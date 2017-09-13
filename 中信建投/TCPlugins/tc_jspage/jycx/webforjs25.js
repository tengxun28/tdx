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
	"jylb":"",//交易类别
	"yxjg":"",//意向价格
	"yxsl":"",//意向数量
	"yxyd":"",//意向约定
	"yxrq":"",//有效日期
	"lxrname":"",//联系人姓名
	"lxrphone":""//联系人电话
	
}


var glob2={
	"cpdm":[],// 产品代码
	"cpbm":[]// 产品编码
	
};
var num =0;

var bgl=false;
var cxfs=0;//0 查询所以，1根据产品代码查询
var codecxnum=""
function PageInit(){
	num =0;
	var obj = document.getElementById("code")
	obj.style.display="none";
	bgl=false;
	var today=getCur()	
	$("#edate").attr("value",today.slice(0, 4)+"-"+today.slice(4, 6)+"-"+today.slice(6,8))
	setDlg()
	hideLoading()
	//create_easygrid("意向卖出",{"size":20,onDblClickRow:onDblClickRow},{"TRD_ID":{"formatter":get_TraType},"MATCH_TYPE":{"formatter":get_MatchType},"ORD_STAT":{"formatter":get_wtStat}})
	create_jqGrid("意向卖出",{ondblClickRow:onDblClickRow},{"trdid":{formatter:get_TraType},"matchtype":{"formatter":get_MatchType},"ord_stat":{"formatter":get_wtStat}})
	// get_Djzh()
	//get_Djzh()
	get_YxwtDbf()
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
	//	get_Cpzzrq()
		
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
	//get_Yxbj()
	//get_YxwtDbf()
}




function get_YxwtDbf(){	
	var _ix = new IXContent();
	_ix.Set('F113', "9");//股东代码
	
	Win_CallTQL('ret_YxwtDbf', 'JY:2244', _ix, '');
	
}

function ret_YxwtDbf(_fromid,_funid,_flagtype,data){
	num==0
	
	if (_funid == 'JY:2244'){
		
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
			var dr=[]
/*			$.each(data.rows,function(k,v){
				if(v.TRD_ID=="20B")
					dr.push(v)
			})*/
			for(var i=0;i<data.rows.length;i++){
		 		
		 		if(glob.zzrq[data.rows[i].productid]==undefined)
			 		data.rows[i].end_date=""
			 	else
			 		data.rows[i].end_date=glob.zzrq[data.rows[i].productid]
		 	}
		 	up_jqGrid("load",data.rows)
		 	//upDate("load",data)
		}
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
	get_YxwtDbf()

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
	$("#lxrname").attr("value",data["F106"])
	$("#lxrphone").attr("value",data["F459"])
	//$("#inva_date").attr("value",rowdata.VALID_DATE)
	/*if(rowdata.TRD_ID=="20S"){
		$("#maxpay").attr("value","0")
	}else{
		$("#maxpay").attr("value",rowdata.QUOTE_QTY)
	}*/
	$("#maxpay").attr("value",glob.zdkm)
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
				$("#maxpay").attr("value",glob.zdkm)		
			}
		}	
	}
}

function ClearInput(){
	$("#inst_name").attr("value","")
	$("#payprice").attr("value","")
	$("#paynum").attr("value","")
	$("#lxrname").attr("value","")
	$("#lxrphone").attr("value","")
	//$("#inva_date").attr("value","")
	$("#maxpay").attr("value","")
	
}


//请求产品信息
function get_CpInfo(cpdm){

	L2612001({"funcname":'ret_CpInfo',"prodcode":cpdm})
	
}
//应答产品信息
function ret_CpInfo(_fromid,_funid,_flagtype,data){

	if(_funid=="5010:SIMPLE.L2612001"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
			ClearInput()
		 	return;
		}else{
		 	if(data.rows==undefined){
		 		proInfo("没获取到该产品信息,请重新输入产品代码")
		 		ClearInput()
		 		return
		 	}else{
		 	
		 		$("#inst_name").attr("value",data.rows[0].productname)
		 		glob.cpbm=data.rows[0].productid
		

		 		setIX({"funcid":"L2620200","funcname":'ret_Kshfe',"custid":User.khh,"stkacc":glob.djzh,"fundid":glob.zczh,"isscode":data.rows[0].isscode,"prodcode":data.rows[0].prodcode,"productid":"","pagerecnum":"0","pagecnt":"500"},User.khh)
		 	}
		 	
		}
	}
}
var listdata=selectRow("F391")
function CheckCode(name,node,e){
	if(name=="keyup"){
		if($(node).attr('value').length==6){
			get_CpInfo2()
		
			//get_CpInfo($(node).attr('value'))
			/*var value = listdata($(node).attr('value'),"load")
			if (value!=-1){
				onDblClickRow(value[0],value[1])
			}else{
				proInfo("没有该产品信息，请重新输入产品代码")
				
	    		return;
			}*/
		}else{
			ClearInput()
		}
	}
}


//获取产品信息
function get_CpInfo2(){
	
	var cxCode=$("#inst_code").attr("value")
	
	setIX({"funcname":'ret_CpInfo2',"funcid":"L2612001","isscode":"","prodcode":cxCode,"productid":"","insttype":"","instcls":"","pagerecnum":"0","pagecnt":"500"},User.khh)
}
function ret_CpInfo2(_fromid,_funid,_flagtype,data){


	if(_funid=="5010:SIMPLE.L2612001"){
		
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			$.messager.alert('提示',data.ErrorInfo,"error");
		 	return;
		}else{
			if(data.rows==undefined)
			{
				proInfo("没有该产品信息，请重新输入产品代码");
			}
			else
			{
				$("#inst_name").attr("value",data.rows[0].productname)
				glob.cpbm=data.rows[0].productid
			} 	
		
			
		}
	}
}


//全部
function onAll(){
	$("#paynum").attr("value",$("#maxpay").attr("value"))
}

//买入下单
function onSubmit(t){
	if(isNullStr($("#inst_code").attr("value"))){
		proError("产品代码不能为空")
		return;
	}
	if(fmtFt($("#payprice").attr("value"))==0){
		proError("输入的委托价格无效")
		return;
	}
	if(fmtFt($("#paynum").attr("value"))==0){
		proInfo("输入的委托数量无效")
		return;
	}
	if(fmtFt($("#paynum").attr("value"))>fmtFt($("#maxpay").attr("value"))){
		proInfo("委托数量不能大于最大可卖")
		return;
	}
	if(isNullStr($("#lxrname").attr("value"))){
		proError("联系人姓名不能为空")
		return;
	}
	if(isNullStr($("#lxrphone").attr("value"))){
		proError("联系人电话不能为空")
		return;
	}
	/*if(isNullStr($("#inva_date").attr("value"))){
		proError("有效日期不能为空")
		return;
	}*/
	glob.jylb="20S"
	glob.yxjg=$("#payprice").attr("value")
	glob.cpcode=$("#inst_code").attr("value")
	glob.cpname=$("#inst_name").attr("value")
	glob.yxsl=$("#paynum").attr("value")
	var obj=document.getElementById('kkr_type');
	var index=obj.selectedIndex; 
	glob.yxyd=obj.options[index].value;
	glob.yxrq=$("#edate").attr("value")
	glob.lxrname=$("#lxrname").attr("value")
	glob.lxrphone=$("#lxrphone").attr("value")
	
	get_subXd()
}

function get_subXd(){
	
	$('#cdwt').dialog('open');
	
	if(glob.yxyd=="0")
		$("#yxyd").text("可部分成交")
	else
		$("#yxyd").text("不可部分成交")
	$("#wtjg").text(glob.yxjg)
	$("#wtsl").text(glob.yxsl)
	$("#cpcode").text(glob.cpcode)
	$("#cpname").text(glob.cpname)
	$("#lxrxm").text(glob.lxrname)
	$("#lxrdh").text(glob.lxrphone)
	$("#yxrq").text(glob.yxrq)
	
}

function onOk(){
	$('#cdwt').dialog('close');
	//$('#cdSucwt').dialog('open');
	get_WtYxmc()
}
function onCance(){
	$('#cdwt').dialog('close');
}

/*function OnSucWt(){
	$('#cdSucwt').dialog('close');
	get_WtYxmc()
	
}*/
//确定意向卖出
function get_WtYxmc(){
	setIX({"funcid":"L2620110","funcname":'ret_WtYxmc',"custid":User.khh,"fundid":glob.zczh,"issueorgcode":glob.djjg,"stkacc":glob.djzh,"transacc":glob.jyzh,
				"isscode":"","prodcode":"","productid":glob.cpbm,"trdid":glob.jylb,"trdprice":glob.yxjg,"stkqty":glob.yxsl,
				"matchtype":glob.yxyd,"expdate":fmtDt(glob.yxrq),"linkman":glob.lxrname,"linktelno":glob.lxrphone,"st_remark":"","cntrno":"","cntrregdate":""},User.khh)
}
function ret_WtYxmc(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620110"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
			proInfo("委托已提交")
			//get_Yxbj()
			get_YxwtDbf()
		}
	}
}
function onRadio(nr){
	var m=parseInt($("#maxpay").attr("value"))
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


function fmtDt(d){
	var dl=d.split("-")
	var tmpdata=""
	
	if(dl.length!=3)
		return ""
	var fl=$.map(dl,function(val){
		tmpdata = tmpdata+val;
		//return sigtodow(parseInt(val))
	})
	//return fl.join('')
	return tmpdata
	
}

//获取产品信息接口
function L2612001(d){
	d=$.extend({"funcid":"L2612001"},{"isscode":"","prodcode":"","productid":"","insttype":"","instcls":"","pagerecnum":"0","pagecnt":"500"},d)
	setIX(d,User.khh)
}

var wtState={"0":"未报","1":"已报","2":"确认","3":"部撤","4":"全撤","5":"部成","6":"全成","7":"废单",
			"8":"已报待撤","9":"部成待撤","A":"待撤销","B":"TA确认","C":"TA失败","D":"待申报","E":"对手拒绝"}
// 委托状态
function get_wtStat(c){
	return wtState[c]==undefined?"":wtState[c]
}