(function($){
	$.fn.horizontalMove = function(opts){
		var defaults = {	
			transTimeFunc:'ease',
			transDuration:'600ms',
			transDelay:'0s'
		}

		var opt = $.extend({},defaults,opts || {});
		return this.each(function(){
			var selector = $(this);
			var touchStartX;
			var touchEndX;
			var touchMoveX;
			var deltaX;
			var lastX = 0;
			var minX =$(window).width() - selector.width() - selector.offset().left ;
			var trans_templete = 'all {transDuration} {transTimeFunc} {transDelay}';
			function touchStartHandler(event){
				touchStartX = event.originalEvent.touches[0].clientX;
			}
			function touchMoveHandler(event){
				touchMoveX = event.originalEvent.changedTouches[0].clientX;
			    deltaX = touchMoveX - touchStartX;
				selector.css('transform','translateX('+ (lastX + deltaX) +'px)');
			}
			function touchEndHandler(event){
				touchEndX = event.originalEvent.changedTouches[0].clientX;
				deltaX = touchEndX - touchStartX;
				var finalX = lastX + deltaX;
				if(finalX>0){
					selector.css({
						'transform':'translateX(0)',
						'transition':(trans_templete.str_supplant({'transDuration':opt.transDuration,'transTimeFunc':opt.transTimeFunc,'transDelay':opt.transDelay}))
					})
					selector.on("transitionend",function(){
						lastX = 0;
						selector.css("transition","");
					});
				}else if(finalX<minX){
					selector.css({
						'transform':'translateX('+ minX + 'px)',
						'transition':(trans_templete.str_supplant({'transDuration':opt.transDuration,'transTimeFunc':opt.transTimeFunc,'transDelay':opt.transDelay}))
					})
					selector.on("transitionend",function(){
						lastX = minX;
						selector.css("transition","");
					});
				}else{
					selector.css('transform','translateX('+ (finalX) +'px)');
					lastX = finalX;					
				}
			}
			selector.on("touchstart",touchStartHandler);
			selector.on("touchmove",touchMoveHandler);
			selector.on("touchend",touchEndHandler);
		})
	}
})(jQuery)
