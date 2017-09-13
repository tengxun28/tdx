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
		'%E9%90%A9%E6%A8%BA%E6%82%97%E9%8D%A5%E7%82%BA%E3%80%90': '�̺�ع�',
		'%E9%8F%88%E7%83%98%E7%80%AF%E9%90%91%EE%85%A0%E5%81%A3': '�����ȵ�',
		'%E7%91%95%E4%BE%80%E6%A4%88%E7%BB%AE%E6%83%A7%E5%B4%95': 'Ҫ�ž���',
		'%E9%90%92%EF%B8%BE%E5%81%A3%E9%8F%82%E4%BC%B4%E6%A4%88': '��������',
		'%E9%90%A9%E6%A8%BA%E5%A2%A0%E9%8D%99%E5%82%9D%E2%82%AC': '��ǰ�ο�',
		'%E9%8F%85%E3%84%A4%E7%B4%B0%E9%8F%85%E3%84%A6%E5%A7%A4': '���᳿��'
	}
	if (dict1.hasOwnProperty(lu[1]))
	{
		lu[1]=dict1[lu[1]];
	}
	//ע�����������
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
 	$("#time").html("ʱ��: " + time);
 	if(jsonData.ResultSets[0].Content[0][2].indexOf("ͨ����") == -1)
 		$("#sourse").html("��Դ: " + jsonData.ResultSets[0].Content[0][2]);
 	if(_content) {
		$("#content").html(changeTrim(_content));
	} else {
		$("#content").html("");
	}
 	document.getElementById("gssm").innerHTML="<font color=#848484>��Ҫ����������˾�ṩ���κ���Ϣ�����ο���������������֤ȯ�����ĳ��ۻ�ѯ�ۣ�Ͷ����ʹ��ǰ�����Ժ�ʵ�������Ը�������˾���ṩ�Ĺ�˾���桢�������ϡ�Ͷ����ѯ�������Ϣ�����󵫲���֤���ݵ�׼ȷ�Ժ������ԣ��������й�˾������ϢΪ׼���Է����ҹ�˾�ش��ʧ����������Ϣ���ݴ�©���Լ�Ͷ�����������������Ͻ���Ͷ�ʾ��߶����µĲƲ���ʧ�����е��������Ρ�				<br></font>"
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
 	$("#time").html("ʱ��: " + time);
 	if(jsonData.ResultSets[0].Content[0][3] && jsonData.ResultSets[0].Content[0][3].indexOf("ͨ����") == -1) {
 		$("#sourse").html("��Դ: " + jsonData.ResultSets[0].Content[0][3]);
 	}
 	if(_content) {
		$("#content").html(changeTrim(_content));
	} else {
		$("#content").html("");
	}

 	document.getElementById("gssm").innerHTML="<font color=#848484>��Ҫ����������˾�ṩ���κ���Ϣ�����ο���������������֤ȯ�����ĳ��ۻ�ѯ�ۣ�Ͷ����ʹ��ǰ�����Ժ�ʵ�������Ը�������˾���ṩ�Ĺ�˾���桢�������ϡ�Ͷ����ѯ�������Ϣ�����󵫲���֤���ݵ�׼ȷ�Ժ������ԣ��������й�˾������ϢΪ׼���Է����ҹ�˾�ش��ʧ����������Ϣ���ݴ�©���Լ�Ͷ�����������������Ͻ���Ͷ�ʾ��߶����µĲƲ���ʧ�����е��������Ρ�				<br></font>"

}

function emptyTip(){
	$("#zxtit").empty();
	$("#content").empty();
	$("#time").empty();
	$("#sourse").empty();
	document.getElementById("content").innerHTML="&nbsp;&nbsp;���������Ѷ";
	document.getElementById("gssm").innerHTML="<font color=#848484>��Ҫ����������˾�ṩ���κ���Ϣ�����ο���������������֤ȯ�����ĳ��ۻ�ѯ�ۣ�Ͷ����ʹ��ǰ�����Ժ�ʵ�������Ը�������˾���ṩ�Ĺ�˾���桢�������ϡ�Ͷ����ѯ�������Ϣ�����󵫲���֤���ݵ�׼ȷ�Ժ������ԣ��������й�˾������ϢΪ׼���Է����ҹ�˾�ش��ʧ����������Ϣ���ݴ�©���Լ�Ͷ�����������������Ͻ���Ͷ�ʾ��߶����µĲƲ���ʧ�����е��������Ρ�				<br></font>";
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