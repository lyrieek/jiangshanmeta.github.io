//常用工具函数
if (!String.prototype.str_supplant) {
    String.prototype.str_supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
    };
}
function isset() {

  var a = arguments,
    l = a.length,
    i = 0,
    undef;

  if (l === 0) {
    throw new Error('Empty isset');
  }

  while (i !== l) {
    if (a[i] === undef || a[i] === null) {
      return false;
    }
    i++;
  }
  return true;
}
function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (Object.prototype.toString.call(value) == '[object Array]') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}
function in_array(needle, haystack, argStrict) {
  var key = '',
    strict = !! argStrict;
  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        return true;
      }
    }
  }
  return false;
}
function ucfirst (str) {
  str += '';
  var f = str.charAt(0).toUpperCase();
  return f + str.substr(1);
}
function arrayify(el){
	return Array.isArray(el)? el:((el instanceof NodeList || el instanceof HTMLCollection ) ? [].slice.call(el) : [el]) ;
}
//代替jQuery的extend，主要的函数是Object.assign
function extend(out){
	out = out || {};
	var argArr = [].slice.call(arguments);
	argArr.shift();
	argArr.forEach(function(item){
		Object.assign(out,item);
	})
	return out;
}

//深度拷贝,http://youmightnotneedjquery.com/#deep_extend
function deepExtend(out) {
  out = out || {};
  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];
    if (!obj){continue;}

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object'){
          out[key] = deepExtend(out[key], obj[key]);
  		}else{
          out[key] = obj[key];
        }
      }
    }
  }

  return out;
};


//常用BOM操作
function refresh(){
    location.reload(true);
}
function gotoUrl(url){
    location.href = url;
}
function gotoPrev(){
    history.go(-1);
}
//事件操作
function triggerEvent(el, eventName, detail){
    var event = document.createEvent("CustomEvent");
    event.initCustomEvent(eventName, true, true, detail);
    el.dispatchEvent(event);
}

//ajax
//todo


//常用DOM操作的
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
var pfxInStyleSheet = (function () {
    var style = document.createElement('dummy').style,
        prefixes = 'Webkit Moz O ms Khtml'.split(' '),
        prefixesInstylesheet = ['','-webkit-','-moz-','-o-','-ms-','-khtml-'];
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
                    memory[ prop ] = prefixesInstylesheet[i] + prop;
                    break;
                }
            }
        }
        
        return memory[ prop ];
    };
})();
function addClass(el,className){
	if (typeof el === 'string') {
		el = document.querySelectorAll(el);
	}
	var els = arrayify(el); 
	var classNames = className.split(" ");
	els.forEach(function(item){
		classNames.forEach(function(cls){
			item.classList.add(cls);
		})
	});
}
function removeClass(el,className){
	if (typeof el === 'string') {
		el = document.querySelectorAll(el);
	}
	var els = arrayify(el);
	var classNames = className.split(" ");
	els.forEach(function(item){
		classNames.forEach(function(cls){
			item.classList.remove(cls);
		})
	});
}
function hasClass(el,className){
	if (typeof el === 'string') {
		el = document.querySelector(el);
	}
	return el.classList.contains(className);
}
function toggleClass(el,className){
	if (typeof el === 'string') {
		el = document.querySelectorAll(el);
	}
	var els = arrayify(el);
	var classNames = className.split(" ");
	els.forEach(function(item){
		classNames.forEach(function(cls){
			item.classList.toggle(cls);
		})
	});
}
function getCSS(el,prop){
	if (typeof el === 'string') {
		el = document.querySelector(el);
	}	
	if(prop){
	  return getComputedStyle(el)[pfx(prop)];
	}
	return getComputedStyle(el);
}
function setCSS(el,props){
	if(typeof props != 'object'){return;}
	if (typeof el === 'string') {
		el = document.querySelectorAll(el);
	}
	var els = arrayify(el);
	els.forEach(function(item){
		for(propName in props){
			if(props.hasOwnProperty(propName)){
				item.style[pfx(propName)] = props[propName];
			}
		}
	})	
}
function getData(el,dataName){
	if (typeof el === 'string') {
		el = document.querySelector(el);
	}
	if(dataName){
		return el.dataset[dataName]; 
	}
	return el.dataset;	
}
//之所以要写这个函数是因为要有些样式是要根据浏览器环境重写
function insertRule(styleStr){
	//数据组织方式不好想，干脆和insertRule类似传入一个字符串好了
	var styleEle = document.createElement("style");
	styleEle.innerHTML = styleStr;
	document.head.appendChild(styleEle);
}
//jquery的index通常使用的时候也就是取当前元素在兄弟节点中的位置，这里传入的一定要是一个DOM节点
function indexOfEle(el){
	return [].indexOf.call(el.parentNode.children,el);
}