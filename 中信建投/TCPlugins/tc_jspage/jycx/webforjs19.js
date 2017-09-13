var glob={
	"djzh":"",//登记账号
	"djjg":"",//登记机构
	"jyzh":"",//交易账号
	"zczh":"",//资产账户
	"cpbm":"",//产品编码
	"cpcode":"",
	"cpname":"",
	"alldata":"",
	"zzrq":"",//产品终止日期
	"kyzj":"",//可用金额
	"rgje":"",//认购金额
	"cpjz":"",//产品净值数据
	"dlgflag":"0"//调用委托成交的对话框标志	
}

var glob2={
	"xsqsr":"",//销售起始日
	"xszzr":"",//销售终止日
	"qxr":"",//起息日
	"dqr":""//到期日
}

var glob3={
	"yjsyl":"",//预计收益率	
	"sczdje":"",//首次最低金额	
	"zjzdje":"",//追加最低金额	
	"zdrgje":"",//最低认购金额	
	"zgrgje":""//最高认购金额
}

var zzrq = [];
var zzrqPos = 1;
var cpxx = [];
var cpxxPos = 1;

var bFlash=0;

function PageInit(){
	// debugger;
	hideLoading()
	var obj=document.getElementById('detail');
		obj.style.display = "none";

	var obj2=document.getElementById('cpdm');
		obj2.style.display = "none";

	
	create_jqGrid("银行产品信息",{},{"iss_stat":{"formatter":get_Stat},"risk_lvl":{"formatter":get_RiskLvl},"insttype":{"formatter":get_InstType}})
	//create_easygrid("产品信息",{"size":9},{"ISS_STAT":{"formatter":get_Stat},"RISK_LVL":{"formatter":get_RiskLvl},"INST_TYPE":{"formatter":get_InstType}})
	//get_CpJz()
	//get_CpInfo()
	//get_YHLCCPXX()
	zzrq = [];
	zzrqPos = 1;
	get_CpFxzzrq()
}

//获取产品净值
function get_CpJz(){
	setIX({
		"funcid":"L2620304",
		"funcname":'ret_CpJz',
		"bgndate":getCur(),
		"enddate":getCur(),
		"isscode":"",
		"prodcode":"",
		"productid":"",
		"latestflag":"1",
		"pagerecnum":"0",
		"pagereccnt":"500"
	},User.khh);
}
function ret_CpJz(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620304"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			var Msg = data.ErrorInfo;
			if (Msg.indexOf("尚未开户")!= -1)
			{
				proError("您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部")
			}
			else
			{
				proError(data.ErrorInfo)	
			}		
			
		 	return;
		}else{
		 	if(data.rows==undefined) data. rows=[]
		 	var cp={}
		 	$.each(data.rows,function(k,v){
		 		cp[v.productid]=v.lastnet
		 	})
		 	glob.cpjz=cp
		}
	}
	get_CpInfo()
	
}



//查询银行理财产品信息
function get_YHLCCPXX(){
	setIX({
		"funcid":"L2612142",
		"funcname":'ret_Yhlccpxx',
		"isscode":"",
		"prodcode":"",
		"productid":"",
		"pagerecnum":"0",
		"pagereccnt":"500"
	},User.khh);
}
function ret_Yhlccpxx(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2612142"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){

			var Msg = data.ErrorInfo;
			if (Msg.indexOf("尚未开户")!= -1)
			{
				proError("您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部");
			}
			else
			{
				proError(data.ErrorInfo);	
			}
			
		 	return;
		}else{
		 	if(data.rows==undefined) data. rows=[]
		 	var cp={}
		 	var cp1={}
		 	var cp2={}
		 	var cp3={}
		 	$.each(data.rows,function(k,v){
		 		cp[v.productid]=v.salebgndate
		 		cp1[v.productid]=v.saleenddate
		 		cp2[v.productid]=v.interestdate
		 		cp3[v.productid]=v.expirydate
		 	})		 	
		 	glob2.xsqsr=cp
		 	glob2.xszzr=cp1
		 	glob2.qxr=cp2
		 	glob2.dqr=cp3
		}
	}
	//get_CpInfo()
	zzrq = [];
	zzrqPos = 1;
	get_CpFxzzrq();
}



//获取产品发行终止日期
function get_CpFxzzrq(){
	
	setIX({
		"funcid":"L2612011",
		"funcname":'ret_CpFxzzrq',
		"isscode":"",
		"prodcode":"",
		"productid":"",
		"insttype":"",
		"instcls":"",
		"pagerecnum":zzrqPos.toString(),
		"pagecnt":"100"
	},User.khh);
}
function ret_CpFxzzrq(_fromid,_funid,_flagtype,data){
	
	
	if(_funid=="5010:SIMPLE.L2612011"){
		// debugger;
		data=FormatResult(data,1)
		
		if(data.ErrorCode!="0"){

			var Msg = data.ErrorInfo;
			if (Msg.indexOf("尚未开户")!= -1)
			{
				proError("您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部");
			}
			else
			{
				proError(data.ErrorInfo);	
			}
		 	return;
		} else if(data.rows.length == 100) {
			zzrq = zzrq.concat(data.rows);
			zzrqPos += 100;
			get_CpFxzzrq();
		} else {
		 	// if(data.rows==undefined) data.rows=[]
		 	zzrq = zzrq.concat(data.rows);
		 	var rq={}
			var cp={}
		 	var cp1={}
		 	var cp2={}
		 	var cp3={}
		 	$.each(zzrq,function(k,v){
		 		var tmp = v.estyield*100;
		 		rq[v.productid]=tmp.toFixed(2);
		 		//rq[v.productid]=(v.estyield*100)
		 		cp[v.productid]=v.iss_bgn_date
		 		cp1[v.productid]=v.iss_end_date
		 		cp2[v.productid]=v.est_date
		 		cp3[v.productid]=v.end_date
		 	})

		 	glob3.yjsyl=rq
		 	glob2.xsqsr=cp
		 	glob2.xszzr=cp1
		 	glob2.qxr=cp2
		 	glob2.dqr=cp3
			get_Cpxeinfo()
		}
	}
}




//获取产品限额信息
function get_Cpxeinfo(){

	setIX({
		"funcid":"L2612039",
		"funcname":'ret_Cpxeinfo',
		"isscode":"",
		"prodcode":"",
		"productid":"",
		"insttype":"",
		"instcls":"",
		"user_type":""
	},User.khh);
}
function ret_Cpxeinfo(_fromid,_funid,_flagtype,data){
	
	if(_funid=="5010:SIMPLE.L2612039"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			var Msg = data.ErrorInfo;
			if (Msg.indexOf("尚未开户")!= -1)
			{
				proError("您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部");
			}
			else
			{
				proError(data.ErrorInfo);	
			}
		 	return;
		}else{
		 	if(data.rows==undefined) data.rows=[]
		 	var rq={}
		 	var rq2={}
		 	var rq3={}
		 	var rq4={}
		 	$.each(data.rows,function(k,v){
		 		rq[v.productid]=v.min_subs_amt//最低认购金额
		 		rq2[v.productid]=v.max_subs_amt// 最高认购金额

		 		rq3[v.productid]=v.first_min_buy//首次最低金额
		 		rq4[v.productid]=v.append_min_buy// 追加最低金额
		 	})
		 	glob3.zdrgje=rq;
		 	glob3.zgrgje=rq2;

		 	glob3.sczdje=rq3;
		 	glob3.zjzdje=rq4;
		}
	}
	cpxx = [];
	cpxxPos = 1;
	get_CpInfo()
}

//获取产品信息
function get_CpInfo(){
	setIX({
		"funcname":'ret_CpInfo',
		"funcid":"L2612001",
		"isscode":"",
		"prodcode":"",
		"productid":"",
		"insttype":"",
		"instcls":"",
		"pagerecnum":cpxxPos.toString(),
		"pagecnt":"100"
	},User.khh)
}
function ret_CpInfo(_fromid,_funid,_flagtype,data){
	hideLoading()
	if(_funid=="5010:SIMPLE.L2612001"){
		
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			var Msg = data.ErrorInfo;
			if (Msg.indexOf("尚未开户")!= -1)
			{
				proError("您选择的服务需要柜台交易权限，当前账户尚未开通，请联系营业部");
			}
			else
			{
				$.messager.alert('提示',data.ErrorInfo,"error");	
			}			
		 	return;
		} else if(data.rows.length == 100) {
			cpxx = cpxx.concat(data.rows);
			cpxxPos += 100;
			get_CpInfo();
		} else{
			// if(data.rows==undefined) data.rows=[]
			cpxx = cpxx.concat(data.rows);
			cpxx=$.grep(cpxx,function(v,i){
				if(v.iss_stat!="4" /*&& v.insttype=="9"*/)
				{
					if(glob.cpjz[cpxx[i].productid]==undefined)
			 			cpxx[i].lastnet=""
			 		else
			 			cpxx[i].lastnet=glob.cpjz[cpxx[i].productid]

			 		if(glob2.xsqsr[cpxx[i].productid]==undefined)
			 			cpxx[i].salebgndate=""
			 		else
			 			cpxx[i].salebgndate=glob2.xsqsr[cpxx[i].productid]

			 		if(glob2.xszzr[cpxx[i].productid]==undefined)
			 			cpxx[i].saleenddate=""
			 		else
			 			cpxx[i].saleenddate=glob2.xszzr[cpxx[i].productid]

			 		if(glob2.qxr[cpxx[i].productid]==undefined)
			 			cpxx[i].interestdate=""
			 		else
			 			cpxx[i].interestdate=glob2.qxr[cpxx[i].productid]

			 		if(glob2.dqr[cpxx[i].productid]==undefined)
			 			cpxx[i].expirydate=""
			 		else
			 			cpxx[i].expirydate=glob2.dqr[cpxx[i].productid]

			 		if(glob3.yjsyl[cpxx[i].productid]==undefined)
			 			cpxx[i].estyield=""
			 		else
			 			cpxx[i].estyield=glob3.yjsyl[cpxx[i].productid]

			 		if(glob3.zdrgje[cpxx[i].productid]==undefined)
			 			cpxx[i].min_subs_amt=""
			 		else
			 			cpxx[i].min_subs_amt=glob3.zdrgje[cpxx[i].productid]


			 		if(glob3.sczdje[cpxx[i].productid]==undefined)
			 			cpxx[i].first_min_buy=""
			 		else
			 			cpxx[i].first_min_buy=glob3.sczdje[cpxx[i].productid]

			 		if(glob3.zjzdje[cpxx[i].productid]==undefined)
			 			cpxx[i].append_min_buy=""
			 		else
			 			cpxx[i].append_min_buy=glob3.zjzdje[cpxx[i].productid]

					return v
				}
					
			})

			// data.total=cpxx.length
			up_jqGrid("load",cpxx)	
			// glob.alldata=data
			glob.alldata = {total: cpxx.length, rows: cpxx}
			
		}
	}
}
var selectopt=[[{"value":"0","txt":"低"},{"value":"1","txt":"中低"},{"value":"2","txt":"中"},{"value":"3","txt":"中高"},{"value":"4","txt":"高"}],
				[{"value":"0","txt":"募集前状态"},{"value":"1","txt":"募集期"},{"value":"2","txt":"开放期"},{"value":"3","txt":"封闭期"},{"value":"4","txt":"清盘"}]]					
function onset(node){

	//bFlash==1
	

	var selectedOption=node.options[node.selectedIndex];
	
	if($(node).attr("prevalue")==node.value)
		return
	$(node).attr("prevalue",node.value)
	var obj=document.getElementById('detail');
	obj.style.display = "block";
	obj.options.length=0;
	if(node.value=="0"){
		var obj2=document.getElementById('cpdm');
		obj2.style.display = "none";

		$.each(selectopt[0],function(i,val){
			obj.add(new Option(val.txt,val.value)); 
		})
	}else if(node.value=="1"){
		var obj2=document.getElementById('cpdm');
		obj2.style.display = "none";

		var obj=document.getElementById('detail');
		$.each(selectopt[1],function(i,val){
			obj.add(new Option(val.txt,val.value)); 
		})
	}
	else if(node.value=="2"){
		var obj2=document.getElementById('cpdm');
		obj2.style.display = "none";

		var obj=document.getElementById('detail');
		obj.style.display = "none";
	}
	else if(node.value=="3"){
		var obj=document.getElementById('detail');
		obj.style.display = "none";

		var obj2=document.getElementById('cpdm');
		obj2.style.display = "block";
	}
	//get_CpJz();
	get_CpInfo()
}

function onSubMit(){
	

	var obj1=document.getElementById('kkr_type');
	var val1 = obj1.options[obj1.selectedIndex].value;

	var obj6=document.getElementById('cpdm');
	var cpdmcode = obj6.value;

	if(val1 != 2 && val1 != 3 )
	{
	
		var obj=document.getElementById('detail');
		var val = obj.options[obj.selectedIndex].value;
	}
	

	
	var data=glob.alldata
	var updata={}
	var filtdata=[]


	if(val1=="0"){//按风险等级
		$.each(data.rows,function(k,v){

			if(v.risk_lvl==val)
				filtdata.push(v)
			
		})
	}else if(val1=="1"){
		$.each(data.rows,function(k,v){
			if(v.iss_stat==val)
				filtdata.push(v)
			
		})
	}
	else if (val1=="2")
	{
		$.each(data.rows,function(k,v){
	
			filtdata.push(v)
		})
	}
	else if (val1=="3")
	{
		$.each(data.rows,function(k,v){
			if(v.prodcode==cpdmcode)
				filtdata.push(v)
			
		})
	}
	
	
	//upDate("load",updata)
	up_jqGrid("load",filtdata)
}