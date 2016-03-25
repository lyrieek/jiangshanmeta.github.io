(function($){
	var curPage = 1;
	var nextPage,typ;
	var pageNum = $(".h5page").size();
	var progressBar = $(".progress-bar");
	var transitionendEvent = whichTransitionEvent();
	var animation = whichAnimation();
	$(document).on("swipeUp",function(){
		typ = "swipeup";
		nextPage = curPage+1;
		if(nextPage>pageNum){
			nextPage = curPage;
			return;
		}
		$(".h5page[data-index='"+nextPage +"']").removeClass("h5page-notShow").addClass("h5page-showing top").find("[data-role='animation']").each(function(){
			$(this).css(animation,$(this).data("method"))
		});
		
	});

	$(".h5page").on(transitionendEvent,function(event){
		//冒泡上来的直接略过去
		if(!$(event.target).hasClass("h5page")){
			return;
		}
		//其他h5page的过渡
		if(!$(this).hasClass("h5page-showing")){
			$(this).find("[data-role='animation']").css(animation,'');
			return;
		}
		//展示中的h5页面
		if(typ == 'swipeup'){
			$(".h5page[data-index='" + curPage +"']").removeClass("h5page-showing").addClass("h5page-hasShown");
		}else if(typ == 'swipedown'){
			$(".h5page[data-index='" + curPage +"']").removeClass("h5page-showing").addClass("h5page-notShow");
		}
		curPage = $(this).data("index");
		$(this).find("[data-role='animation']").each(function(){
			// console.log($(this))
			// console.log($(this).css('animationName'))
			if($(this).css(animation+'Name')=='none'){
				$(this).css(animation,$(this).data("method"))
			}
			
		})
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
		$(".h5page[data-index='"+nextPage +"']").addClass("h5page-showing top").removeClass("h5page-hasShown").find("[data-role='animation']").each(function(){
			//$(this).addClass("animated "+$(this).data("method"));
			$(this).css(animation,$(this).data("method"))
		});
		
	});
	
	$(".h5page[data-index='1']").trigger(transitionendEvent);
})(jQuery)