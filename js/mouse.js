    //!的作用是告诉javascript引擎这是一个函数表达式，不是函数声明，()、！、+、-等运算符都能实现这个作用，不过()是最安全的  
    //在!function(){}后面加上()会立即调用这个函数
   ! function () {
      var canvas = document.createElement("canvas"),
      context = canvas.getContext("2d"),
      attr = getAttr();
      //設置 canvas 的相關屬性
      canvas.id = "c_n" + attr.length;
      canvas.style.cssText = "position:fixed;top:0;left:0;z-index:" + attr.z + ";opacity:" + attr.opacity;
      document.getElementsByTagName("body")[0].appendChild(canvas);
      //設置 canvas 的長寬
      getWindowWH();
      //onresize 事件會在調整視窗大小的時候觸發，此處便重新取得長寬
      window.onresize = getWindowWH;

      // 取得script的設定，如果沒有另外做設定，則取此份js中默認的設定
      function getAttr() {
        let scripts = document.getElementsByTagName("script"),
        len = scripts.length,
        script = scripts[len - 1];//v为最后一个script元素，即引用了本文件的script元素
        return {
          length: len,
          z: script.getAttribute("zIndex") || -1,
          opacity: script.getAttribute("opacity") || 1,
          color: script.getAttribute("color") || "0,0,0",
          count: script.getAttribute("count") || 109
        }
      }

      function getWindowWH() {
      W = canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      H = canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      }

      var random = Math.random,
      squares = []; //存放要吸引的物件
      
      //放入物件
      for(let p = 0; p < attr.count; p ++){
        var square_x = random() * W, //x軸座標
        square_y = random() * H, //y軸座標
        square_xa = 2 * random() - 1, // x軸移動方向
        square_ya = 2 * random() - 1; //y軸移動方向

        squares.push({
          x: square_x,
          y: square_y,
          xa: square_xa,
          ya: square_ya,
          max: 6000
        })
      }

      //生成存放鼠標資訊的物件
      var mouse = {
        x: null,
        y: null,
        max: 20000
      };
    
    //取得鼠標的位置
    window.onmousemove = function (i) {

      i = window.event;
      mouse.x = i.clientX;
      mouse.y = i.clientY;
       }
      //滑鼠離開範圍後，清除鼠標位置資訊
      window.onmouseout = function () {
      mouse.x = null;
      mouse.y = null;
      }
      //設定小方塊的動畫
      var animation = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (i) {
      window.setTimeout(i, 1000 / 45)
    };

    function draw() {
      
      //清空畫布
      context.clearRect(0, 0, W, H);
      var w = [mouse].concat(squares); //連結鼠標與被吸引物
      var x, v, A, B, z, y;
      //square 屬性表：x，y，xa，ya，max
      squares.forEach(function (i) {
        
        //移動被吸引物速度、方向
        i.x += i.xa;
        i.y += i.ya;

        i.xa = i.xa * (i.x > W || i.x < 0 ? -1 : 1);
        i.ya = i.ya * (i.y > H || i.y < 0 ? -1 : 1);

        //繪製被吸引物
        context.fillRect(i.x - 0.5, i.y - 0.5, 1, 1);

        for (let n = 0; n < w.length; n++) {
          x = w[n];
          
          if (i !== x && null !== x.x && null !== x.y) {
            x_diff = i.x - x.x;
            y_diff = i.y - x.y;

            distance = x_diff * x_diff + y_diff * y_diff;
            if(distance < x.max){
             //如果被吸引物離鼠標夠近，則圍繞著鼠標
              if(x === mouse && distance > x.max/2){
               i.x = i.x - 0.03 * x_diff;
                i.y = i.y - 0.03 * y_diff;
              }
              
              A = (x.max - distance) / x.max;
              context.beginPath(); 
              //設定被吸引物樣貌，顏色，起始點，終點
              context.lineWidth = A * 2;
              context.strokeStyle = "rgba(" + attr.color + "," + (A + 0.2) + ")";
              context.moveTo(i.x, i.y);
              context.lineTo(x.x, x.y);
              //繪製出被吸引物
              context.stroke();
            }
          }
        }

        //刪除連結過的物件
        w.splice(w.indexOf(i), 1);
      });

      animation(draw);
   }
   
setTimeout(function () {
  draw();
  }, 100)
 }();