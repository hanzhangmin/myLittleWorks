//配置项
// config = {
//   abbreWidth: 300, //缩略图宽度
//   abbreHeight: 200, //缩略图高度
//   markWidth: 100, //遮罩层宽度
//   markHeight: 100, //遮罩层高度
//   magnificationTimes: 5, //放大倍数
//   abbreSrc: "../imgs/photo2.jpg", //缩略图图片地址
//   detailSrc: "../imgs/photo2.jpg", //详细图图片地址
// };
function magnifer(config) {
  if (!config.abbreWidth) config.abbreWidth = 300;
  if (!config.abbreHeight) config.abbreHeight = 200;
  if (!config.markWidth) config.markWidth = 100;
  if (!config.markHeight) config.markHeight = 100;
  if (!config.magnificationTimes) config.magnificationTimes = 5;
  if (!config.abbreSrc) config.abbreSrc = "../imgs/photo2.jpg";
  if (!config.detailSrc) config.detailSrc = "../imgs/photo2.jpg";
  //获取图片的宽高
  let img = new Image();
  img.src = config.detailSrc;
  let imgWidth, imgHeight; //计算宽高的放大倍数
  img.onload = function () {
    imgWidth = img.width;
    imgHeight = img.height;
  };

  let magnifer = document.querySelector(".magnifer");
  magnifer.style.width =
    config.abbreWidth + config.markWidth * config.magnificationTimes;
  let mark = document.querySelector(".magnifer .abbre .mark");
  mark.style.width = config.markWidth + "px";
  mark.style.height = config.markHeight + "px";
  let abbre = document.querySelector(".magnifer .abbre");
  abbre.style.width = config.abbreWidth + "px";
  abbre.style.height = config.abbreHeight + "px";
  let abbreSrc = document.querySelector(".magnifer .abbre img");
  abbreSrc.src = config.abbreSrc;
  abbreSrc.style.width = config.abbreWidth + "px";
  abbreSrc.style.height = config.abbreHeight + "px";
  let detail = document.querySelector(".magnifer .detail");
  detail.style.width = config.markWidth * config.magnificationTimes + "px";
  detail.style.height = config.markHeight * config.magnificationTimes + "px";
  let detailSrc = document.querySelector(".magnifer .detail img");
  detailSrc.src = config.detailSrc;
  detailSrc.style.width =
    config.markWidth *
      config.magnificationTimes *
      (config.abbreWidth / config.markWidth) +
    "px";
  mark.style.setProperty("--markShow", "none");
  detailSrc.style.setProperty("--markShow", "none");
  detailSrc.style.height =
    config.markHeight *
      config.magnificationTimes *
      (config.abbreHeight / config.markHeight) +
    "px";
  abbre.addEventListener("mouseenter", function (ev) {
    mark.style.setProperty("--markShow", "block");
    detailSrc.style.setProperty("--markShow", "block");
  });
  abbre.addEventListener("mouseleave", function (ev) {
    mark.style.setProperty("--markShow", "none");
    detailSrc.style.setProperty("--markShow", "none");
  });

  //获取缩略图距离窗口左侧和上边的距离
  let abbretop = abbre.getBoundingClientRect().top;
  let abbreleft = abbre.getBoundingClientRect().left;

  //窗口大小改变时重新获取获取缩略图距离窗口左侧和上边的距离
  window.addEventListener("resize", () => {
    abbretop = abbre.getBoundingClientRect().top;
    abbreleft = abbre.getBoundingClientRect().left;
  });
  //缩略图mousemove处理

  let abbre_mousemove_hander = function (ev) {
    let left = ev.clientX - abbreleft - config.markWidth / 2;
    let top = ev.clientY - abbretop - config.markHeight / 2;
    // console.log(left, top);
    if (left < 0) {
      left = 0;
    }
    if (left >= config.abbreWidth - config.markWidth) {
      left = config.abbreWidth - config.markWidth;
    }
    if (top < 0) {
      top = 0;
    }
    if (top >= config.abbreHeight - config.markHeight) {
      top = config.abbreHeight - config.markHeight;
    }
    mark.style.setProperty("--moveLeft", left + "px");
    mark.style.setProperty("--moveTop", top + "px");
    detailSrc.style.setProperty(
      "--moveLeft",
      -left * config.magnificationTimes + "px"
    );
    detailSrc.style.setProperty(
      "--moveTop",
      -top * config.magnificationTimes + "px"
    );
  };

  abbre.addEventListener("mousemove", abbre_mousemove_hander);
  //这里是引入的防抖函数
}
