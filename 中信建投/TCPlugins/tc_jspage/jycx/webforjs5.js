function PageInit(){
	
	var today=getCur()
	var preweek=getAddMonth(-1)
	hideLoading()
	$("#sdate").attr("value",preweek.slice(0, 4)+"-"+preweek.slice(4, 6)+"-"+preweek.slice(6,8))
	$("#edate").attr("value",today.slice(0, 4)+"-"+today.slice(4, 6)+"-"+today.slice(6,8))
	//create_easygrid("委托查询",{},{"ORD_STAT":{"formatter":get_wtStat},"TRD_ID":{"formatter":get_TraType},"APP_TIMESTAMP":{"formatter":getTime}})
	create_jqGrid("银行产品委托查询",{},{"ord_stat":{"formatter":get_wtStat},"trdid":{"formatter":get_TraType}})

	// get_WTInfo()
	get_WTInfo()
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
	get_WTInfo()
}

*/
//请求产品信息
var page;
function get_WTInfo(){

	var start=$("#sdate").attr("value")
	var end=$("#edate").attr("value")
	page=new pagecall({"id":"load","cyclef":cp_info,"fcall":ret_cp},{"funcid":"L2620105","funcname":'cp_info',"strdate":fmtDt(start),"enddate":fmtDt(end),"custid":User.khh,"fundid":'',
		"stkacc":'',"transacc":'',"isscode":'',"prodcode":'',"productid":'',"declid":'',"cancancel":'',"pagerecnum":'0',"pagecnt":'10'},User.khh)
	page.request()
	//setIX({"funcid":"L2620105","funcname":'ret_WTInfo',"BGN_DATE":fmtDt(start),"END_DATE":fmtDt(end),"CUST_CODE":User.khh,"CUACCT_CODE":'',
		//"TA_ACCT":'',"TRANS_ACCT":'',"ISS_CODE":'',"INST_CODE":'',"INST_ID":'',"APP_SNO":'',"CAN_CANCEL":'',"PAGE_RECNUM":'0',"PAGE_RECCNT":'10'},User.khh)
}
//应答产品信息
function ret_WTInfo(_fromid,_funid,_flagtype,data){
	
	hideLoading()
	if(_funid=="5010:SIMPLE.L2620105"){	
		data=FormatResult(data,1)	
		if(data.ErrorCode!="0"){
			$("#total").text("共0条")
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

			data.rows=$.grep(data.rows,function(v,i){	 
	
				//if( v.insttype=="9"){
					return v
				//}
			})

	 		$("#total").text("共"+data.rows.length+"条")
	 	
	 		upDate("load",data)
		}

	}
		
	
}
var wtState={"0":"未报","1":"已报","2":"确认","3":"部撤","4":"全撤","5":"部成","6":"全成","7":"废单",
			"8":"已报待撤","9":"部成待撤","A":"待撤销","B":"TA确认","C":"TA失败","D":"待申报","E":"对手拒绝"}
// 委托状态
function get_wtStat(c){
	return wtState[c]==undefined?"":wtState[c]
}

function fmtDt(d){
	
	var dl=d.split("-")

	var tmpdata="";
	if(dl.length!=3)
		return ""
	var fl=$.map(dl,function(val){
		tmpdata=tmpdata+val;
		//return sigtodow(parseInt(val))
	})

	return tmpdata
	
}
function onQuery(){
	get_WTInfo()
}
function test3(){
	alert("1")
	return "1"
}

/*
cyclef循环取数据回调
f数据取完后回调
*/

var pagecall=function(opt,ix,c){
	
	this.PAGE_RECNUM=0
	this.PAGE_RECCNT=opt["cnt"]||20
	this.cyclef=ix["funcname"]//循环取数据回调
	this.fcall=opt["fcall"]//数据取完后回调
	this.funcid=ix["funcid"]
	this.upid=opt["id"]||null
	this.ix=ix//ix协议
	this.c=c;
	this.data=[]
	this.request=function(){
		this.ix["pagerecnum"]=this.pagerecnum+""
		this.ix["pagecnt"]=this.pagecnt+""
		this.tipinfo()
		setIX(this.ix,this.c)
	}
	this.asyquest=function(_funid,data){
		
		if(_funid=="5010:SIMPLE."+this.funcid){
			data=FormatResult(data,1)
			if(data.ErrorCode!="0"){
				if(this.PAGE_RECNUM==0){//第一次查询就报错

					var Msg = data.ErrorInfo;
					if (Msg.indexOf("尚未开户")!= -1)
					{
						$.messager.alert('提示',"您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部","error");						
					}
					else
					{
						$.messager.alert('提示',data.ErrorInfo,"error");	
					}	

					
					this.update("error")
					return
				}else{
					this.update()
					/*this.fcall(this.data)*/
				}
			}else{
				if(data.rows==undefined){
					data.rows=[]
				}
				var dt=this.data.concat(data.rows)
				this.data=dt
				if(data.rows.length!=this.pagecnt){

					this.update()
				}else{
					this.pagerecnum+=1
					this.request()
				}	
	 		}
		}
		
	};
	this.update=function(s){
		
		if(this.fcall!=undefined&&s!="error"){
			
			this.fcall(this.data)
			return
		}

		if(this.upid!=""||this.upid!=null){
			upDate(this.upid,{"rows":this.data,"total":this.data.length})
		}
	};
	this.tipinfo=function(){
		if(this.pagerecnum==0){
			if(this.upid!=""&&this.upid!=null){

				//upDate(this.upid,{"rows":[]},{"info":"正在查询数据,请稍后"})
			}
		}
	}


}

function cp_info(_fromid,_funid,_flagtype,data){
	page.asyquest(_funid,data)
}
function ret_cp(data){
	$("#total").text("共"+data.length+"条")


	
	 upDate("load",{"rows":data,"total":data.length})
	
	 
	 	
}



