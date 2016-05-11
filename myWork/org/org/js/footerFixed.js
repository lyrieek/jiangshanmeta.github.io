$.fn.footerFixed = function(){
	var windowH = $(window).height();
	var bodyH = $("body").height();
	if(bodyH<windowH){
		$(this).css({position:'fixed','bottom':'0','width':'100%'});
	}
}