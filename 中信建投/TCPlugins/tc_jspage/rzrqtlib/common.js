
/*
* 获取URL参数
*/
function URLParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}


/** 获取COOKIE */
function getCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) {
            var endstr = document.cookie.indexOf(";", j);
            if (endstr == -1) {
                endstr = document.cookie.length;
            }
            return unescape(document.cookie.substring(j, endstr));
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}

/** 设置COOKIE */
function setCookie(name, value) {
    var argv = setCookie.arguments;
    var argc = setCookie.arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    var path = (argc > 3) ? argv[3] : null;
    var domain = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : false;
    document.cookie = name + "=" + escape(value)
		+ ((expires == null) ? "" : ("; expires=" + expires.toGMTString()))
		+ ((path == null) ? "" : ("; path=" + path))
		+ ((domain == null) ? "" : ("; domain=" + domain))
		+ ((secure == true) ? "; secure" : "");
}

/** 删除COOKIE */
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = 0;
    document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}
