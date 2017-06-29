(function(window){

	function H5page(option){
	    if(!option||!option.style){
	    	return;
	    }
	    return new H5page._style[option.style](option);
	}
	H5page._style = {};
	H5page.prototype = Object.assign({},Widget.prototype,{
		constructor:H5page,

	});
	H5page.setStyle = function(name,obj){
		this._style[name] = obj;
		this._style[name].prototype = this.prototype;
	}
	H5page.defaults = {

	}
	var _h5page = window.H5page;
	H5page.noConflict = function(){
		window.H5page = _h5page;
		return H5page;
	}
	window.H5page = H5page;
})(window);