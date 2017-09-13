var glob={
	"djzh":"",//登记账号
	"djjg":"",//登记机构
	"jyzh":"",//交易账号
	"zczh":"",//资产账户
	"zdkm":"",//最大可卖
	"zzrq":"",//产品终止日期
	"cpcode":"",//产品代码
	"cpname":"",//产品名称
	"cpbm":"",//产品编码
	"wtjg":"",//委托价格
	"wtsl":"",//委托数量
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
	create_jqGrid("确认卖出",{ondblClickRow:onDblClickRow},{"ord_stat":{"formatter":get_wtStat},"trdid":{"formatter":get_TraType},"matchtype":{"formatter":get_MatchType}})
	//create_easygrid("确认卖出",{"size":20,onDblClickRow:onDblClickRow},{"TRD_ID":{"formatter":get_TraType},"ORD_STAT":{"formatter":get_wtStat}})
	// get_Djzh()
	//get_Djzh()
	get_QrwtDbf()
}
function onset(node){
	
	var obj=document.getElementById('bjsqbh');
	obj.value="";

	if(node.value == "0")// 意向报价
	{
		$("#bjsqbh").attr({"disabled":false});
		//obj.style.background="RGB(255,255,255)";
		obj.className="form_input form_val_five"
	}
	else if(node.value == "9")// 无报价
	{
		$("#bjsqbh").attr({"disabled":true});
		obj.className="form_input form_disabled form_val_five"
		//obj.style.background="RGB(159,159,159)";
		
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
	// get_QrwtDbf()
}
//报价查询
function get_Yxbj(){
	setIX({"funcid":"L2620010","funcname":'ret_Yxbj',"strdate":getAddMonth(-2),"enddate":getCur(),"custid":"","stkacc":glob.djzh,"isscode":"","prodcode":"","productid":"","declid":"","cancancel":"1","pagerecnum":"0","pagecnt":"500"},User.khh)
}

function ret_Yxbj(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620010"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]
			/*var dr=[]
			$.each(data.rows,function(k,v){
				if(v.TRD_ID=="20B")
					dr.push(v)
			})*/
			glob.data=data.rows
			//get_bj()
			
		 	
		}
	}
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



//意向报价查询
function get_bj(){
	setIX({"funcid":"L2620115","funcname":'ret_bj',"strdate":getAddMonth(-2),"enddate":getCur(),"custid":User.khh,"prodcode":"","productid":"","declid":"","cancancel":"1","pagerecnum":"0","pagecnt":"500"},User.khh)
}

function ret_bj(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620115"){
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
			//data.rows = glob.data.concat(data.rows);
			for(var i=0;i<data.rows.length;i++){
		 		if(glob.zzrq[data.rows[i].productid]==undefined)
			 		data.rows[i].end_date=""
			 	else
			 		data.rows[i].end_date=glob.zzrq[data.rows[i].productid]
		 	}
			data.total=data.rows.length
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
	$("#payprice").attr("value",data["F945"])
	/*if(rowdata.TRD_ID=="20S"){
		$("#maxpay").attr("value","0")
	}else{
		$("#maxpay").attr("value",rowdata.QUOTE_QTY)
	}*/
	$("#maxbuy").attr("value",glob.zdkm)
	onRadio(parseInt($("input[name='radioGroup1']:checked").val()))
//	glob.cpbm=data["F254"]
	/*if(rowdata.QUOTE_TYPE==undefined){
		glob.bjlx=""
		get_bjlx()
	}else{
			glob.bjlx=rowdata.QUOTE_TYPE
		}*/		
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
				$("#maxbuy").attr("value",glob.zdkm)		
			}
		}	
	}
}

function get_bjlx(){
	setIX({"funcid":"L2620010","funcname":'ret_bjlx',"strdate":getAddMonth(-2),"enddate":getCur(),"custid":User.khh,"stkacc":glob.djzh,"isscode":"","prodcode":"","productid":glob.cpbm,"declid":"","cancancel":"1","pagerecnum":"0","pagecnt":"500"},User.khh)
}
function ret_bjlx(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620010"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]
			else glob.bjlx=data.rows[0].pricetype
		 	
		}
	}
}
//全部
function onAll(){
	$("#paynum").attr("value",$("#maxbuy").attr("value"))
}

function ClearInput(){
	$("#inst_name").attr("value","")
	$("#payprice").attr("value","")
	$("#paynum").attr("value","")
	$("#ydh").attr("value","")
	$("#jyzh").attr("value","")
	$("#maxbuy").attr("value","")
	
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

function onSubmit(t){
	if(isNullStr($("#inst_code").attr("value"))){
		proError("产品代码不能为空")
		return;
	}
	if(fmtFt($("#paynum").attr("value"))==0){
		proInfo("输入的委托数量无效")
		return;
	}
	if(fmtFt($("#paynum").attr("value"))>fmtFt($("#maxbuy").attr("value"))){
		proInfo("委托数量不能大于最大可卖")
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
	glob.wtjg=$("#payprice").attr("value")
	glob.cpcode=$("#inst_code").attr("value")
	glob.cpname=$("#inst_name").attr("value")
	glob.wtsl=$("#paynum").attr("value")
	glob.ydh=$("#ydh").attr("value")
	glob.ydrzh=$("#jyzh").attr("value")
	glob.bjsqbhval = $("#bjsqbh").attr("value")

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
	setIX({"funcid":"L2620120","funcname":'ret_Wtmr',"custid":User.khh,"fundid":glob.zczh,"issueorgcode":glob.djjg,"stkacc":glob.djzh,"transacc":glob.jyzh,
				"isscode":"","prodcode":"","productid":glob.cpbm,"trdid":"20S","cntrno":"","cntrregdate":"","trdprice":glob.wtjg,"stkqty":glob.wtsl,
				"targetmbrcode":"","targetstkacc":"","targettransacc":"","quotedeclid":glob.bjsqbhval,"quoteopendate":getCur(),"pricetype":glob.bjlx,"promiseno":"","paypattern":"","payorg":"","bankcode":"","riskrevealmethod":""},User.khh)
}
function ret_Wtmr(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620120"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
			return
		}else{
			proInfo("委托已提交")
			//get_Yxbj()
			get_QrwtDbf()
			//get_bj()
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

//获取产品信息接口
function L2612001(d){
	d=$.extend({"funcid":"L2612001"},{"isscode":"","prodcode":"","productid":"","insttype":"","instcls":"","pagerecnum":"0","pagecnt":"500"},d)
	setIX(d,User.khh)
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