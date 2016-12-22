(function(window){
	var instance = null;
	var status = null;
	var defaults = {
		selector:"#jumbotron",
		openFunc:'linear',
		openDuration:800,
		closeFunc:'linear',
		closeDuration:500,
		doSthBeforeOpen:function(){

		},
		doSthAfterOpen:function(){

		},
		doSthBeforeClose:function(){

		},
		doSthAfterClose:function(){

		},
	}
	function Jumbotron(option){
	    if(!(this instanceof Jumbotron)){
	        return new Jumbotron(option);
	    }
	    if(!(instance instanceof Jumbotron)){
	    	// 初始化设置
	    	this.option = Object.assign({},defaults,option);
	    	this.init();
	    	instance = this;
	    }
	    return instance;
	}
	Jumbotron.prototype = {
		constructor:Jumbotron,
		init:function(){
			this.ele = document.querySelector(this.option.selector);
			if(!this.ele){
				console.error('missing parameter');
				return;
			}
			this.oriDisplay = window.getComputedStyle(this.ele)['display'];
			this.ele.style.display = "none";
			status = 0;
			var _this = this;
			this.ele.addEventListener(whichTransitionEvent(),function(){
				if(status==1){
					status = 2;
					_this.ele.style.height = "auto";
					gettype(_this.option.doSthAfterOpen)==='function' && _this.option.doSthAfterOpen();
				}else if(status==3){
					status = 4;
					_this.ele.style.display = "none";
					gettype(_this.option.doSthAfterClose)==='function' && _this.option.doSthAfterClose();
				}
			});
		},
		open:function(){
			if(status!==0){
				return;
			}
			gettype(this.option.doSthBeforeOpen)==='function' && this.option.doSthBeforeOpen();
			this.ele.style[pfx('transition')] = "height " + this.option.openDuration + "ms "+ this.option.openFunc;
			this.ele.style.cssText += "display:"+ this.oriDisplay + ";height:0;overflow:hidden;"
			this.ele.style.height = this.ele.scrollHeight + 'px';
			status = 1;
		},
		close:function(){
			if(status!=2){
				return;
			}
			gettype(this.option.doSthBeforeClose)==='function' && this.option.doSthBeforeClose();
			this.ele.style.height = getComputedStyle(this.ele)['height'];
			this.ele.style[pfx('transition')] = "height " + this.option.closeDuration + "ms "+ this.option.closeFunc;
			status = 3;
			getComputedStyle(this.ele)['height'];
			this.ele.style.height = 0;
		}
	}
	window.jumbotron = Jumbotron;
	window.Jumbotron = Jumbotron;
})(window);