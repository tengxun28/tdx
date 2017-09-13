var glob={
	"djzh":"",//登记账号
	"djjg":"",//登记机构
	"jyzh":"",//交易账号
	"zczh":"",//资产账户
	"zzrq":"",//产品终止日期
	"kyzj":"",//可用资金
	"cpcode":"",//产品代码
	"cpname":"",//产品名称
	"cpbm":"",//产品编码
	"wtjg":"",//委托价格
	"wtsl":"",//委托数量
	"dlgflag":"0"//调用委托成交的对话框标志
	
	
}

var glob2={
	"cpdm":[],// 产品代码
	"cpbm":[]// 产品编码
	
};
var num =0;
/*$(function(){
	PageInit()
})*/
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

	create_jqGrid("定价买入",{ondblClickRow:onDblClickRow},{"pricetype":{"formatter":getBjls}})
	
	get_DjwtDbf()
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

//	get_DjwtDbf()
}




function get_DjwtDbf(){


	var _ix = new IXContent();
	_ix.Set('F113', "10");//股东代码
	
	Win_CallTQL('ret_DjwtDbf', 'JY:2276', _ix, '');
	
}

function ret_DjwtDbf(_fromid,_funid,_flagtype,data){
	num==0
	
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


/*


//报价查询
function get_Yxbj(){
	
	setIX({"funcid":"L2620010","funcname":'ret_Yxbj',"BGN_DATE":getAddMonth(-2),"END_DATE":getCur(),"CUST_CODE":User.khh,"INST_CODE":"","INST_ID":"","APP_SNO":"","CAN_CANCEL":"1","PAGE_RECNUM":"0","PAGE_RECCNT":"500"},User.khh)
}

function ret_Yxbj(_fromid,_funid,_flagtype,data){
	
	if(_funid=="5010:SIMPLE.L2620010"){
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

			 	if (fmtFt(data.rows[i].BUY_QTY)>0.00) {
			 		data.rows[i].QUOTE_QTY=data.rows[i].BUY_QTY
			 		data.rows[i].QUOTE_PRICE=data.rows[i].BUY_PRICE
			 	}else{
			 		data.rows[i].QUOTE_QTY=data.rows[i].SELL_QTY
			 		data.rows[i].QUOTE_PRICE=data.rows[i].SELL_PRICE
			 	}
		 	}
		 	upDate("load",data)
		}
	}
}
*/
function onDblClickRow(rowid,data){

	
	$("#inst_code").attr("value",data["F391"])
	$("#inst_name").attr("value",data["F392"])
	$("#buyprice").attr("value",data["F257"])
	$("#buynum").attr("value",data["F258"])

	//glob.cpbm=rowdata.F254
	var code=data["F391"]
	for(var i=0; i<num; i++)
	{
	
		
		if(glob2.cpdm[i]==code)
		{
			glob.cpbm=glob2.cpbm[i];
			break;
		}
	}
	
	var v=fmtFt($("#buyprice").attr("value"))
	
	$("#maxbuy").attr("value",parseInt((glob.kyzj/v)+"")+"")

	onRadio(parseInt($("input[name='radioGroup1']:checked").val()))
}
//全部
function onAll(){
	$("#buynum").attr("value",$("#maxbuy").attr("value"))
}

//买入下单
function onSubmit(t){
	if(fmtFt($("#buynum").attr("value"))==0){
		proInfo("输入的委托数量无效")
		return;
	}
	if(fmtFt($("#buynum").attr("value"))>fmtFt($("#maxbuy").attr("value"))){
		proInfo("委托数量不能大于最大可买")
		return;
	}
	glob.wtjg=$("#buyprice").attr("value")
	glob.cpcode=$("#inst_code").attr("value")
	glob.cpname=$("#inst_name").attr("value")
	glob.wtsl=$("#buynum").attr("value")
	
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
//确定买入
function get_Wtmr(){
	var risk
	if(glob.dlgflag=="0")
		risk="0"
	else
		risk="1"
	setIX({"funcid":"L2620001","funcname":'ret_Wtmr',"custid":User.khh,"fundid":glob.zczh,"issueorgcode":glob.djjg,"stkacc":glob.djzh,"transacc":glob.jyzh,
				"isscode":"","prodcode":"","productid":glob.cpbm,"buyprice":glob.wtjg,"buyqty":glob.wtsl,"sellprice":"","sellqty":"","pricetype":"1","cntrno":"","cntrregdate":"",
				"expdate":getCur(),"riskrevealmethod":risk},User.khh)
}
function ret_Wtmr(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620001"){
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


function fmtFt(f){
	f=parseFloat(f)
	return isNaN(f)?0:f
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