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

function forceReflow() {
    var tempDivID = "reflowDivBlock";
    var domTreeOpDiv = document.getElementById(tempDivID);
    if (!domTreeOpDiv) {
        domTreeOpDiv = document.createElement("div");
        domTreeOpDiv.id = tempDivID;
        document.body.appendChild(domTreeOpDiv);
    }
    var parentNode = domTreeOpDiv.parentNode;
    var nextSibling = domTreeOpDiv.nextSibling;
    parentNode.removeChild(domTreeOpDiv);
    parentNode.insertBefore(domTreeOpDiv, nextSibling);
};



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
function whichAnimationEvent(){  
    var t;  
    var el = document.createElement('p');  
    var animations = {  
      'animation':'animationend',  
      'OAnimation':'oAnimationEnd',  
      'MozAnimation':'mozAnimationEnd',  
      'WebkitAnimation':'webkitAnimationEnd',  
      'MsAnimation':'msAnimationEnd'  
    }  
    for(t in animations){  
        if( el.style[t] !== undefined ){  
            return animations[t];  
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
  if(!option.lotteris || !option.ajaxUrl || !option.needCredits ){
    return;
  }
  var w = document.documentElement.clientWidth*0.9;
  console.log(w);
  var defaults = {
    warpId:"lotteryWrap",
    ajaxUrl:"http://jiangshanmeta.github.io",
    w:w,
    creditsInputId:credits,
    animationDuration:1,
    rotateCountAfterAjax:3,
    // durationAfterRes:2,
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
      _this.canvas2.style[pfx("transition")] = "all 5s cubic-bezier(0.33,0.5,0.66,0.83)";
      _this.ajaxGetLotteryRes();
    }else if(_this.status==2){
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
    
    this.wrap = document.querySelector("#"+options.warpId);
    this.wrap.classList.add("center-table");
    
    this.wrap.style['position'] = "relative";
    this.wrap.style['overflow'] = "hidden";
    var fragment = document.createDocumentFragment();
    var w = options.w;

    //canvas1负责绘制具体的奖项
    this.canvas1 = document.createElement("canvas");
    this.canvas1.width = w;
    this.canvas1.height = w;
    this.canvas1.classList.add("center-block");
    this.context1 = this.canvas1.getContext('2d');

    //canvas2负责绘制装饰性的指针表盘
    this.canvas2 = document.createElement("canvas");
    this.canvas2.width = w;
    this.canvas2.height = w;
    this.canvas2.style.cssText="position:absolute;top:0;left:0;"+pfx("transform") + ":rotate(0deg)";
    // var canvas2Style = this.canvas2.style;

    // canvas2Style['position'] = "absolute";
    // canvas2Style['top'] = 0;
    // canvas2Style['left'] = 0;
    // canvas2Style[pfx("transform")] = "rotate(0deg)";

    this.context2 = this.canvas2.getContext('2d');

    this.textArea = document.createElement("div");
    this.textArea.style.cssText = "position:absolute;border-radius:50%;box-shadow:0 0 5px rgba(0,0,0,0.5),inset 0 0 10px rgba(0,0,0,0.5);width:"+0.25*w+"px;height:"+0.25*w+"px;line-height:"+ 0.25*w +"px;left:37.5%;top:37.5%;background:#fff;text-align:center;white-space:nowrap;"
    this.textArea.innerText = "开始抽奖";
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
    drawRing(context2,r-9,10,"#ffa642");
    context2.restore();
    drawRing(context2,r-2,4,"#FF6900");

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
    context2.fillStyle = "#ffa642";
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
    context2.fillStyle = "#ffa642";
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
  drawText:function(context1){

  },
  drawImg:function(context1){

  },
  ajaxGetLotteryRes:function(){
     var hasEnoughCredits = this.checkCredits();
     if(hasEnoughCredits){
      // 这里应该发起ajax请求然后后端返回结果根据结果展示，但是github pages只能放静态页面。这里就简单模拟一下吧
      this.status = 1;
      this.textArea.innerText = "抽奖中";
      this.canvas2.style[pfx("animation")] = "rotate " + this.options.animationDuration +"s linear infinite";
      var _this = this;
      setTimeout(function(){
          var rst = Math.floor(Math.random()*_this.options.lotteris.length);
          
          _this.showLotteryRes({data:{index:rst}});
      },1000)   
      
     }else{
      alert("积分不足");
     }
  },

  checkCredits:function(){
    var options = this.options;
    var userCredits = document.querySelector("#"+options.creditsInputId).value;
    if(userCredits>=options.needCredits){
      return true;
    }
    return false;
  },
  showLotteryRes:function(json){
    console.log(json.data.index);
    var _this = this;
    
    var options = this.options;
    document.querySelector("#"+options.creditsInputId).value-=options.needCredits;

    // var curCount = 1;
    var canvas2 = this.canvas2;
    var animationIterationCallback = function(e){
      // var finalRotate = Math.PI/options.lotteris.length + Math.PI*2*rotateCountAfterAjax;
      // var duration = options.durationAfterRes;
      // var acceleration = finalRotate/duration;
      // var continueRotate = true;
      // var lastOmega = 2*Math.PI/options.animationDuration;
      // var lastTime = Date.now();
      // var reqAnimCallback = function(){
      //   if(continueRotate){
      //     requestAnimFrame(reqAnimCallback);
      //   }else{
      //     canvas2.style[pfx("transform")] = "rotate(" + finalRotate*180/Math.PI +"deg)";
      //   }
      // }
      // requestAnimFrame(reqAnimCallback);

      this.style[pfx("animationIterationCount")] = 1;
      //不想用js去控制，想用css过渡实现，尽可能减少js动画,目前的问题是时间的控制和timing-function的控制
      this.removeEventListener(e.type,animationIterationCallback);

      var animationEndCallback = function(e){
          this.removeEventListener(e.type,animationEndCallback);
          var finalRotate = (json.data.index+0.5)*360/options.lotteris.length+360*options.rotateCountAfterAjax
          var transitionndCallback = function(e){
            _this.status = 2;
            _this.textArea.innerText = "抽奖结束";
            this.removeEventListener(e.type,transitionndCallback);
          }
          this.addEventListener(whichTransitionEvent(),transitionndCallback,false);      
          this.style[pfx("transform")] = "rotate("+  finalRotate +"deg)";
      }
      this.addEventListener(whichAnimationEvent(),animationEndCallback)

      
      // this.style[pfx("transition")] = "all 5s cubic-bezier(0.33,0.5,0.66,0.83)";
      // forceReflow();




    }

    // animationiteration
    canvas2.addEventListener('webkitAnimationIteration',animationIterationCallback)
    // canvas2.addEventListener(whichAnimationEvent(),animationCallback,false);

    // 在微信浏览器，能够正常监听animationend，但似乎对改变动画次数不认
    // canvas2.style[("webkitAnimationIterationCount")] = 1;





    /*现在需要展示结果了*/


    // canvas1.style[pfx('animationDuration')] = 1.5*duration + "s";
    // canvas1.style[pfx('animationIterationCount')] = curCount;
    // canvas1.addEventListener(whichAnimationEvent(),function(){
    //   curCount++;
    //   this.style[pfx('animationIterationCount')] =curCount;
    //   duration = 1.5*duration;
    //   console.log(curCount)
    //   this.style[pfx('animationDuration')] = duration + "s";
    // })
  },
  reset:function(){
    this.status = 0;
    this.textArea.innerText = "开始抽奖";
    var canvas2Style = this.canvas2.style;
    canvas2Style[pfx("transition")] ="";
    canvas2Style[pfx('transform')] = "";
    canvas2Style[pfx('animation')] = "";

  }

}
function drawRing(context,radius,lineWidth,strokeStyle){
    context.save();
    context.beginPath();
    context.arc(0,0,radius,0,2*Math.PI,false);
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    context.closePath();
    context.stroke();
    context.restore();  

}