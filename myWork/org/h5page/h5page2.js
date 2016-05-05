//php.js
function ucfirst (str) {
  str += ''
  var f = str.charAt(0)
    .toUpperCase()
  return f + str.substr(1)
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
var triggerEvent = function (el, eventName, detail) {
    var event = document.createEvent("CustomEvent");
    event.initCustomEvent(eventName, true, true, detail);
    el.dispatchEvent(event);
};
function getCSS(el,prop){
	  if(prop){
	    return window.getComputedStyle(el)[pfx(prop)];
	  }
	  return window.getComputedStyle(el);
}
(function(document){
	var startTouchX,startTouchY,endTouchX,endTouchY;
	var touchHnadler = {
		toucherstartHandler:function(event){
			startTouchX = event.touches[0].clientX;
			startTouchY = event.touches[0].clientY;			
		},
		touchmoveHandler:function(event){
			event.preventDefault();
			var curTouchX = event.changedTouches[0].clientX;
			var curTouchY = event.changedTouches[0].clientY;
			event.deltaX = curTouchX - startTouchX;
			event.deltaY = curTouchY - startTouchY;			
		},
		touchendHandler:function(event){
			endTouchX = event.changedTouches[0].clientX;
			endTouchY = event.changedTouches[0].clientY;
			var deltaX = endTouchX - startTouchX;
			var deltaY = endTouchY - startTouchY;
			event.deltaX = deltaX;
			event.deltaY = deltaY;
			var absY = Math.abs(deltaY);
			var absX = Math.abs(deltaX);
			if(absX>50 || absY>50){
				var eventName = absX>absY? (deltaX == absX? 'swipeRight':'swipeLeft'):(deltaY==absY? 'swipeDown':'swipeUp');
				triggerEvent(event.target,eventName);
			}			
		}
	}

	document.addEventListener("touchstart",touchHnadler.toucherstartHandler,false);
	document.addEventListener("touchmove",touchHnadler.touchmoveHandler,false);
	document.addEventListener("touchend",touchHnadler.touchendHandler,false);
})(document);

//deal with pfx of transitionent event
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
var arrayify = function ( a ) {
    return [].slice.call( a );
};
//option wrapSelector wrap选择器 
function H5page(option){

	var defaults = {
		wrapSelector:'.h5page-wrap',
		mode:'',
		beforeLeave:function(curPage,nextPage){

		},
		afterLoad:function(nextPage,curPage){

		},
		init:function(){

		}

	}
	//todo callback defaults
	option = Object.assign(defaults,option || {});
	var h5pageWrap = document.querySelector(option.wrapSelector);
	var pages = arrayify(h5pageWrap.children);
	var pageNum = pages.length;
	var h5method = option.role || h5pageWrap.dataset.role;
	h5pageWrap.classList.add('h5page-' + h5method);
	var transition = pfx('transition');
	var transitionendEvent = whichTransitionEvent();
	var animation = pfx('animation');
	var curPage = 1;
	var nextPage = 1;
	var pageSwitch = false;
	var jsMethod;
	// var progressBar = document.querySelector('.progress-bar');
	var arrow = document.getElementById("arrow");
	
	var cfgMethod = {
		'alltogether':{
			goto:function(num){
				if(pageSwitch){
					return;
				}
				nextPage = num;
				if(nextPage<1){
					nextPage = 1;
				}else if(nextPage>pageNum){
					nextPage = pageNum;
				}
				if(nextPage == curPage){
					return;
				}
				h5pageWrap.style[pfx('transform')] = 'translateY(' + (-(nextPage-1)*100 +'%') +')';
				pageSwitch = true;
				option.beforeLeave&&option.beforeLeave(curPage,nextPage);
				addAnimation(nextPage-1);
				toggleArrow()
			},
			pageTransitionEndEvent:function(event){
				if(event.target != h5pageWrap){
					return;
				}
				removeAnimation(curPage-1);
				option.afterLoad&&option.afterLoad(nextPage,curPage);
				curPage = nextPage;
				pageSwitch = false;
			//	updateProgressBar();				
			}
		},
		'step':{
			goto:function(num){
				if(pageSwitch){
					return;
				}
				nextPage = num;
				if(nextPage<1){
					nextPage = 1;
				}else if(nextPage>pageNum){
					nextPage = pageNum;
				}
				if(nextPage == curPage){
					return;
				}
				pages[curPage-1].classList.remove("top");

				var needTransEle = pages[nextPage-1];
				needTransEle.classList.remove("h5page-notShow");
				needTransEle.classList.remove("h5page-hasShown");
				needTransEle.classList.add("h5page-showing");
				needTransEle.classList.add("top");
				pageSwitch = true;
				option.beforeLeave&&option.beforeLeave(curPage,nextPage);
				addAnimation(nextPage-1);
				toggleArrow();		
			},
			pageTransitionEndEvent:function(event){
				var index = pages.indexOf(event.target);
				if(index==-1){
					return;
				}
				if(index != nextPage-1){
					removeAnimation(index);
					return;
				} 
				if(nextPage>curPage){
					var start = curPage;
					var end = nextPage;
					var cls = 'h5page-hasShown';
				}else{
					var start = nextPage+1;
					var end = curPage+1;
					var cls = 'h5page-notShow';
				}
				for(var i=start;i<end;i++){
					var needTransEle = pages[i-1];
					needTransEle.classList.remove("h5page-showing");
					needTransEle.classList.remove("h5page-notShow");
					needTransEle.classList.remove("h5page-hasShown");
					needTransEle.classList.add(cls);
				}
				option.afterLoad&&option.afterLoad(nextPage,curPage);
				curPage = nextPage;
				pageSwitch = false;
			//	updateProgressBar();				

			}
		},
		'twotogether':{
			goto:function(num){
				if(pageSwitch){
					return;
				}
				nextPage = num;
				if(nextPage<1){
					nextPage = 1;
				}else if(nextPage>pageNum){
					nextPage = pageNum;
				}
				if(nextPage == curPage){
					return;
				}
				if(nextPage>curPage){
					var start = curPage;
					var end = nextPage;
					var cls = "h5page-hasShown";
				}else{
					var start = nextPage+1;
					var end = curPage+1;
					var cls = "h5page-notShow";
				}
				for(var i=start;i<end;i++){
					var needTransEle = pages[i-1];
					needTransEle.classList.remove("h5page-showing");
					needTransEle.classList.remove("h5page-notShow");
					needTransEle.classList.remove("h5page-hasShown");
					needTransEle.classList.add(cls);
				}
			 	var needTransEle = pages[nextPage-1];
			 	needTransEle.classList.remove("h5page-notShow");
			 	needTransEle.classList.remove("h5page-hasShown");
			 	needTransEle.classList.add("h5page-showing");
			 	pageSwitch = true;
			 	option.beforeLeave&&option.beforeLeave(curPage,nextPage);
			 	addAnimation(nextPage-1);
			 	toggleArrow();
			},
			pageTransitionEndEvent:function(event){
				var index = pages.indexOf(event.target);
				if(index == -1){
					return;
				}
				if(index != nextPage-1){
					removeAnimation(index);
					return;
				} 
				option.afterLoad&&option.afterLoad(nextPage,curPage);
				curPage = nextPage;
				pageSwitch = false;
			//	updateProgressBar();
			}
		},
		'oneonly':{
			goto:function(num){
				if(pageSwitch){
					return;
				}
				nextPage = num;
				if(nextPage<1){
					nextPage = 1;
				}else if(nextPage>pageNum){
					nextPage = pageNum;
				}
				if(nextPage == curPage){
					return;
				}				
				if(nextPage>curPage){
					for(var i = curPage+1;i<=nextPage;i++){
						var needTransEle = pages[i-1];
						needTransEle.classList.remove("h5page-notShow");
						needTransEle.classList.add("h5page-showing");						
					}
				}else{
					for(var i = nextPage+1;i<=curPage;i++){
						var needTransEle = pages[i-1];
						needTransEle.classList.remove("h5page-showing");	
						needTransEle.classList.add("h5page-notShow");						
					}					
				}
				pageSwitch = true;
				option.beforeLeave&&option.beforeLeave(curPage,nextPage);
				addAnimation(nextPage-1);				
				toggleArrow();
			},

			pageTransitionEndEvent:function(event){
				var index = pages.indexOf(event.target);
				if( index == -1 ){
					return;
				}

				if(nextPage>curPage){
					var start = curPage;
					var end = nextPage;
					index == nextPage-1 && option.afterLoad&&option.afterLoad(nextPage,curPage);
				}else{
					var start = nextPage+1;
					var end = curPage+1;
					index == curPage-1 && option.afterLoad&&option.afterLoad(nextPage,curPage);
				}
				for(var i = start;i<end;i++){
					removeAnimation(i-1);
				}
				curPage = nextPage;
				pageSwitch = false;
			//	updateProgressBar();
			}			
		}
	};
	var cfgInit = {
		threeD:function(){
			var winH = getCSS(document.documentElement,"height");
			var styleEle = document.createElement("style");
			//是一个很笨的方法，这里的前缀也不能用上面的pfx，浏览器不认
			styleEle.innerHTML = ".h5page-threeD .h5page-notShow{ -webkit-transform: translate3d(0," + winH + ", 0) rotate3d(1, 0, 0, -90deg); transform: translate3d(0, " + winH +", 0) rotate3d(1, 0, 0, -90deg);";
			document.head.appendChild(styleEle);					
		},
	}; 
	//整体思路是css控制页面切换效果，但是对应的js就那么几个,气候css控制的页面切换多了，就在这里添加cfg
	var cfgPageRole = {
		alltogether:["unite"],//整体动
		step:["seperate"],//下一页先动，动完上一页再动
		twotogether:["threeD",'unite2'],//上下两页一起动
		oneonly:["notMove"]//仅仅动下一页
	}
	if(option.mode){
		jsMethod = option.mode;
	}else{
		for(k in cfgPageRole){
			if(cfgPageRole.hasOwnProperty(k)){
				var arr = cfgPageRole[k];
				if(arr.indexOf(h5method)>-1){
					jsMethod = k;
					break;
				}
			}
		}		
	}

	var mode = cfgMethod[jsMethod];

	function addAnimation(pageNum){
		var curPageAnimationEle = pages[pageNum].querySelectorAll("[data-role='animation']");
		for(var i = 0;i<curPageAnimationEle.length;i++){
			var thisEle = curPageAnimationEle[i];
			thisEle.style[animation] = thisEle.dataset.method;
		}
	}
	function removeAnimation(pageNum){
		if(pageNum<0){return;}
		var curPageAnimationEle = pages[pageNum].querySelectorAll("[data-role='animation']");
		for(var i = 0;i<curPageAnimationEle.length;i++){
			var thisEle = curPageAnimationEle[i];
			thisEle.style[animation] = '';
		}		
	}
	function toggleArrow(){
		arrow.style.display = (nextPage == pageNum? 'none':'block');
	}
	// function updateProgressBar(){
	// 	progressBar.style.width = (curPage/pageNum)*100 +"%";
	// }

	return {
		init:function(){
			option.init&&option.init();
			cfgInit[h5method]&&cfgInit[h5method]();
			mode['pageTransitionEndEvent']&&h5pageWrap.addEventListener(transitionendEvent,mode['pageTransitionEndEvent'],false);
			addAnimation(0);
		//	updateProgressBar();
		},
		prev:function(){
			mode['goto'](curPage-1);
		},
		next:function(){
			mode['goto'](curPage+1);
		},
		goto:function(num){
			mode['goto'](num);
		},
		top:function(){
			mode['goto'](1);
		},
		bottom:function(){
			mode['goto'](pageNum);
		}
	}
}
