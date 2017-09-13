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
	"yqnhsyl":"",// 预期年化收益率
	"dlgflag":"0"//调用委托成交的对话框标志
	
}

var glob2={
	"cpdm":[],// 产品代码
	"cpfxdj":[],// 产品风险等级
	"cpbm":[]// 产品编码
	
};


var glob3={
	"xsqsr":"",//销售起始日
	"xszzr":"",//销售终止日
	"sczdje":"",//首次最低金额	
	"zjzdje":"",//追加最低金额	
	"qxr":"",//起息日
	"dqr":""//到期日
}

var EndCpdm="";
var EndCpFxdj="";
var EndKhFxdj="";



var num =0;
function PageInit(){
	num =0;
	setDlg()
	//setDlg("cdSucwt")
	hideLoading()

	create_easygrid("银行产品认购",{onDblClickRow:onDblClickRow},{"iss_stat":{"formatter":get_Stat},"risk_lvl":{"formatter":get_RiskLvl},"insttype":{"formatter":get_InstType}})
	
	get_Djzh()

}

//获取登记账号
function get_Djzh(){
	setIX({
		"funcid":"L2610008",
		"funcname":'ret_Djzh',
		"custid":User.khh,
		"fundid":"",
		"orgid":"",
		"issueorgcode":"",
		"stkacc":"",
		"transacc":"",
		"pagerecnum":"0",
		"pagecnt":"500"
	},User.khh)
}

function ret_Djzh(_fromid,_funid,_flagtype,data){
	
	if(_funid=="5010:SIMPLE.L2610008"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			var Msg = data.ErrorInfo;
			if (Msg.indexOf("尚未开户")!= -1)
			{
				proError("您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部")
			}
			else
			{
				proError(data.ErrorInfo)	
			}	
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
			var Msg = data.ErrorInfo;
			if (Msg.indexOf("尚未开户")!= -1)
			{
				proError("您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部")
			}
			else
			{
				proError(data.ErrorInfo)	
			}	
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
		zzrq = [];
		zzrqPos = 1;
		get_CpFxzzrq()
	}
}


//获取产品净值
function get_CpJz(){
	setIX({
		"funcid":"L2620304",
		"funcname":'ret_CpJz',
		"bgndate":getCur(),
		"enddate":getCur(),
		"isscode":"",
		"prodcode":"",
		"productid":"",
		"latestflag":"1",
		"pagerecnum":"0",
		"pagereccnt":"500"
	},User.khh)
}
function ret_CpJz(_fromid,_funid,_flagtype,data){
	
	if(_funid=="5010:SIMPLE.L2620304"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			var Msg = data.ErrorInfo;
			if (Msg.indexOf("尚未开户")!= -1)
			{
				proError("您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部")
			}
			else
			{
				proError(data.ErrorInfo)	
			}	
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

var zzrq = [];
var zzrqPos = 1;
//获取产品发行终止日期
function get_CpFxzzrq(){
	
	setIX({
		"funcid":"L2612011",
		"funcname":'ret_CpFxzzrq',
		"isscode":"",
		"prodcode":"",
		"productid":"",
		"insttype":"",
		"instcls":"",
		"pagerecnum":zzrqPos.toString(),
		"pagecnt":"100"
	},User.khh)
}
function ret_CpFxzzrq(_fromid,_funid,_flagtype,data){
	
	
	if(_funid=="5010:SIMPLE.L2612011"){

		data=FormatResult(data,1)
		
		if(data.ErrorCode!="0"){
			var Msg = data.ErrorInfo;
			if (Msg.indexOf("尚未开户")!= -1)
			{
				proError("您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部")
			}
			else
			{
				proError(data.ErrorInfo)	
			}	
		 	return;
		} else if(data.rows.length == 100) {
			zzrq = zzrq.concat(data.rows);
			zzrqPos += 100;
			get_CpFxzzrq();
		}else{
		 	// if(data.rows==undefined) data.rows=[]
		 	zzrq = zzrq.concat(data.rows);

		 	var rq={}
		 	var rq2={}
		 	var cp={}
		 	var cp1={}
		 	var cp2={}
		 	var cp3={}

		 	$.each(zzrq,function(k,v){
		 		rq[v.productid]=v.iss_end_date

		 		var tmp = v.estyield*100;
		 		rq2[v.productid]=tmp.toFixed(2);

		 		cp[v.productid]=v.iss_bgn_date
		 		cp1[v.productid]=v.iss_end_date
		 		cp2[v.productid]=v.est_date
		 		cp3[v.productid]=v.end_date

		 		//rq2[v.productid]=(v.estyield*100)
		 	})

		 	glob.zzrq=rq;
		 	glob.yqnhsyl=rq2;
		 	glob3.xsqsr=cp
		 	glob3.xszzr=cp1
		 	glob3.qxr=cp2
		 	glob3.dqr=cp3
			get_Cpxeinfo()
		}
	}
}

//获取产品限额信息
function get_Cpxeinfo(){

	setIX({
		"funcid":"L2612039",
		"funcname":'ret_Cpxeinfo',
		"isscode":"",
		"prodcode":"",
		"productid":"",
		"insttype":"",
		"instcls":"",
		"user_type":""
	},User.khh)
}
function ret_Cpxeinfo(_fromid,_funid,_flagtype,data){
	
	if(_funid=="5010:SIMPLE.L2612039"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			var Msg = data.ErrorInfo;
			if (Msg.indexOf("尚未开户")!= -1)
			{
				proError("您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部")
			}
			else
			{
				proError(data.ErrorInfo)	
			}	
		 	return;
		}else{
		 	if(data.rows==undefined) data.rows=[]
		 	var rq={}
		 	var rq2={}

		 	var rq3={}
		 	var rq4={}

		 	$.each(data.rows,function(k,v){
		 		rq[v.productid]=v.min_subs_amt//最低认购金额
		 		rq2[v.productid]=v.max_subs_amt// 最高认购金额

		 		rq3[v.productid]=v.first_min_buy//首次最低金额
		 		rq4[v.productid]=v.append_min_buy// 追加最低金额
		 	})
		 	glob.zdrgje=rq;
		 	glob.zgrgje=rq2;

		 	glob3.sczdje=rq3;
		 	glob3.zjzdje=rq4;
		}
	}
//	get_CpInfo()
	//get_YHLCCPXX()
	cpxx = [];
	cpxxPos = 1;
	get_CpInfo()
}



//查询银行理财产品信息
function get_YHLCCPXX(){
	setIX({"funcid":"L2612142","funcname":'ret_Yhlccpxx',"isscode":"","prodcode":"","productid":"","pagerecnum":"0","pagereccnt":"500"},User.khh)
}
function ret_Yhlccpxx(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2612142"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			var Msg = data.ErrorInfo;
			if (Msg.indexOf("尚未开户")!= -1)
			{
				proError("您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部")
			}
			else
			{
				proError(data.ErrorInfo)	
			}	
		 	return;
		}else{
		 	if(data.rows==undefined) data. rows=[]
		 	var cp={}
		 	var cp1={}
		 	var cp2={}
		 	var cp3={}
		 	$.each(data.rows,function(k,v){
		 		cp[v.productid]=v.salebgndate
		 		cp1[v.productid]=v.saleenddate
		 		cp2[v.productid]=v.interestdate
		 		cp3[v.productid]=v.expirydate
		 	})		 	
		 	glob3.xsqsr=cp
		 	glob3.xszzr=cp1
		 	glob3.qxr=cp2
		 	glob3.dqr=cp3
		}
	}
	get_CpInfo()
}


var cpxx = [];
var cpxxPos = 1;
//请求产品信息
function get_CpInfo(){
	L2612001({"funcname":'ret_CpInfo'})
}

function ret_CpInfo(_fromid,_funid,_flagtype,data){

	if(_funid=="5010:SIMPLE.L2612001"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			var Msg = data.ErrorInfo;
			if (Msg.indexOf("尚未开户")!= -1)
			{
				proError("您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部")
			}
			else
			{
				proError(data.ErrorInfo)	
			}	
		 	return;
		} else if(data.rows.length == 100) {
			cpxx = cpxx.concat(data.rows);
			cpxxPos += 100;
			get_CpInfo();
		}else{
			
		 	if(data.rows==undefined) data.rows=[]
		 	cpxx = cpxx.concat(data.rows);
	 		cpxx=$.grep(cpxx,function(v,i){
	 
	
				if(v.iss_stat=="1"/* && v.insttype=="9"*/){




					if(glob.cpjz[cpxx[i].productid]==undefined)
			 			cpxx[i].lastnet=""
			 		else
			 			cpxx[i].lastnet=glob.cpjz[cpxx[i].productid]
			 		if(glob.zzrq[cpxx[i].productid]==undefined)
			 			cpxx[i].iss_end_date=""
			 		else
			 			cpxx[i].iss_end_date=glob.zzrq[cpxx[i].productid]

			 		if(glob.zdrgje[cpxx[i].productid]==undefined)
			 			cpxx[i].min_subs_amt=""
			 		else
			 			cpxx[i].min_subs_amt=glob.zdrgje[cpxx[i].productid]

			 		if(glob.zgrgje[cpxx[i].productid]==undefined)
			 			cpxx[i].max_subs_amt=""
			 		else
			 			cpxx[i].max_subs_amt=glob.zgrgje[cpxx[i].productid]





			 		if(glob3.xsqsr[cpxx[i].productid]==undefined)
			 			cpxx[i].salebgndate=""
			 		else
			 			cpxx[i].salebgndate=glob3.xsqsr[cpxx[i].productid]

			 		if(glob3.xszzr[cpxx[i].productid]==undefined)
			 			cpxx[i].saleenddate=""
			 		else
			 			cpxx[i].saleenddate=glob3.xszzr[cpxx[i].productid]

			 		if(glob3.qxr[cpxx[i].productid]==undefined)
			 			cpxx[i].interestdate=""
			 		else
			 			cpxx[i].interestdate=glob3.qxr[cpxx[i].productid]

			 		if(glob3.dqr[cpxx[i].productid]==undefined)
			 			cpxx[i].expirydate=""
			 		else
			 			cpxx[i].expirydate=glob3.dqr[cpxx[i].productid]

			 		if(glob.yqnhsyl[cpxx[i].productid]==undefined)
			 			cpxx[i].estyield=""
			 		else
			 			cpxx[i].estyield=glob.yqnhsyl[cpxx[i].productid]



			 		if(glob3.sczdje[cpxx[i].productid]==undefined)
			 			cpxx[i].first_min_buy=""
			 		else
			 			cpxx[i].first_min_buy=glob3.sczdje[cpxx[i].productid]

			 		if(glob3.zjzdje[cpxx[i].productid]==undefined)
			 			cpxx[i].append_min_buy=""
			 		else
			 			cpxx[i].append_min_buy=glob3.zjzdje[cpxx[i].productid]


			 		
			 		glob2.cpdm[num]=cpxx[i].prodcode
					glob2.cpbm[num]=cpxx[i].productid
					glob2.cpfxdj[num]=cpxx[i].risk_lvl
					
					num++;

					return v
				}
			})
		 	
		 	// upDate("load",data)
		 	upDate("load", { total: cpxx.length, rows: cpxx})
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
			EndCpdm=glob.cpbm;
			EndCpFxdj=get_RiskLvl(glob2.cpfxdj[i]) ;

			break;
		}
	}
	get_CCCXInfo();
	
}





//请求产品信息
function get_CCCXInfo(){
	
	setIX({"funcid":"L2610003","funcname":'ret_CCCXInfo',"custid":User.khh,"g_serverid":User.yyb,"g_bizsno":"","g_bizdate":"","g_biztype":"4"},User.khh)
}
//应答产品信息
function ret_CCCXInfo(_fromid,_funid,_flagtype,data){
	
	hideLoading()	
	data=FormatResult(data,1)
	if(data.ErrorCode!="0"){
			var Msg = data.ErrorInfo;
			if (Msg.indexOf("尚未开户")!= -1)
			{
				proError("您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部")
			}
			else
			{
				$.messager.alert('提示',data.ErrorInfo,"error");	
			}	
		
	 	return;
	}else{
		if(data.rows==undefined) data.rows=[]		
	 	
	 	
	 	EndKhFxdj=get_Fxpjlx(data.rows[0].eval_lvl);


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

	
	var wtbh="";
	if(_funid=="5010:SIMPLE.L2620100"){
		var ErrorMsg = "";		
	
		data=FormatResult(data,1)

		ErrorMsg=data.ErrorInfo

		if(ErrorMsg.indexOf("27030080") != -1)
		{
			
			var obj = document.getElementById("total")
			



obj.innerHTML="<div><h5 style='text-align:center;font-size:14px'>中信建投证券股份有限公司金融产品或金融服务不适当警示及客户投资确认书</h5><br><h6 style='text-align:center;font-size:12px'>风险等级、投资期限、投资品种不匹配警示</h6>"
			+"<br>尊敬的客户(姓名/名称:&nbsp;<b>"+User.uname+"</b>&nbsp;&nbsp;资金账号:&nbsp;<b>"+glob.zczh+"</b>)<br>"+"&nbsp;&nbsp;&nbsp;&nbsp;您拟投资的金融产品&nbsp;<b>"+glob.cpname+"</b>存在下列情况:<br>"+"&nbsp;&nbsp;&nbsp;&nbsp;其风险等级为&nbsp;<b>"+
			EndCpFxdj+"&nbsp;</b>,高于您在客户风险评估中所显示的风险承受能力等级&nbsp;<b>"+EndKhFxdj+"</b>.投资该项产品,可能导致高出您自身承受能力的损失.<br>"+
			"&nbsp;&nbsp;&nbsp;&nbsp;我营业部就上述情况向您做出提示,并建议您应当审慎考察该产品的特征及风险,自行做出充分风险评估.<br>&nbsp;&nbsp;&nbsp;&nbsp;若您经审慎考虑后,仍坚持投资该产品,请签署下附投资确认书.<br>"
			+"<br><h6 style='text-align:center;font-size:12px'>客户投资确认书</h6><br>&nbsp;&nbsp;&nbsp;&nbsp;本人/本机构已认真阅读了贵营业部关于&nbsp;<b>"+glob.cpname+"</b>产品或服务的相关提示,并已充分了解该产品或服务的特征和风险,充分知悉以下情况:<br>"
			+"&nbsp;&nbsp;&nbsp;&nbsp;其风险等级高于本人/本机构的风险承受能力等级.<br>&nbsp;&nbsp;&nbsp;&nbsp;本人/本机构经审慎考虑后，仍坚持投资该项产品，并愿意承担该项投资可能引起的损失和其他后果.投资该项产品的决定,系本人/本机构独立、自主、真实的意思表示,与贵营业部及相关从业人员无关.<br></div>"



			$('#singlewt2').dialog('open');
			//$("#singlewt").dialog("open")
			
			return
		}
		
		


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

			wtbh=data.rows[0].declid

			proInfo("委托已提交,委托编号："+wtbh );
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
	get_subRg()
	//$('#cdSucwt').dialog('open');
}
function onSinCance(){
	$('#singlewt').dialog('close');
	
}




function onSure(){
	
	$('#singlewt2').dialog('close');
	$('#singlewt').dialog('open');

	
	//$('#cdSucwt').dialog('open');
}
function onCancle(){
	$('#singlewt2').dialog('close');
	
}


//获取产品信息接口
function L2612001(d){
	d=$.extend({
		"funcid":"L2612001"
	},{
		"isscode":"",
		"prodcode":"",
		"productid":"",
		"insttype":"",
		"instcls":"",
		"pagerecnum":cpxxPos.toString(),
		"pagecnt":"100"
	},d)
	
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