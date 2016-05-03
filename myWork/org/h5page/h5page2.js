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

function H5page(){
	var curPage = 1;
	var nextPage = 1;
	var typ;
	var pages = arrayify(document.querySelectorAll(".h5page"));
	var pageNum = pages.length;
	var progressBar = document.querySelector('.progress-bar');
	var transition =pfx('transition');
	var transitionendEvent = whichTransitionEvent();
	var animation = pfx('animation');
	var h5pageWrap = document.querySelector(".h5page-wrap");
	var h5method = h5pageWrap.dataset.role;
	h5pageWrap.classList.add('h5page-' + h5method);
	var arrow = document.getElementById("arrow");
	var pageSwitch = false;
	var jsMethod;
	//这里本来只有一种页面切换方式，而且也不是这种组织形式，后来看得多了想实现的也多了，就写成了这种cfg的形式，想来想去页面的切换方式也就那么多
	//下一个页面一定要展示上来，这是毫无疑问的，问题是上一个页面要不要动，如果动的话实现了两种，一种是把所有的页面看成一个整体，对应unite，
	//一种是把各个页面分离开，对应threeD,如果下一个页面动的时候上一个页面不动，问题是下一个页面动完，上一个页面去哪里，如果动，则对应seperate
	//如果不动，则对应notMove
	var cfgMethod = {
		'unite':{
			swipeUpEvent:function(){
				nextPage = curPage + 1;
				if(nextPage>pageNum){
					nextPage = curPage;
					return;
				}
				toggleArrow();
				h5pageWrap.style[pfx('transform')] = 'translateY(' + (-(nextPage-1)*100 +'%') +')';
				addAnimation(nextPage-1);	
			},
			swipeDownEvent:function(){
				nextPage = curPage-1;
				if(nextPage<1){
					nextPage = 1;
					return;
				}
				h5pageWrap.style[pfx('transform')] = 'translateY(' + (-(nextPage-1)*100 +'%') +')';
				addAnimation(nextPage-1);		
				toggleArrow();
			},
			pageTransitionEndEvent:function(event){
				if(!event.target.classList.contains("h5page-wrap")){
					return;
				}
				removeAnimation(curPage-1);
				curPage = nextPage;
				updateProgressBar();				
			}
		},
		'seperate':{
			swipeUpEvent:function(){
				if(pageSwitch){
					return;
				}
				typ = "swipeup";
				nextPage = curPage + 1;
				if(nextPage>pageNum){
					nextPage = curPage;
					return;
				}
				toggleArrow();
				var needTransEle = pages[nextPage-1];
				needTransEle.classList.remove("h5page-notShow");	
				needTransEle.classList.add("h5page-showing");		
				needTransEle.classList.add("top");
				pages[curPage-1].classList.remove("top");
				pageSwitch = true;
				addAnimation(nextPage-1);
			},
			swipeDownEvent:function(){
				if(pageSwitch){
					return;
				}				
				typ = "swipedown";
				nextPage = curPage-1;
				if(nextPage<1){
					nextPage = 1;
					return;
				}
				toggleArrow();
				pages[curPage-1].classList.remove("top");
				var needTransEle = pages[nextPage-1];
				needTransEle.classList.remove("h5page-hasShown");	
				needTransEle.classList.add("h5page-showing");		
				needTransEle.classList.add("top");
				pageSwitch = true;
				addAnimation(nextPage-1);				
			},
			pageTransitionEndEvent:function(event){
				if(!event.target.classList.contains("h5page")){
					return;
				}
				if(!event.target.classList.contains("h5page-showing")){
					removeAnimation(pages.indexOf(event.target));
					return;
				}
				var needTransEle = pages[curPage-1];
				needTransEle.classList.remove("h5page-showing");
				if(typ == 'swipeup'){
					needTransEle.classList.add("h5page-hasShown");
				}else if(typ == 'swipedown'){
					needTransEle.classList.add("h5page-notShow");
				}
				curPage = nextPage;
				pageSwitch = false;
				updateProgressBar();				

			}
		},
		'threeD':{
			swipeUpEvent:function(){
				if(pageSwitch){
					return;
				}
				typ = "swipeup";
				nextPage = curPage + 1;
				if(nextPage>pageNum){
					nextPage = curPage;
					return;
				}
				toggleArrow();
				var curPageEle = pages[curPage-1];
				var needTransEle = pages[nextPage-1];
				curPageEle.classList.remove("h5page-showing");
				curPageEle.classList.add("h5page-hasShown");	
				needTransEle.classList.remove("h5page-notShow");	
				needTransEle.classList.add("h5page-showing");		
				addAnimation(nextPage-1);
			},
			swipeDownEvent:function(){
				if(pageSwitch){
					return;
				}				
				typ = "swipedown";
				nextPage = curPage-1;
				if(nextPage<1){
					nextPage = 1;
					return;
				}
				toggleArrow();
				var curPageEle = pages[curPage-1];
				var needTransEle = pages[nextPage-1];
				curPageEle.classList.remove("h5page-showing");
				curPageEle.classList.add("h5page-notShow");
				needTransEle.classList.remove("h5page-hasShown");	
				needTransEle.classList.add("h5page-showing");		
				pageSwitch = true;
				addAnimation(nextPage-1);	
			},
			pageTransitionEndEvent:function(event){
				if(!event.target.classList.contains("h5page")){
					return;
				}
				if(!event.target.classList.contains("h5page-showing")){
					removeAnimation(pages.indexOf(event.target));
					return;
				}
				curPage = nextPage;
				pageSwitch = false;
				updateProgressBar();
			}
		},
		'notMove':{
			swipeUpEvent:function(){
				if(pageSwitch){
					return;
				}
				typ = "swipeup";
				nextPage = curPage + 1;
				if(nextPage>pageNum){
					nextPage = curPage;
					return;
				}
				toggleArrow();
				var needTransEle = pages[nextPage-1];
				needTransEle.classList.remove("h5page-notShow");	
				needTransEle.classList.add("h5page-showing");		
				pageSwitch = true;
				addAnimation(nextPage-1);
			},
			swipeDownEvent:function(){
				if(pageSwitch){
					return;
				}				
				typ = "swipedown";
				nextPage = curPage-1;
				if(nextPage<1){
					nextPage = 1;
					return;
				}
				toggleArrow();
				var needTransEle = pages[curPage-1];
				needTransEle.classList.remove("h5page-showing");	
				needTransEle.classList.add("h5page-notShow");		
				pageSwitch = true;
				addAnimation(nextPage-1);				
			},
			pageTransitionEndEvent:function(event){
				if(!event.target.classList.contains("h5page")){
					return;
				}
				removeAnimation(curPage-1);
				curPage = nextPage;
				pageSwitch = false;
				updateProgressBar();
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
	//整体思路是css控制页面切换效果，但是对应的js就那么几个
	var cfgPageRole = {
		unite:["unite"],//整体动
		seperate:["seperate"],//下一页先动，动完上一页再动
		threeD:["threeD",'unite2'],//上下两页一起动
		notMove:["notMove"]//仅仅动下一页
	}

	for(k in cfgPageRole){
		if(cfgPageRole.hasOwnProperty(k)){
			var arr = cfgPageRole[k];
			if(arr.indexOf(h5method)>-1){
				jsMethod = k;
				break;
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
		var curPageAnimationEle = pages[pageNum].querySelectorAll("[data-role='animation']");
		for(var i = 0;i<curPageAnimationEle.length;i++){
			var thisEle = curPageAnimationEle[i];
			thisEle.style[animation] = '';
		}		
	}
	function toggleArrow(){
		arrow.style.display = (nextPage == pageNum? 'none':'block');
	}
	function updateProgressBar(){
		progressBar.style.width = (curPage/pageNum)*100 +"%";
	}

	return {
		init:function(){
			cfgInit[h5method]&&cfgInit[h5method]();
			mode['swipeUpEvent']&&document.addEventListener("swipeUp",mode['swipeUpEvent'],false);
			mode['swipeDownEvent']&&document.addEventListener("swipeDown",mode['swipeDownEvent'],false);
			mode['pageTransitionEndEvent']&&h5pageWrap.addEventListener(transitionendEvent,mode['pageTransitionEndEvent'],false);
			
			addAnimation(0);
			updateProgressBar();
		},
		prev:function(){
			mode['swipeDownEvent']();
		},
		next:function(){
			mode['swipeUpEvent']();
		}
	}
}
