/**
 * @description 宏定义投票功能id
 */
// var voteid = {
// 	"getdhlist":"JY:368",
// 	"getyalist":"JY:324",
// 	"getyaresult":"JY:330",
// 	"cxwtlist":"JY:332",
// 	"gettpdmlist":"JY:326",
// 	"wtapp":"JY:328"
// }

var voteid = {
	"getdhlist":"JY:368",
	"getyalist":"JY:362",
	"cxwtlist":"JY:366",
	"gettpdmlist":"JY:364",
	"wtapp":"JY:328"
}

/**
 * @description 获得合适的表格头
 * @param {array} arr 表格头字段名称数组 + 显示控制
 * @returns {string} 返回表格头字符串
 */
function getTitleHtml(arr) {
	var flag = arr[arr.length-1];
	var fgarr = flag.split("");
	var titleHtml = "";
	for(var i = 0; i < fgarr.length; i++) {
		if(fgarr[i] == 0) {
			titleHtml += "<td>" + arr[i] + "</td>";
		}
	}

	//titleHtml += "<td>备注</td>";

	return titleHtml;
}

/**
 * @description 获得内容的模板
 * @param {array} fields 字段的名称
 * @param {string} flag 标示字符串
 */
function getContentHtml(arr, flag) {
	var fgarr = flag.split("");
	var cntHtml = "{{~it:item:index}}<tr>";
	for(var i = 0; i < fgarr.length; i++) {
		if(fgarr[i] == 0) {
			if(arr[i] == "F1057") {
				cntHtml += "<td>"
						+ "<a href='tpya.html?id={{=item[\"F1050\"]}}&title={{=item[\"F1057\"]}}&time={{=item[\"F127\"]}}'>"
						+ "{{=item[\"F1057\"]}}"
						+ "</a></td>";
			} else {
				cntHtml += "<td>{{=item['" + arr[i] + "']}}</td>";
			}
		}
	}

	cntHtml += "<td>"
			+ "<a href='tpya.html?id={{=item[\"F1050\"]}}&title={{=item[\"F1057\"]}}'>"
			+ "投票</a></td>";

	return cntHtml + "</tr>{{~}}";
}

function getContentHtml1(arr, flag) {
	var fgarr = flag.split("");
	var cntHtml = "{{~it:item:index}}<tr>";
	for(var i = 0; i < fgarr.length; i++) {
		if(fgarr[i] == 0) {
			cntHtml += "<td>{{=item." + arr[i] + "}}</td>";
		}
	}

	return cntHtml + "</tr>{{~}}";
}

/**
 * @description 从url中获得相关参数
 * @returns {JSON} 返回参数的JSON对象
 */
function getParamFromUrl() {
	// 解析url中的参数：
	var schstr = window.location.search.substr(1);
	var arr1 = schstr.split("&");
	var urlparam = {};
	$.each(arr1, function(index, value) {
		var arr2 = value.split("=");
		urlparam[arr2[0]] = arr2[1];
	})

	return urlparam;
}

/**
 * @description doT公共函数封装
 * @param {string} id 模板内容id
 * @param {array} arr 数据数组
 * @returns 返回拼接的字符串
 */
function doTemplate(id, arr) {
	var tplText = document.getElementById(id).text;
	var tplFunc = doT.template(tplText);
	return tplFunc(arr);
}

/**
 * @description 投票代码keyup事件响应函数
 * @param {object} obj 输入框对象
 * @param {number} codelen 投票代码长度
 * @param {function} callback 回调函数,入参为投票代码
 */
var oldcode = ""; // 存放上一次的投票代码
function tpdmKeyup(obj, codelen, callback) {
	var value = obj.value;
	if(value.match(/[^0-9]/)) {
		Alert("只能输入数字");
		obj.value = '';
	} else if(value.length == codelen && value != oldcode) {
		oldcode = value;
		callback(value);
	}
}

/**
 * @description 对议案列表进行排序
 * @param {array} list 议案列表 [{field:vlaue, .... }, {...}, ...]
 * @param {string} field 排序的字段
 * @returns {array} 返回排序好的列表
 */
function sortYaList(list, field) {
	// debugger;
	if(list.length <= 1) {
		return list;
	}

	var arr = new Array(list.length);

	$.each(list, function(index, rowdata) {
		var comp = parseFloat(rowdata[field]);
		var minnum = -1;
		$.each(list, function(index1, rowdata1) {
			if(comp >= parseFloat(rowdata1[field])) {
				minnum ++;
			}
		})

		arr[minnum] = rowdata;
	})

	// 兼容IE
	//debugger;
	var arr1 = [];
	var listrow = {};
	// for(var i = 0; i < list.length; i++) {
	try {
		for(var i = 0; i < arr.length; i++) {

			// 显示主议案可投票数与子议案一样
			if(arr[i]["F1052"] == parseInt(arr[i]["F1052"])) { 
				listrow = arr[i];	
			} else {
				if (listrow["F1054"] != undefined) arr[i]["F1054"] = listrow["F1054"];
			}

			arr1.push(arr[i]);
		}
	} catch(e) {
		Alert("该投票代码下的议案具有相同的议案号，出错。");
		return list;
	}

	return arr1;
}

/**
 * @description 封装Win_CallTQL函数，使其支持回调函数
 * @param {String} funid 功能函数id
 * @param {json} json ix对象需要填写的值
 * @param {function} callback 回调函数 入参 msg-错误信息，data-成功数据
 */
function winCallTQLWrapper(funid, json, callback) {
	var tmpfunc = "ret_" + parseInt(Math.random() * 1000);
	window[tmpfunc] = function(_fromid, _funid, _flagtype, _json) {

		_json = _json.replace(/\r\n/g, "");
		_json = _json.replace(/\n/g, "");
		// debugger;
		try {
			var data = FormatResult(_json, 1);
		} catch(e) {
			Alert(e);
		}
		
		if(data.ErrorCode == 0) {
			callback("", data, json.F331);
		} else {
			if(data.ErrorInfo == "") {
				data.ErrorInfo = "请求出错，返回错误信息为空。";
			}
			callback(data.ErrorInfo, "", json.F331);
		}

		tmpfunc = null;
	}

	var _ix = new IXContent();
	$.each(json, function(key, value) {
		_ix.Set(key, value);
	})

	_ix.Set("F1217", "SHWLTP");

	Win_CallTQL(tmpfunc, funid, _ix, '');
}

/**
 * @description 格式化日期
 * @param {Date} date 日期对象
 * @param {string} deli 分隔符
 * @returns {string} 合适格式的日期	
 */
function fmtDate(date, deli) {
	// Alert(date.toLocaleDateString());
	// debugger;
	deli = deli || "/";
	var datearr = date.toLocaleDateString().split(/[^0-9]/);
	datearr[1] = datearr[1] < 10 ? ("0"+datearr[1]) : datearr[1];
	datearr[2] = datearr[2] < 10 ? ("0"+datearr[2]) : datearr[2];

	return datearr.join(deli);
}

/**
 * @description 相应的字典
 */
var dict = {};
dict.voteOpinion = {
	"1":"同意",
	"2":"反对",
	"3":"弃权"
}

dict.voteStat = {
	"0":"未报",
	"1":"正报",
	"2":"已报",
	"6":"已撤",
	"8":"已成",
	"9":"废单",
	"A":"待报",
	"B":"正报"
}

dict.yaType = {
	"P":"非累积型",
	"L":"累积型"
}

/**
 * $.messager.alert 包裹函数
 */
function Alert(info, callback) {
	$.messager.alert("提示", info, "", callback)
}