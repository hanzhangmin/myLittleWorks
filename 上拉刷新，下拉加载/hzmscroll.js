(function(name, definition) {
    if (typeof define === 'function') {
        // AMD环境或CMD环境
        define(definition);
    } else if (typeof module !== 'undefined' && module.exports) {
        // 定义为普通Node模块
        module.exports = definition();
    } else {
        // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
        this[name] = definition();
    }
})("HzmScroll", function() {
    var HzmScroll = function(scrollId, options) {
        var _this = this;
        _this.version = "0.0.1";
        _this.scrollBody = _this.getDomById(scrollId);
        _this.options = options || {};

    }
    HzmScroll.prototype.getDomById = function(id) {
        if (id) {
            if (typeof id === 'string') {
                // 如果是String类型，那么通过id找到该节点
                let dom = document.getElementById(id);
                // 如果文档中没有这个节点，会返回null;
                if (!dom) {
                    throw new Error("ocument.getElementById(" + id + "}) is null!")
                } else {
                    return dom
                }
            } else if (id.nodeType) {
                // 如果是dom对象,则直接赋值
                return id;
            }
        }
    }
});