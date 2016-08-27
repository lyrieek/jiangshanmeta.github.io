//php.js
function ucfirst (str) {
  str += ''
  var f = str.charAt(0)
    .toUpperCase()
  return f + str.substr(1)
}
//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (!Object.assign) {
  Object.defineProperty(Object, "assign", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      "use strict";
      if (target === undefined || target === null)
        throw new TypeError("Cannot convert first argument to object");
      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) continue;
        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
        }
      }
      return to;
    }
  });
}
//impress.js
var pfx = (function () {
    var style = document.createElement('dummy').style,
        prefixes = 'Webkit Moz O ms Khtml'.split(' '),
        memory = {};
    return function ( prop ) {
        if ( typeof memory[ prop ] === "undefined" ) {
            //实现一个ucfirst
            var ucProp  = ucfirst(prop),
            //拿到前缀化的属性名
                props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
            
            memory[ prop ] = null;
            for ( var i in props ) {
                if ( style[ props[i] ] !== undefined ) {
                    memory[ prop ] = props[i];
                    break;
                }
            }
        }
        
        return memory[ prop ];
    };
})();

function whichTransitionEvent(){  
    var t;  
    var el = document.createElement('p');  
    var transitions = {  
      'transition':'transitionend',  
      'OTransition':'oTransitionEnd',  
      'MozTransition':'mozTransitionEnd',  
      'WebkitTransition':'webkitTransitionEnd',  
      'MsTransition':'msTransitionEnd'  
    }  
    for(t in transitions){  
        if( el.style[t] !== undefined ){  
            return transitions[t];  
        }  
    }  
}
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function Lottery(option){
  if(!option.lotteris || !option.ajaxUrl ){
    return;
  }
  var w = Math.min(document.documentElement.clientWidth*0.9,500);
  var defaults = {
    warpId:"lotteryWrap",
    ajaxUrl:"http://jiangshanmeta.github.io",
    w:w,
    animationTimePerRound:1,     //animationTimePerRound是指在 抽奖动画中匀速转动时没转一圈所需要的时间
    rotateCountAfterAjax:3,
    outerRingColor:"#ff6900",
    innerRingColor:"#ffa642",
    pointerColor:"#ffa642",
    textColor:'#fff',
    doSthAfterLottery:function(json){

    },
    checkCanLottery:function(){
        return true;
    },
    doSthAfterAjaxError:function(json){

    },    
  }
  this.options = Object.assign(defaults,option || {});
  //状态 0表示没开始抽奖，1表示正在抽奖中，2表示抽奖完成
  this.status = 0;

  this.imgs = [];
  this.initDOM();
  this.preLoadImg();
  this.draw();
  var _this = this;
  this.wrap.addEventListener("click",function(){
    //没开始抽奖的时候点击，说明要抽奖
    if(_this.status===0){
      _this.ajaxGetLotteryRes();
    }else if(_this.status===2){
      //此时抽奖结束,点击应该是重置
      _this.reset();
    }
    //剩下的情况是抽奖中，当然什么也不做默默等待后端返回结果
  },false);
}

Lottery.prototype = {
  construct:Lottery,
  initDOM:function(){
    var options = this.options;
    var w = options.w;
    //外层盒子初始样式设置
    this.wrap = document.querySelector("#"+options.warpId);
    this.wrap.style.cssText += "position:relative;overflow:hidden;margin-left:auto;margin-right:auto;display:table;"

    //canvas1负责绘制具体的奖项
    this.canvas1 = document.createElement("canvas");
    this.canvas1.width = w;
    this.canvas1.height = w;
    this.context1 = this.canvas1.getContext('2d');

    //canvas2负责绘制装饰性的指针表盘
    this.canvas2 = document.createElement("canvas");
    this.canvas2.width = w;
    this.canvas2.height = w;
    this.canvas2.style.cssText="position:absolute;top:0;left:0;"+pfx("transform") + ":rotate(0deg);will-change:transform;";
    this.context2 = this.canvas2.getContext('2d');

    // 文字区域
    this.textArea = document.createElement("div");
    var textAreaPercent = 0.25;
    this.textArea.style.cssText = "position:absolute;border-radius:50%;box-shadow:0 0 5px rgba(0,0,0,0.5),inset 0 0 10px rgba(0,0,0,0.5);width:"+textAreaPercent*w+"px;height:"+textAreaPercent*w+"px;line-height:"+ textAreaPercent*w +"px;left:" + (0.5-textAreaPercent/2)*100 + "%;top:"+(0.5-textAreaPercent/2)*100 +"%;background:#fff;text-align:center;white-space:nowrap;-webkit-user-select:none;"
    this.textArea.innerText = "开始抽奖";

    var fragment = document.createDocumentFragment();
    fragment.appendChild(this.canvas1);
    fragment.appendChild(this.canvas2);
    fragment.appendChild(this.textArea);
    this.wrap.appendChild(fragment);
  },
  preLoadImg:function(){
    var _this = this;
    
    var lotteris = this.options.lotteris;
    for(var i=0,len=lotteris.length;i<len;i++){
        var src = lotteris[i].src;
        if(src){
            var flag = false;
            for(var j=0,imglen = this.imgs.length;j<imglen;j++){
              if(this.imgs[j].src = src){
                flag =true;
                break;
              }
            }

            if(!flag){
              this.imgs.push({src:src,status:0});
              var img = new Image();
              img.onload = function(){
                src = this.src;
                imgs = _this.imgs;
                for(var k=0,imglen=imgs.length;k<imglen;k++){
                  if(imgs[k].src==src){
                    imgs[k].status=1;
                  }
                }
                _this.drawImg(src);
              }
              img.src = src;
            }

        }
    }
  },
  draw:function(){
    var context1 = this.context1;
    var context2 = this.context2;
    var options = this.options;
    var r = options.w/2;
    context2.save();
    
    context2.translate(r,r);

    /* 外层两个环 阴影 */
    context2.save();
    context2.shadowColor = "rgba(0,0,0,0.5)";
    context2.shadowBlur = 8;
    this.drawRing(context2,r-9,10,options.innerRingColor);

    context2.restore();
    this.drawRing(context2,r-2,4,options.outerRingColor);

    /* 外层指针 */
    context2.save();
    context2.beginPath();
    context2.moveTo(-0.05*r,-r+9);
    context2.lineTo(-0.05*r,-0.8*r);
    context2.lineTo(-0.12*r,-0.8*r);
    context2.lineTo(0,-0.7*r);   
    context2.lineTo(0.12*r,-0.8*r);
    context2.lineTo(0.05*r,-0.8*r);
    context2.lineTo(0.05*r,-r+9);
    context2.closePath();
    context2.fillStyle = options.pointerColor;
    context2.fill();
    context2.restore();  
    
    // 内层指针 
    context2.save();
    context2.beginPath();
    context2.moveTo(-0.05*r,-0.25*r);
    context2.lineTo(-0.05*r,-0.40*r);
    context2.lineTo(-0.12*r,-0.40*r);
    context2.lineTo(0,-0.50*r);   
    context2.lineTo(0.12*r,-0.40*r);
    context2.lineTo(0.05*r,-0.40*r);
    context2.lineTo(0.05*r,-0.25*r);    
    context2.closePath();
    context2.fillStyle = options.pointerColor;
    context2.fill();
    context2.restore();  

    /* 奖区 */
    context1.save();
    context1.translate(options.w/2,options.w/2);
    this.drawBg(context1);
    this.drawText(context1);

    context1.restore();
    
  },
  drawBg:function(context1){
    var options = this.options;
    var lotteris = options.lotteris;
    var len=lotteris.length;
    var degPerPart = 2*Math.PI/len;
    var r = options.w/2;
    for(var i=0;i<len;i++){
      context1.save();
      context1.beginPath();
      context1.moveTo(0,0);
      context1.lineTo(Math.sin(i*degPerPart)*r,-Math.cos(i*degPerPart)*r);
      context1.arc(0,0,r,(i*degPerPart)-Math.PI/2,(i+1)*degPerPart-Math.PI/2,false)
      context1.closePath();
      context1.fillStyle = lotteris[i].bgColor;
      context1.fill();
      context1.restore();
    }

  },
  drawRing:function(context,radius,lineWidth,strokeStyle){
    context.save();
    context.beginPath();
    context.arc(0,0,radius,0,2*Math.PI,false);
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    context.closePath();
    context.stroke();
    context.restore();   
  },
  drawText:function(context1){
    var options = this.options;
    var lotteris = options.lotteris;
    var len=lotteris.length;
    var degPerPart = 2*Math.PI/len;
    var r = options.w/2;

    context1.save();
    context1.font = "14px bold sans-serif";
    context1.textAlign = "center";
    context1.textBaseline = "middle";
    context1.fillStyle = options.textColor;
    context1.shadowColor = "rgba(0,0,0,0.5)";
    context1.shadowBlur = 8;
    for(var i=0;i<len;i++){
      var text = lotteris[i].text;
      if(text !== undefined){
        context1.fillText(text,(Math.sin(degPerPart*(i+0.5)))*r*2/3,-Math.cos(degPerPart*(i+0.5))*r*2/3  );
      }
    }
    context1.restore();
  },
  drawImg:function(context1){

  },
  ajaxGetLotteryRes:function(){
    var options = this.options;
     var canLottery = options.checkCanLottery();
     var _this = this;
     if(canLottery){
      // 这里应该发起ajax请求然后后端返回结果根据结果展示，但是github pages只能放静态页面。这里就简单模拟一下吧
      this.status = 1;
      this.textArea.innerText = "抽奖中";
      var canvas2 = this.canvas2;
      var animationTimePerRound = this.options.animationTimePerRound;
      var styleStr = canvas2.style.cssText;
      styleStr = styleStr + pfx('transition') +":all " + animationTimePerRound  +"s linear;" + pfx("transform") + ":rotate(360deg);";
      var hasAjaxRest = false;
      var ajaxRest;
      var transitionendCallback = function(e){
        if(hasAjaxRest){
          this.removeEventListener(e.type,transitionendCallback);
          _this.showLotteryRes(ajaxRest);
        }else{
          var styleStr2 = this.style.cssText;
          styleStr2+= pfx("transition") + ":0s;" + pfx("transform") + ":rotate(0deg);";
          this.style.cssText = styleStr2;

          var _thisCanvas = this;
          // 你猜为什么要写在setTimeout中呢。为了强制渲染啊。
          // setTimeout(function(){
          //   _thisCanvas.style.cssText = styleStr;
          // },0)
          //上面一个写法和下面的写法表现结果是一致的
          //用requestAnimationFrame的作用是一样的，等重置需要一帧时间，再下一次重绘的时候写入新的样式。
          requestAnimFrame(function(){
            requestAnimFrame(function(){
              _thisCanvas.style.cssText = styleStr;
            })
             
          });

        }
      }

      canvas2.addEventListener(whichTransitionEvent(),transitionendCallback);
      canvas2.style.cssText = styleStr;
      
      // 模拟ajax返回值
      setTimeout(function(){
          var rst = Math.floor(Math.random()*_this.options.lotteris.length);
          hasAjaxRest = true;
          //因为可能后端校验禁止参与抽奖
          if(Math.random()>0.5){
            ajaxRest = {data:{index:rst,err:{msg:'达成成就：+1s'}},rstno:1};
          }else{
            ajaxRest = {data:{err:{msg:'苟利国家生死以'}},rstno:2};
          }
          
      },1800)   
      
     }else{
        alert(this.errMsg);
     }
  },
  showLotteryRes:function(json){

    var _this = this;
    var options = this.options;
    var canvas2 = this.canvas2;

    if(json.rstno==1){
      var transitionendCallback1 = function(e){
        this.removeEventListener(e.type,transitionendCallback1);
        _this.status = 2;
        _this.textArea.innerText = "抽奖结束";
        options.doSthAfterLottery && options.doSthAfterLottery(json);  
      }
      canvas2.addEventListener(whichTransitionEvent(),transitionendCallback1,false);
      //这里要+1是因为在改变过渡效果的时候，ajax过程中最后的那一圈也算上了
      var finalRotate = (json.data.index+0.5)*360/options.lotteris.length+360*(options.rotateCountAfterAjax+1);
      canvas2.style[pfx("transition")] = "all 7s cubic-bezier(0.33,0.5,0.66,0.83)";
      canvas2.style[pfx("transform")] = "rotate("+  finalRotate +"deg)";      
    }else{
      this.reset(); 
      options.doSthAfterAjaxError && options.doSthAfterAjaxError(json);
      
    }



  },
  reset:function(){
    this.status = 0;
    this.textArea.innerText = "开始抽奖";
    var canvas2Style = this.canvas2.style;
    var styleStr = canvas2Style.cssText;
    styleStr += pfx("transition")+":0s;"+pfx("transform") + ":rotate(0deg);";
    canvas2Style.cssText = styleStr;

  }

}
