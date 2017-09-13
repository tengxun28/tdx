$(function(){
	get_clientver();
})

/*
	获取客户端版本号
*/
function get_clientver(){
	Win_CallTQL('ret_clientver', 'getclientver', new IXContent() ,'');
}

function ret_clientver(_fromid,_funid,_flagtype,data) {
	if(_funid == 'getclientver'){
		if(data!=""){
			$('#version').text('V'+data);
		}
		get_ylxxex();
	}
}

/*
	获取预留信息
*/
function get_ylxxex(){
	Win_CallTQL('ret_ylxxex', 'getylxxex', new IXContent() ,'');
}

function ret_ylxxex(_fromid,_funid,_flagtype,data) {
	if(_funid == 'getylxxex'){
		if(data!=""){
			try{
				var xsxxStr = '';
				var dataList = data.split('<br><br>');
				var leftPxList = [22,38,20,46];
				$(dataList).each(function(n,val){
					var valList=val.split(' :');
					valList[1] = (valList[1]==null||valList[1]==undefined)?'':(valList[1]);
					if(n==0){
						valList[1] = formatDateStr(valList[1]);
					}
					if(n==2){
						valList[1] = formatMacStr(valList[1]);
					}
					xsxxStr +="<p align=left style='margin-top:8px'>";
					xsxxStr +="<span>";
					xsxxStr +=valList[0]+':';
					xsxxStr +='</span>';
					xsxxStr +="<span style='margin-left:"+leftPxList[n].toString()+"px'>";
					xsxxStr +=valList[1];
					xsxxStr +='</span>';
					xsxxStr +='</p>';
				})
				$(xsxxStr).appendTo($('#ylxx'));
			}
			catch(e){
			}

		}
	}
}

function formatDateStr(date){
	var dateStr= '';
	if(date==null||date==undefined||date=='') return dateStr;
	dateStr = date.replace(/\//g, "-");
	return dateStr;
}

function formatMacStr(mac){
	var macStr= '';
	if(mac==null||mac==undefined||mac=='') return macStr;
	for(var i=0;i<mac.length;i++){
		if(i%2==0){
			macStr +=(i==0)?'':'-';
			macStr+=mac.substr(i,2);
		}
	}
	return macStr;
}

String.prototype.getBytesLength = function() { 
return this.replace(/[^\x00-\xff]/gi, "--").length; 
} 

