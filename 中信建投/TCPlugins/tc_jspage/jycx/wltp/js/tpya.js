var fljxVoteResult = {};	// 非累积型投票的存放结果
var ljxVoteResult = {}; // 累积型投票存放结果
var keyarray = []; // 存放key
var urlparam = {}; // 存放url带回来的参数
var codeparam = {}; // 存放当前投票代码的信息，
					// 包括：tpdm-代码，cc-持仓，sc-市场，gddm-股东代码
var gddmxx = {}; // { [市场]:"", [代码列表]:[array] }

$(function() {

	// debugger;

	// 初始化页面
	initPage();

	// 获得股东列表
	getGddmlist();

	// 获得大会下的议案内容
	// getYaData();
})

/**
 * @description 初始化页面-1.解析URL参数 2. 初始化全局变量 3. 绑定事件函数
 */
function initPage() {

	// debugger;
	urlparam = getParamFromUrl();
	$("#gddh-title").html(urlparam.title);
	// $("#gqdjr").html(urlparam.time);
	// Alert(JSON.stringify(urlparam));

	// 绑定事件函数
	$("input[name='radiohead']").bind("click", rdHeadClick);

	$(".radiohead2").live('click', rdBodyHeadClick);
	$(".radiobody").live('click', rdBodyClick); // 动态绑定
	// 防止在IE6中页面绑定该函数不执行的问题
	$(".ljxya-vote").live({
		keyup: function() { // 累积型投票的结果必须为纯数字
			var value = this.value;
			if(value.match(/[^0-9]/)) {
				Alert("输入格式错误，只能是整数。");
				this.value = 0;
			} else {
				var cls = $(this).attr("cls");
				var total = $(this).attr("total");
				ljxYaVote(this, cls, total);
			}
		}
	})

	// 扩展easyUI ok cancel值
	$.messager.defaults = { ok:"确定", "cancel":"取消" };
}

// radio所有的议案统一投票
var rdHeadClick = function() {
	// debugger;
	// Alert("hello");
	this.ck = this.ck ? false : true;
	this.checked = this.ck;

	var value = this.value;

	// Alert(JSON.stringify(fljxVoteResult));

	// 其他相同的兄弟元素的this.ck应该改为false
	$.each($(".radiohead"), function(index, obj) {
		if(this.value != value) {
			this.ck = false;
		}
	});

	if(this.checked) {
		fljxVoteResult["radiohead"] = value;
		for(var i = 0; i < keyarray.length; i++) {
			fljxVoteResult[keyarray[i]] = value;
		}

		// 设置radiobody中的radio标签状态
		$(".radiobody").each(function(index, obj) {
			if(obj.value == value) {
				obj.checked = true;
				obj.ck = true;
			} else {
				obj.checked = false;
				obj.ck = false;
			}
		})	
		
		// 设置radiohead2中的radio标签状态
		$(".radiohead2").each(function(index, obj) {
			if(obj.value == value) {
				obj.checked = true;
				obj.ck = true;
			} else {
				obj.checked = false;
				obj.ck = false;
			}
		})
	} else {
		fljxVoteResult["radiohead"] = 0;
		for(var i = 0; i < keyarray.length; i++) {
			fljxVoteResult[keyarray[i]] = 0;
		}	
		$(".radiobody[value='"+value+"']").each(function(index, obj) {
			obj.checked = false;
			obj.ck = false;
		})
		$(".radiohead2[value='"+value+"']").each(function(index, obj) {
			obj.checked = false;
			obj.ck = false;
		})
	}
}

// radiohead2对应的子议案
var rdBodyHeadClick = function() {
	this.ck = this.ck ? false : true;
	this.checked = this.ck;
	var value = this.value;
	$.each($(".radiohead2[name='"+this.name+"']"), function(index, obj) {
		if(this.value != value) {
			this.ck = false;
		}
	});

	// 去掉总的投票结果标识
	if(fljxVoteResult["radiohead"] != 0 ) {
		fljxVoteResult["radiohead"] = 0;
		$(".radiohead:checked")[0].ck = false;
		$(".radiohead:checked")[0].checked = false;
	}

	if(this.checked) {
		// 对投票结果赋值及其子议案结果进行赋值
		for(var i = 0; i < keyarray.length; i ++) {
			if(parseInt(keyarray[i]) == parseInt(this.name)) {
				fljxVoteResult[keyarray[i]] = value;
			}
		}

		// 获得该议案组的标识class
		var cls = $(this).parent().parent().attr("class"); 
		$("."+cls+" .radiobody").each(function(index, obj) {
			if(obj.value == value) {
				obj.ck = true;
				obj.checked = true;
			} else {
				obj.ck = false;
				obj.checked = false;
			}
		})
	} else {
		// 对投票结果赋值及其子议案结果进行赋值
		for(var i = 0; i < keyarray.length; i ++) {
			if(parseInt(keyarray[i]) == parseInt(this.name)) {
				fljxVoteResult[keyarray[i]] = 0;
			}
		}
		fljxVoteResult[this.name] = -1;

		// 获得该议案组的标识class
		var cls = $(this).parent().parent().attr("class"); 
		$("."+cls+" .radiobody").each(function(index, obj) {
			obj.ck = false;
			obj.checked = false;
		})
	}
}

// radio按钮单个议案投票
var rdBodyClick = function() {

	this.ck = this.ck ? false : true;
	this.checked = this.ck;
	var value = this.value;
	// 设置相同radio name的标签属性，ck-false, checked - false
	$(".radiobody[name='"+this.name+"']").each(function(index, obj) {
		if(obj.value != value) {
			obj.ck = false;
			obj.checked = false;
		}
	})

	// 去掉总的投票结果标识
	if(fljxVoteResult["radiohead"] != 0) {
		fljxVoteResult["radiohead"] = 0;
		$(".radiohead:checked")[0].ck = false;
		$(".radiohead:checked")[0].checked = false;
	}

	// 去掉该组中总议案的投票结果
	// debugger;
	var cls = $(this).parent().parent().attr("class");
	var selobj = $("."+cls+" .radiohead2");
	if(selobj.length != 0) {
		var name = selobj[0].name;
		fljxVoteResult[name] = -1;
		if($(".radiohead2[name='"+name+"']:checked").length > 0) {
			$(".radiohead2[name='"+name+"']:checked")[0].ck = false;
			$(".radiohead2[name='"+name+"']:checked")[0].checked = false;
		}
	}
	
	if(this.checked) {
		fljxVoteResult[this.name] = this.value;
	} else {
		fljxVoteResult[this.name] = 0;
	}
}

/**
 * @description 获得客户的股东列表
 */
function getGddmlist() {
	var _ix = new IXContent();
	_ix.Set("F113", "0");
	Win_CallTQL("ret_gddm", "JY:1122", _ix, '');
}

function ret_gddm(_fromid, _funid, _flagtype, _json) {
	// debugger;
	// var arr = JSON.parse(_json);
	var data = FormatResult(_json, 1);
	if(data.ErrorCode != 0) {
		var errinfo = data.ErrorInfo || "获得股东代码列表错误。";
		Alert(errinfo);
		return;
	}
	var selHtml = "";

	$.each(data.rows, function(index, rowdata) {
		if(gddmxx[rowdata.F125] == undefined) {
			gddmxx[rowdata.F125] = [rowdata.F123];
		} else if(rowdata.F246 == 1) { // 该股东账号是主账号
			gddmxx[rowdata.F125].unshift(rowdata.F123);
		}

		selHtml += "<option sc='"+rowdata.F125+"' value='" + rowdata.F123+"'>"
				+ rowdata.F123 + "</option>";
	});

	$("#gddmsel").html(selHtml);
	getYaData();
}

/**
 * @description 获得股东大会下的议案内容
 */
function getYaData() {
	// debugger;
	var _ix = new IXContent();
	_ix.Set("F1050", urlparam.id);

	Win_CallTQL("ret_tpList", voteid.gettpdmlist, _ix, '');
}

// 填入投票select
function ret_tpList(_fromid, _funid, _flagtype, _json) {
	// debugger;
	var data = FormatResult(_json, 1);
	if(data.rows[0]["F140"] == "") {
		Alert("暂无投票代码。");
		return;
	}

	var listarr = data.rows[0]["F140"].split("#");
	var htmlStr = "";
	for(var i = 0; i < listarr.length -1; i ++) {
		var arr = listarr[i].split(",");
		if(arr[4] != 1) {
			/**
			 * 证券代码，持仓数量，交易所，
			 * 股东代码，证券名称，投票结果（0或1）
			 */
			htmlStr += "<option value='" + arr[0]
					+ "' cz='" + (arr[1] || 0)
					+ "' sc='" + (arr[2] || 1)
					+ "' gddm='" + arr[3]
					+ "' tpjg='" + arr[5]
					+ "'>" + arr[0]
					+ " " + (arr[4] == 0 || arr[4] == undefined ? "" : arr[4]) +"</option>";
		}
	}

	// Alert(htmlStr);

	$("#tpsel").html(htmlStr);
	tpSelChange($("#tpsel")[0]);
}

// select改变响应函数
function tpSelChange(obj) {
	// debugger;
	var op = $(obj).find("option:selected")[0];
	if(op == undefined) {
		$("#tpsubmit").attr("disabled", true);
		return; // 没有投票代码的情形
	}

	$("#tpsubmit").attr("disabled", false);
	codeparam.tpdm = op.value; // 投票代码
	codeparam.sc = op.sc;

	codeparam.tpjg = op.tpjg;
	if(codeparam.tpjg == 1) {
		$("#tpjg").html("已投票");
		$("#tpjg").css("color","red");
	} else {
		$("#tpjg").html("未投票");
		$("#tpjg").css("color","black");
	}
	// codeparam.cz = op.cz; // 获得当前股票代码的持仓

	// 匹配合适的股东代码
	try {
		var gddmvalue = gddmxx[codeparam.sc][0];
		$("#gddmsel option[value='"+gddmvalue+"']").attr("selected", true);
		gddmchange(gddmvalue);
		codeparam.gddm = gddmvalue;
	} catch(e) {
		gddmchange($("#gddmsel").val());
	}
	queryTpdmInfo(codeparam.tpdm);
}

function gddmchange(value) {
	document.getElementById("gddmtext").value = value;
	codeparam.sc = $("#gddmsel").find("option:selected").attr("sc");
	gddmtextchange(value);
}

function gddmtextchange(value) {
	codeparam.gddm = value;
}

/**
 * @description 由投票代码得到议案信息
 * @param {string} code 投票代码
 */
function queryTpdmInfo(code) {
	// debugger;
	var _ix = new IXContent();
	_ix.Set("F1050", urlparam.id);
	_ix.Set("F140", code);

	Win_CallTQL("ret_tpdmInfo", voteid.getyalist, _ix, '');
}

function ret_tpdmInfo(_fromid, _funid, _flagtype, _json) {
	// Alert(_json);
	// debugger;

	// 清空radiohead的check值
	if($(".radiohead:checked").length != 0) {
		$(".radiohead:checked").attr("ck", false)[0].checked = false;		
	}

	try {
		var data = FormatResult(_json, 1);
		// $("#gqdjr").html(data.rows[0]["F1051"]);
	} catch(e) {
		Alert(e);
	}

	// 整理投票编码下的议案信息
	formatInfo(data.rows);
}

/**
 * @description 整理投票编码下的议案信息
 * @param {array} rows 投票编码下的信息集合 [{...}, {...}, ...]
 */
var fljxyalist = []; // 非累计型议案列表
var ljxyalist = []; // 累计型议案列表
var ljxyavoteinfo = {}; // 累积型议案投票信息
function formatInfo(rows) {
	// debugger;

	// 清空原来的议案列表
	fljxyalist = [];
	ljxyalist = [];
	ljxyavoteinfo = {};

	// 初始化非累计型投票结果
	fljxVoteResult = {"length":0};
	keyarray = [];

	var flag = {}; // 标记非累计型议案
	var ljxyaindex = 0; // 当前分配给非累计型议案的数组下标
	
	if(rows[0] == undefined) {
		Alert("该投票代码下暂无可投票的议案。");
		return;
	}

	$.each(rows, function(index, rowdata) {
		if(rowdata.F1056 == "P") { // 普通投票，非累计型
			fljxyalist.push(rowdata);
		} else if(rowdata.F1056 == "L") { // 累计型投票
			var yabh = parseInt(rowdata.F1052);
			if(flag[yabh] == undefined) {
				flag[yabh] = ljxyaindex;
				ljxyalist[ljxyaindex] = [];
				ljxyalist[ljxyaindex].push(rowdata);
				ljxyaindex ++;
			} else {
				ljxyalist[flag[yabh]].push(rowdata);
			}
		}
	})

	// 排序议案，按议案编号大小排序
	// debugger;
	fljxyalist = sortYaList(fljxyalist, "F1052");
	$.each(ljxyalist, function(index, list) {
		ljxyalist[index] = sortYaList(list, "F1052");

		// 初始化累积型议案投票信息
		var yano = parseInt(ljxyalist[index][0]["F1052"]);
		ljxyavoteinfo[yano] = 0; // 对应的议案组投票情形，未投票
	})

	// 标记不能投票的非累计型议案，如 2,2.01,2.02,议案2不能投票 
	$.each(fljxyalist, function(index, rowdata) {
		if(rowdata.F1052 == parseInt(rowdata.F1052)) {
			fljxyalist[index]["F88888"] = 1; // 主议案居中，子议案居右
		}
		if(rowdata.F1052 == parseInt(rowdata.F1052)
			&& fljxyalist[index+1] != undefined
			&& parseInt(rowdata.F1052) == parseInt(fljxyalist[(index+1)]["F1052"])) {
			fljxyalist[index]["F99999"] = 1;
		}
	})

	showYaHtml();
	// 将所有的投票结果设置为不可选择
	if(codeparam.tpjg == 1) {
		$("radio").attr("disabled", true);
		$("input").attr("disabled", true);
		getTpjg();
	}
}

/**
 * @description 获得投票结果
 */
function getTpjg() {
	// debugger;
	winCallTQLWrapper(voteid.getyaresult,
	{
		"F1050":urlparam.id,
		"F140":codeparam.tpdm
	},function(msg, data, yaid) {
		if(msg == "") {
			if(data.rows == undefined) return;
			$.each(data.rows, function(index, rowdata) {
				if(rowdata.F335 == 1) { // 投票结果有效
					if(isFljxYa(rowdata.F1052)) { //如果是非累积型议案
						$("input[type='radio'][name='"
							+rowdata.F1052+"'][value='"
							+rowdata.F144+"']")[0].checked = true;
					} else {
						$("#"+rowdata.F1052).val(rowdata.F144);
					}
				}
			})
		}
	})
}

// 判断该议案是否在非累计型议案列表中
function isFljxYa(yaid) {
	var flag = 0;
	$.each(fljxyalist, function(index, rowdata) {
		if(rowdata.F1052 == yaid) {
			flag = 1;
			return false;
		}
	})

	return flag;
}

/**
 * @description 显示议案页面
 */
function showYaHtml() {
	// 拼接字符串
	var htmlStr = doTemplate("tpl1", fljxyalist);
	$("#fljx").html(htmlStr);
	// debugger;
	$.each(fljxyalist, function(index, rowdata) {
		var key = rowdata.F1052;
		keyarray.push(key);
		fljxVoteResult[key] = 0; // 1-同意 2-反对 3-弃权
		fljxVoteResult["length"]++;
	})
	fljxVoteResult["radiohead"] = 0;

	htmlStr = "";
	$.each(ljxyalist, function(index, list) {
		htmlStr += doTemplate("tpl2", list);
	})
	$("#ljx").html(htmlStr);
}

/**
 * @description 累计型投票结果变化函数
 * @param {object} obj 发生事件输入框对象
 * @param {string} cls 对象对应的class
 * @param {string} total 可以投票的个数
 */
function ljxYaVote(obj, cls, total) {
	// debugger;
	var value = obj.value - 0;
	var count = 0;
	$("."+cls).each(function(index, obj1) {
		if((obj1.value - 0) != 0) count++;
	})
	if(count > 0) {
		if(value <= 0 || count > total) { // vlaue <= 0 或者 value > 0 && count > total
			if(count > total) {
				Alert("投票人数超过当选人数。");
				obj.value = 0;
				ljxVoteResult[obj.id] = 0;	
			}
			// obj.value = 0;
		} else { 
			obj.value = value;
			ljxVoteResult[obj.id] = obj.value;
			ljxyavoteinfo[parseInt(obj.id)] = 1;
		}
	} else if(count == 0) {
		// obj.value = 0;
		ljxVoteResult[obj.id] = 0;
		ljxyavoteinfo[parseInt(obj.id)] = 0;
	}
}

/**
 * @description 投票结果提交
 */
function tpSubmit() {
	// debugger;

	// 统计普通投票的情形
	var fljxnotvotekeylist = []; // 统计未被投票的非累计型议案号
	for(var i = 0; i < keyarray.length; i++) {
		if(fljxVoteResult[keyarray[i]] == 0) {
			fljxnotvotekeylist.push(keyarray[i]);
		}
	}

	if(fljxnotvotekeylist.length > 0) {
		// Alert("议案："
		// 	+ fljxnotvotekeylist.join("，")
		// 	+ "。未表决，请表决后再提交!");
		// return;
		var info = "<div style='float:left;'>议案："
				+ fljxnotvotekeylist.join("，")
				+ "。未表决，是否放弃该议案表决继续提交？"
				+ "<p style='color:red;'>所有投票请求仅以第一次投票为准的"
				+ "</p></div>";
		$.messager.confirm("提示", info, function(r) {
			if(r) {
				CheckLjxTP();
			}
		})
	} else {
		CheckLjxTP();
	}
}

function CheckLjxTP() {
	// 统计累积型议案投票的情形
	// debugger;
	var ljxnotvotekeylist = [];
	$.each(ljxyavoteinfo, function(index, value) {
		if(value == 0 ) {
			ljxnotvotekeylist.push(index);
		}
	})

	if(ljxnotvotekeylist.length > 0) {
		// Alert("议案组："
		// 	+ ljxnotvotekeylist.join("，")
		// 	+ "。未表决，请表决后再提交!");
		// return;
		var info = "<div style='float:left;'>议案组："
				+ ljxnotvotekeylist.join("，")
				+ "。未表决，是否放弃该议案组表决继续提交？"
				+ "<p style='color:red;'>所有投票请求仅以第一次投票为准！"
				+ "</p></div>";
		$.messager.confirm("提示", info, function(r) {
			if(r) {
				tpXd();
			}
		})
	} else {
		tpXd();
	}
}

function tpXd() {

	// debugger;
	// 统计可投票的数量
	var votekeylist = getVoteKeyList();

	if(votekeylist.length == 0) {
		Alert("在该投票代码下，您未选择任何议案！");
		return;
	}

	var votesum = votekeylist.length;
	var votedone = 0;
	var info = "共有" + votesum + "笔议案进行投票申请，申请结果如下：";

	for(var i = 0; i < votekeylist.length; i++) {
		// debugger;
		winCallTQLWrapper(voteid.wtapp,
		{
			"F113":"1",
			"F334":codeparam.tpdm,
			"F1050":urlparam.id,
			"F331":votekeylist[i][0],
			"F234":votekeylist[i][1],
			"F335":fljxVoteResult[votekeylist[i][0]] || ljxVoteResult[votekeylist[i][0]],
			"F123":codeparam.gddm,
			"F125":codeparam.sc
		}, function(msg, data, yaid) {
			votedone ++;
			if(msg == "") {
				if(data.rows[0].F149 == "") {
					info += "<br>议案号：" + yaid + ":" 
					+ "投票已提交，委托编号：" + data.rows[0].F146;
				} else {
					info += "<br>议案号：" + yaid + ":" + data.rows[0].F149;
				}
				
			} else {
				info += "<br>议案号：" + yaid + ":" + msg;
			}

			if(votedone == votesum) {
				info += "<p style='color:red;'>所有投票请求仅以第一次投票为准！</p>";
				Alert(info);
			}
		})
	}
}

/**
 * @description 统计可投列表
 * @returns {array} 返回投票记录key
 */
function getVoteKeyList() {

	var keylist = [];

	// 统计非累积型议案
	for(var i = 0; i < keyarray.length; i++) {
		if(parseInt(keyarray[i]) == parseFloat(keyarray[i])) { // 主议案
			if(fljxVoteResult[keyarray[i]] == -1) { // 具有子议案的主议案，且没有选中
				var curid = -1;
			} else if(fljxVoteResult[keyarray[i]] != 0){ // 主议案被选择，包括有子议案和没有子议案
				var curid = parseInt(keyarray[i]);
				keylist.push([keyarray[i], 1]);
			}
		} else { // 子议案
			// if(parseInt(keyarray[i]) != curid && fljxVoteResult[keyarray[i]] != 0) { // 已投票子议案
			// 	keylist.push([keyarray[i], 1]);
			// }

			// 主议案和子议案都投票
			if(fljxVoteResult[keyarray[i]] != 0) {
				keylist.push([keyarray[i], 1]);
			}
		}
	}

	// 统计累积型投票议案
	$(".ljxya-vote").each(function(index, obj) {
		if(obj.value != 0) {
			keylist.push([obj.id, 2]);
		}
	})

	return keylist;
}