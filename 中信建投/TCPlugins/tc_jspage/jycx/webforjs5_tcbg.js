/**
 * 修改说明
 *
 * 1. 20150331 tdx10404 修改同webforjs4_tccx.js 
 * 2. 20150331 tdx10404 修改头寸查询471143，只查独占的 get_tccxcx 改为 get_tccxcx_dz
 */

// var zjzh = ""
var defcx=0;//第一次进入界面的时候不填充列表
var today ="";
var typeval='2';
var pageList=[];
var pageCur=0;
var tcbh_list=[];
var tccx_count=0;
var total_data={};
var tcbh_select="";
var bdcache = {};

function PageInit(){
 	tcbh_select+="<option value='' selected='selected'>全部</option>";
	cur_page=1;
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
	
	
	pageList=[''];
	pageCur = 0; 
	defcx=0;
	tcbh_list=[];
	tccx_count=0;
	total_data=[];
	today = getCur();
	get_khxx()
	// get_tccxcx('');
	get_bd({pos: '', callback: 'ret_bd'});

}

// 标的回调
function ret_bd(_fromid, _funid, _flagtype, _json) {
	hideLoading();
	try { var data = FormatResult(_json, 1); }
	catch(e) { $.messager.alert("提示", "格式化标的返回数据出错。"); return; }

	if(data.ErrorCode == 0) {
		if(!data.rows) data.rows = [];
		var curcount = data.rows.length - 1;
		$.each(data.rows, function(index, rowdata) {
			bdcache[rowdata.stkcode] = rowdata.stkname;
		});

		if(curcount == 99) {
			get_bd({pos: data['POS'], callback: 'ret_bd'});
		} else {
			get_tccxcx_dz('');
		}
	} else {
		$.messager.alert("提示", data.ErrorInfo, "error");
	}
}

//客户关联头寸查询
function onQuery(){
	var data1={rows:[]};
	//alert(JSON.stringify(total_data));
	defcx=1;
	var tcbhobj=document.getElementById("tcbh_detail");
	var input_tcbh = tcbhobj.options[tcbhobj.selectedIndex].value;
	
	//var input_tcbh = $("#tcbh_detail").find("option:selected").val() || "";
	//alert(input_tcbh);
	if((input_tcbh=="全部"||input_tcbh=="")){
		$("#total").text("共"+total_data.rows.length+"条");
		upDate("load",total_data);
	}
	else if(input_tcbh!="全部"&&input_tcbh!=""){ 
		for(var i=0;i<total_data.rows.length;i++){
			if(total_data.rows[i].positionid==input_tcbh){
				data1.rows.push(total_data.rows[i]);
			}
		}
		// code_next(data1);
		$("#total").text("共"+data1.rows.length+"条");
		upDate("load",data1);
	}
}

// 查独占头寸查询
function get_tccxcx_dz(sPos){
	var cfg ={
		"funcid":"471143",
		"posstr":sPos,
		"funcname":'ret_TcglInfo',
		"fundid":zjzh,
		"positype": "2",
		"qrynum":"100"
	};
	setIX(cfg);
}

//应答头寸信息总条数
function ret_TcglInfo(_fromid,_funid,_flagtype,data){
	$("#tcbh_detail").empty();
	var data1=[];
	var curdate = getCur()
	curdate = curdate.replace(/-/g,"")
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
				if(pageCur>0){
					$.each(data.rows,function(k,v){
		            	total_data.rows.push(data.rows[k]);
		        	});
				}
			}
			if (pageCur < (pageList.length - 1)) {
				pageCur += 1;
				get_tccxcx_dz(pageList[pageCur]);
			}
			else if(pageCur == (pageList.length - 1)){
				// showJDQList(total_data);//显示将要到期的头寸
				// 将缓存的证券名称匹配到对应的证券代码上
				spanTCBHselect(total_data);
				$.each(total_data.rows, function(index, value) {
					$.extend(value, {"F141": bdcache[value['stkcode']]});
				});
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
}

// 融资头寸变更预约申请
function onReqchange(){
	onDblClickRow();
}
//双击对头寸进行申请变更
function onDblClickRow(){
	flag=0;
	var rowdata = $("#load").datagrid("getSelected")

	if(!rowdata){
		proError("请至少选择一项头寸！")
		return;
	}else {
		checkTCinfo(rowdata);
	}
}
function checkTCinfo(rowdata){
	var sqedate = ""
	var v=rowdata
		if(v.positype == 1){
		proError("请选择非共享头寸进行变更")
		return;
	}
	if(v.enddate - today < 0 ){
		proError("请选择未到期的头寸进行变更")
		return;
	}else if(v.enddate - today >= 0 && v.positype != 1){

		sqedate = v.enddate

		var cur_zqcode=v.stkcode;

		var cur_zqname=v.F141;
		var cur_market=getJYmarket(v.market);

		$("#tcbg").dialog("open")
		$("#jymarket").inputbox({"disabled":true});
		$("#zqname").inputbox({"disabled":true});
		$("#zq_code").val(cur_zqcode);
		$("#zqname").attr("value",cur_zqname);
		$("#jymarket").attr("value",cur_market);

		$("#tcedate").val(formatDate(sqedate))
		$("#tcsdate").val(formatDate(today))
		$("#qwzxje").val('')
		$("#qwzdje").val('')
		$("#qwfl").val('')
	}

}

function onOk(){
	var sysdate=getCur()
	var tcsdate = $("#tcsdate").val()
	tcsdate = tcsdate.replace(/-/g,"")
	var tcedate = $("#tcedate").val()
	tcedate = tcedate.replace(/-/g,"")
	var qwzxje = $("#qwzxje").val()
	var qwzdje = $("#qwzdje").val()
	var qwfl = parseFloat($("#qwfl").val())/100
	var bgjymarket = $("#jymarket").val()
	bgjymarket = getJYmarketid(bgjymarket);
	var bgzq_code = $("#zq_code").val()

	if(!((tcsdate - sysdate) >=0 && (tcedate - tcsdate) >= 0)){
		proError("头寸开始日期要大于等于当前日期，头寸结束日期要大于等于头寸开始日期")
		return;
	}
	if(isNullStr($("#qwzxje").attr("value"))){
		proError("请输入期望的最小数量")
		return;
	}
	if(isNullStr($("#qwzdje").attr("value"))){
		proError("请输入期望的最大数量")
		return;
	}
	if(($("#qwzxje").attr("value") == 0) && ($("#qwzdje").attr("value") == 0)){
		proError("期望的最大最小数量不可同时为0")
		return;
	}
	if(isNullStr($("#qwfl").attr("value"))){
		proError("请输入期望费率")
		return;
	}
		
	setIX({"funcid":"471139","funcname":"ret_Reqchange","fundid":zjzh,"market":bgjymarket,
			"stkcode":bgzq_code,"reqintrrate":qwfl,"datebegin":tcsdate,"dateend":tcedate,
			"reqqtymin":qwzxje,"reqqtymax":qwzdje})
}
function onCance(){
	$('#tcbg').dialog('close');
	$("#tcedate").val('')
	$("#tcsdate").val('')
	$("#qwzxje").val('')
	$("#qwzdje").val('')
	$("#qwfl").val('')
}

//变更预约申请应答
function ret_Reqchange(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.471139"){	
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			$.messager.alert('提示',data.ErrorInfo,"error");
		 	return;
		}else{
 			$.messager.alert('提示',"融券头寸变更申请成功！","succeed");
			$('#tcbg').dialog('close');
			$("#tcedate").val('')
			$("#tcsdate").val('')
			$("#qwzxje").val('')
			$("#qwzdje").val('')
			$("#qwfl").val('')
		}
	}
}
