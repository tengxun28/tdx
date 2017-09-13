var glob={
	"zzrq":""//产品终止日期
}

var bgl=false;
var cxfs=0;//0 查询所以，1根据产品代码查询
var codecxnum=""
function PageInit(){
var obj = document.getElementById("code")
	obj.style.display="none";	
	bgl=false;
	hideLoading()
	create_jqGrid("定价信息查询",{},{})
	//create_easygrid("定价信息查询",{"size":20},{})
	get_DjwtDbf()
	// get_DjxxCx()
}
/*
//意向报价查询
function get_DjxxCx(){
	setIX({"funcid":"L2620010","funcname":'ret_DjxxCx',"BGN_DATE":getAddMonth(-2),"END_DATE":getCur(),"CUST_CODE":User.khh,"TA_ACCT":"","ISS_CODE":"","INST_CODE":"","INST_ID":"","APP_SNO":"","CAN_CANCEL":"0","PAGE_RECNUM":"0","PAGE_RECCNT":"1000"},User.khh)
}

function ret_DjxxCx(_fromid,_funid,_flagtype,data){
	if(_funid=="5010:SIMPLE.L2620010"){
		data=FormatResult(data,1)
		if(data.ErrorCode!="0"){
			proError(data.ErrorInfo)
		 	return;
		}else{
			if(data.rows==undefined) data.rows=[]
			
		 	upDate("load",data)
		}
	}
}



*/









function get_DjwtDbf(){

	var _ix = new IXContent();
	_ix.Set('F113', "10");//股东代码
	
	Win_CallTQL('ret_DjwtDbf', 'JY:2276', _ix, '');
	
}

function ret_DjwtDbf(_fromid,_funid,_flagtype,data){
	
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
					return v
				}
				})
			//	upDate("load",data)
				up_jqGrid("load",data.rows)

			}
			else
			{
			//	upDate("load",data)
			up_jqGrid("load",data.rows)
			}		
			
				
			
		 //	upDate("load",data)
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
	get_DjwtDbf()

}