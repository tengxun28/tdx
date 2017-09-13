var flag=0;
var code_name={};
var count = 0;

function req_code(data){
	count=0;
	$.each(data.rows,function(index,value){
		if(code_name[value["stkcode"]]==undefined){
			get_zqname(value["stkcode"]);
		}else{
			count++
		}
	})
}

function get_zqname(code){
	var _ix = new IXContent();
	_ix.Set('F140', code);
	Win_CallTQL('ret_zqInfo', 'JY:102', _ix);
}
function ret_zqInfo(_fromid, _funid, _flagtype, _json) {
	count++;

	_json=FormatResult(_json,1)
	if(_json.ErrorCode!="0"){
	
	}else{
		if(flag==1){
			if(_json.rows||_json.rows.length){
				code_name[_json.rows[0]["F140"]]=_json.rows[0]["F141"]
			}
			if(total==count){
			
				code_next();
			}	
		}else if(flag==0){
			var zqname = _json.rows[0].F141;
			var jymarket = getJYmarket(_json.rows[0].F125);
			$("#zqname").attr("value",zqname);
			$("#jymarket").attr("value",jymarket);

		}
	}
		
}
function code_next(totalinfo){
		$.each(totalinfo.rows,function(index,value){
			$.extend(value,{"F141":code_name[value["stkcode"]]})	
		});
		$("#total").text("共"+totalinfo.rows.length+"条");
		upDate("load",totalinfo)
}
/*
	头寸信息查询
*/
function get_tccxcx(sPos){
	var cfg ={
		"funcid":"471143",
		"posstr":sPos,
		"funcname":'ret_TcglInfo',
		"fundid":zjzh,
		"qrynum":"100"
	};
	setIX(cfg);
}

// 标的查询
function get_bd(conf) {
	var cfg = {
		"funcid":"471002",
		"@POS": conf.pos,
		"funcname": conf.callback,
		"@COUNT": "100"
	};
	setIX(cfg);
}

function showJDQList(total_data){
 	spanTCBHselect(total_data);
	var curdate = getCur()
	curdate = curdate.replace(/-/g,"")
	if(defcx==0&&pageCur==(pageList.length - 1)){
 		var tccount = 0
			$.each(total_data.rows,function(k,v){
			// if(v.enddate - curdate<=5){
			if(v.enddate - curdate<=5 && v.enddate - curdate > 0) {
				tccount++;
	 			$("#kdqtc").text(function(i,oldsno){
					return oldsno +" "+ v.positionid
				})
	 		}
	 	});
	 	if(tccount){
	 		$("#tcdqtx").dialog("open");
	 	}
 	}
 	req_code(total_data);
}
function spanTCBHselect(total_data){
	var dvalue=[];
	for(var n=1;n<total_data.rows.length;n++){
		dvalue.push(total_data.rows[n].positionid);
	}
	var newArray=[];
	var len=dvalue.length;
	for (var h=0;h<len ;h++){
		for(var g=h+1;g<len;g++){
			if(dvalue[h]===dvalue[g]){
				g=++h;
			}
		}
		newArray.push(dvalue[h]);
	} 

	for(var k=0;k<newArray.length;k++){
		tcbh_select+="<option value='"+newArray[k]+"'>"+newArray[k]+"</option>";
	}
 	$("#tcbh_detail").append(tcbh_select);
}

function get_Tctype(c){//头寸类型
	var positype="";
	if(c=="0")
		positype="默认";
	else if(c=="1")
		positype="共享";
	else if(c=="2")
		positype="独占";
	return positype;
}

function getJYmarket(c){//获取交易市场对应的中文
	var market=""
	if(c=="0")
		market="深圳A股"
	else if(c=="1")
		market="上海A股"
	else if(c=="2")
		market="深圳B股"
	else if(c=="3")
		market="上海B股"
	return market
}

function getJYmarketid(c){//获取交易市场对应的中文
	var market=""
	if(c=="深圳A股")
		market="0"
	else if(c=="上海A股")
		market="1"
	else if(c=="深圳B股")
		market="2"
	else if(c=="上海B股")
		market="3"
	return market
}
//如果是共享或默认头寸，则固定显示几个字段，将其他字段置空
function emtpyval(val,rowdata,index){
	if(rowdata.positype==0||rowdata.positype==1) return "";
	return val
}
//判断输入的是否为0
/*function formatterZroe(d){
    var sum=0;
    var temp=0;
    var testZroe=/^[0-9]*$/;
	d=d.toString();
    for(var i=0;i<d.length-1;i++){
        if(testZroe.test(d.substring(i,i+1))){
            temp=parseInt(d.substring(i,i+1))
            sum+=temp;
        }
    }
    if(sum==0){
    	d=0;
    }
    return d;
}*/
//判断输入的是否为0，如果不是则费率等乘以100
function get_Cyyb(d){

    var fl="";
		fl=parseFloat(d)*100;
		fl=fl.toFixed(3);
    return fl;
}
/*
	input 封装

*/
(function($) {
	function bindev(t) {
		var opts = $.data(t, "inputbox").options;
		$(t).unbind().bind("keypress", function(e) {

			if (typeof opts.rules[opts.valiType] != "undefined") {
				return opts.rules[opts.valiType].filter.call(this, e)
			}
			return true
		}).bind("keyup", function() {
			if (typeof opts.onKey == "function") {
				opts.onKey.call(t, $(t).val())
			}
		})
	};

	function setable(t, b) {
		var opts = $.data(t, "inputbox").options;
		if (b) {
			opts.disabled = true;
			$(t).attr("disabled", true);
		} else {

			opts.disabled = false;
			$(t).removeAttr("disabled");
		}
	};

	function filter(e) {
		if (e.which == 0 || e.which == 8) {
			return true;
		} else {
			if (e.ctrlKey == true && (e.which == 99 || e.which == 118)) {
				return true;
			} else {
				return false;
			}
		}
	};
	$.fn.inputbox = function(pin, p) {
		if (typeof pin == "string") {
			var fn = $.fn.inputbox.methods[pin];
			if (fn) {
				return fn(this, p);
			}
		}
		pin = pin || {};
		return this.each(function() {
			var tput = $.data(this, "inputbox");
			if (tput) {
				$.extend(tput.options, pin);
			} else {
				tput = $.data(this, "inputbox", {
					options: $.extend({}, $.fn.inputbox.defaults, pin)

				});
				$(this).removeAttr("disabled");
				//valiType不是文本类型,禁用中文输入法
				if (tput.options.valiType != "txtbox") {
					$(this).css({
						imeMode: "disabled"
					});
				}
			}
			tput.options.originalValue = tput.options.value
			setable(this, tput.options.disabled);
			bindev(this);
		});
	};
	$.fn.inputbox.methods = {
		options: function(jq) {
			return $.data(jq[0], "inputbox").options;
		},
		disable: function(jq) {
			return jq.each(function() {
				setable(this, true);
			});
		},
		enable: function(jq) {
			return jq.each(function() {
				setable(this, false);
			});
		},
		setValue: function(jq, v) {
			return jq.each(function() {
				$(this).val(v);
			});
		},
		getValue: function(jq) {
			return $(jq[0]).val();
		},
		clear: function(jq) {
			return jq.each(function() {
				$(this).val("");
			});
		},
		reset: function(jq) {
			return jq.each(function() {
				var opts = $(this).inputbox("options");
				$(this).inputbox("setValue", opts.originalValue);
			});
		},
		//扩展默认参数rules的类型
		extendrule: function(jq, valifilt) {
			return jq.each(function() {
				var opts = $(this).inputbox("options");
				$.extend(opts.rules, valifilt)
			});
		},

		//判断参数是否符合要求,不符合,返回-1,符合返回输入框值
		checkValid: function(jq) {
			var opts = $(jq[0]).inputbox("options");
			var v = $.trim(jq.inputbox("getValue"))
			if (v.length == 0 && opts.emptytxt.length) {
				alert(opts.emptytxt)
				return -1
			}
			if (typeof opts.rules[opts.valiType] != "undefined") {
				var ov = opts.rules[opts.valiType].validVal.call(jq[0], v)
				if (opts.info.length && ov == -1) {
					alert(opts.info)
					return -1
				} else
					return opts.rules[opts.valiType].validVal.call(jq[0], v)
			}
			return v
		}
	};

	$.fn.inputbox.defaults = $.extend({}, {
		disabled: false, //文本框是否不能输入
		valiType: "intbox", //intbox:数字;floatbox:浮点;txtbox:所以文本;enbox:英文单词
		info: "", //输入框参数不合法时提示信息
		emptytxt: "", //文本为空时提示信息
		rules: {
			intbox: {
				filter: function(e) {
					if (e.which >= 48 && e.which <= 57 && e.ctrlKey == false && e.shiftKey == false)
						return true;
					return filter.call(this, e)
				},
				validVal: function(v) {
					v = parseInt(v)
					return isNaN(v) ? -1 : v
				}
			},
			floatbox: {
				filter: function(e) {
					var c = String.fromCharCode(e.which);
					if (c == '.')
						return ($(this).val().indexOf(c) == -1 ? true : false);
					if (e.which >= 48 && e.which <= 57 && e.ctrlKey == false && e.shiftKey == false)
						return true;
					return filter.call(this, e)
				},
				validVal: function(v) {
					v = parseFloat(v)
					return isNaN(v) ? -1 : v
				}
			},
			txtbox: {
				filter: function(e) {
					return true
				},
				validVal: function(v) {
					return v
				}
			},
			enbox: {
				filter: function(e) {
					if ((e.which >= 65 && e.which <= 90 || e.which >= 97 && e.which <= 122) && e.ctrlKey == false && e.shiftKey == false)
						return true;
					return filter.call(this, e)
				},
				validVal: function(v) {
					var regexp = /^[a-zA-Z]+$/;
					return regexp.test(v) ? v : -1
				}
			}
		},
		onKey: function(v) {}
	});
})(jQuery);


//判断Input只能输入数字和字母
function CheckNumChar(name,node,e){
	if(name=="keypress"){
		var k = window.event ? e.keyCode:e.which;
	    if (((k >= 48) && (k <= 57))||((k >= 65) && (k <= 90))||((k >= 97) && (k <= 122)) || k==8 || k==0){
	    	
	    }else{
	    	if(window.event) window.event.returnValue = false; 
			else e.preventDefault();
		}
	}
}

//判断Input只能输入整数
function CheckNum(name,node,e){
	if(name=="keypress"){
		var k = window.event ? e.keyCode:e.which;
	    if (((k >= 48) && (k <= 57)) || k==8 || k==0){
	    }else{
	    	if(window.event) window.event.returnValue = false; 
			else e.preventDefault();
		}
	}
}
//判断input只能输入浮点型
function CheckFloat(name,node,e){
	if(name=="keypress"){
		var k = window.event ? e.keyCode:e.which;
	    if (((k >= 48) && (k <= 57)) || k==8 || k==0||k==46){
	    	if(k==46){//"判断小数点"
	    		var val=$(node).attr("value")
	    		if(val.indexOf(".")!=-1)
	    			if(window.event) window.event.returnValue = false; 
					else e.preventDefault();
	    	}
	    }else{
	    	if(window.event) window.event.returnValue = false; 
			else e.preventDefault();
		}
	}
}


/*
选择表格中对应值的行
@param：field:需要查找的列名,id：表格ID,v:需要查找的值
@return：返回对应的行，没找到返回-1
*/

function selectRow(field){
	return function(v,id){
		var data=$("#"+id).datagrid("getRows")
		for(var i=0;i<data.length;i++){
			if(data[i][field]==v){
				$("#"+id).datagrid("selectRow",i)
				return [1,data[i]];
			}
		}
		return -1
	}
}
/*
*获取操作站点
*@return:ip地址+mac地址

*/
function getPcInfo(){
	var info=User.minfo.split(";")
	if(info.length!=12)
		return ""
	return info[7]+" "+info[8]
}

// var dxotc_share ={};
// dxotc_share.pageSize =50;
/*
*设置IX协议
*@param cfg为{},其中funcid和funcname2个key必须填入
*/
function setIX(cfg){
	var _ix = new IXContent();
	_ix.Set('funcid', cfg.funcid);//功能号
	_ix.Set('custid', User.khh);//客户代码
	_ix.Set('custorgid',User.yyb);//营业部ID
	_ix.Set('netaddr', '');//不需要填
	_ix.Set('trdpwd', "##PWD##");//交易密码
	_ix.Set('orgid', User.yyb);//操作机构
	_ix.Set('operway', User.wtfs);//操作方式
	_ix.Set('ext', '0');//固定参数
	_ix.Set('custcert', '');//固定参数
	_ix.Set('netaddr2', '');//固定参数
	_ix.Set('@COND', 'SELECT * from '+ cfg.funcid);
	$.each(cfg,function(key,val){
		if(key=="funcid"||key=="funcname"){}
		else{
			_ix.Set(key, val);
		}
	})
	Win_CallTQL(cfg.funcname, '5010:SIMPLE.'+cfg.funcid, _ix, '');
}
//获取当前请求时间
function getCurRequstTime(){
	var myDate = new Date();
	var mytime=myDate.toLocaleTimeString(); 
	var m=myDate.getMonth();
	var d=myDate.getDate()
	if(m<10)
		m="0"+(m+1);
	if(d.toString().length==1)
		d="0"+d;
	return myDate.getFullYear().toString()+m+d+" "+mytime
	}

/*
*单数转双数
*@param：整数
*@return:双数
*/

function sigtodow(i){
	if(i<10)
		return "0"+i
	else
		return i+""
}
/*
*获取input选中文本
*@param：inputDom：input节点
*@return:选中文本
*/
function getSelectedText(inputDom){ 
    if (document.selection) //IE
     {
        return document.selection.createRange().text;
    } 
    else { 
        return inputDom.value.substring(inputDom.selectionStart, 
                inputDom.selectionEnd); 
    } 
}
function hideLoading(){
	$(".tdx_loading").remove();
}



//判断字符串是否为空
function isNullStr(s){
	if(s.replace(/(^\s*)|(\s*$)/g, "").length==0)
		return 1;
	return 0;
}

//产品状态
function get_Stat(c){
	var stat=""
	if(c=="0")
		stat="募集前状态"
	else if(c=="1")
		stat="募集期"
	else if(c=="2")
		stat="开放期"
	else if(c=="3")
		stat="封闭期"
	else if(c=="4")
		stat="清盘"
	return stat
}

//风险级别
function get_RiskLvl(c){
	var Lvl=""
	if(c=="1")
		Lvl="低"
	else if(c=="2")
		Lvl="中低"
	else if(c=="3")
		Lvl="中"
	else if(c=="4")
		Lvl="中高"
	else if(c=="5")
		Lvl="高"
	return Lvl
}

//交易类别
function get_TraType(c){

	var tra=""
	if(c=="001")
		tra="开户"
	else if(c=="002")
		tra="销户"
	else if(c=="003")
		tra="变更"
	else if(c=="008")
		tra="注册"
	else if(c=="110")
		tra="认购"
	else if(c=="111")
		tra="申购"
	else if(c=="112")
		tra="赎回"
	else if(c=="20B")
		tra="买入"
	else if(c=="20S")
		tra="卖出"
	return tra
}

//意向约定
function get_MatchType(c){
	var matchtype=""
	if (c=="0") 
		matchtype="可部分成交"
	else if (c=="1")
		matchtype="不可部分成交"
	return matchtype
}

function easyui_grid(cuscol,d,id,easyid){
	//cuscol:[[["字段名","字段标题"],["字段名2","字段标题2"]]]
	//如果列需要其它属性,则cuscol:格式为:[[["字段名","字段标题",{}],["字段名2","字段标题2",{}]]]
	id=id||"tdx_center"
	easyid=easyid||"load"
	cuscol=cuscol||[]
	var mygrid=$("<div id='"+easyid+"'></div>").appendTo($("#"+id));

	d=$.extend({},{
					singleSelect:true,
					fitColumns:true,
					scrollbarSize:0,
					loadMsg:'',
					border:false,
					remoteSort: false
				},d)
	if(d.onDblClickRow!=undefined)
		d.onDblClickRow=onDlbEasyGrid(d.onDblClickRow,easyid)
	var head=[]		
	for(var k=0;k<cuscol.length;k++){
	 	head.push([])
	 	for(var h=0;h<cuscol[k].length;h++){
	 		if(cuscol[k][h].length==3){
	 			head[k].push($.extend({},{halign:'center',align:'right',width:100},{field:cuscol[k][h][0],title:cuscol[k][h][1]},cuscol[k][h][2]))
	 		}
	 		else{
	 			head[k].push($.extend({},{halign:'center',align:'right',width:100},{field:cuscol[k][h][0],title:cuscol[k][h][1]}))
	 		}
	 	}
	 }
	 d.columns=head
	 mygrid.datagrid(d)
	 var _52d = $.data( $("#"+easyid)[0], "datagrid");
	 var dc = _52d.dc;
	 dc.body1.add(dc.body2).unbind("mouseover mouseout")
}



function create_easygrid(funname,easyhead,columns,did){
	//easyhead{key:value}
	//columns:{"field":{}}
	var eaid=(did==undefined)?{}:did
	eaid=$.extend({},{"id":"tdx_center","easyid":"load"},did)
	var head=getHead(funname)
	if(easyhead!=undefined){
		$.each(easyhead,function(k,v){

			head.easyhead[k]=v
		})
	}
	if(columns!=undefined){
		for(var i=0;i<head.columns.length;i++){
			for(var k=0;k<head.columns[i].length;k++){
				if(columns[head.columns[i][k][0]]!=undefined)
					if(head.columns[i][k].length==2)
						head.columns[i][k].push(columns[head.columns[i][k][0]])
					else{

						head.columns[i][k][2]=$.extend({},head.columns[i][k][2],columns[head.columns[i][k][0]])
					}
			}
		}
	}
	easyui_grid(head.columns,head.easyhead,eaid.id,eaid.easyid)	
}

/**
*功能:更新easy表格数据,表格无数据时加提示信息
*备注：表格第一列为check时不要调用这个函数
*参数:rt表格id,
	  data表格更新数据
	  opts：{}对象 {"info"}
	  		info:表格无数据的提示文本,默认"没有相应的查询信息"
*返回:无
*/
function upDate(rt,data,opts){

	
	var opt=$("#"+rt).datagrid("options")
	opt.hasData=1//表格是否有数据的标志,默认有数据
	opts=opts||{}
	var field=$("#"+rt).datagrid("getColumnFields")
	if(opt.columns[0][0]["talign"]==undefined)
		opt.columns[0][0]["talign"]=opt.columns[0][0].align
	else
		opt.columns[0][0].align=opt.columns[0][0]["talign"]
	if(opt.columns[0][0].tstyler==undefined)
		opt.columns[0][0]["tstyler"]=opt.columns[0][0].styler
	else if(opt.columns[0][0].tstyler=="null")
		opt.columns[0][0]["styler"]=undefined
	else
		opt.columns[0][0]["styler"]=opt.columns[0][0].tstyler
	
	if(data.rows==undefined||data.rows.length==0){
		data={"total":0,"rows":[{}]}
		data.rows[0][field[0]]=opts["info"]||"没有相应的查询信息"
		if(opt.columns[0][0].styler==undefined)
			opt.columns[0][0]["tstyler"]="null"
		opt.columns[0][0].align="left"
		opt.columns[0][0].styler=function(){return "color:red;"}
		opt.hasData=0//表格是否有数据标志

	}
	
	$("#"+rt).datagrid("loadData",data.rows);
	if(data.total==0)
		$("#"+rt).datagrid("mergeCells",{"index":0,"field":field[0],"colspan":field.length});
	
}

/**
*功能:处理弹出对话框拖动时与父节点的高度,
*备注：easyui的弹出对话框拖动时有bug,需要控制和父节点的高度
*参数:sid 弹出对话框的id,
	  top 距离父节点高度
*返回:无
*/
function setDlg(sid,top){
	sid=sid||"cdwt"
	top=top||10
	var dg=$.data($("#"+sid)[0], "window")			
	$("#"+sid).dialog("dialog").draggable("options").onDrag=function(e) {
		if(e.data.top<top){
			e.data.top=top
			dg.proxy.css({
				display: "block",
				left: e.data.left,
				top: e.data.top
			})
			return false;
		}else{
			dg.proxy.css({
				display: "block",
				left: e.data.left,
				top: e.data.top
			})
			return false;
		}
	}
}

/**
*功能:处理表格无数据时的双击事件
*参数:fDlbRow 双击时自定义的回调函数,
	  rt 表格ID
*返回:无
*/
function onDlbEasyGrid(fDlbRow,rt){
	return function(rowindex,rowdata){
		var opt=$("#"+rt).datagrid("options")
		if(opt.hasData==0)//表格是否有数据标志，0为无数据
			return
		fDlbRow(rowindex,rowdata)
	}
}
/**
*功能:弹出调试信息,相对于改进的alert
*参数:info要显示的信息,类型可以为字符串,[],{}
*返回:无
*/

function myAlert(info){
	alert(JSON.stringify(info))
}

/**
*功能:一般提示信息
*参数:txt为提示信息
*返回:无
*/
function proInfo(txt){
	$.messager.alert('提示',txt,"info");
}

/**
*功能:错误提示信息
*参数:txt为错误的信息
*返回:无
*/
function proError(txt){
	$.messager.alert('提示',txt,"error");
}


/**
*功能:返回当前日期
*参数:无　　　
*返回:当前日期 格式为yyyymmdd
*/
function getCur(){
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth()+1;
	month = (month<10)?('0'+month):month;
	var day = d.getDate();
	if(day<10) day = "0" + day;
	return year.toString()+month.toString()+day.toString();
}

/**
*功能:返回与当前日期相距N月的日期
*参数:delta类型可以为正负整数;　　　　
*返回:新的日期 格式为yyyymmdd
*/
function getAddMonth(delta){
	var d = new Date();
	d.setMonth(d.getMonth() + delta);
	var year = d.getFullYear();
	var month = d.getMonth()+1;
	month = (month<10)?('0'+month):month;
	var day = d.getDate();
	if(day<10) day = "0" + day;
	return year.toString()+month.toString()+day.toString();
}

function getTime(c){	
	return c.substring(11)	
}

function getAcctStat(c){
	var state;
	if (c=="0") {
		state="正常";
	}
	else if (c=="1") {
		state="冻结";
	}
	else if (c=="2") {
		state="挂失";
	}
	else if (c=="3") {
		state="销户";
	}
	else if (c=="5") {
		state="休假";
	}
	else if (c=="A") {
		state="不合格司法冻结";
	}
	else if (c=="C") {
		state="中登休眠";
	}
	else if (c=="E") {
		state="中登不合格";
	}
	else if (c=="G") {
		state="内部休眠";
	}
	else if (c=="J") {
		state="内部不合格";
	}
	else{
		state="";
	}
	return state;
}

function getIdType(c){
	var IdType=""
	if (c=="00") {
		IdType="身份证";
	}
	else if (c=="01") {
		IdType="护照";
	}
	else if (c=="02") {
		IdType="军官证";
	}
	else if (c=="03") {
		IdType="士兵证";
	}
	else if (c=="04") {
		IdType="港澳居民来往内地通行证";
	}
	else if (c=="05") {
		IdType="户口本";
	}
	else if (c=="06") {
		IdType="外国护照";
	}
	else if (c=="07") {
		IdType="其他";
	}
	else if (c=="08") {
		IdType="文职证";
	}
	else if (c=="09") {
		IdType="警官证";
	}
	else if (c=="0A") {
		IdType="台胞证";
	}
	else if (c=="10") {
		IdType="组织机构代码证";
	}
	else if (c=="11") {
		IdType="营业执照";
	}
	else if (c=="12") {
		IdType="行政机关";
	}
	else if (c=="13") {
		IdType="社会团体";
	}
	else if (c=="14") {
		IdType="军队";
	}
	else if (c=="15") {
		IdType="武警";
	}
	else if (c=="16") {
		IdType="下属机构";
	}
	else if (c=="17") {
		IdType="基金会";
	}
	else if (c=="18") {
		IdType="其他";
	}
	else{
		IdType="";
	}
	return IdType;
}