"use strict";
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
var addEvent = function(obj,type,fn){
	obj.addEventListener(type,fn,false);
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
	addEvent(document,"touchstart",toucherstartHandler);
	addEvent(document,"touchmove",touchmoveHandler);
	addEvent(document,"touchend",touchendHandler);
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


{
	let wWidth = document.documentElement.clientWidth;
	let list = document.querySelector(".list");
	let listItems = Array.from(list.getElementsByClassName("list-item"));
	let tabNum = listItems.length; 
	let transform = pfx("transform");
	let transEvent = whichTransitionEvent();
	let moving = false;
	listItems.forEach(function(item){
		item.style.width = wWidth + "px";
	});
	let curIndex = 0;
	let menus = Array.from(document.getElementsByClassName("nav-item"));
	let drag = {
		goto:function(num){
			if(moving){return;}
			list.style[transform] = "translate3d(" + (-curIndex*wWidth) + "px,0,0)";
			moving = true;
			menus.forEach(function(item){
				item.classList.remove("active");
			})
			menus[curIndex].classList.add("active");
		},
		prev:function(){
			if(moving){return;}
			if(curIndex <= 0){
				return;
			}
			curIndex--;
			drag.goto();
		},
		next:function(){
			if(moving){return;}
			if(curIndex >= (tabNum-1)){return;}
			curIndex++;
			drag.goto();
		},
		finish:function(){
			moving = false;
		}
	}

	
	menus.forEach(function(item,index){
		console.log(index)
		item.index = index;
		addEvent(item,"click",function(event){
			if(!event.target.classList.contains("nav-item")){return;}
			curIndex = this.index;
			drag.goto();
		});
	})
	addEvent(list,transEvent,drag.finish);
	addEvent(document,"swipeRight",drag.prev);
	addEvent(document,"swipeLeft",drag.next);

}