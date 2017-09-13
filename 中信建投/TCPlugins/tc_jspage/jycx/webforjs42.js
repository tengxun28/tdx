var glob={
	"zzrq":""//产品终止日期		
}
function PageInit(){
	  hideLoading()
	 create_jqGrid("份额查询",{},{})
	  get_Cpzzrq()
}

//获取产品终止日期
function get_Cpzzrq(){

	setIX({"funcid":"L2612011","funcname":'ret_Cpzzrq',"isscode":"","prodcode":"","productid":"","insttype":"","instcls":"","pagerecnum":"0","pagecnt":"500"},User.khh)
}
function ret_Cpzzrq(_fromid,_funid,_flagtype,data){
	get_CCCXInfo()
	if(_funid=="5010:SIMPLE.L2612011"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
		 	if(data.rows==undefined) data.rows=[]
		 	var rq={}
		 	$.each(data.rows,function(k,v){
		 		rq[v.productid]=v.end_date
		 	})
		 	glob.zzrq=rq
		}
		get_CCCXInfo()
	}
	
}
//请求产品信息
function get_CCCXInfo(){
	setIX({"funcid":"L2620200","funcname":'ret_CCCXInfo',"custid":User.khh,"fundid":'',"stkacc":'',"isscode":'',"prodcode":'',"productid":'0',"pagerecnum":'500'},User.khh)
}
//应答产品信息
function ret_CCCXInfo(_fromid,_funid,_flagtype,data){
	hideLoading()	
	data=FormatResult(data,1)
	if(data.ErrorCode!="0"){
		$.messager.alert('提示',data.ErrorInfo,"error");
	 	return;
	}else{
		if(data.rows==undefined) data.rows=[]		
	 	data.rows=$.grep(data.rows,function(v,i){	
					
			 if(glob.zzrq[data.rows[i].productid]==undefined)
			 	data.rows[i].end_date=""
			 else
			 	data.rows[i].end_date=glob.zzrq[data.rows[i].productid]		
			return v	
			})
	 	up_jqGrid("load",data.rows)
	}
}
