var User = {}; // 用户信息

$(function() {

	// debugger;

	// 扩展easyUI ok cancel值
	$.messager.defaults = { ok:"确定", "cancel":"取消" };

	$("#startdate").datepicker({
		format:"yyyy/mm/dd",
		autoclose:true,
		language:"zh-CN"
	}).on("changeDate", function(ev) {
		var startdate = $("#startdate").val();
		$("#startdate").datepicker("hide");
		$("#enddate").datepicker("setStartDate", startdate);
	})

	$("#enddate").datepicker({
		format:"yyyy/mm/dd",
		autoclose:true,
		language:"zh-CN"
	}).on("changeDate", function(ev) {
		// debugger;
		var enddate = $("#enddate").val();
		$("#enddate").datepicker("hide");
		$("#startdate").datepicker("setEndDate", enddate);
	})

	$(".input-date").live('keydown', function() {
		$(this).blur();
	})

	// debugger;
	$("#gddmsel").live("change", function() {
		queryBtnClick();
	})

	// 默认查当天
	var date = fmtDate(new Date(), "/");
	
	$("#startdate").datepicker("setDate", date);
	$("#enddate").datepicker("setDate", date);

	// debugger;
	// 向下滚动屏幕100的宽度，是的datepicker的弹出框在下出来
	var height = $(window).height();
	if(height < 250) { // 如果窗口的宽度小于250，向下滚动100
		$(window).scrollTop(100);
	}

	// debugger;
	getUserKhh();
})

/**
 * @description 获得客户号
 */
function getUserKhh() {
	Win_CallTQL('ret_getkhxx', 'getkhxx', new IXContent() ,'');
}

function ret_getkhxx(_fromid, _funid, _flagtype, data) {
	if(_funid == 'getkhxx'){
		if(data!=""){
			var info=data.split("#");
			try{
				User.khh=info[2];
				User.zjzh=info[3];
				// queryBtnClick();
			}
			catch(e){
				Alert("获取资金账号失败！\r\n"+data);
			}
		}

		getGddmlist();
		// queryBtnClick();
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
	var gdval = "";

	$.each(data.rows, function(index, rowdata) {

		selHtml += "<option sc='"+rowdata.F125+"' value='" + rowdata.F123+"'>"
				+ rowdata.F123 + "</option>";

		if(rowdata.F125 == 1) {
			gdval = rowdata.F123;
		}
	});

	$("#gddmsel").html(selHtml);
	$("#gddmsel option[value='"+gdval+"']").attr("selected", true);

	queryBtnClick();
}

/**
 * @description 投票议案查询按钮点击
 */
function queryBtnClick() {
	// debugger;
	var gddm = $("#gddmsel").find("option:selected").val();
	var _ix = new IXContent();
	_ix.Set("F120", User.khh);
	_ix.Set("F126", $("#startdate").val().replace(/[^0-9]/g, ""));
	_ix.Set("F127", $("#enddate").val().replace(/[^0-9]/g, ""));
	_ix.Set("F123", gddm);
	try {
		Win_CallTQL("ret_wtlist", voteid.cxwtlist, _ix, '');
	} catch(e) {
		Alert(e);
	}
}

function ret_wtlist(_fromid, _funid, _flagtype, _json) {
	// debugger;
	try {
		var data = FormatResult(_json, 1);
		var arr = JSON.parse(_json);
	} catch(e) {
		Alert("error:\n" + e);
		return;
	}

	if(data.ErrorCode != 0) {
		Alert(data.ErrorInfo);
		return;
	}

	if(arr[2] == "") {
		Alert("您的客户端的AddinStock.dll版本较低，请更换高版本的dll。");
		return;
	}

	var titleHtml = getTitleHtml(arr[2]);
	$("#wtlist").html(titleHtml);

	if(data.rows == undefined) {
		Alert("当前时间区间内还没有投票委托。");
		$("#tpjg").html("");
		return;
	}

	doDictDataRows(data.rows, [["voteStat", "F147"], ["yaType", "F1056"]]);

	var tplText = getContentHtml1(arr[1], arr[2][arr[2].length-1]);
	var tplFunc = doT.template(tplText);
	var htmlStr = tplFunc(data.rows);
	$("#tpjg").html(htmlStr);
}

/**
 * @description 相应字段字典转换
 * @param {array} datarows 数据结果集 [{},{},...]
 * @param {array} fields 需要转换的字段 [[dict, field], [dict, field], ...]
 */
function doDictDataRows(datarows, fields) {
	if(datarows == "" || fields.length == 0) return;
	$.each(datarows, function(index, rowdata) {
		for(var i = 0; i < fields.length; i++) {
			if(rowdata[fields[i][1]] != undefined) {
				rowdata[fields[i][1]] = dictField(rowdata[fields[i][1]], fields[i][0]);
			}
		}
	})
}

function dictField(fieldvalue, dct) {
	return dict[dct][fieldvalue] || fieldvalue;
}