// 实现节流有两种方式，时间戳和定时器
// 时间戳 第一次立即执行 最后一次不执行，并且最后一次会在第二次触发事件时立即执行
function throttle0(func, wait) {
    let old = new Date().valueOf(),
        context, args;
    return function() {
        let now = new Date().valueOf();
        context = this;
        args = arguments;
        if (now - old > wait) {
            func.apply(context, args);
            old = now
        }
    }
}
// 定时器 第一次不会立即执行，最后一次会执行
function throttle1(func, wait) {
    let timeout;
    return function() {
        if (timeout) {
            return
        }
        let context = this;
        let args = arguments;
        timeout = setTimeout(function() {
            func.apply(context, args);
            timeout = null;
        }, wait)
    }
}
// 第一次执行，最后一次也执行
function throttle2(func, wait) {
    let old = 0,
        context, args, timeout;
    return function() {
        context = this;
        args = arguments;
        let now = new Date().valueOf();
        if (now - old > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            func.apply(context, args);
            old = new Date().valueOf();
        } else if (!timeout) {
            timeout = setTimeout(function() {
                func.apply(context, args);
                old = new Date().valueOf();
            }, wait)
        }
    }
}
// 所以利用时间戳和定时器的两种特点，可以实现自定义
// options.enter 第一次是否执行
// options.leaving:最后一次是否执行
function throttle(func, wait, options) {
    let old = 0,
        context, args, timeout;
    if (!options) options = null;
    console.log(options);
    return function() {
        context = this;
        args = arguments;
        let now = new Date().valueOf();
        if (options.enter === false && !old) {
            console.log(1);
            old = now;
        }
        if (now - old > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            func.apply(context, args);
            old = now;
        } else if (!timeout && options.leaving) {
            timeout = setTimeout(function() {
                func.apply(context, args);
                old = new Date().valueOf();
            }, wait)
        }
    }

}