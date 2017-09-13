var zjzh = ""
var cdcount = 0
var sqStatus={"0":"已申报","1":"已取消","2":"预审",
			  "3":"审批通过","4":"审批拒绝","5":"审批完成"}
var sqType = {"0":"预约申请","1":"变更申请"}
var getsysdate = [];
var start="";
var end="";
var sflag=0;
var eflag=0;
var dzcode=[];

function PageInit(){
	hideLoading()
	$("#zqcode").inputbox({onKey:CheckCode,"valiType":"txtbox"});
	$("#jymarket").inputbox({"disabled":true});
	$("#zqname").inputbox({"disabled":true});
	create_easygrid("融券申请管理",{singleSelect:false,onDblClickRow:onDblClickRow},
					{"reqtype":{"formatter":get_Reqtype},"market":{"formatter":getJYmarket},
					"status":{"formatter":get_Reqstatus},
					 "reqintrrate":{"formatter":get_Cyyb},"chkintrrate":{"formatter":get_Cyyb}});

	$("#detail").bind("change",function(){
		onQuery();
	});

	get_YysqInfo()
}

function get_khxx() {
	var _ix = new IXContent();
	Win_CallTQL('ret_khxx', 'getkhxx', _ix, '');
}

function ret_khxx(_fromid, _funid, _flagtype, _json) {
	var khxx = _json.split("#")
	var len=khxx.length;
	zjzh = khxx[len-1]
}

//获取全部申请信息
function get_YysqInfo(){
	get_khxx()
	setIX({"funcid":"471133","funcname":"ret_YysqInfo","fundid":zjzh})
}
//应答全部申请信息总条数
function ret_YysqInfo(_fromid,_funid,_flagtype,data){
	var data1=[];
	var data2=[];
	hideLoading()
	if(_funid=="5010:SIMPLE.471133"){	
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			$.messager.alert('提示',data.ErrorInfo,"error");
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]

			if(sflag==1){
				for(var i=0;i<data.rows.length;i++){
					if(data.rows[i].sysdate>=start){
						data1.push(data.rows[i]);
					}
				}
			}else if(sflag==0){
				data1=data.rows;
			}
			if(eflag==1){
				for(var k=0;k<data1.length;k++){
					if(data1[k].sysdate<=end){
						data2.push(data1[k]);
					}
				}
			}else if(eflag==0){
				data2=data1;
			}
			
		 	flag=1;
		 	data.rows=data2;

			code_next(data)	
		}
	}
	setIX({"funcid":"471143","funcname":"ret_TcglInfo","fundid":zjzh,"positype":'2'});
}

//应答头寸信息总条数
function ret_TcglInfo(_fromid,_funid,_flagtype,data){
	hideLoading()
	if(_funid=="5010:SIMPLE.471143"){	
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			$.messager.alert('提示',data.ErrorInfo,"error");
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]
			$.each(data.rows,function(k,v){
				// if(v.positype==2){
					dzcode.push(v.stkcode);
				// }
			});
		}
	}
}
//提交新的预约申请
//确认预约
function onSubmit(t){
	var sysdate1=getCur()
	if(isNullStr($("#in_tcsdate").attr("value"))){
		proError("头寸开始日期不能为空")
		return;
	}
	if(isNullStr($("#in_tcedate").attr("value"))){
		proError("头寸结束日期不能为空")
		return;
	}
	if(isNullStr($("#zqcode").attr("value"))){
		proError("证券代码不能为空")
		return;
	}

	var tcsdate1 = $("#in_tcsdate").attr("value");
	var tcedate1 = $("#in_tcedate").attr("value");
	tcsdate1 = tcsdate1.replace(/-/g,"");
	tcedate1 = tcedate1.replace(/-/g,"");
	if(!((tcsdate1 - sysdate1) >=0 && (tcedate1 - tcsdate1) >= 0)){
		proError("头寸开始日期要大于等于当前日期，头寸结束日期要大于等于头寸开始日期")
		return;
	}
	if(isNullStr($("#in_qwzxje").attr("value"))){
		proError("请输入期望的最小金额")
		return;
	}
	if(isNullStr($("#in_qwzdje").attr("value"))){
		proError("请输入期望的最大金额")
		return;
	}
	if(($("#in_qwzxje").attr("value") == 0) && ($("#in_qwzdje").attr("value") == 0)){
		proError("期望的最大最小金额不可同时为0")
		return;
	}
	if(isNullStr($("#in_qwfl").attr("value"))){
		proError("请输入期望费率")
		return;
	}
	var codein=0;
	$.each(dzcode,function(k,v){
		if($("#zqcode").attr("value")==v){
			codein=1;
		}
	});
	if(codein==1){
		proError("该证券已存在有效的预约申请，请变更头寸！")
		return;
	}else if(codein==0){
		$('#tjyysq').dialog('open')
		$('#tcsdate').text(tcsdate1)
		$('#tcedate').text(tcedate1)
		$('#qwzxje').text($("#in_qwzxje").attr("value"))
		$('#qwzdje').text($("#in_qwzdje").attr("value"))
		$('#tcjy_market').text($("#jymarket").attr("value"))
		$('#tczq_code').text($("#zqcode").attr("value"))
		$('#tczq_name').text($("#zqname").attr("value"))
		$('#qwfl').text($("#in_qwfl").attr("value"))
	}

}
// //提交预约申请应答
 function ret_Tjyysq(_fromid,_funid,_flagtype,data){
 	hideLoading()
 	if(_funid=="5010:SIMPLE.471141"){
 		data=FormatResult(data,1)
 		if(data.ErrorCode=="-1"){
 			$.messager.alert('提示',data.ErrorInfo,"error");
 		 	return;
		}else{
			$('#tjyysq').dialog('close')
 			get_YysqInfo()
 		}
 	}
 }
function onOkTj(){
	var qwzxje=$("#in_qwzxje").attr("value")
	var qwzdje=$("#in_qwzdje").attr("value")
	var qwfl=parseFloat($("#in_qwfl").attr("value"))/100
	var tcsdate = $("#in_tcsdate").attr("value")
	tcsdate = tcsdate.replace(/-/g,"")
	var tcedate = $("#in_tcedate").attr("value")
	tcedate = tcedate.replace(/-/g,"")
	var zq_code = $("#zqcode").attr("value");

	var tjmarket=$("#jymarket").attr("value");
	tjmarket=getJYmarketid(tjmarket);
	
	$('#tjyysq').dialog('close');
	setIX({"funcid":"471141","funcname":"ret_Tjyysq","market":tjmarket,"stkcode":zq_code,"reqintrrate":qwfl,
 		"datebegin":tcsdate,"dateend":tcedate,"reqqtymin":qwzxje,
		"reqqtymax":qwzdje,"fundid":zjzh})
}
function onCanceTj(){
	$('#tjyysq').dialog('close')
}

//申请信息查询
function onQuery(){
	var obj=document.getElementById('detail');
	var val = obj.options[obj.selectedIndex].value;
	start=$("#sqsdate").attr("value")
	if(start!=null&&start!=""){
		sflag=1;
		start = start.replace(/-/g,"")
	}else if(start==null&&start==""){ 
		sflag=0;
	}
	end=$("#sqedate").attr("value")
	if(end!=null&&end!=""){
		eflag=1;
		end = end.replace(/-/g,"")
	}else if(end==null&&end==""){ 
		eflag=0;
	}
	if(val==2){
		if(start==""||start==null){
			if (end==""||end==null) {
				setIX({"funcid":"471133","funcname":"ret_YysqInfo","fundid":zjzh})
			}else {
				setIX({"funcid":"471133","funcname":"ret_YysqInfo","endsysdate":end,"fundid":zjzh})
			}
		}else if(start!=""&&start!=null){
			if (end==""||end==null) {
				setIX({"funcid":"471133","funcname":"ret_YysqInfo","beginsysdate":start,"fundid":zjzh})
			}else {
				setIX({"funcid":"471133","funcname":"ret_YysqInfo","beginsysdate":start,"endsysdate":end,"fundid":zjzh})
			}
		}
	}else{
		if(start==""||start==null){
			if (end==""||end==null) {
				setIX({"funcid":"471133","funcname":"ret_YysqInfo","reqtype":val,"fundid":zjzh})
			}else {
				setIX({"funcid":"471133","funcname":"ret_YysqInfo","reqtype":val,"endsysdate":end,"fundid":zjzh})
			}
		}else if(start!=""&&start!=null){
			if (end==""||end==null) {
				setIX({"funcid":"471133","funcname":"ret_YysqInfo","reqtype":val,"beginsysdate":start,"fundid":zjzh})
			}else {
				setIX({"funcid":"471133","funcname":"ret_YysqInfo","reqtype":val,"beginsysdate":start,"endsysdate":end,"fundid":zjzh})
			}
		}
	}
}

// //双击某条预约申请或点击撤单，弹出撤单确认框，可以批量撤单
// //撤单请求
function onDblClickRow(rowindex,rowdata){
	onCd()
}
function onCd(){
	var getrows=$("#load").datagrid("getChecked")
	var getlen = 0;
	if(getrows!=null){
		getlen=getrows.length;
	}
	if(getlen==0){
		proError("请至少选择一项")
		return;
	}else{
		for(var i=0;i<getlen;i++){
			var spzt = getrows[i].status
			if(spzt!= 0){
				proError("该申请单（正在审批中/已通过/已被拒绝/已处理完成），不允许撤单")
				get_YysqInfo()
				return ;
			}else{
				cdcount++
				var getreqsno = getrows[i].reqsno
				getsysdate.push(getrows[i].sysdate)
				$("#sqbh").text(function(i,oldsno){
					return oldsno +" "+ getreqsno
				})
			}
		}
		$('#cd').dialog('open');
	}
}
//撤单应答
function ret_Cdyysq(_fromid,_funid,_flagtype,data){
	hideLoading()
	if(_funid=="5010:SIMPLE.471134"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{	
			get_YysqInfo()
		}
	}
}

function onOkCd(){
	var cdsno = $("#sqbh").text()
	cdsno = cdsno.split(" ")
	if(cdcount==0){
		proError("请至少选择一项")
		return;
	}else{
		for(var i=1;i<=cdcount;i++){
			var clchkreqsno = cdsno[i]
			setIX({"funcid":"471134","funcname":"ret_Cdyysq","reqsno":clchkreqsno,"sysdate":getsysdate[i-1],"fundid":zjzh})
		}
	}
	$('#cd').dialog('close');
	$("#sqbh").text("")
	
}
function onCanceCd(){
	$("#sqbh").text("")
	$('#cd').dialog('close');
}

function get_Reqtype(c){
	var type=""
	if(c=="0")
		type="预约申请"
	else if(c=="1")
		type="变更申请"
	return type
}

function get_Reqstatus(c){
	var stat=""
	if(c=="0")
		stat="已申报"
	else if(c=="1")
		stat="已取消"
	else if(c=="2")
		stat="预审"
	else if(c=="3")
		stat="审批通过"
	else if(c=="4")
		stat="审批拒绝"
	else if(c=="5")
		stat="审批完成"
	return stat
}
function CheckCode(code){
	flag=0;
	if(code.length==6){
		get_zqname(code)
	}else{
			$("#zqname").attr("value","");
			$("#jymarket").attr("value","");
	}
}

