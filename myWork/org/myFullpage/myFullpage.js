(function($){
	$.fn.fullpage = function(opts){
		var defaults = {
			scrollingSpeed:800,   //滚动速度
			navigation:true,	  //是否有导航
			navigationPosition:"right",	//导航的位置
		//	navigationTooltips:["section1"],//导航的内容
			continuousVertical:false,		//是否在垂直方向上连续
			keyboard : true,				//是否支持键盘上下键切换
			mobile : true,					//是否支持移动端的touch事件 //如果设定为false，则在手机上无法正常使用
			method : "swing"		
		}
		//todu 导航条的文字显示
		//手机事件的封装
		var opts = $.extend({},defaults,opts);
		return this.each(function(){
			var selector = $(this);
			var size = selector.find(".section").size();
			var height = $("body").height();
			var index = 0;
			var direction ;
			var touchstartY;
			var touchendY;
			var navigationWrap;
			var moving = false;
			var navigationTooltipWrap;
			var pageW = $("body").width();
			var setNavbar = function(){
			    navigationWrap = $("<div class='navigationWrap'></div>");
				if(opts.navigationPosition){
					navigationWrap.addClass("right-nav");
				}else{
					navigationWrap.addClass("left-nav");
				}
				var navHTML = "";
				var template = "<div class='nav {isActive}' data-index='{i}'></div>";
				for(var i =0;i<size;i++){
					navHTML += template.str_supplant({isActive:(i==0)?"active":"",i:i});
				}
				navigationWrap.html(navHTML);
				$("body").append(navigationWrap);
				navigationWrap.delegate(".nav","click",function(){
					var index = $(this).data("index");
					goto(index);
				});	
				if($.type(opts.navigationTooltips).toLowerCase() == "array"){
					navigationTooltipWrap = $("<div class='navigationTooltipWrap'></div>");
					$('body').append(navigationTooltipWrap);

					navigationWrap.delegate(".nav","mouseover mouseenter",function(event){
						var index = $(this).data("index");
						var text = opts.navigationTooltips[index];
						navigationTooltipWrap.text(text);
						if(navigationWrap.hasClass("right-nav")){
							navigationTooltipWrap.css({right:(pageW-event.clientX+10),top:event.clientY-5})
						}else if(navigationWrap.hasClass("right-nav")){
							navigationTooltipWrap.css({left:(event.clientX+5),top:event.clientY})
						}
						navigationTooltipWrap.fadeIn("200");
					});
					navigationWrap.delegate(".nav","mouseout mouseleave",function(event){
						navigationTooltipWrap.fadeOut("200");
					})



				}
			}
			var goto = function(num){
				if(num<0){
					if(opts.continuousVertical){
						moveTo(size-1);
					}
					return;
				}
				if(num<size ){
					moveTo(num);
					return;
				}
				if(num==size){
					if(opts.continuousVertical){
						moveTo(0);
					}
				}					
			}
			var moveTo = function(num){
				if(opts.navigation){
					activeNav(num);
				}
				moving = true;
				if(opts.onLeave){
					opts.onLeave(index)
				}
				selector.animate({top:-num*height},opts.scrollingSpeed,opts.method,function(){
					moving = false;
					index = num;
					if(opts.afterLoad){
						opts.afterLoad(index);
					}
				})						
			}
			var mousewheelHandler = function(event){
				if(moving){return;}
				direction = event.originalEvent.wheelDelta? -event.originalEvent.wheelDelta : event.originalEvent.detail;
				goByDirection();
			}
			var keyboardHandler = function(event){
				if(moving){return;}
				if(event.which != 38 && event.which != 40){return;}
				if(event.which == 38){
					direction = -1;
				}else{
					direction = 1;
				}
				goByDirection();				
			}
			var activeNav = function(num){
				navigationWrap.find(".nav").eq(num).addClass("active").siblings().removeClass("active");
			}
			var goByDirection = function(){
				if(direction>0){
					goto(index + 1);
				}else{
					goto(index - 1);
				}	
			}
			var touchstartHandler = function(event){
				touchstartY = event.originalEvent.touches[0].clientY;
			}
			var touchmoveHandler = function(event){
				event.preventDefault();
			}
			var touchendHandler = function(event){
				touchendY = event.originalEvent.changedTouches[0].clientY;
				if(touchendY < touchstartY){
					direction = 1;
				}else{
					direction =-1;
				}
				 goByDirection();
			}
			selector.addClass("sectionWrap");
			if(opts.navigation){
				setNavbar();
			}
			$(document).on("mousewheel DOMMouseScroll",mousewheelHandler);
			if(opts.keyboard){
				$(document).on("keyup",keyboardHandler);
			}
			if(opts.mobile){
				$(document).on("touchstart",touchstartHandler);
				$(document).on("touchmove",touchmoveHandler);
				$(document).on("touchend",touchendHandler);
			}

		})
	}


})(jQuery)


















