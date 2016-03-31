(function($){
	var curPage = 1;
	var nextPage = 1;
	var typ;
	var pageNum = $(".h5page").size();
	var progressBar = $(".progress-bar");
	var transition = whichTransition();
	var transitionendEvent = whichTransitionEvent();
	var animation = whichAnimation();
	var h5pageWrap = $(".h5page-wrap");
	if(h5pageWrap.hasClass("h5page-unite")){
		var mode = 'unite';
	}else{
		var mode = 'seperate';
	}


	var duration = h5pageWrap.data("duration") || '0.8s';
	if(mode == 'unite'){
		h5pageWrap.css(transition+'Duration',duration);
	}else{
		$(".h5page-wrap .h5page").css(transition+'Duration',duration);
	}
	
	var arrow = $("#arrow");
	function toggleArrow(){
		if(nextPage == pageNum){
			arrow.css("display",'none');
		}else{
			arrow.css('display','block');
		}
	}
	$(document).on("swipeUp",function(){
		typ = "swipeup";
		nextPage = curPage + 1;
		if(nextPage>pageNum){
			nextPage = curPage;
			return;
		}
		toggleArrow();

		if(mode == 'unite'){
			h5pageWrap.css('transform', 'translateY(' + (-(nextPage-1)*100 +'%') +')' ).find("[data-role='animation']").each(function(){
				$(this).css(animation,$(this).data("method"))
			});			
			$(".h5page[data-index='"+nextPage +"']")
		}else{
			$(".h5page[data-index='"+nextPage +"']").removeClass("h5page-notShow").addClass("h5page-showing top").find("[data-role='animation']").each(function(){
				$(this).css(animation,$(this).data("method"))
			});			
		}


		
	});

	if(mode == 'unite'){
		h5pageWrap.on(transitionendEvent,function(event){
			if(!$(event.target).hasClass("h5page-wrap")){
				return;
			}			
			$(".h5page").each(function(){
				var index = $(this).data("index");
				console.log(index)
				if(index!=nextPage){
					$(this).find("[data-role='animation']").css(animation,'')
				}
			})
			$(".h5page[data-index='" + nextPage + "']").find("[data-role='animation']").each(function(){
				var cssName = $(this).css(animation+'Name');
				console.log(cssName)
				if(cssName=='none'){
					$(this).css(animation,$(this).data("method"))
				}
			})
			curPage = nextPage;
			progressBar.css("width",(curPage/pageNum)*100 +"%");
		});
	}else{

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
				if($(this).css(animation+'Name')=='none'){
					$(this).css(animation,$(this).data("method"))
				}
			})
			progressBar.css("width",(curPage/pageNum)*100 +"%");
		})




	}
	$(document).on("swipeDown",function(){
		typ = "swipedown";
		nextPage = curPage-1;
		if(nextPage<1){
			nextPage = 1;
			return;
		}

		if( mode == 'unite'){
			h5pageWrap.css('transform', 'translateY(' + (-(nextPage-1)*100 +'%') +')' ).find("[data-role='animation']").each(function(){
				$(this).css(animation,$(this).data("method"))
			});			;
		}else{
			$(".h5page").removeClass("top")
				$(".h5page[data-index='"+nextPage +"']").addClass("h5page-showing top").removeClass("h5page-hasShown").find("[data-role='animation']").each(function(){
					$(this).css(animation,$(this).data("method"))
			});			
		}




		toggleArrow();
	});
	
	if(mode=='unite'){
		h5pageWrap.trigger(transitionendEvent)
	}else{
		$(".h5page[data-index='1']").trigger(transitionendEvent);
	}
})(jQuery)