var glob={
	"djzh":"",//登记账号
	"djjg":"",//登记机构
	"jyzh":"",//交易账号
	"zczh":"",//资产账户
	"cpbm":"",//产品编码
	"cpcode":"",
	"cpname":"",
	"zzrq":"",//产品终止日期
	"kyzj":"",//可用金额
	"sgje":"",//申购金额
	"cpjz":"",//产品净值
	"zdrgje":"",// 最低认购金额
	"zgrgje":"",// 最高认购金额
	"dlgflag":"0"//调用委托成交的对话框标志
	
}


var glob2={
	"cpdm":[],// 产品代码
	"djjg":[],// 登记机构
	"cpbm":[]// 产品编码
	
};
var num =0;

function PageInit(){
	num =0;
	setDlg()
	//setDlg("cdSucwt")
	hideLoading()
	create_jqGrid("申购",{ondblClickRow:onDblClickRow},{"iss_stat":{"formatter":get_Stat},"risk_lvl":{"formatter":get_RiskLvl},"insttype":{"formatter":get_InstType}})
	//create_easygrid("申购",{onDblClickRow:onDblClickRow},{"ISS_STAT":{"formatter":get_Stat},"RISK_LVL":{"formatter":get_RiskLvl},"INST_TYPE":{"formatter":get_InstType}})
	// get_Djzh()
	//get_Djzh()
	get_KhKyzj()
}


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

				for(var i=0;i<data.rows.length;i++)
				{					
						
					if (data.rows[i].issueorgcode == glob.djjg) {
						glob.djzh=data.rows[i].stkacc							
						glob.jyzh=data.rows[i].transacc
						glob.zczh=data.rows[i].fundid	
						
						break;
					}
					else
					{						
						glob.djzh=data.rows[i].stkacc							
						glob.jyzh=data.rows[i].transacc
						glob.zczh=data.rows[i].fundid	
					}
				}
				
			}
		}
		//get_KhKyzj()	
		get_subSg()
	}
}

//获取客户可用资金
function get_KhKyzj(){

	setIX({"funcid":"L2611203","funcname":'ret_KhKyzj',"custid":User.khh,"fundid":"","currency":""},User.khh)
}
function ret_KhKyzj(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2611203"){
	
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
			if(data.rows==undefined){
				proInfo("未获取到可用金额")
				return
			}else{
		 		glob.kyzj=fmtFt(data.rows[0].fundavl)
		 	}
		}
		//get_CpJz()
		get_Cpzzrq()
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
	get_Cpzzrq()
}

//获取产品终止日期
function get_Cpzzrq(){

	setIX({"funcid":"L2612011","funcname":'ret_Cpzzrq',"isscode":"","prodcode":"","productid":"","insttype":"","instcls":"","pagerecnum":"0","pagecnt":"500"},User.khh)
}
function ret_Cpzzrq(_fromid,_funid,_flagtype,data){
		
	if(_funid=="5010:SIMPLE.L2612011"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
		 	if(data.rows==undefined) data.rows=[]
		 	var rq={}
		 	var rq2={}
		 	$.each(data.rows,function(k,v){
		 		rq[v.productid]=v.end_date
		 		rq2[v.productid]=v.issueorgcode		 	
		 	})
		 	
		 	glob.zzrq=rq
		 	glob.djjg=rq2
		 
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
		 		rq[v.productid]=v.min_bids_amt//最低申购金额
		 		rq2[v.productid]=v.max_bids_amt// 最高申购金额

		 	
		 	})
		 	glob.zdrgje=rq
		 	glob.zgrgje=rq2
		}
	}

	get_CpInfo()
}



//请求产品信息
function get_CpInfo(){

	L2612001({"funcname":'ret_CpInfo'})
	
}

function ret_CpInfo(_fromid,_funid,_flagtype,data){

	
	if(_funid=="5010:SIMPLE.L2612001"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]
			data.rows=$.grep(data.rows,function(v,i){
				
				if(v.iss_stat=="2"){

					glob2.cpdm[num]=data.rows[i].prodcode
					glob2.cpbm[num]=data.rows[i].productid
										

					if(glob.cpjz[data.rows[i].productid]==undefined)
			 			data.rows[i].lastnet=""
			 		else
			 			data.rows[i].lastnet=glob.cpjz[data.rows[i].productid]
			 		if(glob.zzrq[data.rows[i].productid]==undefined)
			 			data.rows[i].end_date=""
			 		else
			 			data.rows[i].end_date=glob.zzrq[data.rows[i].productid]
			 		if(glob.zdrgje[data.rows[i].productid]==undefined)
			 			data.rows[i].min_bids_amt=""
			 		else
			 			data.rows[i].min_bids_amt=glob.zdrgje[data.rows[i].productid]

			 		if(glob.zgrgje[data.rows[i].productid]==undefined)
			 			data.rows[i].max_bids_amt=""
			 		else
			 			data.rows[i].max_bids_amt=glob.zgrgje[data.rows[i].productid]

			 		if(glob.djjg[data.rows[i].productid]==undefined)
			 			data.rows[i].issueorgcode=""
			 		else			 		
			 			data.rows[i].issueorgcode=glob.djjg[data.rows[i].productid]

			 		
			 		glob2.djjg[num]=data.rows[i].issueorgcode

			 		num++;

			 		

					return v
				}
			})
		 	/*for(var i=0;i<data.rows.length;i++){
		 		if(data.rows[i].ISS_STAT=="2"){
			 		if(glob.cpjz[data.rows[i].INST_ID]==undefined)
			 			data.rows[i].LAST_NET=""
			 		else
			 			data.rows[i].LAST_NET=glob.cpjz[data.rows[i].INST_ID]
			 		if(glob.zzrq[data.rows[i].INST_ID]==undefined)
			 			data.rows[i].END_DATE=""
			 		else
			 			data.rows[i].END_DATE=glob.zzrq[data.rows[i].INST_ID]
			 	}
		 	}*/

		 	
		 //	upDate("load",data)
		 	up_jqGrid("load",data.rows)
		}
	}
}


function onDblClickRow(rowid,data){
	$("#inst_code").attr("value",data["prodcode"])
	$("#inst_name").attr("value",data["productname"])
	$("#avafund").attr("value",glob.kyzj)
	$("#instjz").attr("value",data["lastnet"])
	//glob.cpbm=data["INST_ID"]
	glob.cpcode=data["prodcode"]
	glob.cpname=data["productname"]
	for(var i=0; i<num; i++)
	{
		
		if(glob2.cpdm[i]==glob.cpcode)
		{
			glob.cpbm=glob2.cpbm[i];
			glob.djjg=glob2.djjg[i];
			break;
		}
	}
	
}

//确认认购
function onSubmit(t){
	if(isNullStr($("#inst_code").attr("value"))){
		proError("产品代码不能为空")
		return;
	}
	if(isNullStr($("#sgje").attr("value"))){
		proError("请输入需要申购的金额")
		return;
	}
	glob.sgje=$("#sgje").attr("value")
	glob.cpcode=$("#inst_code").attr("value")
	glob.cpname=$("#inst_name").attr("value")
	get_subXd()
}

function get_subXd(){
	$('#cdwt').dialog('open');
	$("#cpcode").text(glob.cpcode)
	$("#cpname").text(glob.cpname)
	
	$("#wtsgje").text(glob.sgje)
}
var listdata=selectRow("prodcode")
function CheckCode(name,node,e){
	if(name=="keyup"){

		if($(node).attr('value').length==6){
			var value = listdata($(node).attr('value'),"load");
			if (value!=-1){
				onDblClickRow(value[0],value[1])
			}else{
				proInfo("没有该产品信息，请重新输入产品代码")
				
	    		return;
			}
		}else{
			$("#avafund").attr("value","")
			$("#minrg").attr("value","")
			$("#minapp").attr("value","")
			$("#inst_name").attr("value","")
			$("#instjz").attr("value","")

		}
	}
}

function onOk(){
	glob.dlgflag="0"
	$('#cdwt').dialog('close');
	//$('#cdSucwt').dialog('open');
	//get_subSg()
	get_Djzh()
}
function onCance(){
	$('#cdwt').dialog('close');
}

/*function OnSucWt(){
	$('#cdSucwt').dialog('close');
	get_subSg()
	
}*/
function onSinOk(){
	glob.dlgflag="1"
	$('#singlewt').dialog('close');
	//$('#cdSucwt').dialog('open');
	get_Djzh()
	//get_subSg()
}
function onSinCance(){
	$('#singlewt').dialog('close');
	
}

function get_subSg(){
	
	var risk
	if(glob.dlgflag=="0")
		risk="0"
	else
		risk="1"
	
	setIX({"funcid":"L2620100","funcname":'ret_subSg',"custid":User.khh,"fundid":glob.zczh,"issueorgcode":glob.djjg,"stkacc":glob.djzh,"transacc":glob.jyzh,
				"isscode":"","prodcode":"","productid":glob.cpbm,"trdid":"111","amt":glob.sgje,"paypattern":"1","bankcode":"","payorg":"",
				"paidamt":"","frzamt":"","frzsize":"","latestpaydate":"","riskrevealmethod":risk,"referrercode":"","ecsignflag":""},User.khh)

}


function ret_subSg(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620100"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			if(data.ErrorCode=="27030080"){
				$("#singlewt").dialog("open")
				$("#total").attr("value","客户风险承受能力与产品风险等级不匹配,是否继续委托交易")
				return
			}else if(data.ErrorCode=="27030084"){
				proInfo("客户风险承受能力与产品风险等级不匹配，该产品不允许强制下单")
				return
			}else{
				proError(data.ErrorInfo)
				return
			}
		}else{
			proInfo("委托已提交")
			glob.kyzj=0
			get_KhKyzj()
		}
	}
}

//获取产品信息接口
function L2612001(d){
	d=$.extend({"funcid":"L2612001"},{"isscode":"","prodcode":"","productid":"","insttype":"","instcls":"","pagerecnum":"0","pagecnt":"500"},d)
	
	setIX(d,User.khh)
}
function L2612039(d){
	d=$.extend({"funcid":"L2612039"},{"isscode":"","prodcode":"","productid":"","insttype":"","instcls":"","user_type":""},d)
	setIX(d,User.khh)
}
function fmtFt(f){
	f=parseFloat(f)
	return isNaN(f)?0:f
}