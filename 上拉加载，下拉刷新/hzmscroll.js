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
        let user = navigator.userAgent
        _this.user = {
            isIOS: user.match(/Mac OS X/) != null,
            isPC: (typeof window.orientation) === 'undefined',
            isAndroid: user.match(/Android/) != null,
        };
        if (_this.options) {
            _this.downOp = options.downRefrech;
            _this.upOp = options.upLoad;
        }
        // console.log(_this.downOp, _this.upOp);

        _this.init();
        _this.upLoad();
        _this.downRefresh();
    }

    // 初始化
    HzmScroll.prototype.init = function() {
        // 为容器设置样式
        this.scrollBody.classList.add("wrapper");
        // 为容器设置上拉刷新的元素
        // let domfrag = document.createDocumentFragment();
        // 上拉加载容器
        let wrapperDownwrap = document.createElement('div');
        wrapperDownwrap.className = "wrapper-downwrap";

        let downwarpContent = document.createElement("div");
        downwarpContent.className = "downwarp-content";
        // 上拉加载动画设置
        let downwarProgress = document.createElement('p');
        downwarProgress.className = "downwarp-progress";
        // 上拉加载文字提示
        let downwarptip = document.createElement('p');
        downwarptip.className = 'downwarp-tip';
        downwarpContent.appendChild(downwarProgress);
        downwarpContent.appendChild(downwarptip);
        wrapperDownwrap.appendChild(downwarpContent);
        this.scrollBody.insertBefore(wrapperDownwrap, this.scrollBody.childNodes[0]);
        // 为元素设置下拉加载的元素
        let wrapperUpwarp = document.createElement('div');
        wrapperUpwarp.className = "wrapper-upwarp";
        let upwarpProgress = document.createElement('p');
        upwarpProgress.className = "upwarp-progress";
        let upwarpTip = document.createElement('p');
        upwarpTip.className = "upwarp-tip";
        wrapperUpwarp.appendChild(upwarpProgress);
        wrapperUpwarp.appendChild(upwarpTip);
        this.scrollBody.appendChild(wrapperUpwarp);
        // 在实例中添加下拉刷新，上拉加载的元素节点
        this.wrapperDownwrap = wrapperDownwrap; //下拉刷新内容区
        this.downwarProgress = downwarProgress; //下拉刷新动画区
        this.downwarptip = downwarptip; //下拉刷新文本提示区

        this.wrapperUpwarp = wrapperUpwarp; //上拉加载内容区
        this.upwarpProgress = upwarpProgress; //上拉加载动画区
        this.upwarpTip = upwarpTip; //上拉加载文本提示区
        console.log("初始化完成！");
        // this.scrollBody.addEventListener("mou");
    }

    /** 
     * 初始化上拉加载（init中元素已经挂载好了，这里加事件）
     * 上拉加载的原理：
     * 滑动条到达页面底部，
     * pc端监听鼠标滚动，使用防抖函数控制只在一定时间内触发一次
     * 移动端监听touch事件，在touch事件结束后，确定是上拉的动作，执行回调函数。*/

    HzmScroll.prototype.upLoad = function() {
        let _this = this;

        function touchstartEvent(e) {
            // 触摸过程中，时刻记录y位置
            _this.scrollBody.addEventListener("mousemove", touchmoveEventThrottle);
            _this.scrollBody.addEventListener("touchmove", _this.myThrottle(touchmoveEvent, 60));
            _this.touchStartY = e.clientY || e.touches[0].pageY;
        }

        function touchmoveEvent(e) {
            // console.log(e);
            _this.touchEndY = e.clientY || e.touches[0].pageY;
            // _this.wrapperDownwrap.style.height = _this.touchStartY - _this.touchEndY + "px";
            let change = _this.touchEndY - _this.touchStartY
            if (change < 200) {
                _this.wrapperDownwrap.style.height = change + "px";
            }
            _this.downwarProgress.style.transform = `rotate(${change/300*360}deg)`;
        }
        let touchmoveEventThrottle = _this.myThrottle(touchmoveEvent, 60);

        function touchendEvent(e) {
            // console.log(e);
            _this.wrapperDownwrap.style.height = "100px";
            // 执行下拉刷新的回调
            if (_this.upOp.callback) {
                _this.downwarProgress.classList.add("change");
                _this.upOp.callback();
                _this.wrapperDownwrap.style.height = "0px";
            }
            _this.scrollBody.removeEventListener("mousemove", touchmoveEventThrottle)
            _this.scrollBody.removeEventListener("touchmove", touchmoveEventThrottle)
        }

        if (_this.user.isPC) {
            // pc端的处理
            if (_this.getScrollTop() <= 0) {

                // 开始触摸，记录下触摸y坐标
                _this.scrollBody.addEventListener("mousedown", touchstartEvent);

                // 触摸过程中，时刻记录y位置
                // _this.scrollBody.addEventListener("mousemove", touchmoveEventThrottle);

                //  触摸事件结束事件
                _this.scrollBody.addEventListener("mouseup", touchendEvent);
            }
        } else {
            if (_this.getScrollTop() <= 0) {

                // 开始触摸，记录下触摸y坐标
                _this.scrollBody.addEventListener("touchstart", touchstartEvent);

                //  触摸事件结束事件
                _this.scrollBody.addEventListener("touchend", touchendEvent);
            }
        }
    }



    // 初始化下拉刷新（init中元素已经挂载好了，这里加事件）
    /***
     * pc端和移动端都要进行滑动监听 scroll可以支持移动端和pc端
     * 
     */
    HzmScroll.prototype.downRefresh = function() {
        let _this = this;
        let scrollEvent = function() {
            if (_this.getScrollBottom()) {
                _this.upwarpProgress.style.visibility = 'visible';
                _this.upwarpProgress.classList.add("change");
            }
            // 执行下拉的回调
            if (_this.downOp.callback) {
                _this.downOp.callback();
            }
        }

        window.addEventListener("scroll", _this.myDebouce(scrollEvent, 400, true));


    }


    // 获取挂载元素
    HzmScroll.prototype.getDomById = function(id) {
        if (id) {
            if (typeof id === 'string') {
                // 如果是String类型，那么通过id找到该节点
                let dom = document.getElementById(id);
                // 如果文档中没有这个节点，会返回null;
                if (!dom) {
                    let err = new Error("找不到id为 " + id + " 的元素！")
                    this.catch(err);
                } else {
                    return dom
                }
            } else if (id.nodeType) {
                // 如果是dom对象,则直接赋值
                return id;
            }
        }
    }

    // 得到滚动条距离滚动区域顶部的距离
    HzmScroll.prototype.getScrollTop = function() {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }

    // 获取当前可视范围的高度
    HzmScroll.prototype.getClientHeight = function() {
        var clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
        } else {
            clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        }
        return clientHeight;
    }

    // 获取文档完整高度
    HzmScroll.prototype.getScrollHeight = function() {
        if (document.body) {
            return Math.max(document.body.scrollHeight, document.body.clientHeight);
        } else {
            return Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight);
        }

    }

    // 获取滚动条是否到达滚动区底部
    HzmScroll.prototype.getScrollBottom = function() {
        let _this = this;
        // console.log(_this.getScrollTop(), _this.getClientHeight(), _this.getScrollHeight());
        return _this.getScrollTop() + _this.getClientHeight() === _this.getScrollHeight() ? true : false
    }

    // 防抖函数处理 ,我们需要立即执行的防抖函数
    HzmScroll.prototype.myDebouce = function(func, wait, immediaty) {
        let timer = null;
        return function() {
            let args = arguments;
            if (timer) clearTimeout(timer);
            if (immediaty && !timer) {
                timer = setTimeout(() => {
                    timer = null;
                }, wait);
                func.call(this, args);
            } else {
                timer = setTimeout(() => {
                    func.call(this, args);
                }, wait)
            }
        }
    }

    // 节流函数处理
    HzmScroll.prototype.myThrottle = function(func, wait) {
        let old = 0;
        return function() {
            let now = new Date().valueOf();
            let args = arguments;
            if (now - old >= wait) {
                func.apply(this, args);
                old = now;
            }
        }
    }

    // 用于捕获输出错误
    HzmScroll.prototype.catch = function(error) {
        console.error(error);
    }

    return HzmScroll;
});