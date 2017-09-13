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
/*
* 转换IX的解析出来的数组
* json: 返回的IX数据
* type: 1-easyui
*/
function FormatResult(json,type){
	var data=[];
	var list=getResultList(json,false);
	data["ErrorCode"]=list[0].ErrorCode;
	data["ErrorInfo"]=list[0].ErrorInfo;
	data["POS"]=list[0].POS;
	data["Num"]=list[0].Num;


	if(list.length>6){
		data["FieldName"]=list[1];
		data["HideFlag"]=list[2];
		data["Align"]=list[3];
		data["Width"]=list[4];
		data["DataType"]=list[5];
		data["CatheFlag"]=list[6];
	}

	if(type=="1"){
		if(list.length>7){
			var rows=[];
			for(var i=7;i<list.length;i++){
				var row={};
				rows[rows.length]=list[i];
			}
			data["total"]=rows.length;
			data["rows"]=rows;
		}
	}

	return data;
}