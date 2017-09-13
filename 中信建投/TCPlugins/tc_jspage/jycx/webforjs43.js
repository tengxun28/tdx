function PageInit(){
	  //get_ZJInfo()
	  hideLoading()
	 // create_easygrid("资金查询",{"size":6},{"CURRENCY":{"formatter":get_moneyname}})
	  create_jqGrid("资金查询",{},{"currency":{"formatter":get_moneyname}})

	  get_ZJInfo()
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
	 get_ZJInfo()
}
*/

//请求资金信息
function get_ZJInfo(){
	setIX({"funcid":'L2611203',"funcname":'ret_ZJInfo',"custid":User.khh,"fundid":'',"currency":''},User.khh)
}
//应答资金信息
function ret_ZJInfo(_fromid,_funid,_flagtype,data){
	hideLoading()	
	data=FormatResult(data,1)
	if(data.ErrorCode!="0"){
		$.messager.alert('提示',data.ErrorInfo,"error");
	 	return;
	}else{
		if(data.rows==undefined) data.rows=[]
	 	
	 //	upDate("load",data)
	 up_jqGrid("load",data.rows)
	}
}
// 获取币种名称
function get_moneyname(c){
	var name=""
	if(c=="0")
		name="人民币"
	else if(c=="1")
		name="美元"
	else if(c=="2")
		name="港币"	
	return name
}

