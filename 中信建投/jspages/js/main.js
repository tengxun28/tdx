//注册浏览器类型
var tdxClientLite = TDXClientLite;
calltql = tdxClientLite('PC');
callsys = tdxClientLite('vary');
var mry = {};
var _khxx = "";
var zxjt_home_config;
var _imgGetTimes = 0;   //广告图片获取次数
var hasLoad = false;    //资讯新闻加载
var lastLoadTime = "";  //资讯新闻上一次加载时刻

var timeTicket;         // banner切换时钟句柄
var $banner;            // banner索引
var $bannerChIco;       // banner切换按钮

$(function() {
    // 矫正配置文件
    var config = checkConfig(zxjt_home_config);
    setConfigInfo(config);
    calltql("CWServ.tdxi_get_picture", '{"Params":[],"CilentSpecifiedKey":""}', getHomePic);

    var $ewm = $("#zxjt_ewm");
    $ewm.css("top", ($(window).height() - 592)/2);
    var _dpi = screen.width;
	
	// 添加事件
    $(window).resize(function(event) {
        $ewm.css("top", ($(window).height() - 592)/2);
        if(screen.width != _dpi) {
            window.location.reload();
        }
    }); 
	$("#zxccnav").bind('click', function(event) {
		getZxCcZxinfo(event.target);
	});
	$("#indexnav").children('li').hover(function(event) {
		getIndexInfo(event.target);
	});
    
    $("#tdxzx").on('mousemove mouseout', 'li a', function(event) {
        if(event.type == "mousemove") {
            var txt = $(this).prop("title");
            var tip = '<div id="tooltip">' + txt + '</div>';
            if($("#outbox #tooltip").length) {
                $("#tooltip").css({
                    "top": event.pageY + 20 + "px",
                    "left": event.pageX + 10 + "px"
                });
            } else {
                $("#outbox").append(tip);
                $("#tooltip").css({
                    "top": event.pageY + 20 + "px",
                    "left": event.pageX + 10 + "px"
                }).show("fast");
            }
        } else if(event.type == "mouseout") {
            $("#tooltip").remove();
        }
    });
    $(".zx-right").on('mousemove mouseout', 'li a', function(event) {
        if(event.type == "mousemove") {
            var txt = $(this).prop("title");
            var tip = '<div id="tooltip">' + txt + '</div>';
            if($("#outbox #tooltip").length) {
                $("#tooltip").css({
                    "top": event.pageY + 20 + "px",
                    "left": event.pageX + 10 + "px"
                });
            } else {
                $("#outbox").append(tip);
                $("#tooltip").css({
                    "top": event.pageY + 20 + "px",
                    "left": event.pageX + 10 + "px"
                }).show("fast");
            }
        } else if(event.type == "mouseout") {
            $("#tooltip").remove();
        }
    });

    // 弹出框拖拽支持
    $("body").on('mousedown', '#more_head', function(event) {
        var $dlg = $("#more_dlg");
        $dlg.css("cursor", "move");
        var offset = $dlg.offset();
        var x = event.pageX - offset.left;
        var y = event.pageY - offset.top;
        var dataStorage = window.localStorage;

        $(document).bind("mousemove", function(event) {
            if($dlg.css("margin-top").replace(/px/, "") || $dlg.css("margin-left").replace(/px/, "")) {
                $dlg.css("margin", "0");
            }
            if($("body").css("user-select") != "none") {
                $("body").css("user-select", "none");
            }
            $dlg.stop();
            var _x = event.pageX - document.body.scrollLeft - x;
            var _y = event.pageY - document.body.scrollTop - y;

            _x = _x<-650 ? -650 : 
                _x>$(window).width()-50 ? $(window).width()-50 : _x;
            _y = _y<0 ? 0 : 
                _y>$(window).height()-50 ? $(window).height()-50 : _y;

            dataStorage.setItem("popPosition", JSON.stringify({x: _x,y: _y}));

            $dlg.animate({left: _x + "px", top: _y + "px"}, 10);
        });
    });

    $(document).mouseup(function(event) {
        $("#more_dlg").css("cursor", "default");
        $("body").css("user-select", "auto");
        $(document).unbind("mousemove");
    });

	// 板块指数区域联动
	$(".sc-cont-tabs dt").hover(function () {
		var id = $(this).attr("class");
		$(".sc-cont-tabs dt").css({
			"background-color": "rgb(247, 247, 247)",
			"border-width": "0"
		});
        $(".sc-cont-tabs dt span a").css("color", "#333");
		$(this).css({
			"background-color": "white",
			"border-top": "2px solid rgb(216, 10, 48)"
		});
        $(this).find('a').css("color", "rgb(238, 36, 36)");

		if (id.indexOf("hq_", 0) >= 0) {
			$(".sc-cont-img").css("display", "block");
			$(".sc-cont-img>div").each(function () {
				$(this).css("display", "none");
			});
			$("#" + id).css("display", "block");
			$(".sc-cont-img1").css("display", "none");
			GraphShow(id);
		}
		else {
			$(".sc-cont-img1").css("display", "block");
			$(".sc-cont-img").css("display", "none");
			GraphShow(id);
		}
	});
	GraphShow("hq_sh");
	$('.hq_sh').css({
		"background-color": "white",
		"border-top": "2px solid rgb(216, 10, 48)"
	});
    $('.hq_sh').find('a').css("color", "rgb(238, 36, 36)");
	$("#wdcc_div").width($("#plate_index").width() - 10);

    // 初始化操作
    getZxCcZxinfo("", true); // 初始化显示自选股资讯 
    //获取交易登录信息
    callsys("SYS_FUNCData", "", 6, SetSYSData);
    //获取acl登录信息
    callsys("Query_YHTJson", "", 6, OnUserInfo);

    // 获取资讯信息
    calltql("CWServ.tdxi_zxjtzx", '{"Params":["首页今日焦点","6"],"CilentSpecifiedKey":"zxjtnews"}', getZx);
    calltql("CWServ.tdxi_zxxwhome", '{"Params":["1","0","10"],"CilentSpecifiedKey":"zxjthomeimg"}', getZxImg); 

	// 资讯信息获取
	var _zx_call_json = {
	    "170": [zxjt_zx1, "CWServ.tdxi_zxjtzx", '{"Params":["盘前参考","6"],"CilentSpecifiedKey":"pqck"}'],
	    "160": [zxjt_zx2, "CWServ.tdxi_zxjtzx", '{"Params":["焦点新闻","6"],"CallName":"dxi_zxa","CilentSpecifiedKey":"zqyw"}'],
	    "150": [zxjt_zx3, "CWServ.tdxi_zxjtzx", '{"Params":["要闻精华","6"],"CilentSpecifiedKey":"zqyw"}'],
	    "140": [zxjt_zx4, "CWServ.tdxi_zxjtzx", '{"Params":["机构热点","6"],"CilentSpecifiedKey":"jrjgsd"}'],
	    "130": [zxjt_zx5, "CWServ.tdxi_zxjtzx", '{"Params":["盘后回顾","6"],"CilentSpecifiedKey":"phhg"}'],
	    "120": [zxjt_zx6, "CWServ.tdxi_zxjtzx", '{"Params":["晨会晨报","6"],"CilentSpecifiedKey":"chcb"}']
	}
    var _zx_keys = Object.keys(_zx_call_json);
    // 资讯信息延迟加载
    $(document).scroll(function(event) {
        if(document.body.scrollTop > 300) {
            if(!hasLoad || ((event.timeStamp - lastLoadTime) > 600000)) {
                lastLoadTime = event.timeStamp;
                hasLoad = true;
                for(var i in _zx_keys) {
                    calltql(_zx_call_json[_zx_keys[i]][1], _zx_call_json[_zx_keys[i]][2], _zx_call_json[_zx_keys[i]][0]);
                }
            } 
        }
    });

    // 弹出框阻止父级滚动事件
    $("#more_body").scrollUnique();
});

function getZxImg(err, data) {
    try {
        console.log(data);
        var imgInfo = JSON.parse(data).ResultSets[0].Content;
        var imgArr = [];
        var titleArr = [];
        var linkArr = [];
        for(var i in imgInfo) {
            imgArr.push(imgInfo[i][0]);
            titleArr.push(imgInfo[i][1]);
            linkArr.push(imgInfo[i][2]);
        }
        _imgGetTimes = 0;
        setImgCarousel(imgArr, "zxjt_ad1", titleArr, 4000, linkArr);
    }
    catch(err) {
        _imgGetTimes++;
        if(_imgGetTimes == 1) {
            calltql("CWServ.tdxi_zxxwhome", '{"Params":["1","0","10"],"CilentSpecifiedKey":"zxjthomeimg"}', getZxImg);
        }
    }
}

function setImgCarousel(imgArr, position, urlArr, time, linkArr) {
    switch(imgArr.length) {
        case 1:
        Promise.all([checkImgSource(imgArr[0])]).then(function(data) {
            var resultArr = [];
            for(var i in data) {
                if(data[i] != "error") {
                    resultArr.push(data[i]);
                }
            }

            if(resultArr.length == 0) {
                return;
            } else {
                $("#" + position + " img").attr("src", resultArr[index]);
                if(position == "banner") {
                    $("#" + position + " a").attr("href", "http://www.treeid/"+urlArr[0]);
                } else {
                    $("#zxjt_ad1_title").show();
                    $("#zxjt_ad1_title").text(urlArr[0]);
                }
            }
        }, function(data) {
            console.log("Unexpection Error!");      
        });
        break;
        case 2:
        Promise.all([checkImgSource(imgArr[0]), checkImgSource(imgArr[1])]).then(function(data) {
            if(position == "banner") {
                var resultArr = [];
                var _url = [];
                for(var i in data) {
                    if(data[i] != "error") {
                        resultArr.push(data[i]);
                        if(urlArr.length && urlArr.length!=1) {
                            _url.push("http://www.treeid/"+urlArr[i]);
                        }
                    }
                }
                if(urlArr.length == 1) {
                   _url[0] = "http://www.treeid/"+urlArr[0]; 
                }

                if(resultArr.length == 0) {
                    return;
                } else {
                    if(resultArr.length == 1) {
                        $("#" + position + " a").attr("href", _url[0]);
                        $("#" + position + " img").attr("src", resultArr[0]);
                    } else {
                        var changeHtml = "";
                        for(var i=0;i<resultArr.length;i++) {
                            changeHtml += '<div class="banner-change-icon"></div>';
                        }
                        $("#banner_change").html(changeHtml);
                        var _marginLeft = $("#banner_change").width()/2 * (-1) + "px";
                        $("#banner_change").css("margin-left", _marginLeft);
                        $(".banner-change-icon").eq(0).css("background-color", "white");

                        var index = 0;
                        $(".banner-change-icon").each(function(index, el) {
                            $(el).css("background-color", "transparent");
                        });
                        $(".banner-change-icon").eq(index).css("background-color", "white");
                        $("#" + position + " img").attr("src", resultArr[index]);
                        var totle = resultArr.length;
                        var timeTicket = setInterval(function() {
                            index++;
                            if(index >= totle) {
                                index = 0;
                            }
                            $(".banner-change-icon").each(function(index, el) {
                                $(el).css("background-color", "transparent");
                            });
                            $(".banner-change-icon").eq(index).css("background-color", "white");
                            $("#" + position + " img").attr("src", resultArr[index]);
                            if(_url.length == 1) {
                                $("#" + position + " a").attr("href", _url[0]);
                            } else {
                                $("#" + position + " a").attr("href", _url[index]);
                            }
                        }, time || 3000);

                        $("#banner_change").on('click', '.banner-change-icon', function(event) {
                            index = $(this).index();
                            $(".banner-change-icon").each(function(index, el) {
                                $(el).css("background-color", "transparent");
                            });
                            $(".banner-change-icon").eq(index).css("background-color", "white");
                            $("#" + position + " img").attr("src", resultArr[index]);
                            if(_url.length == 1) {
                                $("#" + position + " a").attr("href", _url[0]);
                            } else {
                                $("#" + position + " a").attr("href", _url[index]);
                            }
                            clearInterval(timeTicket);
                            timeTicket = setInterval(function() {
                                index++;
                                if(index >= totle) {
                                    index = 0;
                                }
                                $(".banner-change-icon").each(function(index, el) {
                                    $(el).css("background-color", "transparent");
                                });
                                $(".banner-change-icon").eq(index).css("background-color", "white");
                                $("#" + position + " img").attr("src", resultArr[index]);
                                if(_url.length == 1) {
                                    $("#" + position + " a").attr("href", _url[0]);
                                } else {
                                    $("#" + position + " a").attr("href", _url[index]);
                                }
                            }, time || 3000);
                        });
                    }
                }
            } else {
                var resultArr = [];
                var titleArr = [];
                var link = [];
                for(var i in data) {
                    if(data[i] != "error") {
                        resultArr.push(data[i]);
                        titleArr.push(urlArr[i]);
                        link.push(linkArr[i]);
                    }
                }

                if(resultArr.length == 0) {
                    $("#zxjt_ad1_title").text("暂未抓取到相关资讯信息");
                    return;
                } else {
                    var index = 0;
                    $("#" + position + " img").attr("src", resultArr[index]);
                    $("#zxjt_ad1_title").show();
                    $("#zxjt_ad1_title").text(titleArr[index]);
                    $("#zxjt_ad1 a").prop("href", "http://www.treeid/dlglocalurl##homepath##figs/web/html/zxdialog.htm?objid=" + link[index] + ",zxzx");
                    var totle = resultArr.length;
                    setInterval(function() {
                        index++;
                        if(index >= totle) {
                            index = 0;
                        }
                        $("#" + position + " img").attr("src", resultArr[index]);
                        $("#zxjt_ad1_title").show();
                        $("#zxjt_ad1_title").text(titleArr[index]);
                        $("#zxjt_ad1 a").prop("href", "http://www.treeid/dlglocalurl##homepath##figs/web/html/zxdialog.htm?objid=" + link[index] + ",zxzx");
                    }, time || 3000);
                }
            }
        }, function(data) {
            console.log("Unexpection Error!");      
        });
        break;
        case 3:
        Promise.all([checkImgSource(imgArr[0]), checkImgSource(imgArr[1]), checkImgSource(imgArr[2])]).then(function(data) {
            if(position == "banner") {
                var resultArr = [];
                var _url = [];
                for(var i in data) {
                    if(data[i] != "error") {
                        resultArr.push(data[i]);
                        if(urlArr.length && urlArr.length!=1) {
                            _url.push("http://www.treeid/"+urlArr[i]);
                        }
                    }
                }
                if(urlArr.length == 1) {
                   _url[0] = "http://www.treeid/"+urlArr[0]; 
                }

                if(resultArr.length == 0) {
                    return;
                } else {
                    if(resultArr.length == 1) {
                        $("#" + position + " a").attr("href", _url[0]);
                        $("#" + position + " img").attr("src", resultArr[0]);
                    } else {
                        var changeHtml = "";
                        for(var i=0;i<resultArr.length;i++) {
                            changeHtml += '<div class="banner-change-icon"></div>';
                        }
                        $("#banner_change").html(changeHtml);
                        var _marginLeft = $("#banner_change").width()/2 * (-1) + "px";
                        $("#banner_change").css("margin-left", _marginLeft);
                        $(".banner-change-icon").eq(0).css("background-color", "white");

                        var index = 0;
                        $(".banner-change-icon").each(function(index, el) {
                            $(el).css("background-color", "transparent");
                        });
                        $(".banner-change-icon").eq(index).css("background-color", "white");
                        $("#" + position + " img").attr("src", resultArr[index]);
                        var totle = resultArr.length;
                        var timeTicket = setInterval(function() {
                            index++;
                            if(index >= totle) {
                                index = 0;
                            }
                            $(".banner-change-icon").each(function(index, el) {
                                $(el).css("background-color", "transparent");
                            });
                            $(".banner-change-icon").eq(index).css("background-color", "white");
                            $("#" + position + " img").attr("src", resultArr[index]);
                            if(_url.length == 1) {
                                $("#" + position + " a").attr("href", _url[0]);
                            } else {
                                $("#" + position + " a").attr("href", _url[index]);
                            }
                        }, time || 3000);

                        $("#banner_change").on('click', '.banner-change-icon', function(event) {
                            index = $(this).index();
                            $(".banner-change-icon").each(function(index, el) {
                                $(el).css("background-color", "transparent");
                            });
                            $(".banner-change-icon").eq(index).css("background-color", "white");
                            $("#" + position + " img").attr("src", resultArr[index]);
                            if(_url.length == 1) {
                                $("#" + position + " a").attr("href", _url[0]);
                            } else {
                                $("#" + position + " a").attr("href", _url[index]);
                            }
                            clearInterval(timeTicket);
                            timeTicket = setInterval(function() {
                                index++;
                                if(index >= totle) {
                                    index = 0;
                                }
                                $(".banner-change-icon").each(function(index, el) {
                                    $(el).css("background-color", "transparent");
                                });
                                $(".banner-change-icon").eq(index).css("background-color", "white");
                                $("#" + position + " img").attr("src", resultArr[index]);
                                if(_url.length == 1) {
                                    $("#" + position + " a").attr("href", _url[0]);
                                } else {
                                    $("#" + position + " a").attr("href", _url[index]);
                                }
                            }, time || 3000);
                        });
                    }
                }
            } else {
                var resultArr = [];
                var titleArr = [];
                var link = [];
                for(var i in data) {
                    if(data[i] != "error") {
                        resultArr.push(data[i]);
                        titleArr.push(urlArr[i]);
                        link.push(linkArr[i]);
                    }
                }

                if(resultArr.length == 0) {
                    $("#zxjt_ad1_title").text("暂未抓取到相关资讯信息");
                    return;
                } else {
                    var index = 0;
                    $("#" + position + " img").attr("src", resultArr[index]);
                    $("#zxjt_ad1_title").show();
                    $("#zxjt_ad1_title").text(titleArr[index]);
                    $("#zxjt_ad1 a").prop("href", "http://www.treeid/dlglocalurl##homepath##figs/web/html/zxdialog.htm?objid=" + link[index] + ",zxzx");
                    var totle = resultArr.length;
                    setInterval(function() {
                        index++;
                        if(index >= totle) {
                            index = 0;
                        }
                        $("#" + position + " img").attr("src", resultArr[index]);
                        $("#zxjt_ad1_title").show();
                        $("#zxjt_ad1_title").text(titleArr[index]);
                        $("#zxjt_ad1 a").prop("href", "http://www.treeid/dlglocalurl##homepath##figs/web/html/zxdialog.htm?objid=" + link[index] + ",zxzx");
                    }, time || 3000);
                }
            }
        }, function(data) {
            console.log("Unexpection Error!");      
        });
        break;
        case 4:
        Promise.all([checkImgSource(imgArr[0]), checkImgSource(imgArr[1]), checkImgSource(imgArr[2]), checkImgSource(imgArr[3])]).then(function(data) {
            if(position == "banner") {
                var resultArr = [];
                var _url = [];
                for(var i in data) {
                    if(data[i] != "error") {
                        resultArr.push(data[i]);
                        if(urlArr.length && urlArr.length!=1) {
                            _url.push("http://www.treeid/"+urlArr[i]);
                        }
                    }
                }
                if(urlArr.length == 1) {
                   _url[0] = "http://www.treeid/"+urlArr[0]; 
                }

                if(resultArr.length == 0) {
                    return;
                } else {
                    if(resultArr.length == 1) {
                        $("#" + position + " a").attr("href", _url[0]);
                        $("#" + position + " img").attr("src", resultArr[0]);
                    } else {
                        var changeHtml = "";
                        for(var i=0;i<resultArr.length;i++) {
                            changeHtml += '<div class="banner-change-icon"></div>';
                        }
                        $("#banner_change").html(changeHtml);
                        var _marginLeft = $("#banner_change").width()/2 * (-1) + "px";
                        $("#banner_change").css("margin-left", _marginLeft);
                        $(".banner-change-icon").eq(0).css("background-color", "white");

                        var index = 0;
                        $(".banner-change-icon").each(function(index, el) {
                            $(el).css("background-color", "transparent");
                        });
                        $(".banner-change-icon").eq(index).css("background-color", "white");
                        $("#" + position + " img").attr("src", resultArr[index]);
                        var totle = resultArr.length;
                        var timeTicket = setInterval(function() {
                            index++;
                            if(index >= totle) {
                                index = 0;
                            }
                            $(".banner-change-icon").each(function(index, el) {
                                $(el).css("background-color", "transparent");
                            });
                            $(".banner-change-icon").eq(index).css("background-color", "white");
                            $("#" + position + " img").attr("src", resultArr[index]);
                            if(_url.length == 1) {
                                $("#" + position + " a").attr("href", _url[0]);
                            } else {
                                $("#" + position + " a").attr("href", _url[index]);
                            }
                        }, time || 3000);

                        $("#banner_change").on('click', '.banner-change-icon', function(event) {
                            index = $(this).index();
                            $(".banner-change-icon").each(function(index, el) {
                                $(el).css("background-color", "transparent");
                            });
                            $(".banner-change-icon").eq(index).css("background-color", "white");
                            $("#" + position + " img").attr("src", resultArr[index]);
                            if(_url.length == 1) {
                                $("#" + position + " a").attr("href", _url[0]);
                            } else {
                                $("#" + position + " a").attr("href", _url[index]);
                            }
                            clearInterval(timeTicket);
                            timeTicket = setInterval(function() {
                                index++;
                                if(index >= totle) {
                                    index = 0;
                                }
                                $(".banner-change-icon").each(function(index, el) {
                                    $(el).css("background-color", "transparent");
                                });
                                $(".banner-change-icon").eq(index).css("background-color", "white");
                                $("#" + position + " img").attr("src", resultArr[index]);
                                if(_url.length == 1) {
                                    $("#" + position + " a").attr("href", _url[0]);
                                } else {
                                    $("#" + position + " a").attr("href", _url[index]);
                                }
                            }, time || 3000);
                        });
                    }
                }
            } else {
                var resultArr = [];
                var titleArr = [];
                for(var i in data) {
                    if(data[i] != "error") {
                        resultArr.push(data[i]);
                        titleArr.push(urlArr[i]);
                    }
                }

                if(resultArr.length == 0) {
                    $("#zxjt_ad1_title").text("暂未抓取到相关资讯信息");
                    return;
                } else {
                    var index = 0;
                    $("#" + position + " img").attr("src", resultArr[index]);
                    $("#zxjt_ad1_title").show();
                    $("#zxjt_ad1_title").text(titleArr[index]);
                    var totle = resultArr.length;
                    setInterval(function() {
                        index++;
                        if(index >= totle) {
                            index = 0;
                        }
                        $("#" + position + " img").attr("src", resultArr[index]);
                        $("#zxjt_ad1_title").show();
                        $("#zxjt_ad1_title").text(titleArr[index]);
                    }, time || 3000);
                }
            }
        }, function(data) {
            console.log("Unexpection Error!");      
        });
        break;
        default:
        break;
    }
}
// 检查图片资源是否存在
function checkImgSource(_src) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        img.src = _src;
        img.onload = function() {
            resolve(_src);
        }
        img.onerror = function() {
            resolve("error");
        }
    });
}
// 获取acl客户信息
function OnUserInfo(err, data) {}
// 获取登录信息
function SetSYSData(err, data) {
    var _tempJSON = $.parseJSON(data);
    if (_tempJSON[0]["姓名"]=="") {
        return;
    }
    var info = _tempJSON[0];

    _khxx = info["客户号"];
    $("#khmc").text(info["姓名"]);
    $("#zjzh").text(info["资金帐号"]);
    $("#khxx img").prop("src", "./images/head.png");
    $(".per-other #per_login a").text("快捷交易");
    $(".per-other #per_question").html('<a href="http://www.treeid/dlglocalurl##privatepath##webchat.htmltdx_zxjt3descode019&tdxmyietitle=%E4%BC%98%E9%97%AE&tdxmyiewidth=1000&tdxmyieheight=608&canchangesize=1" id="youwen" style="background-color: rgb(237, 104, 64);">我要提问</a>');

    if(zxjt_home_config !== undefined) {
        var _yybId = info["营业部ID"];
        var _yybName = "";
        for(var i=0,len=zxjt_home_config.yybInfo.length;i<len;i++) {
            if(zxjt_home_config.yybInfo[i][0] == _yybId) {
                _yybName = zxjt_home_config.yybInfo[i][1];
                break;
            }
        }
        if(_yybName !== "") {
            $("#szyyb").text(_yybName);
        } else {
            console.log("未查找到对应营业部信息，请检查更新实际营业部对照表!");
            $("#szyyb").text(info["营业部ID"]);
        }
    } else {
        console.log("没有获取到有效的实际营业部信息对照表！请检查网络连接和TP主站状态！");
        $("#szyyb").text(info["营业部ID"]);
    }  
}

// 关闭更多信息对话框
function closeMoreDlg() {
    $("#more_body").empty();
    $("#more_head span").text("资讯中心");
    $("#more_bk").hide();
    $("#more_dlg").hide(300);
}
// 点击查询更多资讯对话框
function getMoreZx(pos) {
    var popPosition = window.localStorage.getItem("popPosition");
    var popHistory = false;
    if(popPosition && popPosition!=JSON.stringify({})) {
        popHistory = true;
        popPosition = JSON.parse(popPosition);
    }
    switch(pos) {
        case 0: // 资讯中心
            // window.location = "http://www.treeid/tabjsview_1";
        $("#more_bk").show();
        if(popHistory) {
            $("#more_dlg").css({
                "margin": "0",
                "left": popPosition.x>$(window).width()-50 ? $(window).width()-50 : popPosition.x + "px",
                "top": popPosition.y>$(window).height()-50 ? $(window).height()-50 : popPosition.y + "px"
            }).show(300);
        } else {
            $("#more_dlg").show(300);
        }
        $("#more_head span").text("资讯中心");
        calltql("CWServ.tdxi_zxjtzx", '{"Params":["首页今日焦点","30"],"CilentSpecifiedKey":"zxjtnews"}', setZxzxDlg);
        // calltql("CWServ.tdxi_zxjtzxnews", '{"Params":["1","1","41"],"CilentSpecifiedKey":"zxjtnews"}', setZxzxDlg);
        break;
        case 1: // 自选股，持仓股
        $("#more_bk").show();
        if(popHistory) {
            $("#more_dlg").css({
                "margin": "0",
                "left": popPosition.x>$(window).width()-50 ? $(window).width()-50 : popPosition.x + "px",
                "top": popPosition.y>$(window).height()-50 ? $(window).height()-50 : popPosition.y + "px"
            }).show(300);
        } else {
            $("#more_dlg").show(300);
        }
        if($("#zxg_zx")[0].style["border-bottom-width"] == "2px") {
            $("#more_head span").text("自选股资讯");
            callsys("INFO_FUNCZXGTitle", "", "1|10|-1|6", SetZxZxgDlg);
        } else {
            $("#more_head span").text("持仓股资讯");
            callsys("INFO_FUNCZXGTitle", "", "2|11|-1|6", SetZxZxgDlg);
        }
        break;
        case 2:
        $("#more_bk").show();
        if(popHistory) {
            $("#more_dlg").css({
                "margin": "0",
                "left": popPosition.x>$(window).width()-50 ? $(window).width()-50 : popPosition.x + "px",
                "top": popPosition.y>$(window).height()-50 ? $(window).height()-50 : popPosition.y + "px"
            }).show(300);
        } else {
            $("#more_dlg").show(300);
        }
        $("#more_head span").text("盘前参考");
        calltql("CWServ.tdxi_zxjtzx", '{"Params":["盘前参考","30"],"CilentSpecifiedKey":"pqck"}', setZxDlg);
        break;
        case 3:
        $("#more_bk").show();
        if(popHistory) {
            $("#more_dlg").css({
                "margin": "0",
                "left": popPosition.x>$(window).width()-50 ? $(window).width()-50 : popPosition.x + "px",
                "top": popPosition.y>$(window).height()-50 ? $(window).height()-50 : popPosition.y + "px"
            }).show(300);
        } else {
            $("#more_dlg").show(300);
        }
        $("#more_head span").text("焦点新闻");
        calltql("CWServ.tdxi_zxjtzx", '{"Params":["焦点新闻","30"],"CilentSpecifiedKey":"jdxw"}', setZxDlg);
        break;
        case 4:
        $("#more_bk").show();
        if(popHistory) {
            $("#more_dlg").css({
                "margin": "0",
                "left": popPosition.x>$(window).width()-50 ? $(window).width()-50 : popPosition.x + "px",
                "top": popPosition.y>$(window).height()-50 ? $(window).height()-50 : popPosition.y + "px"
            }).show(300);
        } else {
            $("#more_dlg").show(300);
        }
        $("#more_head span").text("要闻精华");
        calltql("CWServ.tdxi_zxjtzx", '{"Params":["要闻精华","30"],"CilentSpecifiedKey":"ywjh"}', setZxDlg);
        break;
        case 5:
        $("#more_bk").show();
        if(popHistory) {
            $("#more_dlg").css({
                "margin": "0",
                "left": popPosition.x>$(window).width()-50 ? $(window).width()-50 : popPosition.x + "px",
                "top": popPosition.y>$(window).height()-50 ? $(window).height()-50 : popPosition.y + "px"
            }).show(300);
        } else {
            $("#more_dlg").show(300);
        }
        $("#more_head span").text("机构热点");
        calltql("CWServ.tdxi_zxjtzx", '{"Params":["机构热点","30"],"CilentSpecifiedKey":"jgrd"}', setZxDlg);
        break;
        case 6:
        $("#more_bk").show();
        if(popHistory) {
            $("#more_dlg").css({
                "margin": "0",
                "left": popPosition.x>$(window).width()-50 ? $(window).width()-50 : popPosition.x + "px",
                "top": popPosition.y>$(window).height()-50 ? $(window).height()-50 : popPosition.y + "px"
            }).show(300);
        } else {
            $("#more_dlg").show(300);
        }
        $("#more_head span").text("盘后回顾");
        calltql("CWServ.tdxi_zxjtzx", '{"Params":["盘后回顾","30"],"CilentSpecifiedKey":"phhg"}', setZxDlg);
        break;
        case 7:
        $("#more_bk").show();
        if(popHistory) {
            $("#more_dlg").css({
                "margin": "0",
                "left": popPosition.x>$(window).width()-50 ? $(window).width()-50 : popPosition.x + "px",
                "top": popPosition.y>$(window).height()-50 ? $(window).height()-50 : popPosition.y + "px"
            }).show(300);
        } else {
            $("#more_dlg").show(300);
        }
        $("#more_head span").text("晨会晨报");
        calltql("CWServ.tdxi_zxjtzx", '{"Params":["晨会晨报","30"],"CilentSpecifiedKey":"chcb"}', setZxDlg);
        break;
        default:
        break;
    }
}
function setZxDlg(err, data) {
    var jsonData=$.parseJSON(data);
    if(jsonData.ErrorCode != "0"){
        $("#ZXDiv").html("<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td'>暂无未查询到相关记录</td><td class='title4_td'></td></tr></table>")
        return;
    }
    var eli = "";
    var data=parseData(jsonData.ResultSets);
    for(var i in data) {
        var v=data[i];
        var jumpurl='figs/web/html/zxdialog.htm';
        eli += '<li class="more-item"><a href="http://www.treeid/dlglocalurl##homepath##'+jumpurl+'?objid='+v[3]+','+v[0]+'" alt="'+v[1]+'" title="'+v[1]+'">'+v[1]+'</a><span>'+v[2]+'</span></li>';
    }
    $("#more_body").html(eli);
}
function setZxzxDlg(err, data) {
    var jsonData=$.parseJSON(data);
    if(jsonData.ErrorCode != "0"){
        $("#ZXDiv").html("<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td'>暂无未查询到相关记录</td><td class='title4_td'></td></tr></table>")
        return;
    }

    var eli = "";
    var data = jsonData.ResultSets[0].Content;
    for(var i in data) {
        if(i<6) continue;
        var v = data[i];
        var _time = v[1].substring(0, v[1].indexOf(" "));
        var jumpurl = 'http://www.treeid/dlglocalurl##homepath##figs/web/html/zxdialog.htm?objid=';
        eli += '<li class="more-item"><a href="' + jumpurl + v[3] + ',zxzx" title="' + v[0] + '">' + v[0] + '</a><span>' + _time + '</span></li>'
    }
    $("#more_body").html(eli);
}

function getZx(err, data) {
	// 资讯中心数据	
	var _firstInfoHtml = "";
	var _info = JSON.parse(data).ResultSets[0].Content;
	for(var i in _info) {
		if(i >= 6) {
			break;
		}
        if(i == 0) {
            _firstInfoHtml += '<li class="first-title"><a href="http://www.treeid/dlglocalurl##homepath##figs/web/html/zxdialog.htm?objid='+$.trim(_info[i][3])+',zxzx" title="'+_info[i][0]+'">';
            _firstInfoHtml += _info[i][0] + '</a></li>';
            _firstInfoHtml += '<li class="first-info">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            var _content = _info[i][2].length < 50 ? _info[i][2] : _info[i][2].substring(0, 49) + "...";
            _firstInfoHtml += _content;
            _firstInfoHtml += '</li>';
        } else {
    		_firstInfoHtml += '<li class="info-item"><a href="http://www.treeid/dlglocalurl##homepath##figs/web/html/zxdialog.htm?objid=';
    		_firstInfoHtml += $.trim(_info[i][3]);
    		_firstInfoHtml += ',zxzx" alt="' + _info[i][0] + '" ';
    		_firstInfoHtml += 'title="' + _info[i][0] + '">' + _info[i][0] + "</a></li>";
        }
	}
	$("#infomation").append(_firstInfoHtml);
}
// 自选股，持仓股资讯
function getZxCcZxinfo(tag, initMark) {
	if(initMark) {
		$("#ccg_zx").css({
			"border-width": '0',
            "color": "black"
		});
		$("#zxg_zx").css({
			"border-bottom": '2px solid rgb(216, 10, 48)',
            "color": "rgb(238, 36, 36)"
		});
		callsys("INFO_FUNCZXGTitle", "", "1|10|-1|6", SetINFOZXGTitle);
	} else {
		if(tag.id === 'zxg_zx') {
			$("#ccg_zx").css({
				"border-width": '0',
                "color": "black"
			});
			$(tag).css({
                "border-bottom": '2px solid rgb(216, 10, 48)',
                "color": "rgb(238, 36, 36)"
			});
            $("#zxcc_zxinfo").html('<div style="padding: 10px; font-size: 14px;">自选股资讯提示：<br>目前还没有自选股！</div>');
			callsys("INFO_FUNCZXGTitle", "", "1|10|-1|6", SetINFOZXGTitle);
		} else if(tag.id === 'ccg_zx') {
			$("#zxg_zx").css({
				"border-width": '0',
                "color": "black"
			});
			$(tag).css({
				"border-bottom": '2px solid rgb(216, 10, 48)',
                "color": "rgb(238, 36, 36)"
			});
            $("#zxcc_zxinfo").html('<div style="padding: 10px; font-size: 14px;">持仓股资讯提示：<br>请您先点击交易界面持仓菜单后刷新页面，我们将为您抓取最新的资讯信息!</div>');
			callsys("INFO_FUNCZXGTitle", "", "2|11|-1|6", SetINFOZXGTitle);
		}
	}
}

function SetZxZxgDlg(err, data) {
    try {
        var AnsJson = JSON.parse(data);
        var iNo = AnsJson["NO"];
        var txt = AnsJson["CONTENT"];
    }
    catch(err) {
        var iNo = data.match(/{"NO":"(\d+)","CONTENT"/)[1];
        var txt = data.substring(data.search(/"CONTENT":"/)+11, data.length-2);
    }
    var titles = txt.split("<br>");
    var zxgStr = "";
    if(titles.length == 0) {
        zxgStr = "<li style='text-align:center'>暂无未查询到相关记录</li>"
    } else {
        for(var i in titles) {
            var title = $.trim(titles[i]); //去掉空格
            if (title) {
                var fields = title.split("|");  //取出每条资讯的各个字段
                zxgStr += "<li class='more-item'>";
                // zxgStr += '<a href="http://www.treeid/infocontent_'+title.replace(/%/g,"％")+'" alt="'+fields[5]+'" title="'+fields[5]+'">'+fields[5]+'</a>';
                
                var _conTitle = fields[5].getBytesLength() === -1 ? fields[5] : fields[5].slice(0, fields[5].getBytesLength()) + "...";
                zxgStr += '<a href="http://www.treeid/infocontent_'+title.replace(/%/g,"％")+'" alt="'+_conTitle+'" title="'+_conTitle+'">'+_conTitle+'</a>';
                
                zxgStr += '<span>'+fields[3]+'</span>';
                zxgStr += "</li>";
            } 
        }
    }
    $("#more_body").html(zxgStr);
}
//写入自选股，持仓股请求数据
function SetINFOZXGTitle(err, data) {
    //解析协议
    try {
    	var AnsJson = JSON.parse(data);
    	var iNo = AnsJson["NO"];
    	var txt = AnsJson["CONTENT"];
    }
    catch(err) {
    	var iNo = data.match(/{"NO":"(\d+)","CONTENT"/)[1];
    	var txt = data.substring(data.search(/"CONTENT":"/)+11, data.length-2);
    }
    var titles = txt.split("<br>"); 	//取出每一行资讯
    var strZXG="";
    var _g_data=[];

    if ($.trim(txt) == "") {
    	strZXG = "<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td' style='padding: 10px; font-size: 14px;'>目前您还没有自选或持仓股票！</td><td class='title4_td'></td></tr></table>";
    }
    else{
    	strZXG+='<ul class="gzgzx_1">';
    	for (index in titles) {
    		if (iNo=="4"||iNo=="5")
    		{
                var title = $.trim(titles[index]); //去掉空格
                if (title) {
	                var fields = title.split("|");  //取出每条资讯的各个字段
	                var title='<a href="http://www.treeid/infocontent_'+title.replace(/%/g,"％")+'" alt="'+fields[5]+'" title="'+fields[5]+'">'+fields[5]+'</a>'
	                var data=[title,fields[3]]
	                _g_data.push(data)
	                continue;
	            }
        	}
            if (index > 5) //最多只显示10条好了
            	break;
            var title = $.trim(titles[index]); //去掉空格
            if (title) {
                var fields = title.split("|");  //取出每条资讯的各个字段
                var _conTitle = fields[5].getBytesLength() === -1 ? fields[5] : fields[5].slice(0, fields[5].getBytesLength()) + "...";
                strZXG+="<li>";
                strZXG+='<a href="http://www.treeid/infocontent_'+title.replace(/%/g,"％")+'" alt="'+_conTitle+'" title="'+_conTitle+'">'+_conTitle+'</a>';
                strZXG+='<span>'+fields[3]+'</span>';
                strZXG+="</li>"
            }
        }
        if (iNo=="4"||iNo=="5") {
        	ShowTest(iNo,_g_data);
        	return;
        }
        strZXG+="</ul>";
    }
    $("#zxcc_zxinfo").html(strZXG);
}

function parseData(data){
    var paDt = [];
    $.each(data, function(i,vd) {
        $.each(vd.Content,function(j,v) {
            if(v.length==4) {
                paDt.push(v);
            }
        })
    })
    return paDt;
}

var zxjt_zx1 = function(err, data) {
	var jsonData=$.parseJSON(data);
    if(jsonData.ErrorCode != "0"){
        $("#ZXDiv").html("<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td'>暂无未查询到相关记录</td><td class='title4_td'></td></tr></table>")
        return;
    }
    var strZXG="";
    var eli="";
    var data=parseData(jsonData.ResultSets);

    for (index in data) {
        if (index > 5) {break;}
        var v=data[index];

		var jumpurl='figs/web/html/zxdialog.htm';
        eli += '<li><a href="http://www.treeid/dlglocalurl##homepath##'+jumpurl+'?objid='+v[3]+','+v[0]+'" alt="'+v[1]+'" title="'+v[1]+'">&nbsp;&nbsp;<strong>·</strong>&nbsp;&nbsp;'+v[1]+'</a><span>'+v[2]+'</span></li>';
    }
    if(eli.length==0) {
        strZXG = "<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td'>暂无未查询到相关记录</td><td class='title4_td'></td></tr></table>";
    } else {
        strZXG += '<ul class="gzgzx_1 gzgzx_2">';
        strZXG += eli;
        strZXG += '</ul>';
    }
    $("#zx_pqck").html(strZXG);
}
var zxjt_zx2 = function (err, data)
{
    var jsonData=$.parseJSON(data);
    if(jsonData.ErrorCode!="0"){
        $("#ZXDiv").html("<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td'>暂无未查询到相关记录</td><td class='title4_td'></td></tr></table>")
        return;
    }
    var strZXG="";
    var eli="";
    var data=parseData(jsonData.ResultSets);
    for (index in data) {
        if (index > 5){break;}
        var v=data[index];
        var jumpurl='figs/web/html/zxdialog.htm';
        eli += '<li><a href="http://www.treeid/dlglocalurl##homepath##'+jumpurl+'?objid='+v[3]+','+v[0]+'" alt="'+v[1]+'" title="'+v[1]+'">&nbsp;&nbsp;<strong>·</strong>&nbsp;&nbsp;'+v[1]+'</a><span>'+v[2]+'</span></li>';
    }
    if(eli.length==0){
        strZXG = "<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td'>暂无未查询到相关记录</td><td class='title4_td'></td></tr></table>";
    } else {
        strZXG += '<ul class="gzgzx_1 gzgzx_2">';
        strZXG += eli;
        strZXG += '</ul>';
    }
    $("#zx_jdxw").html(strZXG);
}
var zxjt_zx3 = function (err, data)
{
    var jsonData=$.parseJSON(data);
    if(jsonData.ErrorCode!="0"){
        $("#ZXDiv").html("<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td'>暂无未查询到相关记录</td><td class='title4_td'></td></tr></table>")
        return;
    }
    var strZXG="";
    var eli=""
    var data=parseData(jsonData.ResultSets)

    for (index in data) {
        if (index > 5){break;}
        var v=data[index];
        var jumpurl='figs/web/html/zxdialog.htm'
        eli += '<li><a href="http://www.treeid/dlglocalurl##homepath##'+jumpurl+'?objid='+v[3]+','+v[0]+'" alt="'+v[1]+'" title="'+v[1]+'">&nbsp;&nbsp;<strong>·</strong>&nbsp;&nbsp;'+v[1]+'</a><span>'+v[2]+'</span></li>';
    }

    if(eli.length==0){
        strZXG = "<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td'>暂无未查询到相关记录</td><td class='title4_td'></td></tr></table>";
    } else {
        strZXG += '<ul class="gzgzx_1 gzgzx_2">';
        strZXG += eli;
        strZXG += '</ul>';
    }
    $("#zx_ywjh").html(strZXG);
}
var zxjt_zx4 = function (err, data)
{
    var jsonData=$.parseJSON(data);
    if(jsonData.ErrorCode!="0"){
        $("#ZXDiv").html("<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td'>暂无未查询到相关记录</td><td class='title4_td'></td></tr></table>")
        return;
    }
    var strZXG="";
    var eli=""
    var data=parseData(jsonData.ResultSets)

    for (index in data) {
        if (index > 5) {break;}
        var v=data[index];
        var jumpurl='figs/web/html/zxdialog.htm'
        eli += '<li><a href="http://www.treeid/dlglocalurl##homepath##'+jumpurl+'?objid='+v[3]+','+v[0]+'" alt="'+v[1]+'" title="'+v[1]+'">&nbsp;&nbsp;<strong>·</strong>&nbsp;&nbsp;'+v[1]+'</a><span>'+v[2]+'</span></li>';
    }

    if(eli.length==0){
        strZXG = "<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td'>暂无未查询到相关记录</td><td class='title4_td'></td></tr></table>";
    } else {
        strZXG += '<ul class="gzgzx_1 gzgzx_2">';
        strZXG += eli;
        strZXG += '</ul>';
    }
    $("#zx_jgrd").html(strZXG);
}
var zxjt_zx5 = function (err, data) {
    var jsonData = $.parseJSON(data);
    if (jsonData.ErrorCode != "0") {
        $("#ZXDiv").html("<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td'>暂无未查询到相关记录</td><td class='title4_td'></td></tr></table>")
        return;
    }
    var strZXG = "";
    var eli = ""
    var data = parseData(jsonData.ResultSets)

    for (index in data) {
        if (index > 5) { break; }
        var v = data[index];
        var jumpurl = 'figs/web/html/zxdialog.htm'
        eli += '<li><a href="http://www.treeid/dlglocalurl##homepath##' + jumpurl + '?objid=' + v[3] + ',' + v[0] + '" alt="' + v[1] + '" title="' + v[1] + '">&nbsp;&nbsp;<strong>·</strong>&nbsp;&nbsp;' + v[1] + '</a><span>' + v[2] + '</span></li>';
    }

    if (eli.length == 0) {
        strZXG = "<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td'>暂无未查询到相关记录</td><td class='title4_td'></td></tr></table>";
    } else {
        strZXG += '<ul class="gzgzx_1 gzgzx_2">';
        strZXG += eli;
        strZXG += '</ul>';
    }
    $("#zx_phhg").html(strZXG);
}

var zxjt_zx6 = function (err, data)
{
    var jsonData=$.parseJSON(data);
    if(jsonData.ErrorCode!="0"){
        $("#ZXDiv").html("<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td'>暂无未查询到相关记录</td><td class='title4_td'></td></tr></table>")
        return;
    }
    var strZXG="";
    var eli="";
    var data=parseData(jsonData.ResultSets);

    for (index in data) {
        if (index > 5){break;}
        var v=data[index];
        var jumpurl='figs/web/html/zxdialog.htm';
        var _pos = v[1].search(/-(\d){6}/);
        if(_pos != -1) {
        	var _txt = v[1].substring(0, _pos);
        	var _time = "20" + v[1].substring(_pos+1, _pos+3) + "-" + v[1].substring(_pos+3, _pos+5) + "-" + v[1].substring(_pos+5);
        	if(_time.length > 10) {
                _time.length = 10;
            }
            eli += '<li><a href="http://www.treeid/dlglocalurl##homepath##'+jumpurl+'?objid='+v[3]+','+v[0]+'" alt="'+v[1]+'" title="'+v[1]+'">&nbsp;&nbsp;<strong>·</strong>&nbsp;&nbsp;' + _txt + '</a><span>'+ _time +'</span></li>';
    	} else {
    		eli += '<li><a href="http://www.treeid/dlglocalurl##homepath##'+jumpurl+'?objid='+v[3]+','+v[0]+'" alt="'+v[1]+'" title="'+v[1]+'">&nbsp;&nbsp;<strong>·</strong>&nbsp;&nbsp;'+v[1]+'</a><span></span></li>';
    	}
    }
    if(eli.length==0){
        strZXG = "<table cellpadding='0' cellspacing='0' border='0'><tr><td class='title3_td'>暂无未查询到相关记录</td><td class='title4_td'></td></tr></table>";
    } else {
        strZXG += '<ul class="gzgzx_1 gzgzx_2">';
        strZXG += eli;
        strZXG += '</ul>';
    }
    $("#zx_chcb").html(strZXG);
}

function GraphShow(id) {
    var gpdm1 = '';
    var gpdm2 = '';

    var title = '';
    var gpname1 = '';
    var gpname2 = '';

    var sctype1 = '';
    var sctype2 = '';

    mry.curId = id;

    switch (id) {
        case "hq_sh":
            gpdm1 = '999999';
            gpname1 = '上证指数';
            title = '上证指数';
            gpdm2 = '399300';
            gpname2 = '沪深300';
            sctype1 = '1';
            sctype2 = '0';
            break;

        case "hq_sz":
            gpdm1 = '399001';
            gpname1 = '深证成指';
            title = '深证成指';
            gpdm2 = '399300';
            gpname2 = '沪深300';
            sctype1 = '0';
            sctype2 = '0';

            break;

        case "hq_zx":
            gpdm1 = '399005';
            gpname1 = '中小板指';
            title = '中小板指';
            gpdm2 = '399300';
            gpname2 = '沪深300';
            sctype1 = '0';
            sctype2 = '0';

            break;

        case "hq_cy":
            gpdm1 = '399006';
            gpname1 = '创业板指';
            title = '创业板指';
            gpdm2 = '399300';
            gpname2 = '沪深300';
            sctype1 = '0';
            sctype2 = '0';

            break;

        case "hq_300":
            gpdm1 = '399300';
            gpname1 = '沪深300';
            title = '沪深300';
            gpdm2 = '399300';
            gpname2 = '沪深300';
            sctype1 = '0';
            sctype2 = '0';

            break;

        case "hq_sz1":
            gpdm1 = '399106';
            gpname1 = '深圳指数';
            title = '深圳指数';
            gpdm2 = '399300';
            gpname2 = '沪深300';
            sctype1 = '0';
            sctype2 = '0';
            break;

        case "tz_wh":
            gpdm1 = 'tz_wh';
            gpname1 = '美元指数';
            title = '美元指数';
            sctype1 = '12';
            break;
        case "tz_qh":
            gpdm1 = 'tz_qh';
            gpname1 = '美元指数';
            title = '美元指数';
            sctype1 = '12';
            break;
        case "tz_qq":
            gpdm1 = 'tz_qq';
            gpname1 = '美元指数';
            title = '美元指数';
            sctype1 = '12';
            break;
    }

    _shname1 = gpname1;
    _shname2 = gpname1;
    _shname3 = gpname2;
    //填充数据
    if (gpdm1=="")
    {
        $('#wdcc_div').css("display","none");
    }
    else
    {
        if (gpdm1=="999999")
        {
            $('#wdcc_div').css("display","block");
            Insert_Data(tz_gz, gpdm1, sctype1);
        }
        else if (gpdm1=="399001")
        {
            $('#wdcc_div').css("display","block");
            Insert_Data(tz_gz, gpdm1, sctype1);
        }
        else if (gpdm1=="399005")
        {
            $('#wdcc_div').css("display","block");
            Insert_Data(tz_gz, gpdm1, sctype1);
        }
        else if (gpdm1=="399006")
        {
            $('#wdcc_div').css("display","block");
            Insert_Data(tz_gz, gpdm1, sctype1);
        }
        else if (gpdm1=="399300")
        {
            $('#wdcc_div').css("display","block");
            Insert_Data(tz_gz, gpdm1, sctype1);
        }
        else if (gpdm1=="399106")
        {
            $('#wdcc_div').css("display","block");
            Insert_Data(tz_gz, gpdm1, sctype1);
        }
        else if (gpdm1=="tz_wh")
        {
            var strdiv='<table width="100%" cellspacing="0" cellpadding="0">';
            strdiv+='<tbody>'
            strdiv+='<tr class="nb">'
            strdiv+='<td class="name">外汇</td>';
            strdiv+='<td class="name">最新价</td>';
            strdiv+='<td class="name">涨跌幅</td>';
            strdiv+='</tr>';

            strdiv+='<tr>'
            strdiv+='<td class="name">美元/人民币</td>';
            strdiv+='<td class="name" id="t_rmb1"></td>';
            strdiv+='<td class="name" id="t_rmb2"></td>';
            strdiv+='</tr>';

            strdiv+='<tr>'
            strdiv+='<td class="name">美元/港币</td>';
            strdiv+='<td class="name" id="t_mygb1"></td>';
            strdiv+='<td class="name" id="t_mygb2"></td>';
            strdiv+='</tr>';
            strdiv+='<tr>'
            strdiv+='<td class="name">英镑/美元</td>';
            strdiv+='<td class="name" id="t_ybmy1"></td>';
            strdiv+='<td class="name" id="t_ybmy2"></td>';
            strdiv+='</tr>';
            strdiv+='<tr>'
            strdiv+='<td class="name">欧元/美元</td>';
            strdiv+='<td class="name" id="t_oymy1"></td>';
            strdiv+='<td class="name" id="t_oymy2"></td>';
            strdiv+='</tr>';
            strdiv+='<tr>'
            strdiv+='<td class="name">美元/日元</td>';
            strdiv+='<td class="name" id="t_myry1"></td>';
            strdiv+='<td class="name" id="t_myry2"></td>';
            strdiv+='</tr>';

            strdiv+='</tbody></table>';
            $("#hqid").html(strdiv);

            
            Get_DPHQ2('111000', "10", tz_rmb);//人民币
            Get_DPHQ2('111001', "10", tz_myry);//美元日元
            Get_DPHQ2('111003', "10", tz_ybmy);//英镑美元
            Get_DPHQ2('111005', "10", tz_oymy);//欧元美元
            Get_DPHQ2('111010', "10", tz_mygb);//美元港币
        }
        else if (gpdm1=="tz_qh")
        {
            var strdiv='<table width="100%" cellspacing="0" cellpadding="0">';
            strdiv+='<tbody>'
            strdiv+='<tr class="nb">'
            strdiv+='<td class="name">期货</td>';
            strdiv+='<td class="name">最新价</td>';
            strdiv+='<td class="name">涨跌幅</td>';
            strdiv+='</tr>';

            strdiv+='<tr>'
            strdiv+='<td class="name">股指期货</td>';
            strdiv+='<td class="name" id="t_gz1"></td>';
            strdiv+='<td class="name" id="t_gz2"></td>';
            strdiv+='</tr>';

            strdiv+='<tr>'
            strdiv+='<td class="name">国债期货</td>';
            strdiv+='<td class="name" id="t_gz11"></td>';
            strdiv+='<td class="name" id="t_gz22"></td>';
            strdiv+='</tr>';

            strdiv+='</tbody></table>';
            $("#hqid").html(strdiv);
            Get_DPHQ2('IFL8', "47", tz_gz1);//股指期货
            Get_DPHQ2('TFL8',"47", tz_gz2);//国债期货
        }
        else if (gpdm1=="tz_qq")
        {
            var strdiv='<table width="100%" cellspacing="0" cellpadding="0">';
            strdiv+='<tbody>'
            strdiv+='<tr class="nb">'
            strdiv+='<td class="name">全球</td>';
            strdiv+='<td class="name">最新价</td>';
            strdiv+='<td class="name">涨跌幅</td>';
            strdiv+='</tr>';

            strdiv+='<tr>'
            strdiv+='<td class="name">道琼斯工业指数</td>';
            strdiv+='<td class="name" id="t_dqs1"></td>';
            strdiv+='<td class="name" id="t_dqs2"></td>';
            strdiv+='</tr>';

            strdiv+='<tr>'
            strdiv+='<td class="name">纳斯达克指数</td>';
            strdiv+='<td class="name" id="t_nsdk1"></td>';
            strdiv+='<td class="name" id="t_nsdk2"></td>';
            strdiv+='</tr>';
            strdiv+='<tr>'
            strdiv+='<td class="name">标普500</td>';
            strdiv+='<td class="name" id="t_bp1"></td>';
            strdiv+='<td class="name" id="t_bp2"></td>';
            strdiv+='</tr>';
            strdiv+='<tr>'
            strdiv+='<td class="name">恒生指数</td>';
            strdiv+='<td class="name" id="t_hszs1"></td>';
            strdiv+='<td class="name" id="t_hszs2"></td>';
            strdiv+='</tr>';
            strdiv+='</tbody></table>';
            $("#hqid").html(strdiv);
            Get_DPHQ2('A11', "12", tz_dqs);//道琼斯
            Get_DPHQ2('A12', "12", tz_nsdk);//纳斯达克
            Get_DPHQ2('A13', "12", tz_bp);//标普500
            Get_DPHQ2('HSI', "27", tz_hszs);//恒生指数
        }
    }
}

var _shrx = [];
var _gprx = [];
var _khh = '';

var _shname1 = "";
var _shname2 = "";
var _shname3 = "";

var _dnum = 0;
/*
 *  获取大盘行情数据
 */

function Get_DPHQ(gpdm, sctype, func_name) {
    var _params = JSON.stringify({
        "Code": gpdm,
        "Setcode": sctype,
        "Period": 4,  
        "WantNum": "20"
    });
    calltql("HQServ.FXT", _params, func_name)
}

function Get_DPHQ2(gpdm, sctype, func_name) {
    var _params = JSON.stringify({
        "Code": gpdm,
        "Setcode": sctype,
        "Period": 4,
        "ExHQFlag": 1,
        "WantNum": "20"
    });
    calltql("HQServ.FXT", _params, func_name)
}

/* 大盘行情数据获取  BEGIN */
function tz_my(err,data) {
    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (parse > 0) {
        _color = "red";
    } else if (parse < 0) {
        _color = "green";
    }

    $('#tz_span1').html(sh);
    $('#tz_span2').css({
        color: _color
    });
    $('#tz_span2').html(zf + '%');
}
function tz_rmb(err, data) {
    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;
    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var _color = "black";

    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }
    $('#t_rmb1').html(sh);
    $('#t_rmb2').css({
        color: _color
    });
    $('#t_rmb2').html(zf + '%');
}
function tz_oymy(err,data) {
    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }
    $('#t_oymy1').html(sh);
    $('#t_oymy2').css({
        color: _color
    });
    $('#t_oymy2').html(zf + '%');
}
function tz_ybmy(err,data) {
    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }
    $('#t_ybmy1').html(sh);
    $('#t_ybmy2').css({
        color: _color
    });
    $('#t_ybmy2').html(zf + '%');
}
function tz_mygb(err,data) {
    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }
    $('#t_mygb1').html(sh);
    $('#t_mygb2').css({
        color: _color
    });
    $('#t_mygb2').html(zf + '%');
}
function tz_myry(err,data) {
    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }
    $('#t_myry1').html(sh);
    $('#t_myry2').css({
        color: _color
    });
    $('#t_myry2').html(zf + '%');
}

// 获取股指数据返回处理函数
function tz_gz(err,data) {
    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];
    var idperfix = mry.curId.substr(3); // 去掉前面的 hq_ 得到后面的部分
    $("#" + idperfix + "_span1").html(parseFloat(curdata[5]).toFixed(2));
    var parse = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (parse > 0) {
        color = "red";
    } else if (parse < 0) {
        color = "green";
    }
    $("#" + idperfix + "_span2").html(parse + "%").css("color", color);

    var conf = {}
    conf.data = fFormatChartData(datalist); // 获得绘图数据
    DrawGraph(conf);
}
function tz_gz1(err, data) {

    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }
    $('#t_gz1').html(sh);
    $('#t_gz2').css({
        color: _color
    });
    $('#t_gz2').html(zf + '%');
}

function tz_gz2(err, data) {

    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }
    $('#t_gz11').html(sh);
    $('#t_gz22').css({
        color: _color
    });
    $('#t_gz22').html(zf + '%');
}
function tz_nsdk(err,data) {
    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }
    $('#t_nsdk1').html(sh);
    $('#t_nsdk2').css({
        color: _color
    });
    $('#t_nsdk2').html(zf + '%');
}
function tz_dqs(err,data) {
    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }
    $('#t_dqs1').html(sh);
    $('#t_dqs2').css({
        color: _color
    });
    $('#t_dqs2').html(zf + '%');
}
function tz_bp(err,data) {
    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }
    $('#t_bp1').html(sh);
    $('#t_bp2').css({
        color: _color
    });
    $('#t_bp2').html(zf + '%');
}
function tz_hszs(err,data) {
    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }
    $('#t_hszs1').html(sh);
    $('#t_hszs2').css({
        color: _color
    });
    $('#t_hszs2').html(zf + '%');
}

function sh_hq(err, data) {
    console.log("data"+data)
    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];
    var parse = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        color = "red";
    } else if (zf < 0) {
        color = "green";
    }
    $('#sh_span1').html(parseFloat(curdata[5]).toFixed(2));
    $('#sh_span2').html(parse + "%").css("color", color);
    var conf = {}
    conf.data = fFormatChartData(datalist); // 获得绘图数据
    DrawGraph(conf);
}

function sz_hq(err,data) {

    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }

    $('#sz_span1').html(sh);
    $('#sz_span2').css({
        color: _color
    });
    $('#sz_span2').html(zf + '%');
}

function zx_hq(err,data) {
    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }
    $('#zx_span1').html(sh);
    $('#zx_span2').css({
        color: _color
    });
    $('#zx_span2').html(zf + '%');
}

function cy_hq(err,data) {

    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }

    $('#cy_span1').html(sh);
    $('#cy_span2').css({
        color: _color
    });
    $('#cy_span2').html(zf + '%');
}

function hs_hq(err,data) {

    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }

    $('#300_span1').html(sh);
    $('#300_span2').css({
        color: _color
    });
    $('#300_span2').html(zf + '%');
}

function rm_hq(err,data) {

    var _tempJSON = $.parseJSON(data);
    var datalist = _tempJSON.List;

    // 获得当天的数据，计算涨跌幅
    var curdata = datalist[datalist.length - 1];

    var sh = parseFloat(curdata[5]).toFixed(2)
    var zf = ((curdata[5] - curdata[2]) / curdata[2] * 100).toFixed(2);
    var color = "black";
    if (zf > 0) {
        _color = "red";
    } else if (zf < 0) {
        _color = "green";
    }

    $('#sz1_span1').html(sh);
    $('#sz1_span2').html(zf + '%');
    $('#sz1_span2').css({
        color: _color
    });
}

/* 大盘行情数据获取  END */

function GetDetailZX() {
    //展示资讯
    var strZX="";
    strZX+="<ul>"

    strZX+='<li class="at" style="width:160px">';
    strZX+='<h4>';
    strZX+='<a href="#" id="CC">早盘新闻</a>';
    strZX+='</h4>';

    strZX+='<li style="width:160px">';
    strZX+='<h4>';
    strZX+='<a href="#" id="ZX">研究报告</a>';
    strZX+='</h4>';

    strZX+='<li style="width:160px">';
    strZX+='<h4>';
    strZX+='<a href="#" id="GZ">盘前分析</a>';
    strZX+='</h4>';

    strZX+="</ul>"
    $("#DetailZX").html(strZX);
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
function swtz(sid){
    switch(sid){
        case "1":
            return "保守型";
        case "2":
            return "稳健型";
        case "3":
            return "积极型";
        case "4":
            return "激进型";
        default:
            return "";
    }
}

// 作图函数
function DrawGraph(conf) {
    $("#wdcc_div").highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {},
        xAxis: {
            type: 'datetime',
            labels: {
                rotation: 0,
                align: 'center',
                style: {
                    padding: 7
                }
            },
            dateTimeLabelFormats: {
                day: '%e. %b'
            }
        },
        yAxis: {
            title: {
                text: '',
                style: {
                    color: '#fd0007'
                }
            },
            labels: {
                formatter: function () {
                    return this.value
                },
                style: {
                    color: '#fd0007'
                }
            },
            opposite: false
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                lineWidth: 1,
                marker: {
                    enabled: false
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: "area",
            remark: "收盘价",
            data: conf.data
        }]
    });
}

function Insert_Data(func_name,gpdm, sctype) {
    var _params = JSON.stringify({
        "Code": gpdm,
        "Setcode": sctype,
        "Period": 4,
        "WantNum": "20"
    });
    calltql("HQServ.FXT", _params, func_name)
}

function Insert_D1(data) {

    var _tempJSON = getResultList(data, false);
    var _fxt = _tempJSON[1]['FXTInfo'];

    _shrx.splice(0);
    _shrx = [];
    $.each(_fxt["Data"],
        function(m, n) {
            var rq = _fxt["Data"][m]["ymd"];
            var _y = parseInt(rq.substr(0, 4), 10);
            var _m = parseInt(rq.substr(4, 2), 10) - 1;
            var _d = parseInt(rq.substr(6), 10);
            var _c = parseFloat(_fxt["Data"][m]["Close"]);
            var _ary = [Date.UTC(_y, _m, _d), _c];
            _shrx.push(_ary);
        });
    Drawing(_shname1, _shname2, _shname3);
}

function Insert_D2(data) {
    //alert(data)
    var _tempJSON = getResultList(data, false);
    var _fxt = _tempJSON[1]['FXTInfo'];

    _gprx.splice(0);
    _gprx = [];
    $.each(_fxt["Data"],
        function(m, n) {
            var rq = _fxt["Data"][m]["ymd"];
            var _y = parseInt(rq.substr(0, 4), 10);
            var _m = parseInt(rq.substr(4, 2), 10) - 1;
            var _d = parseInt(rq.substr(6), 10);
            var _c = parseFloat(_fxt["Data"][m]["Close"]);
            var _ary = [Date.UTC(_y, _m, _d), _c];
            _gprx.push(_ary);
        });

    _dnum++;
    if (_dnum == 2) {
        Drawing(_shname1, _shname2, _shname3);
        _dnum = 0;
    }
}
/*
 * 画图
 */
function Drawing(dname, x_name, y_name) {
    $('#wdcc_div').highcharts({
        chart: {
            zoomType: 'xy',
            margin: [20, 20, 25,37]
        },
        title: {
            align: 'left',
            x: 15,
            y: 10,
            style: {
                color: '#3E576F',
                fontSize: '12px',
                fontWeight: 'bold'
            }
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            labels: {
                rotation: 0,
                align: 'center',
                style: {
                    padding: 7
                }
            },
            dateTimeLabelFormats: {
                day: '%e. %b'
            }
        },
        yAxis: [
        {
            title: {
                text: '',
                style: {
                    color: '#fd0007'
                }
            },
            labels: {
                formatter: function() {
                    return this.value
                },
                style: {
                    color: '#fd0007'
                }
            },
            opposite: false
        }],
        tooltip: {
            shared: true
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                lineWidth: 1,
                marker: {
                    enabled: false
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            remark: '收盘价',
            data: _shrx
        }]
    });
}

function Draw_2()
{
     $('#wdcc_div').highcharts({
        chart: {
            type: 'area'
        },
        title: {
            text: ''
        },
        xAxis: {
            labels: {
                formatter: function() {
                        return this.value;
                        }
                    }
        },
        yAxis: {
            title: { text: ''
            },
            labels: {
                formatter: function() {
                    return this.value / 1000;
                        }
                }
            },
        tooltip: {
            pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br>warheads in {point.x}'
        },
        plotOptions: {
            area: {
                pointStart: 2000,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 1,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [
            {
                data: [4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,33952,32049,33952]
            }
        ]
        }
    );
}
/**
* 获得绘图数据
*/
function fFormatChartData(datalist) {
    var data = [];
    $.each(datalist, function (index, rowdata) {
        var rq = rowdata[0].toString();
        var year = parseInt(rq.substr(0, 4), 10);
        var month = parseInt(rq.substr(4, 2), 10) - 1;
        var day = parseInt(rq.substr(6), 10);
        data.push([Date.UTC(year, month, day), parseFloat(rowdata[5])]);
    })

    return data;
}

function checkConfig(info) {
    var config = {};
    if(info) {
        var defaultUrl = "";
        if(info.defaultImgUrl.length) {
            if(info.defaultImgUrl[info.defaultImgUrl.length-1] != "/") {
                defaultUrl = info.defaultImgUrl + "/";
            } else {
                defaultUrl = info.defaultImgUrl;
            }
        }

        if(defaultUrl.length) {
            var banner = {
                imgSrc: [],
                url: []
            };
            for(var i in info.banner.imgSrc) {
                if(info.banner.imgSrc[i].indexOf("./") == -1 && info.banner.imgSrc[i].search(/http(s){0,1}:\/\//) == -1) {
                    banner.imgSrc.push(defaultUrl + info.banner.imgSrc[i]);
                } else {
                    banner.imgSrc.push(info.banner.imgSrc[i]);
                }
            }
            banner.url = info.banner.url;
            config.banner = banner;

            var ad = info.jt_ad;
            if(ad.imgSrc.indexOf("./") == -1 && ad.imgSrc.search(/http(s){0,1}:\/\//) == -1) {
                ad.imgSrc = defaultUrl + ad.imgSrc;
            }
            config.ad = ad;
            var ewm = info.ewm;
            for(var i in ewm.imgSrc) {
                if(ewm.imgSrc[i].indexOf("./") == -1 && ewm.imgSrc[i].search(/http(s){0,1}:\/\//) == -1) {
                    ewm.imgSrc[i] = defaultUrl + ewm.imgSrc[i];
                }
            }
            config.ewm = ewm;
            if(info.ad_item.indexOf("./") == -1 && info.ad_item.search(/http(s){0,1}:\/\//) == -1) {
                info.ad_item = defaultUrl + info.ad_item;
            }
            config.ad_item = info.ad_item;
            return config;
        } else {
            return info;
        }
    } else {
        return "error";
    }
}

function setConfigInfo(config) {  
    // 设置图片轮播
    // setImgCarousel(config.banner.imgSrc, "banner", config.banner.url, "");
    // 设置二维码
    var ewm1Html = '<img src="' + config.ewm.imgSrc[0] + '"><br><span>' + config.ewm.markInfo[0] + '</span>';
    var ewm2Html = '<img src="' + config.ewm.imgSrc[1] + '"><br><span>' + config.ewm.markInfo[1] + '</span>';
    $("#ewm1").html(ewm1Html);
    $("#ewm2").html(ewm2Html);
    // 设置广告
    if(config.ad.url.length) {
        $("#zxjt_ad2 .zxjt-ad2-img a").attr("href", "http://www.treeid/"+config.ad.url);
        $("#zxjt_ad2_title a").attr("href", "http://www.treeid/"+config.ad.url);
    }
    $("#zxjt_ad2 .zxjt-ad2-img img").attr("src", config.ad.imgSrc);
    $("#zxjt_ad2_title a").text(config.ad.title);
    $("#zxjt_ad2_title a").prop("title", config.ad.title);
    $("#zxjt_ad2_info").text(config.ad.info);
    $(".zxjt-ad2-link a").eq(0).text(config.ad.link.info);
    $(".zxjt-ad2-link a").eq(0).prop("title", config.ad.link.info);
    if(config.ad.link.url.length) {
        $(".zxjt-ad2-link a").eq(0).attr("href", "http://www.treeid/"+config.ad.link.url);
    }
    if(config.ad.link.info2) {
        $(".zxjt-ad2-link a").eq(1).prop("title", config.ad.link.info2);
        $(".zxjt-ad2-link a").eq(1).text(config.ad.link.info2);
    }
    if(config.ad.link.url2.length) {
        $(".zxjt-ad2-link a").eq(1).attr("href", "http://www.treeid/"+config.ad.link.url2);
    }

    $(".ad-item img").attr("src", config.ad_item);
}

// 阻止滚动事件
$.fn.scrollUnique = function() {
    return $(this).each(function() {
        var eventType = 'mousewheel';
        // 火狐是DOMMouseScroll事件
        if (document.mozHidden !== undefined) {
            eventType = 'DOMMouseScroll';
        }
        $(this).on(eventType, function(event) {
            // 一些数据
            var scrollTop = this.scrollTop,
                scrollHeight = this.scrollHeight,
                height = this.clientHeight;

            var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);        

            if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
                // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
                this.scrollTop = delta > 0? 0: scrollHeight;
                // 向上滚 || 向下滚
                event.preventDefault();
            }        
        });
    }); 
};

function getHomePic(err, data) {
    var _content = JSON.parse(data).ResultSets[0].Content;
    var _banner = [];       // 保存banner资源信息
    var _bannerUrl = [];    // 保存图片链接
    var bannerArr = [];     // banner信息，按指定顺序排序
    var changeTime = 3000;  // 初始化banner切换时间3s
    var fadeTime = 500;
    for(var i in _content) {
        if(_content[i][4] === "banner") {
            _banner[_content[i][3]-1] = [_content[i][1], _content[i][2]];
            _bannerUrl.push(_content[i][1]);
        } else if(_content[i][4] === "changetime") {
            changeTime = parseInt(_content[i][2]);
            fadeTime = parseInt(_content[i][3]);
        }
    }

    Promise.all([checkImage(_bannerUrl)]).then(function(data) {
        var result = data[0][2];
        for(var i in _banner) {
            if(_banner[i][0] && result.indexOf(_banner[i][0]) != -1) {
                bannerArr.push(_banner[i]);
            }
        }
        setBanner(bannerArr, changeTime, fadeTime);
    }, function(err) {
        console.log(err);
    });
}

/* 设置轮播图
 * config [Array] 包含图片链接和跳转地址信息
 * changeTime [int]  banner切换时间，单位ms
 * fadeTime  [int]  banner切换动作时间, 单位ms
 */
function setBanner(config, changeTime, fadeTime) {
    var bnNum = config.length;
    var bnHtml = '';
    bnHtml += '<div id="banner_arr">';

    var chHtml = '';
    chHtml += '<div id="banner_change">';

    for(var i=0; i<bnNum; i++) {
        var _url = "";
        config[i][1] ? config[i][1].indexOf("http://www.treeid/") != -1 ?
            _url = config[i][1] : _url = "http://www.treeid/" + config[i][1]
            : "javascript:void(0);";
        bnHtml += '<a href="' + _url + '">';
        bnHtml +=   '<img src="' + config[i][0] + '">';
        bnHtml += '</a>';

        chHtml += '<li class="banner-change-icon"></li>'
    }
    bnHtml += '</div>';
    chHtml += '</div>';

    $banner = $(bnHtml);
    $banner.css("width", bnNum*100 + "%").find("img").css("width", 1/bnNum*100 + "%");
    var $bannerChange = $(chHtml);
    $("#banner").empty().append($banner).append($bannerChange);
    $bannerChange.css("margin-left", $bannerChange.width()/2*(-1) + "px");
    $bannerChIco = $(".banner-change-icon");
    $bannerChIco.eq(0).css("background-color", "white");

    this.nowTag = 1;
    this.totleTag = bnNum;
    this.changeTime = changeTime;
    this.fadeTime = fadeTime;
    timeTicket = setTimeout(bannerSlide.bind(this), changeTime);
    var _that = this;

    $bannerChIco.each(function(index, el) {
        $(el).on("click", function(event) {
            event.stopPropagation();
            clearTimeout(timeTicket);
            $banner.fadeOut(this.fadeTime, function() {
                $banner.show().css("left", -1*index*100 + "%");
                $bannerChIco.eq(index).css("background-color", "white");
                timeTicket = setTimeout(bannerSlide.bind(this), this.changeTime);
            }.bind(this));
            $bannerChIco.eq(this.nowTag-1).css("background-color", "transparent");
            this.nowTag = index + 1;
        }.bind(_that));
    });

    function bannerSlide() {
        if(this.nowTag < this.totleTag) {
            $banner.animate({"left": -1*nowTag*100 + "%"}, this.fadeTime);
            $bannerChIco.eq(this.nowTag-1).css("background-color", "transparent");
            $bannerChIco.eq(this.nowTag).css("background-color", "white");
            this.nowTag++;
        }
        else {
            $banner.fadeOut(this.fadeTime, function() {
                $banner.show().css("left", "0");
                $bannerChIco.eq(0).css("background-color", "white");
            });
            $bannerChIco.eq(this.nowTag-1).css("background-color", "transparent");
            this.nowTag = 1;
        }
        timeTicket = setTimeout(arguments.callee, this.changeTime);
    }
}

/* 图片路径检查
 * PARAMS [array | string]
 */
function checkImage(/* string,[string] */) {
    function check(url) {       // 单张图片预加载检查
        return new Promise(function(resolve) {
            if(Object.prototype.toString.call(url).slice(8, -1).toLowerCase() === "string") {
                var imgTag = document.createElement("img");
                imgTag.src = url;
                imgTag.onload = function() {
                    resolve(url);
                }
                imgTag.onerror = function() {
                    resolve("error");
                }
            }
            else {
                resolve("error");
            }
        });
    }
    var _thisArguments = arguments;
    return new Promise(function(resolve) {
        if(_thisArguments.length === 1) {
            var imagesUrl = _thisArguments[0];
            var type = Object.prototype.toString.call(imagesUrl).slice(8, -1).toLowerCase();
            if(type === "string") {
                check(imagesUrl).then(function(data) {
                    if(data !== "error") {
                        resolve([1, 1, imagesUrl]);
                    } else {
                        resolve([1, 0, ""]);
                    }
                })
            }
            else if(type === "array") {
                var oginLen = imagesUrl.length;
                var resultArr = [];
                var _time = 0;
                for(var i=0; i<oginLen; i++) {
                    check(imagesUrl[i]).then(function(data) {
                        _time++;
                        if(data !== "error") {
                            resultArr.push(data);
                        }
                        if(_time >= oginLen) {
                            resolve([oginLen, resultArr.length, resultArr]);
                        }
                    });
                }
            }
        } else {
            var oginLen = _thisArguments.length;
            var resultArr = [];
            var _time = 0;
            for(var i=0; i<oginLen; i++) {
                check(_thisArguments[i]).then(function(data) {
                    _time++;
                    if(data !== "error") {
                        resultArr.push(data);
                    }
                    if(_time >= oginLen) {
                        resolve([oginLen, resultArr.length, resultArr]);
                    }
                });
            }
        }
    });
}

String.prototype.getBytesLength = function() {   
    var totalLength = 0;
    var _length = 0; 
    var _maxLengthMark = false;  
    var charCode;  
    for (var i = 0; i < this.length; i++) {  
        charCode = this.charCodeAt(i);  
        if (charCode < 0x007f)  {     
            totalLength++;     
        } else if ((0x0080 <= charCode) && (charCode <= 0x07ff))  {     
            totalLength += 2;     
        } else if ((0x0800 <= charCode) && (charCode <= 0xffff))  {     
            totalLength += 2;   
        } else{  
            totalLength += 3;   
        }
        if(totalLength < 63) {
            _length++;
        }
        if(totalLength >= 63) {
            _maxLengthMark = true;
            break;
        } 
    }  
    return _maxLengthMark ?  _length : -1; 
}