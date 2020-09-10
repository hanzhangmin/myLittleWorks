// 实现节流有两种方式，时间戳和定时器
// 时间戳 最后一次不执行，并且最后一次会在第二次触发事件时立即执行
function throttle0(func, wait) {
    let old = new Date().valueOf(),
        context, args;
    // old = new Date().valueOf()，第一次不会立即执行
    // old = 0,第一次会立即执行
    return function() {
        // 获取时间戳
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
function throttle(func, wait) {
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
// 所以利用时间戳和定时器的两种特点，可以实现自定义