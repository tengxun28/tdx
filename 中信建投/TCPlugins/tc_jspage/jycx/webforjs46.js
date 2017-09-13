var glob={
	"sqbh":null,//需要发送撤单的数据
	"wtflag":0,
	"zzrq":"",//产品终止日期
	"cdcnt":0//撤单发送请求条数
}
function PageInit(){
	
	setDlg()
	setDlg("singlewt")
	//setDlg("cdSucwt")
	hideLoading()
	create_easygrid("预约撤单",{onDblClickRow:onDblClickRow},{"STATUS":{"formatter":get_Stat}})
	// $("#load").datagrid("loadData",{"total":1,"rows":[{"ORD_AMT":"122"},{"ORD_AMT":"222"}]});
	get_YydcxInfo()
	//get_Cpzzrq()
}




//获取产品终止日期
function get_Cpzzrq(){
	//setIX({"funcid":"S8010304","funcname":'ret_Cpzzrq',"CUST_CODE":User.khh,"PRO_CLS":""})
	setIX({"funcid":"L2612011","funcname":'ret_Cpzzrq',"isscode":"","prodcode":"","productid":"","insttype":"","instcls":"","pagerecnum":"0","pagecnt":"500"},User.khh)

}
function ret_Cpzzrq(_fromid,_funid,_flagtype,data){
	get_YydcxInfo()
	if(_funid=="5010:SIMPLE.L2612011"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
		 	if(data.rows==undefined) data.rows=[]
		 	var rq={}
		 	$.each(data.rows,function(k,v){
		 		rq[v.productid]=v.end_date
		 	})
		 	glob.zzrq=rq
		}
	}
	get_YydcxInfo()
}

//预约单查询
function get_YydcxInfo(){
	//setIX({"funcid":"S8010303","funcname":'ret_YydcxInfo',"CUST_CODE":User.khh,"STATUS":'',"ISS_CODE":'',"INST_CODE":'',"INST_ID":'',"PRO_CLS":'1',"BGN_RES_DATE":'0',"END_RES_DATE":'0'},User.khh)

	setIX({"funcid":"L2620504","funcname":'ret_YydcxInfo',"strdate":getAddMonth(-2),"enddate":getCur(),"custid":User.khh,"fundid":"","stkacc":"","transacc":"","isscode":"",
		"prodcode":"","productid":"","booksno":"","cancancel":"1","bookstat":"","cancelflag":"","pagerecnum":"0","pagecnt":"500"},User.khh)

}
//应答产品信息
function ret_YydcxInfo(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620504"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]
		 	data.rows=$.map(data.rows,function(v,i){
		 		/*if(glob.zzrq[data.rows[i].INST_ID]==undefined)
		 			data.rows[i].ISS_END_DATE=""
		 		else
		 			data.rows[i].ISS_END_DATE=glob.zzrq[data.rows[i].INST_ID]*/
		 		return v
			})
		 	up_jqGrid("load",data.rows)
		 	$("#totalnum").text("共"+data.rows.length+"条")
		 	// $("#load").datagrid("loadData",{"total":data.rows.length,"rows":data.rows});
		}
	}
}

function onDblClickRow(rowid,data){
	uncheckAll()
	$("#load").jqGrid("setSelection",rowid)
	onSign(3)
}

function onSign(i){
	
	if(i==0)
		get_YydcxInfo()
	else if(i==1)
		$("#load").datagrid("uncheckAll")
	else if(i==2)
		$("#load").datagrid("checkAll")
	else if(i==3){
		glob.wtflag=0
		var rowid=$("#load").jqGrid('getGridParam','selarrrow');
		var rows=[]
		$.each(rowid,function(n,id){
				rows.push($("#load").jqGrid("getRowData",id))
		})
		//var rows=$("#load").datagrid("getChecked")
		var len=rows.length
		if(len>1){
			glob.sqbh=rows
			$('#singlewt').dialog('open');
			$("#total").text("共有"+len+"笔委托需要撤单")
			glob.wtflag=2
		}else if(len==1){
			glob.wtflag=1
			glob.sqbh=rows
			$('#cdwt').dialog('open');
			$("#czfx").text(rows[0].insttype)
			$("#cpcode").text(rows[0].prodcode)
			$("#cpname").text(rows[0].productname)
		}else{
			glob.wtflag=0
			proInfo("请选择你需要撤销的产品代码")
			return
		}		

		
	}

}

function onOk(){

	$('#cdwt').dialog('close');
	//$('#cdSucwt').dialog('open');
	glob.cdcnt=0
	get_Cd()
	
}
function onCance(){
	$('#cdwt').dialog('close');
	
}

function onSinOk(){
	$('#singlewt').dialog('close');
	if(glob.wtflag!=3)//撤单失败时如果继续要发送撤单的提示信息,则不提示撤单已提交信息
	{
		glob.cdcnt=0
		get_Cd()
		//$('#cdSucwt').dialog('open');
	}		
	else
		cdError()
}
function onSinCance(){
	$('#singlewt').dialog('close');
}

/*function OnSucWt(){
	$('#cdSucwt').dialog('close');
	glob.cdcnt=0
	get_Cd()
	
}*/

//撤单
function get_Cd(){

	if(glob.cdcnt<glob.sqbh.length){
		// myAlert(message)
		//setIX({"funcid":"S8010302","funcname":'ret_CdInfo',"RES_INSNO":glob.sqbh[glob.cdcnt].RES_INSNO,"CUACCT_CODE":glob.sqbh[glob.cdcnt].CUACCT_CODE,"TA_CODE":glob.sqbh[glob.cdcnt].TA_CODE,"TA_ACCT":glob.sqbh[glob.cdcnt].TA_ACCT,"CUST_CODE":User.khh,"INST_CODE":glob.sqbh[glob.cdcnt].INST_CODE},User.khh)

		setIX({"funcid":"L2620511","funcname":'ret_CdInfo',"custid":User.khh,"fundid":glob.sqbh[glob.cdcnt].CUACCT_CODE,"stkacc":glob.sqbh[glob.cdcnt].TA_ACCT,"transacc":glob.sqbh[glob.cdcnt].TRANS_ACCT,"oribooksno":glob.sqbh[glob.cdcnt].ORI_BOOK_SNO,"orisysdate":glob.sqbh[glob.cdcnt].ORI_BOOK_DATE,"bookdealtype":"4"},User.khh)
		glob.cdcnt+=1;
	}else{
		proInfo("撤单已提交")
		get_YydcxInfo()
		return
	}
}
function ret_CdInfo(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620511"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
			return
			
		}else{
			get_Cd()
		}
	}
}
function cdError(){
	get_Cd()
}