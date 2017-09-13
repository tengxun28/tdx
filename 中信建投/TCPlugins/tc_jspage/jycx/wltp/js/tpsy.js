$(function() {
	
	Win_CallTQL("ret_votelist", voteid.getdhlist, new IXContent(), '');
})

function ret_votelist(_formid, _funid, _flagtype, _json) {
	// Alert(_json);
	// debugger;
	try {
		var data = FormatResult(_json, 1);
		var arr = JSON.parse(_json);
	} catch(e) {
		Alert("提示", "error:\n" + e);
		return;
	}

	var titleHtml = getTitleHtml(arr[2]);
	titleHtml += "<td>操作</td>";
	$("#dhtitle").html(titleHtml);

	if(data.ErrorCode != 0) {
		Alert(data.ErrorInfo);
		return;
	}

	if(data.rows == undefined) {
		Alert("当前没有股东大会召开。");
		return;
	}

	if(arr[2] == "") {
		Alert("提示", "您的客户端的AddinStock.dll版本较低，请更换高版本的dll。");
		return;
	}

	var tplText = getContentHtml(arr[1], arr[2][arr[2].length-1]);
	var tplFunc = doT.template(tplText);
	var htmlStr = tplFunc(data.rows);
	$("#gddhlb").html(htmlStr);
}