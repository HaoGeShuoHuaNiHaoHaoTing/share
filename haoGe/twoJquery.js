(function(window, undefined) {
    var jQuery = (function() {
        var jQuery = function(selector) {
            return new jQuery.fn.init(selector)
        };
        jQuery.fn = jQuery.prototype = {
            'name': 'tom',
            constructor: jQuery,
            init: function(selector) { //通过init构造函数可以保持生产选取到dom节点的对象
                if (selector === "undefined") { this.length = 0; return this; } //未选择
                if (selector.nodeType == 1) { this[0] = selector; } else { this[0] = document.getElementById(selector); } //这里this[0]指创建此jQuery实例对象的属性0，且访问格式只能是此jQuery对象[0]
                this.length = 1; //给jQuery对象添加一个length属性
            },
        };

        jQuery.fn.init.prototype = jQuery.prototype;

        console.log(jQuery.init);

        window.jQuery = window.$ = jQuery;
        return jQuery;
    })()
    console.log(jQuery.init)
})(window)