var TDX_DIC={
	// Part.II 数据类型
	//---------------------------------------------------------------------------
	DATATYPE:{
		'1':'TDX_DT_CHAR',
		'2':'TDX_DT_SHORT',
		'3':'TDX_DT_LONG',
		'4':'TDX_DT_LONGLONG',
		'5':'TDX_DT_FLOAT',
		'6':'TDX_DT_DOUBLE',
		'7':'TDX_DT_LONGDOUBLE',
		'8':'TDX_DT_DATE',		
		'9':'TDX_DT_TIME',		
		'10':'TDX_DT_STRING',	
		'11':'TDX_DT_MEMO',		
		'12':'TDX_DT_BINARY',	
		'13':'TDX_DT_RECORDSET',
		'14':'TDX_DT_PASSWORD'
	},


	//---------------------------------------------------------------------------
	// Part.III 对齐显示类型
	//---------------------------------------------------------------------------
	Align:{
	'0':'right',		//TDX_DISP_TOP
	'1':'left',			//TDX_DISP_LEFT
	'2':'center',		//TDX_DISP_CENTER
	'4':'right',		//TDX_DISP_RIGHT
	'6':'vmiddle',		//TDX_DISP_VCENTER
	'8':'vbottom',		//TDX_DISP_BOTTOM
	'':''				//TDX_DISP_NONE
	}

}

//全局变量
var User={
	khh:"",
	uname:"",
	zjzh:"",
	yyb:"",
	wtfs:"",
	minfo:""
}

/*获取基本信息*/
function getUserInfo(){
	//获取基本客户信息
	Win_CallTQL('ret_getkhxx', 'getkhxx', new IXContent() ,'');
}

function ret_getkhxx(_fromid,_funid,_flagtype,data) {
	//alert([_fromid,_funid,_flagtype,data]);

	if(_funid == 'getkhxx'){
		if(data!=""){
			var info=data.split("#");
			try{
				User.khh=info[2];
				User.zjzh=info[3];
			}
			catch(e){
				alert("获取资金账号失败！\r\n"+data);
			}
		}
	}
	getUserInfo2();
	//获取营业部信息
	//Win_CallTQL('ret_getuname', 'getuname', new IXContent() ,'');
}




/*获取基本信息*/
function getUserInfo2(){
	var _ix = new IXContent();
	_ix.Set('keyid', "F294");//功能号
	
	Win_CallTQL('ret_getkhxx2', 'getuidxml', _ix ,'');
}

function ret_getkhxx2(_fromid,_funid,_flagtype,data) {
	//alert([_fromid,_funid,_flagtype,data]);
	
	if(_funid == 'getuidxml'){
		if(data!=""){				
			User.khh=data;			
		}
	}	
	//获取营业部信息
	Win_CallTQL('ret_getuname', 'getuname', new IXContent() ,'');
}





function ret_getuname(_fromid,_funid,_flagtype,data){
	if(_funid == 'getuname'){
		if(data!=""){
				User.uname=data.split("[")[0];
		}
	}
	//获取营业部信息
	Win_CallTQL('ret_getbranchid', 'getbranchid', new IXContent() ,'');
}

function ret_getbranchid(_fromid,_funid,_flagtype,data) {
	//alert([_fromid,_funid,_flagtype,data]);

	if(_funid == 'getbranchid'){
		if(data!=""){
				User.yyb=data;
		}
	}

	//获取委托方式
	Win_CallTQL('ret_getopwtfs', 'getopwtfs', new IXContent() ,'');
}

function ret_getopwtfs(_fromid,_funid,_flagtype,data) {
	//alert([_fromid,_funid,_flagtype,data]);

	if(_funid == 'getopwtfs'){
		if(data!=""){
			User.wtfs=data;
		}
	}

	//获取机器信息
	Win_CallTQL('ret_getmachineinfo', 'getmachineinfo', new IXContent() ,'');
}

function ret_getmachineinfo(_fromid,_funid,_flagtype,data) {
	//alert([_fromid,_funid,_flagtype,data]);
	if(_funid == 'getmachineinfo'){
		if(data!=""){
			User.minfo=data;
		}
	}
	$('#mask').remove();
	try{PageInit();}catch(e){}
}

$(function(){
	$("body").append("<div id='mask' class='loading'></div>");
	getUserInfo();
	
})

