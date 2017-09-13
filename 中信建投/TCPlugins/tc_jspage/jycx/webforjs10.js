var glob={
	"zzrq":""//产品终止日期
}

function PageInit(){	
	hideLoading()
	create_jqGrid("意向申报查询",{},{"ord_stat":{"formatter":get_wtStat},"trdid":{"formatter":get_TraType},"matchtype":{"formatter":get_MatchType}})
	//create_easygrid("意向申报查询",{},{"ORD_STAT":{"formatter":get_wtStat},"TRD_ID":{"formatter":get_TraType},"MATCH_TYPE":{"formatter":get_MatchType}})
	get_Yxbj()
	// get_Cpzzrq()
}


function get_Cpzzrq(){
	setIX({"funcid":"L2612011","funcname":'ret_Cpzzrq',"isscode":"","prodcode":"","productid":"","insttype":"","instcls":"","pagerecnum":"0","pagecnt":"500"},User.khh)
}
function ret_Cpzzrq(_fromid,_funid,_flagtype,data){
	get_Yxbj()
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
	get_Yxbj()
}

//意向报价查询
function get_Yxbj(){
	setIX({"funcid":"L2620115","funcname":'ret_Yxbj',"strdate":getAddMonth(-2),"enddate":getCur(),"custid":User.khh,"prodcode":"","productid":"","declid":"","cancancel":"1","pagerecnum":"0","pagecnt":"500"},User.khh)
}

function ret_Yxbj(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620115"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]
			for(var i=0;i<data.rows.length;i++){
		 		
		 		if(glob.zzrq[data.rows[i].productid]==undefined)
			 		data.rows[i].iss_end_date=""
			 	else
			 		data.rows[i].iss_end_date=glob.zzrq[data.rows[i].productid]
		 	}
		 	//upDate("load",data)
		 	up_jqGrid("load",data.rows)
		}
	}
}

var wtState={"0":"未报","1":"已报","2":"确认","3":"部撤","4":"全撤","5":"部成","6":"全成","7":"废单",
			"8":"已报待撤","9":"部成待撤","A":"待撤销","B":"TA确认","C":"TA失败","D":"待申报","E":"对手拒绝"}
// 委托状态
function get_wtStat(c){
	return wtState[c]==undefined?"":wtState[c]
}
