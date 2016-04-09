//php.js
function ucfirst (str) {
  str += ''
  var f = str.charAt(0)
    .toUpperCase()
  return f + str.substr(1)
}
function array_search (needle, haystack, argStrict) {
  var strict = !!argStrict,
    key = ''

  if (haystack && typeof haystack === 'object' && haystack.change_key_case) {
    // Duck-type check for our own array()-created PHPJS_Array
    return haystack.search(needle, argStrict)
  }
  if (typeof needle === 'object' && needle.exec) {
    // Duck-type for RegExp
    if (!strict) {
      // Let's consider case sensitive searches as strict
      var flags = 'i' + (needle.global ? 'g' : '') +
        (needle.multiline ? 'm' : '') +
        // sticky is FF only
        (needle.sticky ? 'y' : '')
      needle = new RegExp(needle.source, flags)
    }
    for (key in haystack) {
      if (haystack.hasOwnProperty(key)) {
        if (needle.test(haystack[key])) {
          return key
        }
      }
    }
    return false
  }

  for (key in haystack) {
    if (haystack.hasOwnProperty(key)) {
      if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
        return key
      }
    }
  }

  return false
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
(function(document,window){
	var startTouchX,startTouchY,endTouchX,endTouchY;
	function toucherstartHandler(event){
		startTouchX = event.touches[0].clientX;
		startTouchY = event.touches[0].clientY;
	}
	function touchmoveHandler(event){
		event.preventDefault();
		var curTouchX = event.changedTouches[0].clientX;
		var curTouchY = event.changedTouches[0].clientY;
		event.deltaX = curTouchX - startTouchX;
		event.deltaY = curTouchY - startTouchY;
	}
	function touchendHandler(event){
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
	document.addEventListener("touchstart",toucherstartHandler,false);
	document.addEventListener("touchmove",touchmoveHandler,false);
	document.addEventListener("touchend",touchendHandler,false);
})(document,window);

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
(function(){
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
	var cfgMethod = {
		'unite':{
			swipeUpEvent:function(event){
				nextPage = curPage + 1;
				if(nextPage>pageNum){
					nextPage = curPage;
					return;
				}
				toggleArrow();
				h5pageWrap.style[pfx('transform')] = 'translateY(' + (-(nextPage-1)*100 +'%') +')';
				addAnimation(nextPage-1);	
			},
			swipeDownEvent:function(event){
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
			swipeUpEvent:function(event){
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
				addAnimation(nextPage-1);
			},
			swipeDownEvent:function(event){
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
				addAnimation(nextPage-1);				
			},
			pageTransitionEndEvent:function(event){
				if(!event.target.classList.contains("h5page")){
					return;
				}
				if(!event.target.classList.contains("h5page-showing")){
					removeAnimation(array_search(event.target,pages));
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
		}
	};
	var mode = cfgMethod[h5method];
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
	if(mode['swipeUpEvent']){
		document.addEventListener("swipeUp",mode['swipeUpEvent'],false);
	}
	if(mode['swipeDownEvent']){
		document.addEventListener("swipeDown",mode['swipeDownEvent'],false);
	}
	if(mode['pageTransitionEndEvent']){
		h5pageWrap.addEventListener(transitionendEvent,mode['pageTransitionEndEvent'],false);
	}
	addAnimation(0);
	updateProgressBar();

})();
