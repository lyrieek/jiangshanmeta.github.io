/*       navFixed       */
/*  author : Jasin Yip  */
/*  version: 1.0.2      */
/*  http://navfixed.jasinyip.com/ */
/*  update by jiangshan 2016.03.18  */

$.fn.navFixed = function(){
	var $_this = $(this);
	var _this_prev_marginBottom,_this_next_marginTop,_this_marginTop,_this_marginBottom,_real_margin_top,_real_margin_bottom,_topPosition,_navPosition,_fixMarginTop;

	_calParameter();
	_if();


	$(document).scroll( function() {

		_topPosition = $(document).scrollTop();
		_if();
	});

	$(window).resize(function(){ 
		_calParameter();
		_if();
	}); 

	function _calParameter(){
		 _this_prev_marginBottom = parseInt($_this.prev().css('margin-bottom'));
		 _this_next_marginTop = parseInt($_this.next().css('margin-top'));
		 _this_marginTop = parseInt($_this.css("margin-top"));
		 _this_marginBottom = parseInt($_this.css("margin-bottom"));

		//consider of complex box model 
		 _real_margin_top = Math.max(_this_prev_marginBottom,_this_marginTop);
		 _real_margin_bottom = Math.max(_this_next_marginTop,_this_marginBottom);

		 _topPosition = $(document).scrollTop();

		//offset().top 以整个盒子为标准计算，实际用的时候要减去上边距
		 _navPosition = $_this.offset().top - _this_marginTop;
		 _fixMarginTop = _real_margin_top + _real_margin_bottom + $_this.outerHeight();

	}

	function _if(){
		if (_topPosition >= _navPosition){
			$_this.css('position','fixed');
			$_this.next().css("margin-top", _fixMarginTop );
		}else{
			$_this.css("position", "relative");
			$_this.next().css("margin-top", _this_next_marginTop );
		}
	}


}