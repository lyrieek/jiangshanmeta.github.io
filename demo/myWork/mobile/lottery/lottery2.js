// 第一版转盘的具体动画是通过css3实现的，虽然实现了但有些小问题，所以准备具体的动画也采用canvas实现

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
if (typeof Object.create != 'function') {
  Object.create = (function() {
    function Temp() {}
    var hasOwn = Object.prototype.hasOwnProperty;

    return function (O) {
      if (typeof O != 'object') {
        throw TypeError('Object prototype may only be an Object or null');
      }

      Temp.prototype = O;
      var obj = new Temp();
      Temp.prototype = null; 

      if (arguments.length > 1) {

        var Properties = Object(arguments[1]);
        for (var prop in Properties) {
          if (hasOwn.call(Properties, prop)) {
            obj[prop] = Properties[prop];
          }
        }
      }

      return obj;
    };
  })();
}

function gettype(obj){
  return Object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
}
// https://github.com/sindresorhus/deep-assign/blob/master/index.js
var deepAssign = (function(){

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;
  function toObject(val) {
    if (val === null || val === undefined) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    return Object(val);
  }
  function assignKey(to, from, key) {
    var val = from[key];

    if (val === undefined || val === null) {
      return;
    }

    if (hasOwnProperty.call(to, key)) {
      if (to[key] === undefined || to[key] === null) {
        throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
      }
    }

    if(gettype(val)==='object' || gettype(val)==='array'){
      if(!hasOwnProperty.call(to, key)){
        if(gettype(val)==='array'){
          to[key] = [];
        }else{
          to[key] = {};
        }
      }
      to[key] = assign(to[key],from[key]);
    }else{
      to[key] = val;
    }

  }
  function assign(to, from) {
    if (to === from) {
      return to;
    }

    from = Object(from);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        assignKey(to, from, key);
      }
    }

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          assignKey(to, from, symbols[i]);
        }
      }
    }

    return to;
  }

  return function(target){
    target = toObject(target);

    for (var s = 1; s < arguments.length; s++) {
      assign(target, arguments[s]);
    }

    return target;        
  }


})();

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

//利用闭包，把defaults隐藏而不是每次都声明一次
(function(window){
  var easing = {
    linear:function(p){
      return p;
    },
    uniformDeceleration:function(p){
      return -p*p + 2*p;
    },
  }


  var defaults = {
    ajaxUrl:"http://jiangshanmeta.github.io",
    DOM:{
      wrap:'lotteryWrap',
      w:Math.min(document.documentElement.clientWidth*0.9,500),
      rings:[{color:'#ff6900','width':4},{color:'#ffa642',width:10,shadowColor:'rgba(0,0,0,0.5)',shadowBlur:8}],
      pointerColor:"#ffa642",
      startDeg:0,
    },
    animation:{
      timePerRound:1,
      rotateCountAfterAjax:3,  //animationTimePerRound是指在 抽奖动画中匀速转动时没转一圈所需要的时间
      area:'decoratio',
      timeAfterAjax:7,
    },
    text:{
      color:"#fff",
      pos:2/3,
      fontSize:14,
      lineHeight:1.4,
      shadowColor:"rgba(0,0,0,0.5)",
      shadowBlur:8,
      separator:"\n",
    },
    msg:{
      ready:'开始抽奖',
      doing:'抽奖中',
      done:'抽奖结束',
      css:"box-shadow:0 0 5px rgba(0,0,0,0.5),inset 0 0 10px rgba(0,0,0,0.5);background:#fff;",
    },

    doSthAfterLottery:function(json){

    },
    checkCanLottery:function(){
        return true;
    },
    doSthAfterCannotLottery:function(){

    },
    doSthAfterAjaxError:function(json){

    },

  }
  var wrapIdPool = [];

  function deg2rad(angle){
    return Math.PI*angle/180;
  }

  function rad2deg(angle){
    return angle*180/Math.PI;
  }

  function Lottery(option){
    if(!option || !option.lotteris || !option.ajaxUrl ){
      console.error('missing parameter');
      return;
    }

    //安全模式，保证是使用new关键字返回一个新的实例
    if(!(this instanceof Lottery)){
        return new Lottery(option);
    }

    this.options = deepAssign({},defaults,option);
    // 对合并之后的数据进行处理
    if(this.options.text.pos>=1 || this.options.text.pos<=0){
      this.options.text.pos = defaults.text.pos;
    }
    this.options.DOM.startDeg = deg2rad(this.options.DOM.startDeg);

    //状态 0表示没开始抽奖，1表示正在抽奖中，2表示抽奖完成
    this.status = 0;
    this.imgs = [];

    this.initDOM().draw();

    //我希望把这些实例属性隐藏掉，而原型方法可以暴露
    var dummpConstructedFunc = function(){};
    dummpConstructedFunc.prototype = Object.create(Lottery.prototype);
    return new dummpConstructedFunc();


  }

  Lottery.prototype = {
    constructor:Lottery,
    initDOM:function(){
      var options = this.options;
      var DOM = options.DOM;
      var wrapId = DOM.wrapId;
      var w = DOM.w;
      //外层盒子初始样式设置
      // 做一点安全，防止一个wrapId下面有多个抽奖区
      this.wrap = document.querySelector("#"+wrapId);
      if(!this.wrap){
        this.wrap = document.createElement("div");
        document.body.appendChild(this.wrap);
      }else{
        if(wrapIdPool.indexOf(wrapId)>-1){
          console.error('Lottery wrapId repeated');
          return;
        }else{
          wrapIdPool.push(wrapId);
        }
      }
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
      this.canvas2.style.cssText="position:absolute;top:0;left:0;";
      this.context2 = this.canvas2.getContext('2d');
      // 文字区域
      this.textArea = document.createElement("div");
      var textAreaPercent = 0.25;
      this.textArea.style.cssText = "position:absolute;border-radius:50%;width:"+textAreaPercent*w+"px;height:"+textAreaPercent*w+"px;line-height:"+ textAreaPercent*w +"px;left:" + (0.5-textAreaPercent/2)*100 + "%;top:"+(0.5-textAreaPercent/2)*100 +"%;text-align:center;white-space:nowrap;-webkit-user-select:none;" + options.msg.css;
      this.textArea.innerText = options.msg.ready;

      var fragment = document.createDocumentFragment();
      fragment.appendChild(this.canvas1);
      fragment.appendChild(this.canvas2);
      fragment.appendChild(this.textArea);
      this.wrap.appendChild(fragment);

      return this;
    },
    draw:function(){
      return this.drawRing().drawPointer().drawBg().drawText();
    },
    drawRing:function(){
      var context2 = this.context2;
      var options = this.options;
      var DOM = options.DOM;
      var r = DOM.w/2;

      context2.save();
      context2.translate(r,r);

      var totalWidth = 0;
      var rings = DOM.rings;
      if(gettype(rings)!='array'){
        console.error('parameter for rings must be array');
        return this;
      }
      for(var i=0;i<rings.length;i++){
        var thisring = rings[i];
        context2.save();
        context2.beginPath();
        context2.strokeStyle = thisring.color;
        context2.lineWidth = thisring.width;
        if(thisring.shadowColor){
          context2.shadowColor = thisring.shadowColor;
        }
        if(thisring.shadowBlur){
          context2.shadowBlur = thisring.shadowBlur;
        }
        context2.arc(0,0,r-(totalWidth+thisring.width/2),0,2*Math.PI,false);
        context2.closePath();
        context2.stroke();
        context2.restore();
        totalWidth+= thisring.width;
      }

      context2.restore();

      return this;
    },
    drawPointer:function(deg){
      var context2 = this.context2;
      var options = this.options;
      var DOM = options.DOM;
      var r = DOM.w/2;

      context2.save();
      context2.translate(r,r);
      deg = deg || 0;
      
      context2.rotate(deg);
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
      context2.fillStyle = DOM.pointerColor;
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
      context2.fillStyle = DOM.pointerColor;
      context2.fill();
      context2.restore();

      context2.restore();

      return this;
    },
    drawBg:function(deg){
      var context1 = this.context1;
      var options = this.options;
      var DOM = options.DOM;
      var lotteris = options.lotteris;
      var len=lotteris.length;
      var degPerPart = 2*Math.PI/len;
      var r = DOM.w/2;
      var startDeg = DOM.startDeg;

      context1.save();
      context1.translate(r,r);
      deg = deg || 0;
      context1.rotate(deg);
      for(var i=0;i<len;i++){
        context1.save();
        context1.beginPath();
        context1.moveTo(0,0);
        var finalDeg = i*degPerPart+startDeg;

        context1.lineTo(Math.sin(finalDeg)*r,-Math.cos(finalDeg)*r);
        context1.arc(0,0,r,finalDeg-Math.PI/2,finalDeg+degPerPart-Math.PI/2,false)
        context1.closePath();
        context1.fillStyle = lotteris[i].bgColor;
        context1.fill();
        context1.restore();
      }

      context1.restore();

      return this;    
    },
    drawText:function(deg){
      var context1 = this.context1;
      var options = this.options;
      var DOM = options.DOM;
      var lotteris = options.lotteris;
      var optionText = options.text;
      var len=lotteris.length;
      var degPerPart = 2*Math.PI/len;
      var r = DOM.w/2;
      var startDeg = DOM.startDeg;
      var animateArea = options.animation.area;
      context1.save();
      context1.translate(r,r);
      deg = deg || 0;
      context1.rotate(deg);
      context1.save();
      context1.textAlign = "center";
      context1.textBaseline = "middle";
      context1.fillStyle = optionText.color;
      var fontSize = optionText.fontSize;
      var lineHeight = optionText.lineHeight;
      var realLineHeight = fontSize*lineHeight;
      context1.font = fontSize+"px bold sans-serif";
      context1.shadowColor = optionText.shadowColor;
      context1.shadowBlur = optionText.shadowBlur;
      var separator = optionText.separator;

      for(var i=0;i<len;i++){
        var text = lotteris[i].text;
        if(text===undefined){
          continue;
        }

        context1.save();

        if(lotteris[i].textColor!==undefined){
          context1.fillStyle = lotteris[i].textColor;
        }
        if(lotteris[i].textPos!==undefined){
          var textPos = lotteris[i].textPos;
          if(textPos>=1 || textPos<=0){
            textPos = optionText.pos;
          }
        }else{
          var textPos = optionText.pos;
        }
        
        if(animateArea=='decoration'){
          var finalDeg = degPerPart*(i+0.5)+startDeg;
        }else{
          var finalDeg = 0;
          context1.rotate((i+0.5)*degPerPart+startDeg);
        }

        var textArr = text.split(separator);
        var centerPos = r*textPos;

        var startTextPos = centerPos + realLineHeight*(textArr.length-1)/(2*Math.cos(finalDeg));
        for(var j=0,textLen=textArr.length;j<textLen;j++){
            context1.fillText(textArr[j],Math.sin(finalDeg)*centerPos,-Math.cos(finalDeg)*(startTextPos-j*realLineHeight/Math.cos(finalDeg)) );
        }

        context1.restore();
      }
      context1.restore(); 

      context1.restore(); 

      return this;
    },
    ajaxGetLotteryRes:function(){
       var options = this.options;
       var canLottery = options.checkCanLottery();
       var _this = this;

       if(canLottery){
        // 这里应该发起ajax请求然后后端返回结果根据结果展示，但是github pages只能放静态页面。这里就简单模拟一下吧
        this.status = 1;
        this.textArea.innerText = options.msg.doing;
        var animateArea = options.animation.area;
        if(animateArea=='decoration'){
          var context = this.context2;
        }else{
          var context = this.context1;
        }
        // 转换为毫秒
        var animationTimePerRound = options.animation.timePerRound*1000;
        var w = options.DOM.w;
        var hasAjaxRest = false;
        var ajaxRest;
        var startTS = Date.now();
        var render = function(){
          var curTS = Date.now();
          var progress = (curTS-startTS)/animationTimePerRound;
          var curRotate = easing.linear(progress)*2*Math.PI;
          context.clearRect(0,0,w,w);

          if(progress>=1){
            curRotate = 2*Math.PI;
          }
          if(animateArea=='decoration'){
            _this.drawRing().drawPointer(curRotate);
          }else{
            _this.drawBg(curRotate).drawText(curRotate);
          }
          if(hasAjaxRest && progress>=1){
            _this.showLotteryRes(ajaxRest);
          }else{
            if(curRotate==2*Math.PI){
              startTS = Date.now();
            }
            requestAnimFrame(render)
          }

        }
        requestAnimFrame(render);

        if(options.ajaxUrl=='http://jiangshanmeta.github.io'){
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
          //真ajax
          var xhr = new XMLHttpRequest();
          xhr.open("POST",options.ajaxUrl,true);
          xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
          xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
              if(xhr.status == 200){
                hasAjaxRest = true;
                ajaxRest = JSON.parse(xhr.responseText);
              }else{
                _this.reset();
              }
            }
          }
          xhr.send(null);

        }

        
       }else{
          options.doSthAfterCannotLottery && options.doSthAfterCannotLottery();
       }
    },
    showLotteryRes:function(json){
      console.log(json);
      var _this = this;
      var options = this.options;
      var animateArea = options.animation.area;
      if(animateArea=='decoration'){
        var context = this.context2;
      }else{
        var context = this.context1;
      }

      var startDeg = rad2deg(options.DOM.startDeg);
      var w = options.DOM.w;
      if(json.rstno==1){
        // 角度
        if(animateArea=='decoration'){
          var finalRotate = (json.data.index+0.5)*360/options.lotteris.length+360*(options.animation.rotateCountAfterAjax)+startDeg;
        }else{
          var finalRotate = 360-(json.data.index+0.5)*360/options.lotteris.length+360*(options.animation.rotateCountAfterAjax+1)-startDeg;
        }
        // 转换成毫秒
        var duration = options.animation.timeAfterAjax*1000;

        var finalRotateRag = deg2rad(finalRotate);

        var startTS = Date.now();
        var render = function(){
          var curTS = Date.now();
          var progress = (curTS-startTS)/duration;
          curRotate = easing.uniformDeceleration(progress)*finalRotateRag;
          if(progress<1){
            context.clearRect(0,0,w,w);
            if(animateArea=='decoration'){
                _this.drawRing().drawPointer(curRotate);
            }else{
                _this.drawBg(curRotate).drawText(curRotate);
            }
            
            requestAnimFrame(render);
          }else{
            _this.status = 2;
            _this.textArea.innerText = options.msg.done;
            options.doSthAfterLottery && options.doSthAfterLottery(json); 
          }
        }
        requestAnimFrame(render);
      }else{
        this.reset(); 
        options.doSthAfterAjaxError && options.doSthAfterAjaxError(json);
        
      }



    },
    reset:function(){
      this.status = 0;
      this.textArea.innerText = this.options.msg.ready;
      var animateArea = this.options.animation.area;
      var w = this.options.DOM.w;
      if(animateArea=='decoration'){
        this.context2.clearRect(0,0,w,w);
        this.drawRing().drawPointer();
      }else{
        this.context1.clearRect(0,0,w,w);
        this.drawBg().drawText();
      }
      


      return this;
    }

  }
  window.Lottery = Lottery;

})(window);









