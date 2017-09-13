var glob={
	"zzrq":"",//产品终止日期		
	"fxdj":""//风险等级		
}
function PageInit(){
	
	  hideLoading()
	 create_jqGrid("风险承受能力",{},{ "eval_lvl":{"formatter":get_Fxpjlx} })

	
	  get_CCCXInfo()
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
	 	
	 	up_jqGrid("load",data.rows)
	}
}
