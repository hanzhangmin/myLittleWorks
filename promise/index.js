let MyPromise = (function() {
    let PENDING = Symbol("PENDING");
    let FULFILLED = Symbol("FULFILLED");
    let REJECTED = Symbol("REJECTED");

    function isFunction(fun) {
        return typeof fun === "function";
    }

    class promise {
        constructor(hander) {
            if (!isFunction(hander)) {
                throw new Error("MyPromise must accept a function as a parameter");
            }
            this.state = PENDING;
            this.value = undefined;
            this.funFufillStack = [];
            this.funRejectStack = [];
            // 执行hander
            try {
                hander(this._resolve.bind(this), this._reject.bind(this));
            } catch (error) {
                this.catch(error);
            }
        }

        /** 
         * 特点：
         * 1. 改变promise对象状态
         * 2. 如果传进来的参数是promise对象，必须等他状态改变时才执行 
         * 3. 执行回调函数栈*/
        _resolve(val) {
            let run = () => {
                if (this.state != PENDING) {
                    return
                }
                this.state = FULFILLED;
                this.value = val;
                // 定义一个清空funFufillStack的函数
                let clearFunFufillStack = (value) => {
                    let cb;
                    while (cb = this.funFufillStack.shift()) {
                        cb(value);
                    }
                }

                // 定义一个清空funRejectStack的函数
                let clearFunRejectStack = (value) => {
                    let cb;
                    while (cb = this.funRejectStack.shift()) {
                        cb(value);
                    }
                }

                /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
                             当前Promsie的状态才会改变，并且当前promise的值取决于参数promise的值


                             promise handle函数的执行是同步的，所以检查到resolve函数的参数是promise对象后，就会先给这个promise对象
                             添加回到函数，等到其状态改变后，清空该promise对象的回调队列，由于清空当前回调函数的代码就在给参数promise
                             添加的回调函数中，所以会清空当前promise对象的回调队列
                           */
                if (val instanceof MyPromise) {
                    val.then(
                        value => {
                            // console.log(this);
                            this.value = value + 1;
                            // 在这个回调中将当前promise的回调函数栈清空
                            clearFunFufillStack(value);
                        },
                        error => {
                            this.value = error;
                            console.log(error);
                            // 在这个回调中将当前promise的回调函数栈清空
                            clearFunRejectStack(error);
                        })
                } else {
                    clearFunFufillStack(val);
                }
            }

            // 实现异步，让回调函数先计入回调函数栈
            setTimeout(run, 0);
        }

        // 添加reject时执行的函数
        _reject(err) {
            // 依次执行失败队列中的函数，并清空队列
            const run = () => {
                    if (this.state != PENDING) return
                    this.state = REJECTED;
                    this.value = err;
                    let cb;
                    while (cb = this.funRejectStack.shift()) {
                        cb(err)
                    }
                }
                // 为了支持同步的Promise，这里采用异步调用
            setTimeout(run, 0)
        }

        // 将回调函数放入回调队列中
        /**
         * then方法的作用是将回调函数放入回调函数栈中。l
         * 还有一个特点是将回调函数的返回值封装成promise对象返回
         * 解决的难点就是如何回调函数返回的值
         * 解决方式就是讲需要返回的promise对象的reject或者resolve放进函数回调队列中去
         */
        then = function(onFulfilled, onRejected) {
            return new MyPromise((onFulfilledNext, onRejectedNext) => {
                // 封装一个成功时的回调函数
                /**
                 * 成功时的回调函数需要捕获原来回调函数中的错误,如果传入的
                 */
                let fulfilled = value => {
                    try {
                        if (!isFunction(onFulfilled)) {
                            onFulfilledNext(value)
                        } else {
                            let res = onFulfilled(value);
                            if (res instanceof MyPromise) {
                                // 如果当前回调函数返回Promise对象，必须等待其状态改变后在执行下一个回调,将resolve和reject当成回调函数执行就可
                                res.then(onFulfilledNext, onRejectedNext)
                            } else {
                                //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                                onFulfilledNext(res)
                            }
                        }
                    } catch (err) {
                        // 如果函数执行出错，新的Promise对象的状态为失败
                        onRejectedNext(err)
                    }
                }

                // 封装一个失败时执行的函数
                let rejected = error => {
                    try {
                        if (!isFunction(onRejected)) {
                            onRejectedNext(error);
                        } else {
                            let res = onRejected(error);
                            if (res instanceof MyPromise) {
                                // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                                res.then(onFulfilledNext, onRejectedNext)
                            } else {
                                //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                                onFulfilledNext(res)
                            }
                        }
                    } catch (err) {
                        // 如果函数执行出错，新的Promise对象的状态为失败
                        onRejectedNext(err)
                    }
                }
                switch (this.state) {
                    case PENDING:
                        this.funFufillStack.push(fulfilled);
                        this.funRejectStack.push(rejected);
                        break;
                    case FULFILLED:
                        fulfilled(this.value);
                        break;
                    case REJECTED:
                        rejected(this.value);
                        break
                }
            })
        }

        catch = function(onrejected) {
            return this.then(null, onrejected)
        }

        /**
         * all函数接受的参数必须要有iterator接口
         */
        static all = function(params) {
            return new MyPromise((resolve, reject) => {
                if (params[Symbol.iterator]) {
                    let n = 0,
                        responses = new Array(n);
                    for (let [index, key] of params.entries()) {
                        key = this.resolve(key);
                        key.then(res => {
                            responses[index] = res;
                            n++;
                            if (n === params.length) {
                                resolve(responses);
                            }
                        }, err => {
                            console.log(err);
                            reject(err)
                        })
                    }
                } else {
                    reject(new Error("all方法的参数必须为可迭代对象！"))
                }
            })
        }

        static resolve(val) {
            // console.log(!(val instanceof MyPromise);

            if (!(val instanceof MyPromise)) {
                let pvalue = val;
                val = new MyPromise((resolve, reject) => {
                    resolve(pvalue);
                })
            }
            return val
        }
        static reject(val) {
            if (!val instanceof MyPromise) {
                let pvalue = value;
                val = new MyPromise((resolve, reject) => {
                    reject(pvalue);
                })
            }
            return val
        }

        /** 
         * race的特点是比赛，返回最先执行成功的那个promise,如果没有成功的就返回错误
         */
        static race(params) {
            return new MyPromise((resolve, reject) => {
                if (params[Symbol.iterator]) {
                    let n = 0;
                    for (let [index, key] of params.entries()) {
                        key = this.resolve(key);
                        key.then(res => {
                            resolve(res);
                            n++;
                        }, err => {
                            n++;
                            if (n === params.length) {
                                reject(new Error("都没有成功"))
                            }
                        })
                    }
                } else {
                    reject(new Error("all方法的参数必须为可迭代对象！"))
                }
            })
        }

        /**接受一个回调函数 ，这个回调函数无论如何都会执行 */
        finally(cb) {
            let p = this.constructor;
            return this.then(res => {
                p.resolve(cb()).then(() => res)
            }, error => {
                p.resolve(cb()).then(() =>
                    throw error)
            })
        }

    }

    promise.prototype[Symbol.toStringTag] = "Promise";
    return promise
})();