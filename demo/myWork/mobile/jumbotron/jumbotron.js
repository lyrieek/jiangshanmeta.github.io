(function(window){
	// 想实现一个单例
	var instance = null;
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
	    	this.options = Object.assign({},defaults,option||{});
	    	this.initDOM();
	    	instance = this;
	    }
	    return instance;
	}
	Jumbotron.prototype = Object.assign({},Widget.prototype,{
		constructor:Jumbotron,
		initDOM:function(){
			this.ele = document.querySelector(this.options.selector);
			if(!this.ele){
				console.error('missing parameter');
				return;
			}
			this.oriDisplay = window.getComputedStyle(this.ele)['display'];
			this.ele.style.display = "none";
			this.status = 0;
			var _this = this;
			this.ele.addEventListener(whichTransitionEvent(),function(){
				if(_this.status==1){
					_this.status = 2;
					_this.ele.style.height = "auto";
					_this.$emit('afterOpen');
				}else if(_this.status==3){
					_this.status = 4;
					_this.ele.style.display = "none";
					_this.$emit('afterClose');
				}
			});
			this._bindEvent({
				'beforeOpen':'doSthBeforeOpen',
				'afterOpen':'doSthAfterOpen',
				'beforeClose':'doSthBeforeClose',
				'afterClose':'doSthAfterClose',
			});
		},
		open:function(){
			if(this.status!==0){
				return;
			}
			this.$emit('beforeOpen');
			this.ele.style[pfx('transition')] = "height " + this.options.openDuration + "ms "+ this.options.openFunc;
			this.ele.style.cssText += "display:"+ this.oriDisplay + ";height:0;overflow:hidden;"
			this.ele.style.height = this.ele.scrollHeight + 'px';
			this.status = 1;
		},
		close:function(){
			if(this.status!=2){
				return;
			}
			this.$emit('beforeClose');
			this.ele.style.height = getComputedStyle(this.ele)['height'];
			this.ele.style[pfx('transition')] = "height " + this.options.closeDuration + "ms "+ this.options.closeFunc;
			this.status = 3;
			getComputedStyle(this.ele)['height'];
			this.ele.style.height = 0;
		}
	});

	window.jumbotron = Jumbotron;
	window.Jumbotron = Jumbotron;
})(window);