var glob={
	"djzh":"",//登记账号
	"djjg":"",//登记机构
	"jyzh":"",//交易账号
	"zczh":"",//资产账户
	"zzrq":"",//产品终止日期
	"zdkm":"",//最大可卖
	"cpcode":"",//产品代码
	"cpname":"",//产品名称
	"cpbm":"",//产品编码
	"wtjg":"",//意向价格
	"wtsl":"",//意向数量
	"dlgflag":"0"//调用委托成交的对话框标志

	
}


var glob2={
	"cpdm":[],// 产品代码
	"cpbm":[]// 产品编码
	
};
var num =0;

var bgl=false;
var cxfs=0;
var codecxnum=""
function PageInit(){
	num =0;
	var obj = document.getElementById("code")
	obj.style.display="none";
	bgl=false;
	setDlg()
	
	hideLoading()
	create_jqGrid("定价卖出",{ondblClickRow:onDblClickRow},{"trdid":{"formatter":get_TraType},"pricetype":{"formatter":getBjls}})
	//create_easygrid("定价卖出",{"size":20,onDblClickRow:onDblClickRow},{"TRD_ID":{"formatter":get_TraType},"QUOTE_TYPE":{"formatter":getBjls}})
	// get_Djzh()
	//get_Djzh()
	get_DjwtDbf()
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
	get_Djzh()
}

*/
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
		//get_Cpzzrq()
		
	}
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
	// get_Yxbj()
	//get_DjwtDbf()
}



function get_DjwtDbf(){

	var _ix = new IXContent();
	_ix.Set('F113', "11");//股东代码
	
	Win_CallTQL('ret_DjwtDbf', 'JY:2276', _ix, '');
	
}

function ret_DjwtDbf(_fromid,_funid,_flagtype,data){
	num =0;
	if (_funid == 'JY:2276'){
		
		var data = FormatResult(data, 1);
		if (data.ErrorCode != 0){
			proError(data.ErrorInfo)
		}else{
			if(data.rows==undefined) data.rows=[]
			if(bgl)
			{
				data.rows=$.grep(data.rows,function(v,i){ 	
				if(v.F391==codecxnum)
				{	
					glob2.cpdm[num]=data.rows[i].F391
					glob2.cpbm[num]=data.rows[i].F254
					num++;					
					return v
				}
				})
				up_jqGrid("load",data.rows)

			}
			else
			{
				for(var i=0;i<data.rows.length;i++){
					
		 			glob2.cpdm[num]=data.rows[i].F391
					glob2.cpbm[num]=data.rows[i].F254
					

					num++;
		 		}
				up_jqGrid("load",data.rows)
			}
				
			//upDate("load",data)
		}
		get_Djzh()
		
	}
}


function onset(node){
	
	var obj=document.getElementById('code');

	if(node.value == "0")// 意查所有
	{
		 cxfs=0
		obj.style.display="none";
	}
	else if(node.value == "1")// 
	{
		 cxfs=1
		obj.style.display="block";
	}
	
	
}

function getCodeMsg()
{
	if(cxfs==0)
	{
		bgl=false;
	}
	else
	{
		bgl=true;
	}
	var codeobj = document.getElementById("code")
	codecxnum=codeobj.value;
	get_DjwtDbf()

}

//报价查询
function get_Yxbj(){
	setIX({"funcid":"L2620010","funcname":'ret_Yxbj',"strdate":getAddMonth(-2),"enddate":getCur(),"custid":User.khh,"stkacc":"","isscode":"","prodcode":"","productid":"","declid":"","cancancel":"1","pagerecnum":"0","pagecnt":"500"},User.khh)
}

function ret_Yxbj(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620010"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]
			
			/*$.each(data.rows,function(k,v){
				if(v.TRD_ID=="20B")
					dr.push(v)
			})*/
			for(var i=0;i<data.rows.length;i++){
	 		
		 		if(glob.zzrq[data.rows[i].productid]==undefined)
			 		data.rows[i].end_date=""
			 	else
			 		data.rows[i].end_date=glob.zzrq[data.rows[i].productid]
			 	if (fmtFt(data.rows[i].buyqty)>0.00) {
			 		data.rows[i].QUOTE_QTY=data.rows[i].buyqty
			 		data.rows[i].QUOTE_PRICE=data.rows[i].buyprice
			 	}else{
			 		data.rows[i].QUOTE_QTY=data.rows[i].sellqty
			 		data.rows[i].QUOTE_PRICE=data.rows[i].sellprice
			 	}
		 	}
		 	up_jqGrid("load",data.rows)
		 	//upDate("load",data)
		}
	}
}

function onDblClickRow(rowid,data){

	var code=data["F391"]
	for(var i=0; i<num; i++)
	{
	
		
		if(glob2.cpdm[i]==code)
		{
			glob.cpbm=glob2.cpbm[i];
			break;
		}
	}
	
	setIX({"funcid":"L2620200","funcname":'ret_Kshfe',"custid":User.khh,"stkacc":glob.djzh,"fundid":glob.zczh,"isscode":"","prodcode":data["F391"],"productid":glob.cpbm,"pagerecnum":"0","pagecnt":"500"},User.khh)


	$("#inst_code").attr("value",data["F391"])
	$("#inst_name").attr("value",data["F392"])
	$("#payprice").attr("value",data["F145"])
	$("#paynum").attr("value",data["F144"])
	/*if(rowdata.TRD_ID=="20S"){
		$("#maxpay").attr("value","0")
	}else{
		$("#maxpay").attr("value",rowdata.QUOTE_QTY)
	}*/
	$("#maxbuy").attr("value",glob.zdkm)
	onRadio(parseInt($("input[name='radioGroup1']:checked").val()))
	//glob.cpbm=data["F254"]
}

function ret_Kshfe(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620200"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
			return
		}else{
			if(data.rows==undefined) {
				glob.zdkm="0"
				//proInfo("未获取到产品净值信息")
				return
			}
			else{
				glob.zdkm=data.rows[0].ofavl				
			}
		}	
	}
}

//全部
function onAll(){
	$("#paynum").attr("value",$("#maxbuy").attr("value"))
}

//买入下单
function onSubmit(t){
	
	if(fmtFt($("#paynum").attr("value"))==0){
		proInfo("输入的委托数量无效")
		return;
	}
	if(fmtFt($("#paynum").attr("value"))>fmtFt($("#maxbuy").attr("value"))){
		proInfo("委托数量不能大于最大可卖")
		return;
	}
	glob.wtjg=$("#payprice").attr("value")
	glob.cpcode=$("#inst_code").attr("value")
	glob.cpname=$("#inst_name").attr("value")
	glob.wtsl=$("#paynum").attr("value")

	get_subXd()
}

function get_subXd(){
	$('#cdwt').dialog('open');
	
	$("#wtjg").text(glob.wtjg)
	$("#wtsl").text(glob.wtsl)
	$("#cpcode").text(glob.cpcode)
	$("#cpname").text(glob.cpname)
}

function onOk(){

	$('#cdwt').dialog('close');
	//$('#cdSucwt').dialog('open');
	get_Wtmc()
}
function onCance(){
	$('#cdwt').dialog('close');
}

/*function OnSucWt(){
	$('#cdSucwt').dialog('close');
	get_Wtmc()
}*/
//确定卖出
function get_Wtmc(){
	setIX({"funcid":"L2620001","funcname":'ret_Wtmr',"custid":User.khh,"fundid":glob.zczh,"issueorgcode":glob.djjg,"stkacc":glob.djzh,"transacc":glob.jyzh,
				"isscode":"","prodcode":"","productid":glob.cpbm,"buyprice":"","buyqty":"","sellprice":glob.wtjg,"sellqty":glob.wtsl,"pricetype":"1","cntrno":"","cntrregdate":"",
				"expdate":getCur(),"riskrevealmethod":risk},User.khh)
}
function ret_Wtmr(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620001"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
			return
		}else{
			proInfo("委托已提交")
			get_DjwtDbf()
			//get_Yxbj()
		}
	}
}
function onRadio(nr){
	var m=parseInt($("#maxbuy").attr("value"))
	m=isNaN(m)?0:m
	if(nr==0)
		$("#paynum").attr("value",parseInt(m/2))
	else if(nr==1)
		$("#paynum").attr("value",parseInt(m/3))
	else if(nr==2)
		$("#paynum").attr("value",parseInt(m/4))
	else if(nr==3)
		$("#paynum").attr("value",parseInt(m/5))
}

function fmtFt(f){
	f=parseFloat(f)
	return isNaN(f)?0:f
}
