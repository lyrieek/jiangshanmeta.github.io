(function(window){
	// 想实现一个单例
	var instance = null;
	function Jumbotron(option){
	    if(!(this instanceof Jumbotron)){
	        return new Jumbotron(option);
	    }
	    if(!(instance instanceof Jumbotron)){
	    	// 初始化设置
	    	this._mergeOpt(option);
	    	this.initDOM();
	    	instance = this;
	    }
	    return instance;
	}
	Jumbotron.defaults = {
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
	};
	Jumbotron.prototype = Object.assign({},Widget.prototype,{
		constructor:Jumbotron,
		initDOM:function(){
			this._bindContainer();
			if(!this.container){
				console.error('missing parameter');
				return;
			}
			this.oriDisplay = window.getComputedStyle(this.container)['display'];
			this.container.style.display = "none";
			this.status = 0;
			var _this = this;
			this.container.addEventListener(whichTransitionEvent(),function(){
				if(_this.status==1){
					_this.status = 2;
					_this.container.style.height = "auto";
					_this.$emit('afterOpen');
				}else if(_this.status==3){
					_this.status = 4;
					_this.container.style.display = "none";
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
			this.container.style[pfx('transition')] = "height " + this.options.openDuration + "ms "+ this.options.openFunc;
			this.container.style.cssText += "display:"+ this.oriDisplay + ";height:0;overflow:hidden;"
			this.container.style.height = this.container.scrollHeight + 'px';
			this.status = 1;
		},
		close:function(){
			if(this.status!=2){
				return;
			}
			this.$emit('beforeClose');
			this.container.style.height = getComputedStyle(this.container)['height'];
			this.container.style[pfx('transition')] = "height " + this.options.closeDuration + "ms "+ this.options.closeFunc;
			this.status = 3;
			getComputedStyle(this.container)['height'];
			this.container.style.height = 0;
		}
	});
	var _jumbotron = window.Jumbotron;
	Jumbotron.noConflict = function(){
		window.Jumbotron = _jumbotron;
		return Jumbotron;
	}
	
	window.Jumbotron = Jumbotron;
})(window);