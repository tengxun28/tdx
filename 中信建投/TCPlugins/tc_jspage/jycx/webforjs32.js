
function PageInit(){	
	
	var today=getCur()
	var preweek=getAddMonth(-1)
	hideLoading()
	$("#sdate").attr("value",preweek.slice(0, 4)+"-"+preweek.slice(4, 6)+"-"+preweek.slice(6,8))
	$("#edate").attr("value",today.slice(0, 4)+"-"+today.slice(4, 6)+"-"+today.slice(6,8))
	//create_easygrid("成交申报查询",{"size":22},{"ORD_STAT":{"formatter":get_wtStat},"TRD_ID":{"formatter":get_TradId},"APP_TIMESTAMP":{"formatter":getTime},"CANCEL_FLAG":{"formatter":get_CanStat}})
	create_jqGrid("成交申报查询",{},{"ord_stat":{"formatter":get_wtStat},"trdid":{"formatter":get_TradId},"cancelflag":{"formatter":get_CanStat}})
	 // get_CJCXInfo()
	 get_CJCXInfo()
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
	get_CJCXInfo()
}

*/
//请求产品信息
function get_CJCXInfo(){
	var start=$("#sdate").attr("value")
	var end=$("#edate").attr("value")
	setIX({"funcid":"L2620124","funcname":'ret_CJCXInfo',"strdate":fmtDt(start),"enddate":fmtDt(end),"custid":User.khh,"fundid":'',
		"stkacc":'',"isscode":'',"prodcode":'',"productid":'',"cntrno":'',"declid":'',"quotedeclid":'',"cancancel":'',"pagerecnum":'0',"pagecnt":'500'},User.khh)
}
//应答产品信息
function ret_CJCXInfo(_fromid,_funid,_flagtype,data){
	hideLoading()	
	if(_funid=="5010:SIMPLE.L2620124"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
			$("#total").text("共0条")
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]
		 	$("#total").text("共"+data.rows.length+"条")
		 	//upDate("load",data)
		 	up_jqGrid("load",data.rows)
		}
	}
}


function fmtDt(d){
	var dl=d.split("-")
	var tmpdata=""
	
	if(dl.length!=3)
		return ""
	var fl=$.map(dl,function(val){
		tmpdata=tmpdata+val;
		//return sigtodow(parseInt(val))
	})
	return tmpdata
	
}
function onQuery(){
	get_CJCXInfo()
}
// 交易类别
function get_TradId(c){
	var stat=""
	if(c=="001")
		stat="开户"
	else if(c=="002")
		stat="销户"
	else if(c=="003")
		stat="变更"
	else if(c=="008")
		stat="注册"
	else if(c=="110")
		stat="认购"	
	else if(c=="111")
		stat="申购"
	else if(c=="112")
		stat="赎回"
	else if(c=="20B")
		stat="买入"
	else if(c=="20S")
		stat="卖出"
	return stat
}

var wtState={"0":"未报","1":"已报","2":"确认","3":"部撤","4":"全撤","5":"部成","6":"全成","7":"废单",
			"8":"已报待撤","9":"部成待撤","A":"待撤销","B":"TA确认","C":"TA失败","D":"待申报","E":"对手拒绝"}
// 委托状态
function get_wtStat(c){
	return wtState[c]==undefined?"":wtState[c]
}
