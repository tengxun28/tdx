var skin = "bootstrap";                   //easyui皮肤

var jsfile = [
'jquery.min.js',                        //jquery类库
'jquery.bgiframe.js',			//消除easyui alert等弹出框被页面select标签覆盖
'jeasyui/jquery.easyui.min.js',         //easyui类库
'ix_js.js',							//数据调用
'sys_pc.js',							//数据调用
'page/page.js'						//页面总控
];

var jspath = document.scripts;
jspath = jspath[jspath.length - 1].src.substring(0, jspath[jspath.length - 1].src.lastIndexOf("/") + 1);

document.write('<link' + ' id="skin_link" rel="stylesheet" type="text/css" href="' + jspath + 'jeasyui/themes/' + skin + '/easyui.css"/>');

document.write('<link href="' + jspath + '/page/common.css" rel="stylesheet" type="text/css" />');

//引用JS文件
for (var i = 0; i < jsfile.length; i++) {
    document.write('<script' + ' type="text/javascript" src="' + jspath + jsfile[i] + '"></script>');
}