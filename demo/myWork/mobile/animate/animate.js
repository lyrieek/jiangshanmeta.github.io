(function(window){

	function Animate(opt){
		if(!(this instanceof Animate)){
			return new Animate(opt);
		}
		// 事件 before end


	}

	Animate.prototype = {
		constructor:Animate,
		set:function(){

		},
		run:function(){

			return this;
		},
		pause:function(){

			return this;
		},
		repeat:function(){

			return this;
		},
	}
	window.Animate = Animate;

})(window);