var glob={
	"djzh":"",//登记账号
	"djjg":"",//登记机构
	"jyzh":"",//交易账号
	"zczh":"",//资产账户
	"fxrdm":"",//发行人代码
	"cpbm":"",//产品编码
	"cpcode":"",
	"cpname":"",
	"zzrq":"",//产品终止日期
	"ksfe":"",//可赎份额
	"wtsl":"",//委托数量
	"cpjz":"",//产品净值
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
	create_jqGrid("赎回",{ondblClickRow:onDblClickRow},{})
	
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
	//	get_CpJz()
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
		 	$.each(data.rows,function(k,v){
		 		rq[v.productid]=v.end_date
		 	})
		 	glob.zzrq=rq
		}
	}
	get_Cpfe()
}

//请求产品份额
function get_Cpfe(){
	setIX({"funcid":"L2620200","funcname":'ret_Cpfe',"custid":User.khh,"stkacc":glob.djzh,"fundid":glob.zczh,"isscode":"","prodcode":"","productid":"","pagerecnum":"0","pagecnt":"500"},User.khh)
}

function ret_Cpfe(_fromid,_funid,_flagtype,data){
	
	if(_funid=="5010:SIMPLE.L2620200"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]
		 	for(var i=0;i<data.rows.length;i++){
		 		glob2.cpdm[num]=data.rows[i].prodcode
					glob2.cpbm[num]=data.rows[i].productid
					num++;

		 		if(glob.cpjz[data.rows[i].productid]==undefined)
		 			data.rows[i].lastnet=""
		 		else
		 			data.rows[i].lastnet=glob.cpjz[data.rows[i].productid]
		 		if(glob.zzrq[data.rows[i].productid]==undefined)
			 			data.rows[i].end_date=""
			 	else
			 		data.rows[i].end_date=glob.zzrq[data.rows[i].productid]
		 	}
		 //	upDate("load",data)
		 	up_jqGrid("load",data.rows)
		}
	}
}
function onDblClickRow(rowid,data){
	$("#inst_code").attr("value",data["prodcode"])
	$("#inst_name").attr("value",data["productname"])
	$("#ksfe").attr("value",data["ofavl"])
	$("#instjz").attr("value",data["lastnet"])
	//glob.cpbm=data["INST_ID"]
	glob.fxrdm=data["isscode"]
	glob.cpcode=data["prodcode"]
	glob.cpname=data["productname"]
	for(var i=0; i<num; i++)
	{
		
		if(glob2.cpdm[i]==glob.cpcode)
		{
			glob.cpbm=glob2.cpbm[i];
			break;
		}
	}
}

function onAll(t){
	$("#wtsl").attr("value",$("#ksfe").attr("value"))
}

//确认认购
function onSubmit(t){
	if(isNullStr($("#inst_code").attr("value"))){
		proError("产品代码不能为空")
		return;
	}
	if(isNullStr($("#wtsl").attr("value"))){
		proError("请输入委托数量")
		return;
	}
	if(parseFloat($("#wtsl").attr("value"))>parseFloat($("#ksfe").attr("value"))){
		proInfo("委托数量不能大于可赎数量")
		return;
	}

	glob.wtsl=$("#wtsl").attr("value")
	glob.cpcode=$("#inst_code").attr("value")
	glob.cpname=$("#inst_name").attr("value")

	get_Xd()
}

function get_Xd(){

	$('#cdwt').dialog('open');

	$("#cpcode").text(glob.cpcode)

	$("#cpname").text(glob.cpname)

	$("#wtwtsl").text(glob.wtsl)

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
			
			$("#ksfe").attr("value","")
			$("#inst_name").attr("value","")
			$("#instjz").attr("value","")
			$("#wtsl").attr("value","")
		}
	}
}

function onOk(){
	glob.dlgflag="0"
	$('#cdwt').dialog('close');
	//$('#cdSucwt').dialog('open');
	get_subXd()
}
function onCance(){
	$('#cdwt').dialog('close');
}

/*function OnSucWt(){
	$('#cdSucwt').dialog('close');
}*/
function onSinOk(){
	glob.dlgflag="1"
	$('#singlewt').dialog('close');
	//$('#cdSucwt').dialog('open');
	get_subXd()
}
function onSinCance(){
	$('#singlewt').dialog('close');	
}

function get_subXd(){
	
	setIX({"funcid":"L2620101","funcname":'ret_subXd',"custid":User.khh,"fundid":glob.zczh,"issueorgcode":glob.djjg,"stkacc":glob.djzh,"transacc":glob.jyzh,
				"isscode":glob.fxrdm,"prodcode":"","productid":glob.cpbm,"trdid":"","trdqty":glob.wtsl,"cntrno":"","cntrregdate":"","redeemtype":""},User.khh)

}
function ret_subXd(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620101"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
			return
		}else{
			proInfo("委托已提交")
			get_Djzh()
		}
	}
}
function fmtFt(f){
	f=parseFloat(f)
	return isNaN(f)?0:f
}
