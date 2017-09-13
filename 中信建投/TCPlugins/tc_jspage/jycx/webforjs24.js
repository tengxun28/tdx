var glob={
	"djzh":"",//登记账号
	"djjg":"",//登记机构
	"jyzh":"",//交易账号
	"zczh":"",//资产账户
	"kyzj":"",//可用资金
	"zzrq":"",//产品终止日期
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
	create_jqGrid("意向买入",{ondblClickRow:onDblClickRow},{"ord_stat":{"formatter":get_wtStat},"trdid":{"formatter":get_TraType},"matchtype":{"formatter":get_MatchType}})
	//create_easygrid("意向买入",{"size":20,onDblClickRow:onDblClickRow},{"ORD_STAT":{"formatter":get_wtStat},"TRD_ID":{"formatter":get_TraType},"MATCH_TYPE":{"formatter":get_MatchType}})
	get_YxwtDbf()
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
			}else{
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
	//get_Yxbj()
	//get_YxwtDbf()
}



function get_YxwtDbf(){
	
	var _ix = new IXContent();
	_ix.Set('F113', "8");//股东代码
	
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



/*

//意向报价查询
function get_Yxbj(){
	setIX({"funcid":"L2620115","funcname":'ret_Yxbj',"BGN_DATE":getAddMonth(-2),"END_DATE":getCur(),"CUST_CODE":User.khh,"INST_CODE":"","INST_ID":"","APP_SNO":"","CAN_CANCEL":"1","PAGE_RECNUM":"0","PAGE_RECCNT":"500"},User.khh)
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
		 		
		 		if(glob.zzrq[data.rows[i].INST_ID]==undefined)
			 		data.rows[i].END_DATE=""
			 	else
			 		data.rows[i].END_DATE=glob.zzrq[data.rows[i].INST_ID]
		 	}
		 	upDate("load",data)
		}
	}
}
*/
function onDblClickRow(rowid,data){
	
	$("#inst_code").attr("value",data["F391"])
	$("#inst_name").attr("value",data["F392"])
	$("#lxrname").attr("value",data["F106"])
	$("#lxrphone").attr("value",data["F495"])
	//$("#inva_date").attr("value",rowdata.VALID_DATE)
//	glob.cpbm=data["F254"]
	var code=data["F391"]

	for(var i=0; i<num; i++)
	{
	
		
		if(glob2.cpdm[i]==code)
		{
			glob.cpbm=glob2.cpbm[i];
			break;
		}
	}
	
	
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

		 	}
		 	
		}
	}
}

//买入价格失去焦点时调用
function onBuyPrice(v){
	if(isNullStr($("#inst_code").attr("value"))) return
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
	$("#lxrname").attr("value","")
	$("#lxrphone").attr("value","")
	//$("#inva_date").attr("value","")
	$("#maxbuy").attr("value","")
	
}
var listdata=selectRow("F391")
function CheckCode(name,node,e){
	
	if(name=="keyup"){
		if($(node).attr('value').length==6){			
			//get_CpInfo($(node).attr('value'))
			get_CpInfo2()
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
	if(fmtFt($("#buynum").attr("value"))>fmtFt($("#maxbuy").attr("value"))){
		proInfo("委托数量不能大于最大可买")
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
	//if(isNullStr($("#inva_date").attr("value"))){
	//	proError("有效日期不能为空")
	//	return;
	//}
	glob.jylb="20B"
	glob.yxjg=$("#buyprice").attr("value")
	glob.cpcode=$("#inst_code").attr("value")
	glob.cpname=$("#inst_name").attr("value")
	glob.yxsl=$("#buynum").attr("value")
	var obj=document.getElementById('kkr_type');
	var index=obj.selectedIndex; 
	glob.yxyd=obj.options[index].value;
	// glob.yxrq=$("#inva_date").attr("value")
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
	get_WtYxmr()
}
function onCance(){
	$('#cdwt').dialog('close');
}

/*function OnSucWt(){
	$('#cdSucwt').dialog('close');
	get_WtYxmr()
}*/
//确定意向买入
function get_WtYxmr(){
	
	setIX({"funcid":"L2620110","funcname":'ret_WtYxmr',"custid":User.khh,"fundid":glob.zczh,"issueorgcode":glob.djjg,"stkacc":glob.djzh,"transacc":glob.jyzh,
				"isscode":"","prodcode":"","productid":glob.cpbm,"trdid":glob.jylb,"trdprice":glob.yxjg,"stkqty":glob.yxsl,
				"matchtype":glob.yxyd,"expdate":fmtDt(glob.yxrq),"linkman":glob.lxrname,"linktelno":glob.lxrphone,"st_remark":"","cntrno":"","cntrregdate":""},User.khh)
}
function ret_WtYxmr(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620110"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
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

function fmtDt(d){
	var dl=d.split("-")
	var tmpdata=""
	
	if(dl.length!=3)
		return ""
	var fl=$.map(dl,function(val){
		tmpdata=tmpdata+val;
		//return sigtodow(parseInt(val))
	})

	//return fl.join('')
	return tmpdata
	
}

var wtState={"0":"未报","1":"已报","2":"确认","3":"部撤","4":"全撤","5":"部成","6":"全成","7":"废单",
			"8":"已报待撤","9":"部成待撤","A":"待撤销","B":"TA确认","C":"TA失败","D":"待申报","E":"对手拒绝"}
// 委托状态
function get_wtStat(c){
	return wtState[c]==undefined?"":wtState[c]
}
