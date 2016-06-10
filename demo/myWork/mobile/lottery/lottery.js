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
function Lottery(option){
  if(!option.lotteris || !option.ajaxUrl || !option.needCredits || !option.creditsInputId){
    return;
  }
  var w = document.documentElement.clientWidth*0.9;
  console.log(w);
  var defaults = {
    warpId:"lotteryWrap",
    ajaxUrl:"http://jiangshanmeta.github.io",
    w:w
  }
  this.options = Object.assign(defaults,option || {});
  //状态 0表示没开始抽奖，1表示正在抽奖中，2表示抽奖完成
  this.status = 0;
  this.cfgs = {
    animationDuration:0.5,
    rotateCountAfterAjax:3,


  }
  this.imgs = [];
  this.initDOM();
  this.preLoadImg();
  this.draw();
  var _this = this;
  this.wrap.addEventListener("click",function(){
    //没开始抽奖的时候点击，说明要抽奖
    if(_this.status===0){
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
    this.canvas2.style['position'] = "absolute";
    this.canvas2.style['top'] = 0;
    this.canvas2.style['left'] = 0;
    this.context2 = this.canvas2.getContext('2d');

    fragment.appendChild(this.canvas1);
    fragment.appendChild(this.canvas2);
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
    context2.save();
    
    context2.translate(options.w/2,options.w/2);
    context2.save();
    context2.shadowColor = "rgba(0,0,0,0.5)";
    context2.shadowBlur = 8;
    drawRing(context2,options.w/2-9,10,"#ffa642");
    context2.restore();
    drawRing(context2,options.w/2-2,4,"#FF6900");
    

        

    context2.restore();  
    
    context1.save();
    context1.translate(options.w/2,options.w/2);
    this.drawBg(context1);

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
      this.canvas1.style[pfx("animation")] = "rotate " + this.cfgs.animationDuration +"s linear infinite";
      var _this = this;
      setTimeout(function(){
          var rst = Math.floor(Math.random()*_this.options.lotteris.length);
          // console.log(_this.options.length)
          _this.showLotteryRes(rst);
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
    this.status = 2;
    document.querySelector("#"+this.options.creditsInputId).value-=this.options.needCredits;
    
    var canvas1 = this.canvas1;
    canvas1.style[pfx('animationDuration')] = 2*this.cfgs['animationDuration'] + "s";
    canvas1.style[pfx('animationIterationCount')] = this.cfgs['rotateCountAfterAjax'];
  },
  reset:function(){
    this.status = 0;
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