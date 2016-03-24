(function($){
	var curPage = 1;
	var nextPage,typ;
	var pageNum = $(".h5page").size();
	var progressBar = $(".progress-bar");
	$(document).on("swipeUp",function(){
		typ = "swipeup";
		nextPage = curPage+1;
		if(nextPage>pageNum){
			nextPage = curPage;
			return;
		}
		$(".h5page[data-index='"+nextPage +"']").removeClass("h5page-notShow").addClass("h5page-showing");
		
	});

	$(".h5page").on("transitionend webkitTransitionEnd",function(event){

		if(!$(this).hasClass("h5page-showing")  || event.target != this ){
			return;
		}

		if(typ == 'swipeup'){
			$(".h5page[data-index='" + curPage +"']").removeClass("h5page-showing").addClass("h5page-hasShown");
		}else if(typ == 'swipedown'){
			$(".h5page[data-index='" + curPage +"']").removeClass("h5page-showing").addClass("h5page-notShow");
		}
		curPage = $(this).data("index");
		progressBar.css("width",(curPage/pageNum)*100 +"%");
	})
	$(document).on("swipeDown",function(){
		typ = "swipedown";
		nextPage = curPage-1;
		if(nextPage<1){
			nextPage = 1;
			return;
		}

		$(".h5page").removeClass("top")
		$(".h5page[data-index='"+nextPage +"']").addClass("h5page-showing top").removeClass("h5page-hasShown");
		
	});
	var transitionendEvent = whichTransitionEvent();
	$(".h5page[data-index='1']").trigger(transitionendEvent);
})(jQuery)