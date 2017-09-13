var glob={
	"djzh":"",//登记账号
	"djjg":"",//登记机构
	"jyzh":"",//交易账号
	"zczh":"",//资产账户
	"sqbh":null,//需要发送撤单的数据
	"wtflag":0,
	"cdcnt":0//撤单发送请求条数
}


function PageInit(){
	
	setDlg()
	setDlg("singlewt")
	
	hideLoading()
	create_jqGrid("银行产品撤单",{ondblClickRow:onDblClickRow},{"ord_stat":{"formatter":get_OrdStat},"trdid":{"formatter":get_TraType}})
	//up_jqGrid("load",[{"ORD_STAT":"1"},{"ORD_STAT":"2"}])
	get_Djzh()
}
/*$(function(){
	create_jqGrid("撤单",{ondblClickRow:onDblClickRow},{"ORD_STAT":{"formatter":get_OrdStat},"TRD_ID":{"formatter":get_TraType}})
	up_jqGrid("load",[{"ORD_STAT":"1"},{"ORD_STAT":"2"}])

})
*/
//获取登记账号
function get_Djzh(){
	setIX({"funcid":"L2610008","funcname":'ret_Djzh',"custid":User.khh,"fundid":"","orgid":"","issueorgcode":"","stkacc":"","transacc":"","pagerecnum":"0","pagecnt":"500"},User.khh)
	
}

function ret_Djzh(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2610008"){
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
		get_RsgInfo()
	}
}
//认申购查询
function get_RsgInfo(){
	setIX({"funcid":"L2620105","funcname":'ret_RsgInfo',"strdate":getAddMonth(-2),"enddate":getCur(),"custid":User.khh,"fundid":"","stkacc":"","transacc":"","isscode":"",
		"prodcode":"","productid":"","declid":"","cancancel":"1","pagerecnum":"0","pagecnt":"500"},User.khh)
}

function ret_RsgInfo(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620105"){
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
			 if(data.rows==undefined) data.rows=[]

			 	data.rows=$.grep(data.rows,function(v,i){	 
	
				//if( v.insttype=="9"){
					return v
				//}
			})
		 	

			 up_jqGrid("load",data.rows)
			 $("#totalnum").text("共"+data.rows.length+"条")
		 	
		}
	}
}

function onDblClickRow(rowid,data){
	uncheckAll()
	$("#load").jqGrid("setSelection",rowid)
	onSign(3)
}

function onSign(i){
	
	if(i==0)
		get_RsgInfo()
	else if(i==1)
		uncheckAll("load")
	else if(i==2){
		checkAll("load")
		
	}
		
	else if(i==3){
		glob.wtflag=0
		
		var rowid=$("#load").jqGrid('getGridParam','selarrrow');
		var rows=[]
		$.each(rowid,function(n,id){
				rows.push($("#load").jqGrid("getRowData",id))
		})
		
		var len=rows.length
		if(len>1){
			glob.sqbh=rows
			$('#singlewt').dialog('open');
			$("#total").text("共有"+len+"笔委托需要撤单")
			glob.wtflag=2
		}else if(len==1){
			glob.wtflag=1
			glob.sqbh=rows
			$('#cdwt').dialog('open');
			$("#czfx").text(rows[0].trdid)
			$("#cpcode").text(rows[0].prodcode)
			$("#cpname").text(rows[0].productname)
		}else{
			glob.wtflag=0
			proInfo("请选择你需要撤销的产品代码")
			return
		}
	}

}

function onOk(){

	$('#cdwt').dialog('close');
	//$('#cdSucwt').dialog('open');
	glob.cdcnt=0
	get_Cd()
	
}
function onCance(){
	$('#cdwt').dialog('close');
	
}

function onSinOk(){
	$('#singlewt').dialog('close');
	//$('#cdSucwt').dialog('open');
	glob.cdcnt=0
	get_Cd()
	
}
function onSinCance(){
	$('#singlewt').dialog('close');
}

/*function OnSucWt(){
	$('#cdSucwt').dialog('close');
	glob.cdcnt=0
	get_Cd()
	
}*/

//撤单
function get_Cd(){

	if(glob.cdcnt<glob.sqbh.length){
		
		setIX({"funcid":"L2620102","funcname":'ret_CdInfo',"custid":User.khh,"fundid":glob.zczh,"stkacc":glob.djzh,"transacc":glob.jyzh,"oldoperdate":glob.sqbh[glob.cdcnt].operdate,"oldsn":glob.sqbh[glob.cdcnt].declid},User.khh)
		glob.cdcnt+=1;
	}else{
		onSign(0)
		
		
		proInfo("撤单已提交")	

		setTimeout(get_Djzh(), 5000)

		
		return
	}
}


function ret_CdInfo(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620102"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
			return
		}else{			
			get_Cd()
		}
	}
}
