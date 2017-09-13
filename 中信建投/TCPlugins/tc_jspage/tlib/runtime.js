var skin = "gray";                   	//easyui皮肤

var jsfile = [
'jquery.min.js',                        //jquery类库
'connect/ix_js.js',						//数据调用
'connect/sys_pc.js',					//数据调用
'jeasyui/jquery.easyui.min.js', 		//easyui类库
'jeasyui/locale/easyui-lang-zh_CN.js', 	//easyui中文语言包
'jqgrid/js/jquery.jqgrid.min.js',
'my97datepicker/wdatepicker.js',
'page/page.js',
'page/zxjt.js'
];

var jspath = document.scripts;
jspath = jspath[jspath.length - 1].src.substring(0, jspath[jspath.length - 1].src.lastIndexOf("/") + 1);

//引用easyui的css
document.write('<link' + ' id="skin_link" rel="stylesheet" type="text/css" href="' + jspath + 'jeasyui/themes/' + skin + '/easyui.css"/>');
document.write('<link href="' + jspath + '/jqgrid/css/jquery-ui-custorm.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + jspath + '/jqgrid/css/ui.jqgrid.css" rel="stylesheet" type="text/css" />');

//引用icon.css
document.write('<link href="' + jspath + '/jeasyui/themes/icon.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + jspath + '/page/common.css" rel="stylesheet" type="text/css" />');

//引用JS文件
for (var i = 0; i < jsfile.length; i++) {
    document.write('<script' + ' type="text/javascript" src="' + jspath + jsfile[i] + '"></script>');
}
