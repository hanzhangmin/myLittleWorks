(function () {
  function LazyImage(options) {
    options = options || {};
    let defaults = {
      context: document,
      attr: "data-src",
      threshold: 1,
      speed: 300,
      callback: Function.prototype,
    };
    return new LazyImage.prototype.init(Object.assign(defaults, options)); //如果必要要使用深合并
  }
  LazyImage.prototype = {
    // 原型重定向，给构造函数赋值
    constructor: LazyImage,
    //初始化函数
    init: function (config) {
      //把信息挂到实例上
      this.config = config;
      const oboptions = {
        threshold: [config.threshold],
      };
      // 创建监听器,用该对象有一个缺点，就是每当对象中有新的图片元素加载进来的时候都要对其进行监听
      this.ob = new IntersectionObserver((changes) => {
        changes.forEach((change) => {
          var target = change.target;
          if (change.intersectionRatio === this.config.threshold) {
            this.singleHandle(target);
          }
        });
      }, oboptions);
      //加入监听对象  监听对象是上下文下的   context: document 含有data-src 属性的img,
      this.observe();
    },
    // init() {
    //这种写法不允许被new
    // }
    // 用 class 声明的类不能使用普通方法执行
    // 上面两种写法的区别,
    //单张图片的延迟加载
    singleHandle: function (target) {
      target.src = target.dataset.src;
      target.onload = () => {
        target.removeAttribute("data-src");
        target.style.opacity = 1;
        target.style.transition = "all " + this.config.speed + "ms";
      };
      // 取消监听
      this.ob.unobserve(target);
      //执行定义的回调函数
      this.config.callback.call(this, target);
    },
    //加入监听对象
    observe: function () {
      let imgs = this.config.context.querySelectorAll(
        `img[${this.config.attr}]`
      );
      imgs.forEach((img) => {
        this.ob.observe(img);
      });
    },
  };
  LazyImage.prototype.init.prototype = LazyImage.prototype;
  //工厂模式当  LazyImage 作为普通函数执行的时候，仍旧创建了实例对象。
  //将对象暴露出去
  if (typeof window != "undefined") {
    window.LazyImage = LazyImage;
  }
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = LazyImage;
  }
  // console.log(LazyImage.prototype);
})();
//IntersectionObserver 考虑到兼容问题 这种方式移动端用的比较多
// function setLazy(config) {
//   var observer = new IntersectionObserver(
//     function (changes) {
//       changes.forEach((change) => {
//         var target = change.target;
//         if (change.intersectionRatio === 1) {
//           target.src = target.dataset.src;
//           target.style.opacity = 1;
//           observer.unobserve(target); //当已经赋值成功后取消对该元素的观察
//         }
//       });
//     },
//     {
//       threshold: config.threshold, //控制什么时候触发回调函数
//       //intersectionRatio===1有效的前提下，是被监听元素样式高度height是可知的，如果是不可知的话，会被认为是0，这个时候元素只要一露头就会触发回调
//     }
//   );
//   Array.from(config.images).forEach((img) => {
//     observer.observe(img);
//   });
// }

//懒加载方法1通过得到一个元素的top（距离文档顶部的距离），只要top小于页面当前展示的长度，就将src赋值
// function lazyLoad1(imgs) {
//   var vTop =
//     document.documentElement.clientHeight + document.documentElement.scrollTop;
//   for (const img of imgs) {
//     if (gettop(img) < vTop && !img.src) {
//       img.src = img.dataset.src;
//     }
//   }
//   function gettop(element) {
//     var top = element.offsetTop;
//     while (element.offsetParent) {
//       element = element.offsetParent;
//       top += element.offsetTop;
//     }
//     return top;
//   }
// }

//第二种懒加载的方法
// getBoundingClientRect用于获取某个元素相对于视窗的位置集合。集合中有top, right, bottom, left等属性。
//innerheight 返回窗口的文档显示区的高度。
//  innerwidth 返回窗口的文档显示区的宽度。
//只要元素相当于窗口的高度  小于等于 窗口文档显示区的高度 就给src属性赋值
// function lazyLoad2(imgs) {
//   for (const img of imgs) {
//     if (isIn(img) && !img.src) {
//       img.src = img.dataset.src;
//     }
//   }
//   function isIn(element) {
//     var bound = element.getBoundingClientRect();
//     console.log(window.innerHeight);
//     return bound.top <= window.innerHeight; //innerheight 返回窗口的文档显示区的高度。
//   }
// }
// 上面两种方式我们都需要监听滚动事件，需要做节流处理
