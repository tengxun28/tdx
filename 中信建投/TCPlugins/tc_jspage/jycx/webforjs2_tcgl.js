var zjzh = ""
function PageInit(){
	hideLoading()
	create_easygrid("头寸管理",{onDblClickRow:onDblClickRow},{"positype":{"formatter":get_Tctype},"totalamt":{"formatter":formatterZroe2},
		"avlamt":{"formatter":formatterZroe2},"usedamt":{"formatter":formatterZroe2},"repayamtreal":{"formatter":formatterZroe2},
		"fullrate":{"formatter":get_Cyyb2},"unuserate":{"formatter":get_Cyyb2},"userate":{"formatter":get_Cyyb2},
		"intrrate":{"formatter":get_Cyyb2},"punirate":{"formatter":get_Cyyb2},"intrkind":{"formatter":get_Cyyb2},
		"enddate":{"formatter":emtpyval}})
	get_TcglInfo()
	get_khxx()
}

//判断输入的是否为0
function formatterZroe2(d,rowdata,index){
    var sum=0;
    var temp=0;
    var testZroe=/^[0-9]*$/;
	d=d.toString();
    for(var i=0;i<d.length-1;i++){
        if(testZroe.test(d.substring(i,i+1))){
            temp=parseInt(d.substring(i,i+1))
            sum+=temp;
        }
    }
    if(sum==0){
    	d=0;
    }
    if(rowdata.positype==0||rowdata.positype==1) return "";
    return d;
}
//判断输入的是否为0，如果不是则费率等乘以100
function get_Cyyb2(d,rowdata,index){
	var sum=0;
    var temp=0;
    var fl="";
    var testZroe=/^[0-9]*$/;
	d=d.toString();
    for(var i=0;i<d.length-1;i++){
        if(testZroe.test(d.substring(i,i+1))){
            temp=parseInt(d.substring(i,i+1))
            sum+=temp;
        }
    }
    if(sum==0){
    	fl="";
    }else{
		fl=parseFloat(d)*100;
		fl=fl.toFixed(3);
    }
    if(rowdata.positype==0||rowdata.positype==1) return "";
    return fl;
}

//获取全部头寸信息
function get_TcglInfo(){
	setIX({"funcid":"471137","funcname":"ret_TcglInfo"})
}
//应答全部头寸信息总条数
function ret_TcglInfo(_fromid,_funid,_flagtype,data){
	var curdate = getCur()
	curdate = curdate.replace(/-/g,"")
	hideLoading()
	if(_funid=="5010:SIMPLE.471137"){	
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			$.messager.alert('提示',data.ErrorInfo,"error");
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]

		 	$("#total").text("共"+data.rows.length+"条")
		 	upDate("load",data)
		 	var count = 0
		 	$.each(data.rows,function(k,v){
				if(v.enddate - curdate<=5 && v.enddate - curdate > 0 && count<10){
		 			$("#kdqtc").text(function(i,oldsno){
						return oldsno +" "+ v.positionid
					})
		 			count++
		 		}
		 	})
		 	if(count){
		 		$("#tcdqtx").dialog("open")
		 	}
		}
	}
}
function onOkTx(){
	$('#tcdqtx').dialog('close');
}

//客户关联头寸查询
function onQuery(){
	get_TcglInfo()
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
		setIX({"funcid":"471140","funcname":"ret_Setdefault","fundid":zjzh,
 			"positionid":tcbh})
	}
	
}
// 应答设置为默认融资头寸
 function ret_Setdefault(_fromid,_funid,_flagtype,data){
 	hideLoading()
 	if(_funid=="5010:SIMPLE.471140"){
 		data=FormatResult(data,1)
 		if(data.ErrorCode=="-1"){
 			$.messager.alert('提示',data.ErrorInfo,"error");
 		 	return;
		}else{
 			$.messager.alert('提示',"融资默认头寸设置成功！","succeed");
 		}
 	}
 }
// 融资头寸变更预约申请
function onReqchange(){
	onDblClickRow()
}
//双击对头寸进行申请变更
function onDblClickRow(){
	var today = getCur()
	var rowdata = $("#load").datagrid("getChecked")
	var len = rowdata.length
	if(len == 0){
		proError("请至少选择一项")
		return;
	}else {
		var gettcbh = ""
		var sqedate = ""
		$.each(rowdata,function(k,v){
			if(v.positype == 1){
				proError("请选择非共享头寸进行变更")
				return;
			}if(v.enddate - today < 0 ){
				proError("请选择未到期的头寸进行变更")
				return;
			}else if(v.enddate - today >= 0 && v.positype != 1){
				sqedate = v.enddate
				gettcbh = v.positionid
				$("#tcbg").dialog("open")
				$("#tcbh").text(gettcbh)
				$("#tcedate").val(sqedate)
				$("#tcsdate").val(today)
				$("#qwzxje").val("")
				$("#qwzdje").val("")
				$("#qwfl").val("")
			}
		})
	}
}
//变更预约申请应答
function ret_Reqchange(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.471135"){	
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			$.messager.alert('提示',data.ErrorInfo,"error");
		 	return;
		}else{
 			$.messager.alert('提示',"融资头寸变更申请成功！","succeed");
			$('#tcbg').dialog('close');
		}
	}
}

function onOk(){
	var settcbh = $("#tcbh").text()
	var tcsdate = $("#tcsdate").val()
	tcsdate = tcsdate.replace(/-/g,"")
	var tcedate = $("#tcedate").val()
	tcedate = tcedate.replace(/-/g,"")
	var qwzxje = $("#qwzxje").val()
	var qwzdje = $("#qwzdje").val()
	var qwfl = parseFloat($("#qwfl").val())/100
		
		setIX({"funcid":"471135","funcname":"ret_Reqchange","fundid":zjzh,
			"reqintrrate":qwfl,"datebegin":tcsdate,"dateend":tcedate,
			"reqamtmin":qwzxje,"reqamtmax":qwzdje,"linkposition":settcbh})
}
function onCance(){
	$('#tcbg').dialog('close');
}

function get_Tctype(c){
	var positype=""
	if(c=="0")
		positype="默认"
	else if(c=="1")
		positype="共享"
	else if(c=="2")
		positype="独占"
	return positype
}