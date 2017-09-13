var glob={
	"djzh":"",//登记账号
	"zzrq":"",// 产品截止日期
	"djjg":"",//登记机构
	"jyzh":"",//交易账号
	"zczh":"",//资产账户
	"sqbh":null,//需要发送撤单的数据
	"wtflag":0,
	"cdcnt":0//撤单发送请求条数
}

function PageInit(){

	setDlg()
	setDlg("singlewt")
	//setDlg("cdSucwt")
	hideLoading()
	create_jqGrid("意向报价撤单",{ondblClickRow:onDblClickRow},{"ord_stat":{"formatter":get_OrdStat},"trdid":{"formatter":get_TraType},"matchtype":{"formatter":get_MatchType}})
	//create_easygrid("意向报价撤单",{singleSelect:false,onDblClickRow:onDblClickRow},{"ORD_STAT":{"formatter":get_OrdStat},"TRD_ID":{"formatter":get_TraType},"MATCH_TYPE":{"formatter":get_MatchType}})
	// $("#load").datagrid("loadData",{"total":1,"rows":[{"ORD_AMT":"122"},{"ORD_AMT":"222"}]});
	get_Djzh()
}

/*
// 获取客户号
function get_Khh(){
	setIX2({"funcid":"L2610006","funcname":'ret_Khh',"USER_CODE":"","CUACCT_CODE":User.khh,"PAGE_RECNUM":"0","PAGE_RECCNT":"500"})
}
function ret_Khh(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2610006"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{			
		 	if(data.rows==undefined) data.rows=[];
		 	User.khh=data.rows[0].CUST_CODE;
		}
	}
	get_Djzh()
}

*/
//获取登记账号
function get_Djzh(){
	setIX({"funcid":"L2610008","funcname":'ret_Djzh',"custid":User.khh,"fundid":"","orgid":"","issueorgcode":"","stkacc":"","transacc":"","pagerecnum":"0","pagecnt":"500"},User.khh)
	
}

function ret_Djzh(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2610008"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
			return
		}else{
			if(data.rows==undefined) {
				proInfo("未获取到登记账号")
				return
			}
			else{
				glob.djzh=data.rows[0].stkacc
				glob.djjg=data.rows[0].issueorgcode
				glob.jyzh=data.rows[0].transacc
				glob.zczh=data.rows[0].fundid
			}
		}
		//get_Cpzzrq()
		get_RsgInfo()
	}
}

function get_Cpzzrq(){
	setIX({"funcid":"L2612011","funcname":'ret_Cpzzrq',"isscode":"","prodcode":"","productid":"","insttype":"","instcls":"","pagerecnum":"0","pagecnt":"500"},User.khh)
}
function ret_Cpzzrq(_fromid,_funid,_flagtype,data){
	get_RsgInfo()
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
	get_RsgInfo()
}


//认申购查询
function get_RsgInfo(){
	setIX({"funcid":"L2620115","funcname":'ret_RsgInfo',"strdate":getAddMonth(-2),"enddate":getCur(),"custid":User.khh,"prodcode":"","productid":"","declid":"","cancancel":"1","pagerecnum":"0","pagecnt":"500"},User.khh)
}

function ret_RsgInfo(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620115"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
			 if(data.rows==undefined) data.rows=[]

			 	/*for(var i=0;i<data.rows.length;i++){
		 		
		 		if(glob.zzrq[data.rows[i].INST_ID]==undefined)
			 		data.rows[i].END_DATE=""
			 	else
			 		data.rows[i].END_DATE=glob.zzrq[data.rows[i].INST_ID]
		 	}*/
		 	//upDate("load",data)
		 	up_jqGrid("load",data.rows)
		 	$("#totalnum").text("共"+data.rows.length+"条")
		 	//$("#load").datagrid("loadData",{"total":1,"rows":data.rows});
		 	//$("#totalnum").text("共"+data.rows.length+"条")
		 	// $("#load").datagrid("loadData",{"total":1,"rows":data.rows});
		}
	}
}

function onDblClickRow(rowid,data){
	uncheckAll()
	$("#load").jqGrid("setSelection",rowid)
	//$("#load").datagrid("uncheckAll")
	//$("#load").datagrid("checkRow",rowid)
	onSign(3)
}

function onSign(i){
	
	if(i==0)
		get_RsgInfo()
	else if(i==1)
		uncheckAll("load")
	else if(i==2)
		checkAll("load")
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
			
			$("#czfx").text(rows[0].trdid)
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
	//$('#cdSucwt').dialog('open');
	glob.cdcnt=0
	get_Cd()
	
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

		//setIX({"funcid":"L2620112","funcname":'ret_CdInfo',"CUST_CODE":User.khh,"CUACCT_CODE":glob.zczh,"TA_ACCT":glob.djzh,"TRANS_ACCT":glob.jyzh,"ORI_APP_SNO":glob.sqbh[glob.cdcnt].APP_SNO},"ORI_APP_DATE":glob.sqbh[glob.cdcnt].APP_DATE})
		
		setIX({"funcid":"L2620112","funcname":'ret_CdInfo',"custid":User.khh,"fundid":glob.zczh,"stkacc":glob.djzh,"transacc":glob.jyzh,"oriopendate":glob.sqbh[glob.cdcnt].APP_DATE,"oldsn":glob.sqbh[glob.cdcnt].APP_SNO},User.khh)
		glob.cdcnt+=1;
	}else{
		proInfo("撤单已提交")
		onSign(0)
		get_RsgInfo()
		return
	}
}
function ret_CdInfo(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620112"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
			return
		}else{			
			get_Cd()
		}
	}
}
