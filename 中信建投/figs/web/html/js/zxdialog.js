$(function(){
	document.oncontextmenu=function(){window.event.returnValue=false};
	$("#zxtit").empty();
	$("#content").empty();
	var uri = window.location.search;
	var re = new RegExp("objid=([^&?]*)", "ig");
	uri=((uri.match(re))?(uri.match(re)[0].substr("objid".length+1)):null);
	var lu=uri.split(",")
	if(lu.length!=2){
		emptyTip();
		return;
	}
	if(lu[0]==""||lu[1]==""){
		emptyTip();
		return;
	}
	var dict1={
		'%E9%90%A9%E6%A8%BA%E6%82%97%E9%8D%A5%E7%82%BA%E3%80%90': '盘后回顾',
		'%E9%8F%88%E7%83%98%E7%80%AF%E9%90%91%EE%85%A0%E5%81%A3': '机构热点',
		'%E7%91%95%E4%BE%80%E6%A4%88%E7%BB%AE%E6%83%A7%E5%B4%95': '要闻精华',
		'%E9%90%92%EF%B8%BE%E5%81%A3%E9%8F%82%E4%BC%B4%E6%A4%88': '焦点新闻',
		'%E9%90%A9%E6%A8%BA%E5%A2%A0%E9%8D%99%E5%82%9D%E2%82%AC': '盘前参考',
		'%E9%8F%85%E3%84%A4%E7%B4%B0%E9%8F%85%E3%84%A6%E5%A7%A4': '晨会晨报'
	}
	if (dict1.hasOwnProperty(lu[1]))
	{
		lu[1]=dict1[lu[1]];
	}
	//注册浏览器类型
	var tdxClientLite = TDXClientLite;
	calltql = tdxClientLite('PC');
	if(lu[1] == "zxzx") {
		calltql("CWServ.tdxi_zxjtzxcontents", '{"Params":["'+lu[0]+'"],"CilentSpecifiedKey":"zxjtcontents"}', getZxInfo);
	} else {
		calltql("CWServ.tdxi_zxjtzxinfo", '{"Params":["'+lu[1]+'","'+lu[0]+'"],"CilentSpecifiedKey":"zxdialog"}', Fill_zxa)	
	}
})

function getZxInfo(err, data) {
	data=formatStr(data);
	var jsonData=$.parseJSON(data);
	if(jsonData.ErrorCode!="0"){
		emptyTip();
 		return;
 	}
 	
 	if(jsonData.ResultSets.length==0||jsonData.ResultSets[0].Content.length==0||jsonData.ResultSets[0].Content[0][0]=="0"){
 		emptyTip();
 		return;
 	}
 	$("#zxtit").text(jsonData.ResultSets[0].Content[0][0]);
 	var _content = jsonData.ResultSets[0].Content[0][3];
 	var time = jsonData.ResultSets[0].Content[0][1];
 	if(time.indexOf(".") != -1) {
 		time = time.substring(0, time.indexOf("."));
 	}
 	$("#time").html("时间: " + time);
 	if(jsonData.ResultSets[0].Content[0][2].indexOf("通达信") == -1)
 		$("#sourse").html("来源: " + jsonData.ResultSets[0].Content[0][2]);
 	if(_content) {
		$("#content").html(changeTrim(_content));
	} else {
		$("#content").html("");
	}
 	document.getElementById("gssm").innerHTML="<font color=#848484>重要声明：本公司提供的任何信息仅供参考，并不构成所述证券买卖的出价或询价，投资者使用前请予以核实，风险自负。本公司所提供的公司公告、个股资料、投资咨询建议等信息，力求但不保证数据的准确性和完整性，请以上市公司公告信息为准。对非因我公司重大过失而产生的信息内容错漏，以及投资者因依赖上述资料进行投资决策而导致的财产损失，不承担法律责任。				<br></font>"
}
function Fill_zxa(err,data){
	data=formatStr(data);
	var jsonData=$.parseJSON(data);
	if(jsonData.ErrorCode!="0"){
		emptyTip();
 		return;
 	}
 	
 	if(jsonData.ResultSets.length==0||jsonData.ResultSets[0].Content.length==0||jsonData.ResultSets[0].Content[0][0]=="0"){
 		emptyTip();
 		return;
 	}
 	
 	$("#zxtit").text(jsonData.ResultSets[0].Content[0][0]);
 	var _content = jsonData.ResultSets[0].Content[0][2];
 	var time = jsonData.ResultSets[0].Content[0][1];
 	if(time.indexOf(".") != -1) {
 		time = time.substring(0, time.indexOf("."));
 	}
 	$("#time").html("时间: " + time);
 	if(jsonData.ResultSets[0].Content[0][3] && jsonData.ResultSets[0].Content[0][3].indexOf("通达信") == -1) {
 		$("#sourse").html("来源: " + jsonData.ResultSets[0].Content[0][3]);
 	}
 	if(_content) {
		$("#content").html(changeTrim(_content));
	} else {
		$("#content").html("");
	}

 	document.getElementById("gssm").innerHTML="<font color=#848484>重要声明：本公司提供的任何信息仅供参考，并不构成所述证券买卖的出价或询价，投资者使用前请予以核实，风险自负。本公司所提供的公司公告、个股资料、投资咨询建议等信息，力求但不保证数据的准确性和完整性，请以上市公司公告信息为准。对非因我公司重大过失而产生的信息内容错漏，以及投资者因依赖上述资料进行投资决策而导致的财产损失，不承担法律责任。				<br></font>"

}

function emptyTip(){
	$("#zxtit").empty();
	$("#content").empty();
	$("#time").empty();
	$("#sourse").empty();
	document.getElementById("content").innerHTML="&nbsp;&nbsp;暂无相关资讯";
	document.getElementById("gssm").innerHTML="<font color=#848484>重要声明：本公司提供的任何信息仅供参考，并不构成所述证券买卖的出价或询价，投资者使用前请予以核实，风险自负。本公司所提供的公司公告、个股资料、投资咨询建议等信息，力求但不保证数据的准确性和完整性，请以上市公司公告信息为准。对非因我公司重大过失而产生的信息内容错漏，以及投资者因依赖上述资料进行投资决策而导致的财产损失，不承担法律责任。				<br></font>";
}

function formatStr(str)
{
	
	str=str.replace(/\\r\\n/ig,"<br/>");

	return str;
} 
function formatSpace(str)
{
	
	str=str.replace(/\\r\\n/ig,"<br/>");

	return str;
} 
function changeTrim(vStr){
    return "<pre>"+vStr+"</pre>";
}