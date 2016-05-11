(function(document,window){
	var startTouchX,startTouchY,endTouchX,endTouchY;
	function toucherstartHandler(event){
		if(event.touches.length == 1){
			startTouchX = event.touches[0].clientX;
			startTouchY = event.touches[0].clientY;
		}
	}
	function touchmoveHandler(event){
		if(event.touches.length == 1){
			var curTouchX = event.changedTouches[0].clientX;
			var curTouchY = event.changedTouches[0].clientY;
			event.deltaX = curTouchX - startTouchX;
			event.deltaY = curTouchY - startTouchY;
		}
	}
	function touchendHandler(event){
		if(event.touches.length == 1){
			endTouchX = event.changedTouches[0].clientX;
			endTouchY = event.changedTouches[0].clientY;
			event.deltaX = endTouchX - startTouchX;
			event.deltaY = endTouchY - startTouchY;
		}
	}
	document.addEventListener("touchstart",toucherstartHandler,false);
	document.addEventListener("touchmove",touchmoveHandler,false);
	document.addEventListener("touchend",touchendHandler,false);
})(document,window);