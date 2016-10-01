(function(window){
	//php.js
	function ucfirst (str) {
	  str += ''
	  var f = str.charAt(0)
	    .toUpperCase()
	  return f + str.substr(1)
	}	
	// 基于jquery的camelcase修改，仅仅是将中划线删除然后将后面的第一个字母大写
	var camelCase = (function(){
	  var rdashAlpha = /-([a-z])/g;
	  var fcamelCase = function( all, letter ) {
	    return letter.toUpperCase();
	  };
	  return function(str){
	    return str.replace(rdashAlpha,fcamelCase);
	  }

	})();

	//impress.js
	var pfx = (function () {
	  // 看jq的camelcase发现为啥prefixes里面其他前缀都是首字母大写而ie的是首字母小写，举例说明：WebkitTransform msTransform ie自身的bug
	  // 原来的代码里其实没处理带有中划线的名称。
	    var style = document.createElement('dummy').style,
	        prefixes = 'Webkit Moz O ms Khtml'.split(' '),
	        memory = {};
	    return function ( prop ) {
	        prop = camelCase(prop);
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

	var animationendEvent = (function(){
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

	})();
	var animationName = pfx('animationName');
	var animationDuration = pfx('animationDuration');
	var animationTimingFunction = pfx('animationTimingFunction');
	var animationDelay = pfx('animationDelay');
	var animationPlayState = pfx('animationPlayState');
	var animationFillMode = pfx('animationFillMode');
	var animationIterationCount = pfx('animationIterationCount');
	var animationDirection = pfx("animationDirection");

	function Animate(opt){
		if(!(this instanceof Animate)){
			return new Animate(opt);
		}

		if(!opt.selector){
			console.error('you need to bind one element');
		}
		this.ele = document.querySelector(opt.selector);
		if(!this.ele){
			console.error('you pass wrong selector');
		}
		this.pause();
		this.set(opt);

	}

	Animate.prototype = {
		constructor:Animate,
		set:function(opt){
			if(opt.name){
				if(this.ele.style[animationName]){
					this.pause();
					this.ele.style[animationName] = '';
					var _this = this;
					setTimeout(function(){
						_this.ele.style[animationName] = opt.name;
					},0)
				}else{
					this.ele.style[animationName] = opt.name;
				}
			}

			if(opt.duration){
				this.ele.style[animationDuration] = opt.duration;
			}

			if(opt.delay){
				this.ele.style[animationDelay] = opt.delay;
			}

			if(opt.func){
				this.ele.style[animationTimingFunction] = opt.func;
			}

			if(opt.mode){
				this.ele.style[animationFillMode] = opt.mode;
			}else{
				this.ele.style[animationFillMode] = "both";
			}

			if(opt.direction){
				this.ele.style[animationDirection] = opt.direction;
			}

			if(opt.count){
				this.ele.style[animationIterationCount] = opt.count;
			}

			return this;
		},
		run:function(){
			var playState = this.ele.style[animationPlayState];
			if(playState=="paused"){
				this.ele.style[animationPlayState] = "running";
			}
			return this;
		},
		pause:function(){
			this.ele.style[animationPlayState] = "paused";
			return this;
		},
		repeat:function(){
			var name = this.ele.style[animationName];
			this.ele.style[animationName] = "";
			var _this = this;
			setTimeout(function(){
				_this.ele.style[animationName] = name;
			},0);
			return this;
		},
		rightnow:function(){
			this.ele.style[animationDelay] = "0s";
			this.run();
			return this;
		},
		one:function(fn){
			if(typeof fn == 'function'){
				var eventHandler = function(e){
					this.removeEventListener(animationendEvent,eventHandler,false);
					fn(e);
				};
				this.ele.addEventListener(animationendEvent,eventHandler,false);			
			}
			return this;
		},
		on:function(fn){
			if(typeof fn == 'function'){
				this.ele.addEventListener(animationendEvent,fn,false);	
			}
			return this;
		}
	}
	window.Animate = Animate;

})(window);