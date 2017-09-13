
function PageInit(){
	hideLoading()
	//create_easygrid("行情查询",{"size":20},{});
	create_jqGrid("行情查询",{},{})

	get_QrwtDbf()
	
}




function get_QrwtDbf(){

	var _ix = new IXContent();
	_ix.Set('F113', "12");//股东代码
	
	Win_CallTQL('ret_QrwtDbf', 'JY:2278', _ix, '');
	
}

function ret_QrwtDbf(_fromid,_funid,_flagtype,data){
	
	if (_funid == 'JY:2278'){
		
		var data = FormatResult(data, 1);
		if (data.ErrorCode != 0){
			proError(data.ErrorInfo)
		}else{
			if(data.rows==undefined) data.rows=[]
						
		 //	upDate("load",data)
		 up_jqGrid("load",data.rows)
		}
		
	}
}