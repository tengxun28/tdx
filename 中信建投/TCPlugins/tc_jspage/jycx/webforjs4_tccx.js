/**
 * 修改信息
 *
 * 1. 20150331 tdx10404 缓存标的信息，这是因为471143查询回来的数据中没有证券名称，需要匹配证券名称   
 */

var defcx=0;//第一次进入界面的时候不填充列表，但是要提醒将要到期的头寸
var setDftcbh="";//记录当前的头寸编号
var pageList=[];
var pageCur=0;
var tcbh_list=[];
var tccx_count=0;
var total_data={};
var tcbh_select="";
var bdcache = {};

function PageInit(){
 	tcbh_select+="<option value='' selected='selected'>全部</option>";
	hideLoading()
	create_easygrid("融券头寸管理",{onDblClickRow:onDblClickRow},{"positype":{"formatter":get_Tctype},
		"market":{"formatter":getJYmarket},"stktotal":{"formatter":emtpyval},"stklast":{"formatter":emtpyval},
		"stkused":{"formatter":emtpyval},"stkusedreal":{"formatter":emtpyval},"stkrepayreal":{"formatter":emtpyval},
		"enddate":{"formatter":emtpyval}})

    $(document).keydown(function(event){ //这里如果写成$(window)，在ie下面就不会起作用
	    if(event.keyCode==13){
           var act = document.activeElement.id;
			if(act == "inzq_code" ){
				stopDefault(event);
				onQuery();
				return;
            }else{
           		return;
            }
	    }
	});
	
	$("#detail").bind("change",function(){
		onQuery();
	});

	pageList=[''];
	pageCur = 0; 
	tcbh_list=[];
	tccx_count=0;
	total_data=[];

	defcx=0;
	get_bd({pos: '', callback: 'ret_bd'});
	get_khxx()
	// get_tccxcx(''); // 将这个消息放到get_bd的回调中去做，可以保证证券名称已查回来了
}

// 标的回调
function ret_bd(_fromid, _funid, _flagtype, _json) {	
	hideLoading();
	try { var data = FormatResult(_json, 1); }
	catch(e) { $.messager.alert("提示", "格式化标的返回数据出错。"); return; }

	if(data.ErrorCode == 0) {
		if(!data.rows) data.rows = [];
		var curcount = data.rows.length - 1;
		try {
		$.each(data.rows, function(index, rowdata) {
			
			bdcache[rowdata.stkcode] = rowdata.stkname;
		}); } catch(e) { alert(22);}

		if(curcount == 99) {
			//alert(JSON.stringify(data));
			get_bd({pos: data['POS'], callback: 'ret_bd'});
		} else {
			get_tccxcx('');
		}
	} else {
		$.messager.alert("提示", data.ErrorInfo, "error");
	}
}

//客户关联头寸查询
function onQuery(){
	var data1={rows:[]};
	defcx=1;
	var tcbhobj=document.getElementById("tcbh_detail");
	var input_tcbh = tcbhobj.options[tcbhobj.selectedIndex].value;
	var obj=document.getElementById('detail');
	var val = obj.options[obj.selectedIndex].value;

	if(val==3&&(input_tcbh=="全部"||input_tcbh=="")){
		// code_next(total_data); // code_next的功能是显示总条数和向表格加载数据
		$("#total").text("共"+total_data.rows.length+"条");
		upDate("load",total_data);
	}
	else if(val==3&&input_tcbh!="全部"&&input_tcbh!=""){ 
		for(var i=0;i<total_data.rows.length;i++){
			if(total_data.rows[i].positionid==input_tcbh){
				data1.rows.push(total_data.rows[i]);
			}
		}
		// code_next(data1);
		$("#total").text("共"+data1.rows.length+"条");
		upDate("load",data1);
	}
	else if(val!=3&&(input_tcbh=="全部"||input_tcbh=="")){ 
		for(var i=0;i<total_data.rows.length;i++){
			if(total_data.rows[i].positype==val){
				data1.rows.push(total_data.rows[i]);
			}
		}
		$("#total").text("共"+data1.rows.length+"条");
		upDate("load",data1);
	}
	else if(val!=3&&input_tcbh!="全部"&&input_tcbh!=""){ 
		for(var i=0;i<total_data.rows.length;i++){
			if(total_data.rows[i].positionid==input_tcbh&&total_data.rows[i].positype==val){
				data1.rows.push(total_data.rows[i]);
			}
		}
		$("#total").text("共"+data1.rows.length+"条");
		upDate("load",data1);
	}
}

//应答头寸信息总条数
function ret_TcglInfo(_fromid,_funid,_flagtype,data){
	$("#tcbh_detail").empty();
	hideLoading()
	if(_funid=="5010:SIMPLE.471143"){	
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			$.messager.alert('提示',data.ErrorInfo,"error");
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]
			if(data.rows.length>0){
				var curcount=data.rows.length-1;
				if(curcount==99){	
					if($.inArray(data.rows[curcount].posstr, pageList)==-1){
						pageList.push(data.rows[curcount].posstr);
					}
				}
				if(pageCur==0){
					total_data=data;	
				}
				if(pageCur>0 ){
					$.each(data.rows,function(k,v){
		            	total_data.rows.push(data.rows[k]);
		        	});
				}
			}
			if (pageCur < (pageList.length - 1)) {
				pageCur += 1;
				get_tccxcx(pageList[pageCur]);
			}
			else if(pageCur == (pageList.length - 1)){
				showJDQList(total_data);//显示将要到期的头寸

				// 将缓存的证券名称匹配到对应的证券代码上
				$.each(total_data.rows, function(index, value) {
					$.extend(value, {"F141": bdcache[value['stkcode']]});
				});

				// 摩恩默认显示全部
				onQuery();
			}
		 	
		}
	}
}

function onOkTx(){
	$("#kdqtc").text('头寸：');
	$('#tcdqtx').dialog('close');
}

//获取客户信息
function get_khxx() {
	var _ix = new IXContent();
	Win_CallTQL('ret_khxx', 'getkhxx', _ix, '');
}

function ret_khxx(_fromid, _funid, _flagtype, _json) {
	var khxx = _json.split("#")
	zjzh = khxx[khxx.length-1]
	setIX({"funcid":"471111","funcname":"ret_CurKCInfo","fundid":zjzh})
}

//获取当前的默认开仓头寸编号
function ret_CurKCInfo(_fromid,_funid,_flagtype,data){
 	hideLoading()
 	if(_funid=="5010:SIMPLE.471111"){
 		data=FormatResult(data,1)
 		if(data.ErrorCode=="-1"){
 			$.messager.alert('提示',data.ErrorInfo,"error");
 		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]
 			$("#curtc").text(data.rows[0].positionid_stk);
 		}
 	}
}

function onDblClickRow(rowindex,rowdata){
	onSetdefault();
}

//设置为默认融资头寸
function onSetdefault(){
	var rows=$("#load").datagrid("getChecked")
	var tcbh = ""
	if(!rows){
		proError("请选择头寸")
		return;
	}else{
		$.each(rows,function(k,v){
			tcbh = v.positionid
		})
		setDftcbh=tcbh;
		setIX({"funcid":"471132","funcname":"ret_Setdefault","fundid":zjzh,
 			"positionid":tcbh})
	}
	
}
// 应答设置为默认融资头寸
function ret_Setdefault(_fromid,_funid,_flagtype,data){
 	hideLoading()
 	if(_funid=="5010:SIMPLE.471132"){
 		data=FormatResult(data,1)
 		if(data.ErrorCode=="-1"){
 			$.messager.alert('提示',data.ErrorInfo,"error");
 		 	return;
		}else{
 			$.messager.alert('提示',"融券默认头寸设置成功！","succeed");
 			$("#curtc").text(setDftcbh)
 		}
 	}
}

function onSetGGdefault(){
	setDftcbh="2000";
	setIX({"funcid":"471132","funcname":"ret_Setdefault","fundid":zjzh,
 			"positionid":"2000"})
}