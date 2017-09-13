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
	"rgje":"",//认购金额
	"cpjz":"",//产品净值数据
	"zdrgje":"",// 最低认购金额
	"zgrgje":"",// 最高认购金额
	"dlgflag":"0"//调用委托成交的对话框标志
	
}

var glob2={
	"cpdm":[],// 产品代码
	"cpbm":[]// 产品编码
	
};

var num =0;
function PageInit(){
	num =0;
	setDlg()
	//setDlg("cdSucwt")
	hideLoading()

	create_easygrid("认购",{onDblClickRow:onDblClickRow},{"iss_stat":{"formatter":get_Stat},"risk_lvl":{"formatter":get_RiskLvl},"insttype":{"formatter":get_InstType}})
	
	get_Djzh()

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
				glob.djzh=data.rows[0].stkacc
				glob.djjg=data.rows[0].issueorgcode
				glob.jyzh=data.rows[0].transacc
				glob.zczh=data.rows[0].fundid
			}
		}
		get_KhKyzj()
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
	
	
	if(_funid=="5010:SIMPLE.L2612011"){

		data=FormatResult(data,1)
		
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
		 	if(data.rows==undefined) data.rows=[]
		 	var rq={}
		 	$.each(data.rows,function(k,v){
		 		rq[v.productid]=v.iss_end_date
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
	 
	
				if(v.iss_stat=="1"){

					glob2.cpdm[num]=data.rows[i].prodcode
					glob2.cpbm[num]=data.rows[i].productid
					num++;


					if(glob.cpjz[data.rows[i].productid]==undefined)
			 			data.rows[i].lastnet=""
			 		else
			 			data.rows[i].lastnet=glob.cpjz[data.rows[i].productid]
			 		if(glob.zzrq[data.rows[i].productid]==undefined)
			 			data.rows[i].iss_end_date=""
			 		else
			 			data.rows[i].iss_end_date=glob.zzrq[data.rows[i].productid]

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
		 	
		 	upDate("load",data)
		}
	}
}
function onDblClickRow(rowindex,rowdata){

	$("#inst_code").attr("value",rowdata.prodcode)
	$("#inst_name").attr("value",rowdata.productname)
	$("#avafund").attr("value",glob.kyzj)//可用金额
	$("#instjz").attr("value",rowdata.lastnet)

	
//	glob.cpbm=rowdata.INST_ID
	glob.cpcode=rowdata.prodcode
	glob.cpname=rowdata.productname
	for(var i=0; i<num; i++)
	{
		
		if(glob2.cpdm[i]==glob.cpcode)
		{
			glob.cpbm=glob2.cpbm[i];
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
	if(isNullStr($("#rgje").attr("value"))){
		proError("请输入需要认购的金额")
		return;
	}
	glob.rgje=$("#rgje").attr("value")
	glob.cpcode=$("#inst_code").attr("value")
	glob.cpname=$("#inst_name").attr("value")
	get_subXd()
}

function get_subXd(){
	$('#cdwt').dialog('open');
	$("#cpcode").text(glob.cpcode)
	$("#cpname").text(glob.cpname)
	$("#wtrgje").text(glob.rgje)
}

var listdata=selectRow("prodcode")


function CheckCode(name,node,e){
	if(name=="keyup"){

		if($(node).attr('value').length==6){
			var value = listdata($(node).attr('value'),"load")
			if (value!=-1){
				
				onDblClickRow(value[0],value[1])
		
			}else{
				proInfo("没有该产品信息，请重新输入产品代码")
				
	    		return;
			}
		}else{
			
			$("#minrg").attr("value","")
			$("#minapp").attr("value","")
			$("#inst_name").attr("value","")
			$("#instjz").attr("value","")
			$("#avafund").attr("value","")
		}
	}
}








function get_subRg(){

	var risk
	if(glob.dlgflag=="0")
		risk="0"
	else
		risk="1"
	
	setIX({"funcid":"L2620100","funcname":'ret_subRg',"custid":User.khh,"fundid":glob.zczh,"issueorgcode":glob.djjg,"stkacc":glob.djzh,"transacc":glob.jyzh,
				"isscode":"","prodcode":"","productid":glob.cpbm,"trdid":"110","amt":glob.rgje,"paypattern":"1","bankcode":"","payorg":"",
				"paidamt":"","frzamt":"","frzsize":"","latestpaydate":"","riskrevealmethod":risk,"referrercode":"","ecsignflag":"1"},User.khh)

}
function ret_subRg(_fromid,_funid,_flagtype,data){
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


function onOk(){
	
	glob.dlgflag="0"
	$('#cdwt').dialog('close');
	OnSucWt()
	//$('#cdSucwt').dialog('open');
}
function onCance(){

	$('#cdwt').dialog('close');
}

function OnSucWt(){
	
	//$('#cdSucwt').dialog('close');
	get_subRg()
	
}
function onSinOk(){
	glob.dlgflag="1"
	$('#singlewt').dialog('close');
	//$('#cdSucwt').dialog('open');
}
function onSinCance(){
	$('#singlewt').dialog('close');
	
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