(function (global) {

    // 工具组件
    var utils = {};

    /**
    * 获取全局唯一的 ID，每次自增 1
    * 如果入参为空，则返回一个 36 进制字符串
    * 如果指定入参为 `"number"` 则返回一个数字类型
    * @param  {String}  type 指定返回类型
    * @return {String|Number}   返回全局ID，类型视入参而定
    */
    utils.getUID = (function () {
        var id = 0;
        return function (type) {
            if (type === 'number') {
                return id++;
            }
            return ('0000000' + (id++).toString(36)).substr(-8);
        };
    } ());

    /**
    * 将函数封装成一个全局函数，该全局函数在执行过后就会销毁
    * @param  {Function} fn 需要封装的函数
    * @return {String}      全局函数的名称（确保唯一和特殊）
    */
    utils.wrapFn = function (fn) {
        // 如果fn不是一个函数，则直接返回
        if (typeof fn !== 'function') {
            return fn;
        }
        // 生成一个全局唯一的随机名称，将函数绑定到根作用域下
        var globalName = 'globalAnonymous$$' +
    utils.getUID() +
    '$' + Math.random().toString(16).substr(3, 6);
        global[globalName] = function (stream) {
            fn.call(this, stream);
            delete global[globalName];
        };
        return globalName;
    };

    /**
    * 将 url 的附带参数转化成 JSON 对象
    * @param  {String} str 类似于`"name=abc&age=12"`
    * @return {JSON}     JSON键值对
    */
    utils.queryToJson = function (str) {
        return str.split('&').reduce(function (prev, curr) {
            curr = curr.split('=');
            prev[curr[0]] = curr[1];
            return prev;
        }, {});
    };

    /**
    * 将 JSON 对象转换成 url 查询字符串
    * @param  {JSON} obj JSON键值对
    * @return {String}     查询串
    */
    utils.jsonToQuery = function (obj) {
        var ret = [];
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                ret.push(key + '=' + obj[key]);
            }
        }
        return ret.join('&');
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
    //
    //
    // :: cookies.js ::
    //
    // A complete cookies reader/writer framework with full unicode support.
    //
    // Revision #1 - September 4, 2014
    //
    // https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
    // https://developer.mozilla.org/User:fusionchess
    //
    // This framework is released under the GNU Public License, version 3 or later.
    // http://www.gnu.org/licenses/gpl-3.0-standalone.html
    //
    // Syntaxes:
    //
    // * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
    // * docCookies.getItem(name)
    // * docCookies.removeItem(name[, path[, domain]])
    // * docCookies.hasItem(name)
    // * docCookies.keys()
    //
    //
    var docCookies = {
        getItem: function (sKey) {
            if (!sKey) { return null; }
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        removeItem: function (sKey, sPath, sDomain) {
            if (!this.hasItem(sKey)) { return false; }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: function (sKey) {
            if (!sKey) { return false; }
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
        keys: function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            var nLen, nIdx;
            for (nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
            return aKeys;
        }
    };

    var hasLocalStorage = false;
    try {
        hasLocalStorage = typeof window.localStorage.getItem === 'function' && typeof window.localStorage.setItem === 'function';
    } catch (ex) {
        hasLocalStorage = false;
    }

    var defaultNS = 'unset';
    var defaultSplit = '.';

    var localSet = (function () {
        if (hasLocalStorage) {
            return function (ns, key, value) {
                ns = ns || defaultNS;
                key = ns + defaultSplit + key;
                return localStorage.setItem(key, value);
            };
        }

        return function (ns, key, value) {
            ns = ns || defaultNS;
            key = ns + defaultSplit + key;
            return docCookies.setItem(key, value);
        };
    } ());

    var localGet = (function () {
        if (hasLocalStorage) {
            return function (ns, key) {
                ns = ns || defaultNS;
                key = ns + defaultSplit + key;
                return localStorage.getItem(key);
            };
        }

        return function (ns, key) {
            ns = ns || defaultNS;
            key = ns + defaultSplit + key;
            return docCookies.getItem(key);
        };
    } ());
    function createListener(name) {
        var evt = $({});
        evt._on = evt.on;
        evt._unbind = evt.unbind;
        evt.once = function (type) {
            console.log(name + ' once ' + type);
            evt.one.apply(evt, arguments);
            return this;
        };
        evt.emit = function (type) {
            console.log(name + ' emit ' + type);
            evt.trigger.apply(evt, arguments);
            return this;
        };
        evt.on = function (type) {
            console.log(name + ' on ' + type);
            evt._on.apply(evt, arguments);
            return this;
        };
        evt.unbind = function (type) {
            console.log(name + ' unbind ' + type);
            evt._unbind.apply(evt, arguments);
            return this;
        };

        return evt;
    }

    function extendThis(t, evt) {
        t.once = function (eventName, callback) {
            evt.once(eventName, function (e, d) {
                callback(d);
            });
        };
        t.emit = evt.emit.bind(evt);
        t.on = function (eventName, callback) {
            evt.on(eventName, function (e, d) {
                callback(d);
            });
        };
        t.unbind = evt.unbind.bind(evt);
    }
    ////////////////////////////////
    // Simple login state manager //
    ////////////////////////////////
    // function StateManager(settings) {
    //   SimpleEvent.call(this);
    //   this.systemName = settings.system || 'tdx_default';
    //   this.stateKey = this.systemName + '_login_state';
    //   this.infoKey = this.systemName + '_login_info';
    //   this.state = 'init';
    // }

    // StateManager.prototype = SimpleEvent.prototype;

    // StateManager.prototype.checkState = function () {
    //   var loginState = docCookies.getItem(this.stateKey);
    //   var loginInfo = docCookies.getItem(this.infoKey);
    //   if (loginState !== this.state) {
    //     this.state = loginState === 'online' ? 'online' : 'offline';
    //     setTimeout(this.emit.bind(this, this.state, loginInfo), 10);
    //   }
    // };

    // StateManager.prototype.login = function (customLoginMethod) {
    //   var loginState = docCookies.getItem(this.stateKey);
    //   if (loginState === 'online') {
    //     return this.emit('online', docCookies.getItem(this.infoKey));
    //   }
    //   customLoginMethod.call(this, docCookies.getItem(this.infoKey), function (info) {
    //     // 用户自己实现登录方法，登录成功后返回对应的信息
    //     // 将该信息存放在 cookie 当中
    //     docCookies.setItem(this.stateKey, 'online');
    //     docCookies.setItem(this.infoKey, JSON.stringify(info));
    //     // 触发在线事件
    //     this.emit('online', docCookies.getItem(this.infoKey));
    //   }.bind(this));
    // };

    // StateManager.prototype.logout = function (customLogoutMethod) {
    //   // 调用用户自己实现的离线方法，通知服务器退出
    //   // 该方法里面需要回调，以发出离线事件
    //   customLogoutMethod.call(this, docCookies.getItem(this.infoKey), function () {
    //     docCookies.removeItem(this.stateKey);
    //     docCookies.removeItem(this.infoKey);
    //     this.emit('offline');
    //   });
    // };

    /**
    * 无需关心会话保持的调用请求接口集合
    * 调用参数格式统一如下：
    * @type {Object}
    */
    var rapidCalls = {};

    /**
    * TDXW/FC 客户端里面的 TQL 调用接口
    * @param {String}   entry    功能入口，类似于`"HQServ:FXT"`或`"HQServ.ZST"`
    * @param {String}   stream   功能入参数据，一般为使用`JSON.stringify`生成的字符串
    * @param {Function} callback 回调函数。请确保改参数为函数类型！（与旧接口有所区别，支持匿名函数）
    */
    rapidCalls.PC = function (entry, stream, callback) {
        global.external.CallTQL(utils.wrapFn(function (raw) {
            // 可在此处解析底层通信错误
            var errorInfo = null;
            callback(errorInfo, raw);
        }), entry, stream);
    };

    /**
    * TQL请求
    * 20150829支持多进程的Webkit版本
    * @param {String}   entry    功能入口
    * @param {String}   stream   数据
    * @param {Function} callback 回调函数
    */
    rapidCalls.PC2 = function (entry, stream, callback) {
        function once(fn) {
            var called = false;
            return function () {
                if (called) {
                    console.warn('重复的回调: ', fn.name);
                    return;
                }
                called = true;
                return fn.apply(this, arguments);
            };
        }
        var request = {
            Method: 'CallTQL',
            FuncName: entry,
            Param: stream
        };
        callback = once(callback);
        window.TDXQuery({
            request: JSON.stringify(request),
            onSuccess: function (response) {
                callback(null, response);
            },
            onFailure: function (errCode, errInfo) {
                callback(errInfo || '底层错误(TDXQuery)', errCode);
            }
        });
    };

    rapidCalls.PC3 = function (methodname, FuncName, parmas, callback) {
        console.log("methodname: " + methodname);
        console.log("parmas: " + parmas);
        function once(fn) {
            var called = false;
            return function () {
                if (called) {
                    console.warn('重复的回调: ', fn.name);
                    return;
                }
                called = true;
                return fn.apply(this, arguments);
            };
        }
        var request = {
            Method: methodname,
            FuncName: FuncName,
            Param: String(parmas)
        };
        callback = once(callback);
        window.TDXQuery({
            request: JSON.stringify(request),
            onSuccess: function (response) {
                callback(null, response);
            },
            onFailure: function (errCode, errInfo) {
                callback(errInfo || '底层错误(TDXQuery)', errCode);
            }
        });
    };

    /*rapidCalls.PC3 = function (methodname,parmas callback) {
    var request = {
    Method: methodname,
    FuncName: '',
    Param: parmas
    };

    window.TDXQuery({
    request: JSON.stringify(request),
    onSuccess: function (response) {
    callback(null, response);
    },
    onFailure: function (errCode, errInfo) {
    callback(errInfo || '底层错误(TDXQuery)', errCode);
    } 
    })
    };*/

    /*jslint unparam: true*/

    /**
    * Android 客户端的 TQL 接口
    */
    rapidCalls.Android = function (entry, stream, callback) {
        var originCallbackName = utils.wrapFn(function (formid, funcid, flagtype, _data) {
            // 可在此处解析底层通信错误
            var errorInfo = null;
            callback(errorInfo, _data);
        });
        global.tdx_java.Android_SendData('x', entry, 'TP', stream.length, stream, originCallbackName);
    };

    /**
    * iOS 客户端的 TQL 接口
    */
    rapidCalls.iOS = function (entry, stream, callback) {
        var originCallbackName = utils.wrapFn(function (formid, funcid, flagtype, _data, callbackName) {
            // 可在此处解析底层通信错误
            var errorInfo = null;
            callback(errorInfo, _data);
        });
        /*
        通过 iframe 设置 src 的方式发起请求
        参数顺序：
        1. *全局回调函数名称
        2. 回调顺序索引（不再需要）
        3. 用于获取实际回调函数的索引（不再需要）
        4. *TQL 调用接口
        5. *调用参数（是否需要进行编码，防止同时出现两个分号）
        6. 回调函数名称（不再需要）
        */
        var sender = document.createElement('IFRAME');
        var url = 'js-frame:' + [originCallbackName, 0, 'fn', entry, stream, 'x'].join(';;');
        sender.setAttriute('src', url);
        document.documentElement.appendChild(sender);
        sender.parentNode.removeChild(sender);
        sender = null;
    };

    function tqlex(options) {
        options.path = options.path || '/TQLEX';
        $.ajax({
            url: options.path + '?Entry=' + options.entry,
            data: options.data,
            type: 'POST',
            success: function (res) {
                options.callback(null, res);
            },
            error: function (xhr, state, err) {
                options.callback(err, null);
            }
        });
    }
    /*jslint unparam: false*/
    //////////////////////
    // WEBSOCKET CLIENT //
    //////////////////////

    function WSClient(settings) {
        settings = settings || {};
        var ce = createListener('ws-client');
        extendThis(this, ce);

        // 默认参数
        this.heartbeatInterval = settings.heartbeat || 10 * 1000; // 默认每 10 秒发送一次
        this.touchState = false;
        this.heartbeat = false;
        this.infoKey = 'ws_client_login_info';

        // 初始化 WebSocket
        // 参数解析
        var protocol = settings.protocol || 'ws';
        var ip = settings.ip || '127.0.0.1';
        var port = settings.port || '7616';
        var path = settings.path || '/WS';
        var url = protocol + '://' + ip + ':' + port + path;
        var ws = new WebSocket(url);

        var self = this;

        // WebSocket 相关事件绑定
        ws.onopen = function () {
            ws.send('touch');
        };
        ws.onclose = function (e) {
            self.status = false;
            self.emit('close', e);
        };
        ws.onerror = function (e) {
            self.status = false;
            self.emit('error', e);
        };
        ws.onmessage = function (event) {
            var res = event.data;

            var backEvent = res.split('?')[0];
            res = res.substr(backEvent.length + 1);

            var backInfo = res.split('|')[0];
            res = res.substr(backInfo.length + 1);
            backInfo = utils.queryToJson(backInfo);

            var emitEventName;
            if (backEvent === 'TQL') {
                emitEventName = 'TQL:' + backInfo.TransKey;
            } else {
                emitEventName = backEvent;
            }

            self.emit(emitEventName, {
                info: backInfo,
                data: res
            });
        };

        this.ws = ws;
        this.on('touch', function () {
            self.touchState = true;
            if (self.heartbeat === false) {
                self.heartbeat = true;
                self.heartbeatHandle = setInterval(self.ws.send.bind(self.ws, 'alive'), self.heartbeatInterval);
            }
        });
    }

    WSClient.prototype.CallTQL = function (entry, stream, callback) {
        // 首先检查状态
        // 应该使用 nextTick 代替 setTimeout，否则有可能出现时序问题
        if (!this.ws || typeof this.ws.readyState !== 'number') {
            return setTimeout(callback.bind(null, 'The connection is not yet open.', null), 0);
        }
        if (this.ws.readyState === 0) {
            return setTimeout(callback.bind(null, 'The connection is not yet open.', null), 0);
        }
        if (this.ws.readyState === 2) {
            return setTimeout(callback.bind(null, 'The connection is in the process of closing.', null), 0);
        }
        if (this.ws.readyState === 1 && this.touchState === false) {
            return setTimeout(this.CallTQL.bind(null, entry, stream, callback), 500);
        }
        if (this.ws.readyState === 3) {
            return setTimeout(callback.bind(null, 'The connection is closed or couldn\'t be opened.', null), 0);
        }

        var id = utils.getUID('number');
        var eventName = 'TQL:' + id;
        var wsSendStr = '';
        wsSendStr += 'TQL?';
        wsSendStr += utils.jsonToQuery({
            TransKey: id,
            Entry: entry
        }) + '|';
        wsSendStr += stream;
        this.ws.send(wsSendStr);
        this.on(eventName, function (event) {
            callback(null, event.data, event.info);
        });
    };

    WSClient.prototype.login = function (customLoginMethod) {
        customLoginMethod.call(this, docCookies.getItem(this.infoKey), function (info) {
            docCookies.setItem(this.infoKey, info);
            this.emit('online', docCookies.getItem(this.infoKey));
        });
    };

    /*jslint unparam: true*/

    /**
    * 1. TOUCH 对应 ts 的 session 创建
    * 2. ACL:Checkuser 对应 ts 的 manageUser
    */

    var AjaxTSClient = (function () {
        var baseInfo = '';
        function genBaseInfo(info) {
            var ret = [];
            var key;
            for (key in info) {
                if (info.hasOwnProperty(key)) {
                    ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(info[key]));
                }
            }
            return ret.join('&');
        }

        function systemOnError(err) {
            var isReconnectError = this.state === 'reconnect';
            console.log('error >>', arguments);

            if (!isReconnectError) {
                this.state = 'error';
                this.emit('error', err);
            }
        }

        function systemOnAlive() {
            this.state = 'alive';
            console.log('alive >>', arguments);
            this.emit('alive');

            // 检查是否有缓存的请求
            if (Array.isArray(this.caches)) {
                this.caches.forEach(function (cache) {
                    this.send.apply(this, cache.args);
                }, this);
                this.caches = [];
            }
        }

        function wrapErrorCallback(fn) {
            return function (xhr) {
                var res = xhr.responseText;
                var status = xhr.status;
                if (status < 100) {
                    return fn('NET_ERR_' + status + ': 客户端网络错误，请检查网络连接');
                }
                if (status < 200) {
                    return fn('INFO_ERR_' + status + ': 应答错误');
                }
                if (status < 300) {
                    return fn('AJAX_ERR_' + status + ': ' + xhr.statusText);
                }
                if (status < 400) {
                    return fn('REDIRECT_ERR_' + status + ': 重定向错误');
                }
                if (status < 500) {
                    return fn('CLIENT_ERR_' + status + ': 访问错误');
                }
                return fn('SERVER_ERR_' + status + ': ' + res);
            };
        }

        // 用于 touch 和 alive 的函数
        // type : TOUCH or ALIVE
        function tsAjax(type, callback) {
            console.log('cookie before send ' + type + ': ' + document.cookie);
            var options = {
                type: 'GET',
                url: '/' + type + '?' + (type === 'TOUCH' ? baseInfo : '')
            };
            options.success = function (raw) {
                console.log('cookie after send ' + type + ': ' + document.cookie);
                if (raw.length > 0 && raw.substr(2, 5) !== '-5100') {
                    callback('TS_ERROR:' + raw);
                } else {
                    callback(null);
                }
            };
            options.error = wrapErrorCallback(callback);
            $.ajax(options);
        }

        function aliveFn(err) {
            this.lastCallTime = +(new Date());
            if (err) {
                this.evt.emit('error', err);
            } else {
                this.evt.emit('alive');
                clearTimeout(this.heartbeatTick);
                this.heartbeatTick = setTimeout(tsAjax.bind(null, 'ALIVE', aliveFn.bind(this)), 20 * 1000);
            }
        }

        // constructor
        function Client() {
            this.state = 'init';
            this.heartbeatTick = -1;
            this.lastCallTime = 0;    // 上一次和服务器交互的时间
            this.evt = createListener('system');

            this.evt
      .on('error', function (event, data) {
          systemOnError.call(this, data);
      } .bind(this))
      .on('alive', function (event, data) {
          systemOnAlive.call(this, data);
      } .bind(this));

            var ce = createListener('user');
            this.cEvt = ce;
            extendThis(this, ce);

            baseInfo = genBaseInfo({
                Device: 'Browser',
                Ip: '0.0.0.0',
                Mac: '00-00-00-00-00-00-00-00',
                Build: 'WEB',
                Type: '41',
                Ver: '1.0.0',
                EP: '0'
            });
        }

        Client.prototype.connect = function (errPrefix) {
            errPrefix = errPrefix || '';
            if (errPrefix.length <= 0) {
                errPrefix = 'error';
            } else {
                errPrefix = errPrefix + '-error';
            }

            tsAjax('TOUCH', function (err) {
                err = err || '';
                var sessionExistError = 'SERVER_ERR_503: E|-5100|事务中间件正式版(-5100):创建SESSION失败(已经存在)';
                if (err.substr(0, 24) === sessionExistError.substr(0, 24)) {
                    err = null;
                }
                if (err) {
                    this.evt.emit(errPrefix, err);
                } else {
                    // 有可能会 set-cookie 失败，检测一下
                    var aspid = docCookies.getItem('ASPSessionID');
                    if (!aspid) {
                        this.evt.emit(errPrefix, 'Set-Cookie 失败');
                    } else {
                        aliveFn.call(this, err);
                    }
                }
            } .bind(this));

            return this;
        };

        // 重连逻辑
        Client.prototype.reconnect = function (times, callback) {
            callback = typeof callback === 'function' ? callback : function () { return false; };
            if (this.state === 'reconnect') {
                return this.nextTick(callback, '不要重复调用重连操作');
            }

            var trueOnError;

            function onError(event, err) {
                times -= 1;
                if (times <= 0) {
                    // 如果超过重连次数，调用回调函数
                    callback(err || '重连失败');
                    this.evt.unbind('reconnect-error', trueOnError);
                    this.state = 'error';
                } else {
                    // 继续尝试…
                    setTimeout(this.connect.bind(this, 'reconnect'), 1000);
                }
            }

            trueOnError = onError.bind(this);

            // 监听 alive 事件，一旦出现 alive 即认为与服务器连接已经成功
            // 因为 alive 事件是固定频率发出的，所以使用 once 绑定
            this.evt.once('alive', function () {
                // 清除 error 事件绑定记录
                this.evt.unbind('reconnect-error', trueOnError);
                callback(null);
            } .bind(this));

            // 监听 error 事件，如果连续出现 error 次数超过 times，则停止尝试
            times = Math.max(1, parseInt(times, 10) || 1);
            this.evt.on('reconnect-error', trueOnError);

            this.state = 'reconnect';
            this.connect('reconnect');
            return this;
        };

        // 重置连接，发送 quit 后马上发送 touch
        Client.prototype.resetConnect = function (callback) {
            clearTimeout(this.heartbeatTick);
            tsAjax('QUIT', function () {
                this.reconnect(1, callback);
            } .bind(this));
        };

        // 如果客户端状态为 init，缓存请求，直到 error 或 alive 再做处理
        // 如果客户端状态为 touch、alive，直接发送请求
        // 如果客户端状态为 error，下一时刻直接回调错误信息
        // 如果客户端状态为 reconnect，缓存请求，直到 error 或 alive
        Client.prototype.send = function (entry, data, fn) {
            if (this.state === 'init' || this.state === 'reconnect') {
                return this.cache(arguments);
            }

            if (this.state === 'error') {
                return this.nextTick(fn, '客户端连接服务器失败，请重连后再尝试。');
            }

            console.log('cookie before send tql: ' + document.cookie);

            // clearTimeout(this.heartbeatTick);
            // this.heartbeatTick = setTimeout(tsAjax.bind(null, 'ALIVE', aliveFn.bind(this)), 20 * 1000);
            $.ajax({
                url: '/TQL?Entry=' + entry,
                type: 'POST',
                data: data,
                success: fn.bind(null, null),
                error: wrapErrorCallback(function (err) {
                    // 遇到错误后，立马 TOUCH 一次，及时判断是否是服务器错误
                    if (this.state === 'alive') {
                        tsAjax('ALIVE', function (err) {
                            if (err) {
                                // 停止心跳
                                clearTimeout(this.heartbeatTick);
                                // 发出事件
                                this.evt.emit('error', err);
                            }
                        } .bind(this));
                    }
                    fn(err);
                } .bind(this))
            });

            return this;
        };
        // alias
        Client.prototype.CallTQL = Client.prototype.send;

        // 将请求进行缓存，等待适当时机重新调用
        Client.prototype.cache = function (args) {
            this.caches = this.caches || [];
            this.caches.push({
                args: args,
                timestamp: new Date()
            });
            console.log('cache.size = ' + this.caches.length);
            return this;
        };

        // 下一时刻调用
        Client.prototype.nextTick = function (callback) {
            var args = Array.prototype.slice.call(arguments, 1);
            setTimeout(function () {
                callback.apply(null, args);
            }, 0);
            return this;
        };

        // 从 cookie 取出信息进行无密码登录
        // Client.prototype.cookieLogin = function (callback) {
        //   var userInfo;
        //   try {
        //     userInfo = docCookies.getItem('ACL_CHECKUSER_REQ');
        //     userInfo = JSON.parse(userInfo);
        //   } catch (ex) {
        //     return this.nextTick(callback, '登录失败');
        //   }

        //   this.send('ACL:Checkuser', JSON.stringify([{
        //     Token: 'SSO-TOKEN,WITHOUT PASSWORD',
        //     TDXID: userInfo.TDXID,
        //     PWD: ''
        //   }]), callback);
        // };

        Client.prototype.login = function (data, callback) {
            var defaultData = {};
            // 合并默认参数
            var key;
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    defaultData[key] = data[key];
                }
            }
            this.send('ACL:checkuser', JSON.stringify([defaultData]), function (err, data) {
                if (!err) {
                    this.localSet('ACL_CHECKUSER_REQ', JSON.stringify(defaultData));
                    this.localSet('ACL_CHECKUSER_ANS', data);
                }
                callback(err, data);
            } .bind(this));
            defaultData.PWD = ''; // 清空密码字段
        };

        Client.prototype.getLoginHistory = function () {
            return {
                req: this.localGet('ACL_CHECKUSER_REQ'),
                ans: this.localGet('ACL_CHECKUSER_ANS')
            };
        };

        var namespace = 'TS_CLIENT';
        Client.prototype.localSet = function (key, value) {
            return localSet(namespace, key, value);
        };

        Client.prototype.localGet = function (key, defaultValue) {
            return localGet(namespace, key);
        };


        return Client;
    } ());
    /*jslint unparam: false*/

    //////////////////////
    // TS TOMCAT CLIENT //
    //////////////////////

    function AjaxTomcatClient(settings) {
        settings = settings || {};
        StateManager.call(this, settings);
        var self = this;
        var basePath = settings.basePath || '/tq';
        this.handle = {
            connect: basePath + '/Conn',
            execute: basePath + '/Exec',
            addJob: basePath + '/Add',
            pushMsg: basePath + '/Push',
            exit: basePath + 'Fakelogout'
        };

        this.ekey = '';
        this.ckey = '';
        this.ap = '';
        this.openid = settings.openid;

        this.connectTimes = 20;
        this.retryInterval = 2000;
        this.timeout = settings.timeout || 30000;

        (function connect() {
            /*jslint unparam: true*/
            $.ajax({
                url: self.handle.connect,
                type: 'POST',
                cache: false,
                timeout: self.timeout,
                data: { openid: self.openid },
                success: function (res) {
                    try {
                        res = $.parseJSON(res)[0];
                        var keys = ['ekey', 'ckey', 'ap'];
                        var i, len;
                        for (i = 0, len = keys.length; i < len; ++i) {
                            if (!res[keys[i]]) {
                                throw '没有获取到关键字段 ' + keys[i];
                            }
                        }
                    } catch (e) {
                        self.connectTimes -= 1;
                        if (self.connectTimes < 0) {
                            return self.emit('error', '无法连接服务器(conn)。' + e);
                        }
                        return setTimeout(connect, self.retryInterval);
                    }
                    self.ekey = res.ekey;
                    self.ckey = res.ckey;
                    self.ap = res.ap;
                    self.emit('touch');
                },
                error: function (xhr, state, err) {
                    self.connectTimes -= 1;
                    if (self.connectTimes < 0) {
                        return self.emit('error', '无法连接服务器(AJAX)。' + err);
                    }
                    return setTimeout(connect, self.retryInterval);
                }
            });
            /*jslint unparam: false*/

            self.on('touch', function () {
                // TODO:
                return false;
            });
        } ());
    }

    AjaxTomcatClient.prototype.ExecJob = function (entry, stream, callback) {
        /*jslint unparam: true*/
        $.ajax({
            url: this.handle.execute,
            type: 'POST',
            cache: false,
            data: {
                ap: this.ap,
                funcid: entry,
                bodystr: stream,
                timeout: this.timeout
            },
            success: function (res) {
                var prefix;
                try {
                    prefix = res.split('|')[0];
                    res = res.substr(prefix.length + 1);
                } catch (e) {
                    return callback('error', e);
                }
                callback(prefix, res);
            },
            error: function (xhr, state, err) {
                state = state === 'timeout' ? 'timeout' : 'error';
                callback(state, err);
            }
        });
        /*jslint unparam: false*/
    };

    AjaxTomcatClient.prototype.AddJob = function () {
        // TODO:
        return false;
    };

    // AjaxTomcatClient.prototype.CallTQL = function (entry, stream, callback) {
    //   var self = this;
    //   $.ajax({
    //     url: self.handle.execute,
    //     type: 'POST',
    //     cache: false,
    //     timeout: self.timeout,
    //     success: function () {
    //     }
    //   })
    // };
    /////////////
    // exports //
    /////////////

    // 包含会话管理的客户端
    global.CreateTDXClient = function (settings) {
        settings = settings || {};

        // 根据 settings.serverType 选择构造函数
        // 然后再绑定登录相关的处理
        switch (String(settings.serverType).toLowerCase()) {
            case 'tshttp':
                return new AjaxTSClient(settings);
            case 'tsws':
                return new WSClient(settings);
            case 'tomcat':
                return new AjaxTomcatClient(settings);
            default:
                return new AjaxTSClient(settings);
        }
    };

    // 无需会话管理的请求函数
    global.TDXClientLite = function (type) {
        // TODO:
        // 如果 type 为空
        // 自动根据浏览器标识或者其它特性进行智能识别

        switch (String(type).toLowerCase()) {
            case 'ios':
                return rapidCalls.iOS;
            case 'android':
                return rapidCalls.Android;
            case 'debug':
                return tqlex;
            case 'tqlex':
                return (function () {
                    return function (entry, data, callback) {
                        tqlex({
                            entry: entry,
                            data: data,
                            callback: callback
                        });
                    };
                } ());
            case 'vary':
                return (function () {
                    return rapidCalls.PC3;
                } ());
            default:
                return (function () {
                    if (window.hasOwnProperty('TDXQuery')) {
                        return rapidCalls.PC2;
                    }
                    return rapidCalls.PC;
                } ());
        }
    };

} (window));
