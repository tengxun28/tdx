var glob={
	"djzh":"",//登记账号
	"djjg":"",//登记机构
	"jyzh":"",//交易账号
	"zczh":"",//资产账户
	"zzrq":"",//产品终止日期
	"fxrdm":"",//发行人代码
	"cpcode":"",// 产品代码
	"kyzj":"",//可用资金
	"cpjz":"",//产品净值
	"zdrgje":"",// 最低认购金额
	"zgrgje":"",// 最高认购金额
	"cpbm":""//产品编码
	
}


var glob2={
	"cpdm":[],// 产品代码
	"cpbm":[]// 产品编码
	
};
var num =0;


function PageInit(){
	num =0;
	setDlg()
	 hideLoading()
	 create_jqGrid("预约认购",{ondblClickRow:onDblClickRow},{"risk_lvl":{"formatter":get_RiskLevl},"iss_stat":{"formatter":get_Stat},"insttype":{"formatter":get_InstType}})
//	create_easygrid("预约认购",{onDblClickRow:onDblClickRow},{"RISK_LVL":{"formatter":get_RiskLevl},"ISS_STAT":{"formatter":get_Stat},"INST_TYPE":{"formatter":get_InstType}})
	// get_Djzh()
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
		get_Zjinfo()
	}
}

//请求资金信息
function get_Zjinfo(){
	setIX({"funcid":'L2611203',"funcname":'ret_ZJInfo',"custid":User.khh,"fundid":'',"currency":''},User.khh)
}


function ret_ZJInfo(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2611203"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
			return
		}else{
			if(data.rows==undefined) {
				proInfo("未获取到资金信息")
				return
			}
			else{
				glob.kyzj=data.rows[0].fundavl				
			}
		}
		//get_CpJz()
		get_CpFxzzrq()
	}
}

//获取产品净值
function get_CpJz(){
	setIX({"funcid":"L2620304","funcname":'ret_CpJz',"bgndate":getCur(),"enddate":getCur(),"isscode":"","prodcode":"","productid":"","latestflag":"1","pagerecnum":"0","pagereccnt":"500"},User.khh)
}
function ret_CpJz(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620304"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
		 	if(data.rows==undefined) data.rows=[]
		 	var cp={}
		 	$.each(data.rows,function(k,v){
		 		cp[v.productid]=v.lastnet
		 	})
		 	glob.cpjz=cp
		}
	}
	get_CpFxzzrq()
}
//获取产品发行终止日期
function get_CpFxzzrq(){
	setIX({"funcid":"L2612011","funcname":'ret_CpFxzzrq',"isscode":"","prodcode":"","productid":"","insttype":"","instcls":"","pagerecnum":"0","pagecnt":"500"},User.khh)
}
function ret_CpFxzzrq(_fromid,_funid,_flagtype,data){
	get_Cpxeinfo()
	if(_funid=="5010:SIMPLE.L2612011"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
		 	if(data.rows==undefined) data.rows=[]
		 	var rq={}
		 	$.each(data.rows,function(k,v){
		 		rq[v.productid]=v.recm_end_date
		 	})

		 	glob.zzrq=rq
		}
	}
	
	get_Cpxeinfo()
}
//获取产品限额信息
function get_Cpxeinfo(){

	setIX({"funcid":"L2612039","funcname":'ret_Cpxeinfo',"isscode":"","prodcode":"","productid":"","insttype":"","instcls":"","user_type":""},User.khh)
}
function ret_Cpxeinfo(_fromid,_funid,_flagtype,data){

	if(_funid=="5010:SIMPLE.L2612039"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
		 	if(data.rows==undefined) data.rows=[]
		 	var rq={}
		 	var rq2={}
		 	$.each(data.rows,function(k,v){
		 		rq[v.productid]=v.min_subs_amt//最低认购金额
		 		rq2[v.productid]=v.max_subs_amt// 最高认购金额
		 	})
		 	glob.zdrgje=rq
		 	glob.zgrgje=rq2
		}
	}
	get_Cpinfo()
}

//请求产品信息
function get_Cpinfo(){
	
	setIX({"funcid":"L2612001","funcname":'ret_Cpinfo',"isscode":'',"prodcode":'',"productid":'',"insttype":'',"instcls":'',"pagerecnum":'0',"pagecnt":'500'},User.khh)
}
//应答产品信息
function ret_Cpinfo(_fromid,_funid,_flagtype,data){
	num =0;
	hideLoading()
	if(_funid=="5010:SIMPLE.L2612001"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
		 	
		 	data.rows=$.map(data.rows,function(v,i){
		 		if(v.ISS_STAT=="0"){

		 			glob2.cpdm[num]=data.rows[i].prodcode
					glob2.cpbm[num]=data.rows[i].productid
					num++;

		 			if(glob.cpjz[data.rows[i].productid]==undefined)
		 				data.rows[i].lastnet=""
		 			else
		 				data.rows[i].lastnet=glob.cpjz[data.rows[i].productid]

			 		if(glob.zzrq[data.rows[i].productid]==undefined)
			 			data.rows[i].recm_end_date=""
			 		else
			 			data.rows[i].recm_end_date=glob.zzrq[data.rows[i].productid]
			 		if(glob.zdrgje[data.rows[i].productid]==undefined)
			 			data.rows[i].min_subs_amt=""
			 		else
			 			data.rows[i].min_subs_amt=glob.zdrgje[data.rows[i].productid]

			 		if(glob.zgrgje[data.rows[i].productid]==undefined)
			 			data.rows[i].max_subs_amt=""
			 		else
			 			data.rows[i].max_subs_amt=glob.zgrgje[data.rows[i].productid]
			 		return v
		 		}
			})
		 	//upDate("load",{"total":data.rows.length,"rows":data.rows})

		 	up_jqGrid("load",data.rows)
		}
	}
}
function onDblClickRow(rowid,data){
	//setIX({"funcid":"L2620304","funcname":'ret_Cpjz',"BGN_DATE":getCur(),"END_DATE":getCur(),"ISS_CODE":rowdata.ISS_CODE,"INST_CODE":rowdata.INST_CODE,"INST_ID":"","LATEST_FLAG":"1","PAGE_RECNUM":"0","PAGE_RECCNT":"500"},User.khh)

	$("#inst_code").attr("value",data["prodcode"])
	$("#inst_name").attr("value",data["productname"])
	$("#instjz").attr("value",data["lastnet"])
	$("#ksfe").attr("value",glob.kyzj)
	glob.cpcode=data["prodcode"]
	for(var i=0; i<num; i++)
	{
		
		if(glob2.cpdm[i]==glob.cpcode)
		{
			glob.cpbm=glob2.cpbm[i];
			break;
		}
	}
	//glob.cpbm=data["INST_ID"]
	glob.fxrdm=data["isscode"]
	$(".btn2").attr("disabled",false)
	
}

/*function ret_Cpjz(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620304"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
			return
		}else{
			if(data.rows==undefined) {
				proInfo("未获取到产品净值信息")
				return
			}
			else{
				glob.cpjz=data.rows[0].LAST_NET				
			}
		}	
	}
}*/

//确认认购
function onSubmit(t){
	if(isNullStr($("#inst_code").attr("value"))){
		proError("产品代码不能为空")
		return;
	}
	if(isNullStr($("#rgje").attr("value"))){
		proError("请输入认购金额")
		return;
	}
	if(parseFloat($("#rgje").attr("value"))>parseFloat($("#ksfe").attr("value"))){
		proInfo("认购金额不能大于可用金额")
		return;
	}
	$('#cdwt').dialog('open');
	$("#cpcode").text($("#inst_code").attr("value"))
	$("#cpname").text($("#inst_name").attr("value"))
	$("#wtsl").text($("#rgje").attr("value"))	
	
}
var listdata=selectRow("prodcode")
function CheckCode(name,node,e){
	if(name=="keyup"){
		if($(node).attr('value').length==6){
			var value = listdata($(node).attr('value'),"load");
			if (value!=-1){
				$("#inst_name").attr("value",value[1]["productname"])
				$("#instjz").attr("value",value[1]["lastnet"])
				$("#ksfe").attr("value",value[1]["ofavl"])
				glob.cpbm=value[1].productid
				glob.fxrdm=value[1].isscode
				$(".btn2").attr("disabled",false)
				
			}else{
				proInfo("没有该产品信息，请重新输入产品代码")
				$(".btn2").attr("disabled",true)
	    		return;
			}
		}else{
			$(".btn2").attr("disabled",true)			
			$("#inst_name").attr("value","")
			$("#instjz").attr("value","")
			$("#ksfe").attr("value",glob.kyzj)

		}
	}
}

function onOk(){
	$('#cdwt').dialog('close');
	//$('#cdSucwt').dialog('open');
	get_subXd()
}
function onCance(){
	$('#cdwt').dialog('close');
}

/*function OnSucWt(){
	$('#cdSucwt').dialog('close');
	get_subXd()
	
}*/

function get_subXd(){
	var rgje=$("#rgje").attr("value")
	//setIX({"funcid":"S8010301","funcname":'ret_subXd',"CUST_CODE":User.khh,"ISS_CODE":glob.fxrdm,"INST_CODE":"","INST_ID":glob.cpbm,"TRD_ID":"110","CUACCT_CODE":glob.zczh,"TA_CODE":glob.djjg,"TA_ACCT":glob.djzh,"TRANS_ACCT":glob.jyzh,
	//			"PAY_WAY":'1',"BANK_CODE":'',"BANK_ACCT":'',"PAY_ORG":'',"PAY_ACCT":'',"RES_MONEY":rgje,"RISK_REVEAL_METHOD":'0',"RECM_CODE":'',"SOURCE_ID":''},User.khh)

	setIX({"funcid":"L2620510","funcname":'ret_subXd',"custid":User.khh,"fundid":glob.zczh,"issueorgcode":glob.djjg,"stkacc":glob.djzh,"transacc":glob.jyzh,"isscode":glob.fxrdm,"prodcode":"","productid":glob.cpbm,"trdid":"110",
			"trd_amt":rgje,"payopt":'1',"recommenderid":'',"riskrevealmethod":'0'},User.khh)


}
function ret_subXd(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620510"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
			return
		}else{
			proInfo("委托已提交")
			/*if(data.rows==undefined)
				$.messager.alert('提示',"预约认购失败","info",get_Cpinfo);
			else
				$.messager.alert('提示',"预约认购成功","info",get_Cpinfo);*/
		}
	}
}

function onAll(c){
	var kyje = $("#ksfe").attr("value")	
	$("#rgje").attr("value",kyje );
}

// 产品风险等级
function get_RiskLevl(c){
	var stat=""
	if(c=="1")
		stat="低"
	else if(c=="2")
		stat="中低"
	else if(c=="3")
		stat="中"
	else if(c=="4")
		stat="中高"
	else if(c=="4")
		stat="高"	
	return stat
}

/*// 委托状态
function get_Stat(c){
	var stat=""
	if(c=="0")
		stat="未报"
	else if(c=="1")
		stat="已报"
	else if(c=="2")
		stat="确认"
	else if(c=="3")
		stat="部撤"
	else if(c=="4")
		stat="全撤"
	else if(c=="5")
		stat="部成"
	else if(c=="6")
		stat="全成"
	else if(c=="7")
		stat="废单"
	else if(c=="8")
		stat="已报待撤"
	else if(c=="9")
		stat="部成待撤"
	else if(c=="A")
		stat="待撤销"
	else if(c=="B")
		stat="TA确认"
	else if(c=="C")
		stat="TA失败"
	else if(c=="D")
		stat="待申报"
	else if(c=="E")
		stat="对手拒绝"
	return stat
}*/