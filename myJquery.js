(function(global, factory) {

    // 这个地方，缺commonJS module.exports
    // 将来补上
    "use strict";

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                if (!w.document) {
                    throw new Error("jQuery requires a window with a document");
                }
                return factory(w);
            }
    } else {
        factory(global);
    }

})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {

    var version = "3.2.1",
        jQuery = function(selector, context) {
            return new jQuery.fn.init(selector, context); // 选择器，jQuery继承jQuery.fn.init 的原型
        },
        // \s 空白符 \xA0 由十六进制数nn指定的拉丁字符，等价于\n 换行符
        // \uFEFF 由十六进制xxxx指定的Unicode字符，
        //\uFEFF（Unicode 编码：U+FEFF ）。它是 ES5 新增的空白符，叫「字节次序标记字符（Byte Order Mark）」，也就是 BOM字符；
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    // var init = jQuery.fn.init = function(selector, context, root) {

    // }

    var document = window.document;

    var arr = [];
    var slice = arr.slice;
    var concat = arr.concat;
    var push = arr.push;
    var indexOf = arr.indexOf;

    var getProto = Object.getPrototypeOf;
    var class2type = {}; // 先设置一个空对象，用来往里面放type
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString; // ?????????????????????不懂，为什么是hasOwnProperty.toString
    var ObjectFunctionString = fnToString.call(Object);

    var getProto = Object.getPrototypeOf;


    jQuery.fn = jQuery.prototype = {
        jquery: version, // 版本号
        toArray: function() {
            return slice.call(this);
        },
    };

    // 在介绍下面的内容之前，先来介绍一个 jQuery 中一个识别 Html 字符串的正则表达式，
    // var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    // rquickExpr.exec('<div>') //["<div>", "<div>", undefined]
    // rquickExpr.exec('<div></div>') //["<div></div>", "<div></div>", undefined]
    // quickExpr.exec('#id') //["#id", undefined, "id"]
    // rquickExpr.exec('.class') //null
    // 上面这一系列的正则表达式 exec，只是为了说明 rquickExpr 这个正则表达式执行后的结果，首先，如果匹配到，结果数组的长度是 3，如果匹配到 <div> 这种 html，数组的第三个元素是 underfined，如果匹配到 #id，数组的第二个元素是 underfined，如果匹配不到，则为 null。
    // 另外还有一个正则表达式：
    // var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );
    // rsingleTag.test('<div></div>') //true
    // rsingleTag.test('<div ></div>') //true
    // rsingleTag.test('<div class="cl"></div>') //false
    // rsingleTag.test('<div></ddiv>') //false

    var rootjQuery,
        rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
        init = jQuery.fn.init = function(selector, context, root) {
            var match, elem;

            // 处理$(''), $(null), $(undefined), $(false), $('')
            if (!selector) {
                return this; // 返回一个空的jQuery对象
            }

            root = root || rootjQuery; // 给个默认值，document
            // 处理html字符串情况，包括$('<div>), $('#id'), $('.class')
            if (typeof selector === "string") {
                if (selector[0] === "<" && // 如果是 `<...>` 这样
                    selector[selector - 1] === ">" &&
                    selector.length >= 3) {

                    match = [null, selector, null]; // 正则看不懂

                } else {
                    match = rquickExpr.exec(selector);
                }

                if (match && (match[1] || !context)) {

                }

            } else if (selector.nodeType) { // 通过nodeType 判断是否是 Dom元素
                this[0] = selector;
                this.length = 1;
                return this;
            } else if (jQuery.isFunction(selector)) { // 如果传入是函数（document ready的捷径）
                return root.ready !== undefined ? // 如果document.ready 存在
                    root.ready(selector) :
                    selector(jQuery) // 如果没有ready， 就直接执行
            }

            return jQuery.markeArray(selector, this);
        };
    // jQuery 是 jQuery.fn.init 的实例， 继承init的 原型， init.prototype 又等于 jQuery.fn, 又等于jQuery.prototype, 这样，jQuery对象就可以调用 jQuery的prototype中方法了
    init.prototype = jQuery.fn;
    // 初始化中央参考
    rootjQuery = jQuery(document);

    // 用来往jQuery中扩展方法
    jQuery.extend = jQuery.fn.extend = function() {
        var target = arguments[0] || {}, // 被扩展的对象
            length = arguments.length, // 参数的数量
            deep = false, // 是否深度操作
            i = 1;

        if (typeof target === "boolean") { // 如果传入第一个参数是布尔值
            deep = target; // 写错地方了，重新赋值给deep
            target = arguments[1] || {}; // target重新向下寻找
            i = 2; // 循环时，直接从第三个循环，循环要填上的属性，前两个target ，bealoon，要跳过
        }

        if (typeof target !== "object" && !jQuery.isFunction(target)) { // 如果target不是对象，也不是function，那就设置为空对象
            target = {};
        }

        if (length === i) { // 如果只用一个参数，那就把 this/调用这个方法的对象/jQuery对象，赋值给target，就是说，要往jQuery对象中扩展
            target = this; // 只传一个对象，则直接把这个对象，扩展到jQuery上
            --i; // 原本是1，变成0， 下面就可以循环了
        }
        var options, name, src, copy, copyIsArray, clone;
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name]; // 找到target 与 options 的属性值
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }

                    // 如果是深copy 递归 如果是纯对象 或者是纯数组
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) { // 如果是数组
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : []; // 如果被扩展的对象的属性，存在，并且是数组，那就保持原值，如果不是，clone赋值为空数组
                        } else { // 如果是对象
                            clone = src && jQuery.isPlainObject(src) ? src : {}; // 跟上面一样，如果被扩展对象的属性是对象， 那就用原对象，继续扩展，如果不是，就新建一个对象
                        }
                        // 使用递归，深度遍历 , 把
                        target[name] = jQuery.entend(deep, clone, copy);
                    } else if (copy !== undefined) { // 如果不是深拷贝
                        target[name] = copy; // 就直接赋值
                    }
                }
            }
        }
        return target;
    }

    jQuery.extend({ // 开始扩展方法了
        isArray: function() {

        },
        isEmptyObject: function(obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },
        isWindow: function(obj) {
            return obj != null && obj === obj.window;
        },
        each: function(obj, callback) {
            var length, i = 0;
            if (isArrayLike(obj)) { // 如果是类数组 用for循环
                length = obj.length;
                for (; i < length; i++) {
                    if (callback.call(obj[i], i, obj[i]) === false) { // call方法，是为了在执行时，this指向，指向value
                        break;
                    }
                }
            } else { // 如果是对象，就直接for in循环
                for (i in obj) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            }
            return obj;
        },
        map: function(elems, callback, arg) {
            var length, value,
                i = 0,
                ret = [];
            if (isArrayLike(elems)) { // 和each一样，如果是类数组，就普通for循环
                length = elems.length;
                for (; i < length; i++) {
                    value = callback.call(elems[i], i, arg); // 回掉函数传两个参数，一个是i，一个是传入的第三个参数 arg
                    if (value != null) {
                        ret.push(value);
                    }
                }
            } else {
                for (i in elems) {
                    value = callback.call(elems[i], i, arg);
                    if (value != null) {
                        ret.push(value);
                    }
                }
            }
            return concat.apply([], ret); // 使嵌套数组扁平化 只能变一级
        },
        type: function(obj) {
            if (obj == null) {
                return obj + ""; // 如果是undefined null ,就直接返回字符串
            }
            console.log(toString.call(obj))
            return typeof obj === "object" || typeof obj === "function" ? // 如果是复杂数据类型
                class2type[toString.call(obj)] || "object" :
                typeof obj // 如果是简单数据类型
        },
        isFunction: function(obj) {
            console.log(jQuery.type(obj));
            return jQuery.type(obj) === "function";
        },
        trim: function(text) {
            return text == null ?
                "" :
                (text + "").replace(rtrim, "");
        },
        isNumeric: function(obj) {
            var type = jQuery.type(obj);
            return (type === "number" || type === "string") &&
                !isNaN(obj - parseFloat(obj)); // parseFloat(数组) parseFloat(数组中第一元素)， 但是前面已经过滤掉数组了，所以没问题
        },
        isPlainObject: function(obj) { // 简单/纯粹的对象 e.g. `Object.create(null) || 通过 "{}" 或者 "new Object" 创建的`
            var proto, Ctor;
            if (!obj || toString.call(obj) != "[object Object]") {
                return false;
            }
            proto = getProto(obj);

            if (!prpto) { // 没有原型 直接返回true
                return true;
            }

            Ctor = hasOwn.call(proto, "constructor") && proto.constructor; // 如果有原型， 并且原型中有constructor,那么获取到
            return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString; // ?????????????????
        },
        merge: function(first, second) {
            var len = +second.length, // 为了把length变成数值型
                j = 0,
                i = first.length;
            for (; j < len; j++) {
                first[i++] = second[j];
            }
            first.length = i;
            return first;
        },
        inArray: function(elem, arr, i) {
            return arr == null ? -1 : indexOf.call(arr, elem, i);
        },
        markeArray: function(arr, results) {
            var ret = results || [];

            if (arr != null) { // 
                if (isArrayLike(Object(arr))) { // 如果是类数组，就直接merge ，不是的话，就push
                    jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
                } else {
                    push.call(ret, arr);
                }
            }
        },
        grep: function(elems, callback, invert) { // 选择出，满足条件的 数组中的元素
            var callbackInverse,
                matches = [],
                i = 0,
                length = elems.length,
                callbackExpect = !invert;
            // 如果传true, 就把返回false 的返回
            for (; i < length; i++) {
                callbackInverse = !callback(elems[i], i);
                if (callbackInverse !== callbackExpect) { // 如果传true, 就取反
                    matches.push(elems[i]);
                }
            }
            return matches;
        }

    })
    jQuery.extend({

    })
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
        function(i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        }
    )

    function isArrayLike(obj) { // 类型是数组， 或者length == 0 ，或者length是数值型，并且length-1 也在其中
        var length = !!obj && "length" in obj && obj.length,
            type = jQuery.type(obj);
        if (type === "function" || jQuery.isWindow(obj)) { // 如果是函数，或者是window， 直接false
            return false;
        }
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    }

    if (typeof define === "function" && define.amd) { // 定义一个模块‘jquery’， 依赖于[ ]， 
        define("jquery", [], function() {
            return jQuery;
        })
    }




    var
        _jQuery = window.jQuery, // 在覆盖的情况下映射$
        _$ = window.$; // 用内部变量保存jQuery运行之前这两个全局变量的状态, 以便在后面的防冲突操作中还原这两个变量

    jQuery.noConflict = function(deep) {
        if (window.$ === jQuery) { // 这个函数，就用来处理变量名冲突的， 如果调用了，就把$ 这个变量，赋值回去
            window.$ = _$;
        }

        if (deep && window.jQuery === jQuery) { // 如果传入deep， 不仅$ 符号要变回去，jQuery也要变回去
            window.jQuery = _jQuery;
        }
    }


    if (!noGlobal) { // 这是最大函数中传得第二个参数，在module.exports 中传true，没进入判断
        window.jQuery = window.$ = jQuery;
    }
    return jQuery;
})