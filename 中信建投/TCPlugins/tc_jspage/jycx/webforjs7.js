
function PageInit(){	
	var today=getCur()
	var preweek=getAddMonth(-1)
	hideLoading()
	$("#sdate").attr("value",preweek.slice(0, 4)+"-"+preweek.slice(4, 6)+"-"+preweek.slice(6,8))
	$("#edate").attr("value",today.slice(0, 4)+"-"+today.slice(4, 6)+"-"+today.slice(6,8))
	create_jqGrid("银行产品成交查询",{},{"trdid":{"formatter":get_TraType}})


	 get_CJCXInfo()
}


//请求产品信息
function get_CJCXInfo(){
	var start=$("#sdate").attr("value")
	var end=$("#edate").attr("value")
	setIX({"funcid":"L2800902","funcname":'ret_CJCXInfo',"strdate":fmtDt(start),"enddate":fmtDt(end),"custid":User.khh,"fundid":'',
		"transacc":'',"pagerecnum":'0',"pagecnt":'500'},User.khh)
}
//应答产品信息
function ret_CJCXInfo(_fromid,_funid,_flagtype,data){

	if(_funid=="5010:SIMPLE.L2800902"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			
			if(data.ErrorInfo.indexOf("没有查询数据") != -1)
			{				
				data.rows=[];
				$("#total").text("共"+data.rows.length+"条")
				up_jqGrid("load",data.rows)

			}
			else
			{
				var Msg = data.ErrorInfo;
			if (Msg.indexOf("尚未开户")!= -1)
			{
				proError("您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部")
			}
			else
			{
				proError(data.ErrorInfo)	
			}	
				$("#total").text("共0条")
			}
			
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[];
			//myAlert(data.rows)
		 	$("#total").text("共"+data.rows.length+"条")
		 //	upDate("load",data)
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
		return sigtodow(parseInt(val))
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