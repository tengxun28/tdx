var zjzh = ""
var input_code="";
var start="";
var end="";
var sflag=0;
var eflag=0;
var defcx=0;//第一次进入界面的时候不填充列表，但是要提醒将要到期的头寸
var today ="";

function PageInit(){
	// debugger;
	hideLoading()
	create_easygrid("融券头寸管理",{onDblClickRow:onDblClickRow},{"positype":{"formatter":get_Tctype},
		"market":{"formatter":getJYmarket},"stktotal":{"formatter":emtpyval},"stklast":{"formatter":emtpyval},
		"stkused":{"formatter":emtpyval},"stkusedreal":{"formatter":emtpyval},"stkrepayreal":{"formatter":emtpyval},
		"enddate":{"formatter":emtpyval}})
	defcx=0;
	today = getCur();
	// setIX({"funcid":"471143","funcname":"ret_TcglInfo"}); // 修改此处，为了让471143中送资金账号
	get_khxx()
}
//客户关联头寸查询
function onQuery(){
	defcx++;
	input_code=$("#inzq_code").attr("value");
	start=$("#sqsdate").attr("value");
	if(start!=null&&start!=""){
		sflag=1;
		start = start.replace(/-/g,"")
	}else if(start==null||start==""){ 
		sflag=0;
	}
	end=$("#sqedate").attr("value")
	if(end!=null&&end!=""){
		eflag=1;
		end = end.replace(/-/g,"")
	}else if(end==null||end==""){ 
		eflag=0;
	}
	var obj=document.getElementById('detail');
	var val = obj.options[obj.selectedIndex].value;
	if(val==3){
		setIX({"funcid":"471143","funcname":"ret_TcglInfo", "fundid": zjzh})
	}else{ 
		setIX({"funcid":"471143","funcname":"ret_TcglInfo","positype":val, "fundid": zjzh})
	}
}

//应答头寸信息总条数
function ret_TcglInfo(_fromid,_funid,_flagtype,data){
	// debugger;
	var data1=[];
	var data2=[];
	var data3=[];
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
		 	var tccount = 0
		 	if(defcx==0){
		 		$.each(data.rows,function(k,v){
					if(v.enddate - curdate<=5 && tccount<10){
			 			$("#kdqtc").text(function(i,oldsno){
							return oldsno +" "+ v.positionid
						})
			 			tccount++
			 		}
			 	})
			 	if(tccount){
			 		$("#tcdqtx").dialog("open")
			 	}
		 	}else{
				if(input_code!=""){
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].stkcode==input_code){
							data1.push(data.rows[i]);
						}
					}
					if(sflag==1){
						for(var j=0;j<data1.length;j++){
							if(data1[j].enddate>=start){
								data2.push(data1[j]);
							}
						}
					}else if(sflag==0){
						data2=data1;
					}
					if(eflag==1){
						for(var k=0;k<data2.length;k++){
							if(data2[k].enddate<=end){
								data3.push(data2[k]);
							}
						}
					}else if(eflag==0){
						data3=data2;
					}
				}else if(input_code==""){
					if(sflag==1){
						for(var m=0;m<data.rows.length;m++){
							if(data.rows[m].enddate>=start){
								data1.push(data.rows[m]);
							}
						}
					}else if(sflag==0){
						data1=data.rows;
					}
					if(eflag==1){
						for(var n=0;n<data1.length;n++){
							if(data1[n].enddate<=end){
								data2.push(data1[n]);
							}
						}
					}else if(eflag==0){
						data2=data1;
					}
					data3=data2;
				}

			 	flag=1;
			 	data.rows=data3;
				totalinfo = data;
				req_code(data.rows)
				if(count==total){
					code_next()
				}
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

	setIX({"funcid":"471143","funcname":"ret_TcglInfo", "fundid": zjzh});
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
 		}
 	}
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
		}
	}
}


function get_Tctype(c){
	var positype="";
	if(c=="0")
		positype="默认";
	else if(c=="1")
		positype="共享";
	else if(c=="2")
		positype="独占";
	return positype;
}