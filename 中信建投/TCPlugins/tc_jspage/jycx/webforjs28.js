var glob={
	"djzh":"",//登记账号
	"djjg":"",//登记机构
	"jyzh":"",//交易账号
	"zczh":"",//资产账户
	"kyzj":"",//可用资金
	"cpbm":"",//产品编码
	"jylb":"",//交易类别
	"wtjg":"",//委托价格
	"wtsl":"",//委托数量
	"zzrq":"",//产品终止日期
	"cpcode":"",//产品代码
	"cpname":"",//产品名称
	"ydh":"",//约定号
	"ydrzh":"",//约定人账号
	"bjlx":"",//报价类型
	"bjsqbhval":"",// 报价申请编号
	"data":"",
	"dlgflag":"0"//调用委托成交的对话框标志
}

var glob2={
	"cpdm":[],// 产品代码
	"cpbm":[]// 产品编码
	
};
var num =0;

var cxfs=0;
var bgl=false;
var codecxnum=""
function PageInit(){
	num =0;
	var obj = document.getElementById("code")
	obj.style.display="none";
	
	bgl=false;
	setDlg()
	
	hideLoading()
	create_jqGrid("确认买入",{ondblClickRow:onDblClickRow},{"ord_stat":{"formatter":get_wtStat},"trdid":{"formatter":get_TraType},"matchtype":{"formatter":get_MatchType}})
	//create_easygrid("确认买入",{"size":20,onDblClickRow:onDblClickRow},{"TRD_ID":{"formatter":get_TraType},"ORD_STAT":{"formatter":get_wtStat}})
	// get_Djzh()
	// get_Djzh()
	get_QrwtDbf()
}
function onset(node){
	
	var obj=document.getElementById('bjsqbh');	
	obj.value="";

	if(node.value == "0")// 意向报价
	{
		//obj.style.display = "block";
		$("#bjsqbh").attr({"disabled":false});
		obj.className="form_input form_val_five"
	}
	else if(node.value == "9")// 无报价
	{
		//obj.style.display = "none";
		//obj.className="form_disabled";
		$("#bjsqbh").attr({"disabled":true});
		obj.className="form_input form_disabled form_val_five"
	}
	
	
}


function onset2(node){
	
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
		get_KhKyzj()
		
	}
}
//获取客户可用资金
function get_KhKyzj(){
	setIX({"funcid":"L2611203","funcname":'ret_KhKyzj',"custid":User.khh,"fundid":"","currency":""},User.khh)
}

function ret_KhKyzj(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2611203"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
			if(data.rows==undefined){
				proInfo("未获取到可用金额")
				return
			}else{
		 		glob.kyzj=fmtFt(data.rows[0].fundavl)
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
	//get_bj()
	// get_CJCXInfo();
	
	// get_QrwtDbf()
}


function get_QrwtDbf(){

	var _ix = new IXContent();
	_ix.Set('F113', "8");//股东代码
	
	Win_CallTQL('ret_QrwtDbf', 'JY:2244', _ix, '');
	
}

function ret_QrwtDbf(_fromid,_funid,_flagtype,data){
	num =0;
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
	get_QrwtDbf()

}

/*


//请求产品信息
function get_CJCXInfo(){

	setIX({"funcid":"L2620124","funcname":'ret_CJCXInfo',"BGN_DATE":getAddMonth(-2),"END_DATE":getCur(),"CUST_CODE":User.khh,"CUACCT_CODE":'',
		"TA_ACCT":'',"ISS_CODE":'',"INST_CODE":'',"INST_ID":'',"CNTR_NO":'',"APP_SNO":'',"PAGE_RECNUM":'0',"PAGE_RECCNT":'500'},User.khh)
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
		 	$("#total").text("共"+data.rows.length+"条")
		 	upDate("load",data)
		}
	}
}

*/
function onDblClickRow(rowid,data){
	
	$("#inst_code").attr("value",data["F391"])
	$("#inst_name").attr("value",data["F392"])

var code=data["F391"]

	for(var i=0; i<num; i++)
	{
	
		
		if(glob2.cpdm[i]==code)
		{
			glob.cpbm=glob2.cpbm[i];
			break;
		}
	}
	
//	glob.cpbm=data["F254"]

		
}



//请求产品信息
function get_CpInfo(cpdm){
	L2612001({"funcname":'ret_CpInfo',"INST_CODE":cpdm})
	
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
		 		$("#inst_name").attr("value",data.rows[0].F392)
		 		glob.cpbm=data.rows[0].F254
		 		//glob.bjlx=""
		 		//setIX({"funcid":"L2620010","funcname":'ret_bjlx',"BGN_DATE":getAddMonth(-2),"END_DATE":getCur(),"CUST_CODE":User.khh,"TA_ACCT":glob.djzh,"ISS_CODE":"","INST_CODE":"","INST_ID":glob.cpbm,"APP_SNO":"","CAN_CANCEL":"1","PAGE_RECNUM":"0","PAGE_RECCNT":"500"})
		 	}
		}
	}
}
/*function ret_bjlx(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620010"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]
			else glob.bjlx=data.rows[0].QUOTE_TYPE
		 	
		}
	}
}*/



//买入价格失去焦点时调用
function onBuyPrice(v){
	
	v=fmtFt(v)
	if(v==0)
		$("#maxbuy").attr("value","0")
	else{
		
		$("#maxbuy").attr("value",parseInt((glob.kyzj/v)+"")+"")
	}
	onRadio(parseInt($("input[name='radioGroup1']:checked").val()))
}

function ClearInput(){
	$("#inst_name").attr("value","")
	$("#buyprice").attr("value","")
	$("#buynum").attr("value","")
	$("#ydh").attr("value","")
	$("#jyzh").attr("value","")
	
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
	$("#buynum").attr("value",$("#maxbuy").attr("value"))
}

//买入下单
function onSubmit(t){
	if(isNullStr($("#inst_code").attr("value"))){
		proError("产品代码不能为空")
		return;
	}
	if(fmtFt($("#buyprice").attr("value"))==0){
		proError("输入的委托价格无效")
		return;
	}
	if(fmtFt($("#buynum").attr("value"))==0){
		proInfo("输入的委托数量无效")
		return;
	}
	if(isNullStr($("#ydh").attr("value"))){
		proError("双方约定号不能为空")
		return;
	}
	if(isNullStr($("#jyzh").attr("value"))){
		proError("对方交易账号不能为空")
		return;
	}
	
	glob.wtjg=$("#buyprice").attr("value")
	glob.wtsl=$("#buynum").attr("value")
	glob.cpcode=$("#inst_code").attr("value")
	glob.cpname=$("#inst_name").attr("value")
	glob.bjsqbhval = $("#bjsqbh").attr("value")
	
	glob.ydh=$("#ydh").attr("value")
	glob.ydrzh=$("#jyzh").attr("value")

	var obj=document.getElementById('kkr_type');
	var index=obj.selectedIndex; 
	glob.bjlx=obj.options[index].value;
	
	get_subXd()
}

function get_subXd(){
	$('#cdwt').dialog('open');
	$('bjlx').text(bjlx_name(glob.bjlx))
	$("#wtjg").text(glob.wtjg)
	$("#wtsl").text(glob.wtsl)
	$("#cpcode").text(glob.cpcode)
	$("#cpname").text(glob.cpname)
	$("#wtydh").text(glob.ydh)
	$("#dsjyzh").text(glob.ydrzh)
	$("#bjlx2").text(get_bjlxname(glob.bjlx))
}

function onOk(){
	glob.dlgflag="0"
	$('#cdwt').dialog('close');
	//$('#cdSucwt').dialog('open');
	get_Wtmr()
}
function onCance(){
	$('#cdwt').dialog('close');
}

/*function OnSucWt(){
	$('#cdSucwt').dialog('close');
	get_Wtmr()
	
}*/
function onSinOk(){
	glob.dlgflag="1"
	$('#singlewt').dialog('close');
	//$('#cdSucwt').dialog('open');
	get_Wtmr()
}
function onSinCance(){
	$('#singlewt').dialog('close');
}

//确定意向买入
function get_Wtmr(){
	var risk
	if(glob.dlgflag=="0")
		risk="0"
	else
		risk="1"
	setIX({"funcid":"L2620120","funcname":'ret_Wtmr',"custid":User.khh,"fundid":glob.zczh,"issueorgcode":glob.djjg,"stkacc":glob.djzh,"transacc":glob.jyzh,
				"isscode":"","prodcode":"","productid":glob.cpbm,"trdid":"20B","cntrno":"","cntrregdate":"","trdprice":glob.wtjg,"stkqty":glob.wtsl,
				"targetmbrcode":"","targetstkacc":"","targettransacc":"","quotedeclid":glob.bjsqbhval,"quoteopendate":getCur(),"pricetype":glob.bjlx,"promiseno":"","paypattern":"","payorg":"","bankcode":"","riskrevealmethod":risk},User.khh)
}

function ret_Wtmr(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620120"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			if(data.ErrorCode=="27030080"){
				$("#singlewt").dialog("open")
				$("#total").attr("value","客户风险承受能力与产品风险等级不匹配,是否继续委托交易")
				return
			}else if(data.ErrorCode=="27030084"){
				proInfo("客户风险承受能力与产品风险等级不匹配，该产品不允许强制下单")
				return
			}else{
				proError(data.ErrorInfo)
				return
			}
		}else{
			proInfo("委托已提交")
			glob.kyzj=0
			get_KhKyzj()
		}
	}
}
function onRadio(nr){
	var m=parseInt($("#maxbuy").attr("value"))
	m=isNaN(m)?0:m
	if(nr==0)
		$("#buynum").attr("value",parseInt(m/2))
	else if(nr==1)
		$("#buynum").attr("value",parseInt(m/3))
	else if(nr==2)
		$("#buynum").attr("value",parseInt(m/4))
	else if(nr==3)
		$("#buynum").attr("value",parseInt(m/5))
}
//获取产品信息接口
function L2612001(d){
	d=$.extend({"funcid":"L2612001"},{"isscode":"","prodcode":"","productid":"","insttype":"","instcls":"","pagerecnum":"0","pagecnt":"500"},d)
	setIX(d,User.khh)
}

function fmtFt(f){
	f=parseFloat(f)
	return isNaN(f)?0:f
}

function bjlx_name(c){
	if(c=="1")
		return '单边报价'
	else if(c=="2")
		return '双边报价'
	else if(c=="3")
		return '做市报价'
	else
		return ""
}

function get_bjlxname(c){
	var bbjlx=""
	if(c=="0")
	{
		bbjlx="意向报价"
	}
	else if( c=="9")
	{
		bbjlx="无报价"
	}
	return bbjlx;
}

var wtState={"0":"未报","1":"已报","2":"确认","3":"部撤","4":"全撤","5":"部成","6":"全成","7":"废单",
			"8":"已报待撤","9":"部成待撤","A":"待撤销","B":"TA确认","C":"TA失败","D":"待申报","E":"对手拒绝"}
// 委托状态
function get_wtStat(c){
	return wtState[c]==undefined?"":wtState[c]
}