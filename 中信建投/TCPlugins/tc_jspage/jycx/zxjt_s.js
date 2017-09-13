var infoshow="暂无相关数据"
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
		return findData(id,field,v)
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
/**设置IX协议
*@param cfg为{},其中funcid和funcname2个key必须填入
*/
function setIX(cfg,c){

	var _ix = new IXContent();
	_ix.Set('funcid', cfg.funcid);//功能号
	_ix.Set('operid', c);//操作用户代码
	_ix.Set('userrole','1');//操作用户角色
	_ix.Set('custid',c);//用户代码
	_ix.Set('orgid ',User.yyb);//操作机构
	_ix.Set('trdpwd ','');//交易密码
	_ix.Set('operway', User.wtfs);//操作方式
	_ix.Set('ext', '');//扩展
	_ix.Set('netaddr', '');//操作站点
	_ix.Set('netaddr2', '');//站点扩位
	_ix.Set('custcert', '');//用户证书
	_ix.Set('ticket', '##SESSION##');//登录票据



	/*_ix.Set('F_OP_SITE', '');//操作站点
	_ix.Set('F_CHANNEL', '0');//操作渠道
	_ix.Set('F_SESSION', '##SESSION##');//会话凭证
	_ix.Set('F_RUNTIME','##RUNTIM##');//调用时间
	_ix.Set('F_OP_SRC', '0');//操作用户来源*/


	_ix.Set('@MAC', User.minfo);
	_ix.Set('@COND', 'SELECT * from '+ cfg.funcid);
	$.each(cfg,function(key,val){
		if(key=="funcid"||key=="funcname"){}
		else{
			_ix.Set(key, val);
		}
	})

	Win_CallTQL(cfg.funcname, '5010:SIMPLE.'+cfg.funcid, _ix, '');
}

/*
*设置IX协议
*@param cfg为{},其中funcid和funcname2个key必须填入
*/
function setIX2(cfg){
	var _ix = new IXContent();
	_ix.Set('F_FUNCTION', "L2610006");//功能号
	_ix.Set('F_OP_USER', "300748");//操作用户代码
	_ix.Set('F_OP_ROLE','2');//操作用户角色
	_ix.Set('F_OP_SITE', '');//操作站点
	_ix.Set('F_CHANNEL', '7');//操作渠道
	_ix.Set('F_SESSION', '3k4Ad#@%+^p5x6)==');//会话凭证
	_ix.Set('F_RUNTIME',"");//调用时间
	_ix.Set('F_OP_SRC', '0');//操作用户来源
	_ix.Set('@MAC', User.minfo);
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
	return cpzt[c]||""
}

//风险级别
function get_RiskLvl(c){
	return fxjb[c]||""
}

//风险评价类型
function get_Fxpjlx(c){
	
	return pjlx[c]||""
}

//交易类别
function get_TraType(c){
	return jylb[c]||""
}

//意向约定
function get_MatchType(c){
	return yxlb[c]||""
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
	d.onResizeColumn=onEasyResize(easyid,d["size"])
	d.width=undefined
	var head=[]		
	
	for(var k=0;k<cuscol.length;k++){
	 	head.push([])
	 	for(var h=0;h<cuscol[k].length;h++){
	 		if(cuscol[k][h].length==3){
	 			head[k].push($.extend({},{halign:'center',align:'right'},{field:cuscol[k][h][0],title:cuscol[k][h][1]},cuscol[k][h][2]))
	 		}
	 		else{
	 			head[k].push($.extend({},{halign:'center',align:'right'},{field:cuscol[k][h][0],title:cuscol[k][h][1]}))
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
	create_jqGrid(funname,easyhead,columns,did)
}


function onEasyResize(rt,addw){
	var cols={}
	var b=false;
	var ad=0;
	addw=addw||10;
	return function(f,w){
		
		
		var opt=$("#"+rt).datagrid("options")
		var field=$("#"+rt).datagrid("getColumnFields")
		var nl=field.length
		if(!b){
			$.each(opt.columns,function(i,col){
				for(var j=0;j<col.length;j++){
					if(col[j]["checkbox"]){
						b=true
					}
				}
			})
		}
		if(b){
			addw=40
		}
		cols[f]=w
		setTimeout(function(){
			$("#"+rt).datagrid("resize",{width:cnt(cols)+addw})
		
			
			if(ad==0&&f==field[nl-1]){

				ad=1
	
				$("#"+rt).datagrid("resize",{width:cnt(cols)+addw})
			}
		}, 0)
	}
}





function cnt(cols){
	var t=0;
	$.each(cols,function(k,v){
		t+=v;
	})
	return t
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
	up_jqGrid(rt,data.rows)
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

function getBjls(c){
	var bjlx="";
	if (c == "1") {
		bjlx="单边报价";
	}
	else if (c == "2") {
		bjlx="双边报价";
	}
	else if (c == "3") {
		bjlx="做市报价";
	}
	return bjlx;
}


//订单状态
function get_OrdStat(c){
	return ddzt[c]||""
}

//撤单状态
function get_CanStat(c){
	return cdzt[c]||""
}

function get_InstType(c){
	return cpdl[c]||""
}



function create_jqGrid(name,head,column,id){
	
	var jqid=$.extend({},{"id":"tdx_center","jqid":"load"},id||{});
	var jqopt=getjqHead(name)
	
	var jq=$.extend({},jqopt.head,head)

	checkDlickRow(jqid["jqid"],jq)
	
	jq.resizeStop=reStop(jqid["jqid"])
	if(column){
		var clm=[];
		$.each(jqopt.column,function(k,v){
			if(column[v.name]!=undefined){
				jqopt.column[k]=$.extend({},v,column[v.name])
			}
		})
	}

	jq["colModel"]=jqopt.column
	$('<table id="'+jqid["jqid"]+'" style="border-collapse:collapse"><tr><td></td></tr></table>').appendTo($("#"+jqid["id"]));
	$("#"+jqid["jqid"]).jqGrid(jq)
}
/*
	
*/

function reStop(id){
	return function(){
		$("#"+id).jqGrid("setGridWidth",$("#"+id)[0].p.tblwidth)
	}
}

/*
判断表格是否有双击事件
id:表格id
jq:jggrid参数
*/
function checkDlickRow(id,jq){

	if(jq.ondblClickRow!=undefined){
		jq.ondblClickRow=onjqDClickRow(id,jq.ondblClickRow)
	}
	if(jq.onDblClickRow!=undefined)
		jq.ondblClickRow=onjqDClickRow(id,jq.onDblClickRow)
}

/*
中转处理jq表格双击
id:表格id
fnclick:表格双击回调函数

*/
function onjqDClickRow(id,fnclick){
	
	return function(rowid,iRow,iCol,e){
		var data=$("#"+id).jqGrid("getRowData",rowid)
		var colmodel=$("#"+id).jqGrid('getGridParam','colModel');
		var key=colmodel[0].name
		if(data[key]==infoshow)
			return
	
		fnclick(rowid,data)
	}
}
/*
	id:表格id
	field:查找的列字段名
	cmpval:要比较的值
*/
function findData(id,field,cmpval){
	var vcol=$("#"+id).jqGrid('getCol',field,true);
	
	for(var i=0;i<vcol.length;i++){
		if(vcol[i].value==cmpval){
			$("#"+id).jqGrid("setSelection",vcol[i].id)
			return [vcol[i].id,$("#"+id).jqGrid("getRowData",vcol[i].id)]
		}
	}
	return -1
}
function up_jqGrid(id,dt){

	$("#"+id).jqGrid('clearGridData'); 
	if(dt==undefined||dt.length==0){
		var colmodel=$("#"+id).jqGrid('getGridParam','colModel');
		var key=colmodel[0].name
		
		dt=[{}]
		dt[0][key]=infoshow	
	}	
	//myAlert(dt)
	$("#"+id).jqGrid("setGridParam",{page:1,data:dt,rowNum:dt.length}).trigger("reloadGrid");
}

function checkAll(id){
	id=id||"load"
	var selrow=$("#"+id).jqGrid('getGridParam','selarrrow');
	var aid=$("#"+id).jqGrid("getDataIDs")
	$.each(aid,function(i,rid){
		if($.inArray(rid,selrow)==-1){
			$("#"+id).jqGrid("setSelection",rid)
		}
	})
	$("#cb_"+id).attr("checked",true)
}
function uncheckAll(id){
	id=id||"load"
	var selrow=$("#"+id).jqGrid('getGridParam','selarrrow');
	var aid=$("#"+id).jqGrid("getDataIDs")
	$.each(aid,function(i,rid){
		if($.inArray(rid,selrow)!=-1){
			$("#"+id).jqGrid("setSelection",rid)
		}
	})
	$("#cb_"+id).attr("checked",false)
}
