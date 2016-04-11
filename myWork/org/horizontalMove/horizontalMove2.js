function ucfirst (str) {
  str += ''
  var f = str.charAt(0)
    .toUpperCase()
  return f + str.substr(1)
}
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
function getCSS(el,prop){
	  if(prop){
	    return window.getComputedStyle(el)[pfx(prop)];
	  }
	  return window.getComputedStyle(el);
}
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
(function(document,window){
	var horizontalMove = window.horizontalMove = function(selector){
		var selector = selector || '.horizontalMove';
		//这里的dx是指水平方向和原来的偏移量
		var dx;
		var elem = document.querySelector(selector);

		var elemW = parseInt(getCSS(elem,"width"));
		var winW = parseInt(getCSS(document.documentElement,'width'));
		var offsetLeft = elem.getBoundingClientRect().left + document.body.scrollLeft;
		var minX = winW - offsetLeft - elemW;
		var transTF = elem.dataset.timefunc || "ease";
		var transDuration = elem.dataset.time || "600ms";
		var transDelay = elem.dataset.delay || "0s";
		var transitionStr = "all "+ transDuration + " " + transTF + " " + transDelay;
		var setTransition = function(){
			elem.style[pfx("transition")] = transitionStr;
		}
		var init = function(){
			touch.on(selector,'touchstart',function(event){
				event.preventDefault();
			});
			touch.on(selector,'drag',function(event){
				dx = dx || 0;
				var offx = dx + event.x + 'px';
				elem.style[pfx('transform')] = "translate3d(" + offx + ",0,0)";
			});
			touch.on(selector,"dragend",function(event){
				dx += event.x;
				if(dx>0){
					setTransition();
					elem.style[pfx('transform')] = "translate3d(0,0,0)";
				}else if(dx<minX){
					setTransition();
					elem.style[pfx('transform')] = "translate3d("+ minX + "px" + ",0,0)";
				}
			});		
			elem.addEventListener(whichTransitionEvent(),function(event){
				this.style[pfx("transition")] = '';
				if(dx>0){
					dx = 0;
				}else{
					dx = minX;
				}
			},false);
		}
		return {
			'init':init
		}
	}



})(document,window);