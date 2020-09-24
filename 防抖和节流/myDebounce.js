function debounce(func, wait, immediate = false) {
    let timeout, result;
    let debounced = function() {
            // 改变事件处理程序的this指向，使其按正常情况下指向事件绑定元素
            // 将参数也传递进来
            // console.log(arguments);
            let context = this;
            let args = arguments;
            clearTimeout(timeout);
            if (timeout) clearTimeout(timeout);
            if (immediate) {
                // 立即执行
                let flag = !timeout;
                timeout = setTimeout(() => {
                    timeout = null;
                }, wait);
                if (flag) {
                    result = func.apply(context, args)
                }
            } else {
                timeout = setTimeout(function() {
                    // 绑定作用域,并将参数传递进去
                    // 由于call传递的是一个数组参数，这里适合用apply
                    result = func.apply(context, args);
                }, wait)
            }
            return result
        }
        // 添加取消操作
    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    }
    return debounced
}

/***
 * 用到防抖的情况
 * 1.滚动操作
 * 2.搜索框输入查询
 * 3.表单验证
 * 4.按钮提交shijian
 * 5.浏览器缩放事件
 * 
 */