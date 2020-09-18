let _Subscribe = (function() {
    // 发布订阅类
    // console.log("定义发布订阅类");
    class Subscribe {
        constructor() {
                // 创建一个事件池，用来存储后续需要执行的方法
                this.pond = [];

            }
            // 向事件池中追加方法
        add(func) {
                if (typeof func === 'function') {
                    let flag = this.pond.some(item => {
                        return item === func
                    });
                    if (!flag) {
                        this.pond.push(func);
                        return
                    }
                    this.catch(new Error('You haved added the same function!'))

                } else {
                    this.catch(new Error(func + ' is not a function!'))
                }
            }
            // 移除事件池中移除方法
        remove(func) {
                this.pond.splice(this.pond.indexOf(func), 1);
            }
            // 通知事件池中的方法按照添加顺序执行
        fire(...args) {
            this.pond.forEach(item => {
                item.call(this, ...args)
                    // item.apply(this, args)
                    // 三个以上的参数call性能更加好
            })
        }
        catch (error) {
            console.error(error);
        }
    }
    // 暴露给外部使用
    return function() {
        console.log("You haved created pond successfully!");
        return new Subscribe();
    }
})();