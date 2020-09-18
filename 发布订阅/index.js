// let _Subscribe = (function() {
//     // 发布订阅类
//     // console.log("定义发布订阅类");
//     class Subscribe {
//         constructor() {
//                 // 创建一个事件池，用来存储后续需要执行的方法
//                 this.pond = [];

//             }
//             // 向事件池中追加方法
//         add(func) {
//                 if (typeof func === 'function') {
//                     let flag = this.pond.some(item => {
//                         return item === func
//                     });
//                     if (!flag) {
//                         this.pond.push(func);
//                         return
//                     }
//                     this.catch(new Error('You haved added the same function!'))

//                 } else {
//                     this.catch(new Error(func + ' is not a function!'))
//                 }
//             }
//             // 移除事件池中移除方法
//         remove(func) {
//                 // this.pond.splice(this.pond.indexOf(func), 1);
//                 // 防止数组塌陷
//                 this.pond[this.pond.indexOf(func)] = null;
//             }
//             // 通知事件池中的方法按照添加顺序执行
//         fire(...args) {
//             this.pond.forEach(item => {
//                 if (item === null) return
//                 item.call(this, ...args)
//                     // item.apply(this, args)
//                     // 三个以上的参数call性能更加好
//             })
//             this.removeNull()
//         }
//         catch (error) {
//             console.error(error);
//         }
//         removeNull() {
//             while (this.pond.indexOf(null) > 0) {
//                 this.pond.splice(this.pond.indexOf(func), 1);
//             }
//         }
//     }
//     // 暴露给外部使用
//     return function() {
//         console.log("You haved created pond successfully!");
//         return new Subscribe();
//     }
// })();

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
})("_Subscribe", function() {
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
            // this.pond.splice(this.pond.indexOf(func), 1);
            // 防止数组塌陷
            this.pond[this.pond.indexOf(func)] = null;
        }

        // 通知事件池中的方法按照添加顺序执行
        fire(...args) {
            this.pond.forEach(item => {
                if (item === null) return
                item.call(this, ...args)
                    // item.apply(this, args)
                    // 三个以上的参数call性能更加好
            })
            this.removeNull()
        }

        // 输出错误
        catch (error) {
            console.error(error);
        }

        //删除事件池中为null的元素
        removeNull() {
            while (this.pond.indexOf(null) > 0) {
                this.pond.splice(this.pond.indexOf(func), 1);
            }
        }
    }
    // 暴露给外部使用
    return function() {
        console.log("You haved created pond successfully!");
        return new Subscribe();
    }
})