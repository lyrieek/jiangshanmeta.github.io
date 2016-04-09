//php.js
function ucfirst (str) {
  str += ''
  var f = str.charAt(0)
    .toUpperCase()
  return f + str.substr(1)
}
//impress.js
var pfx = (function () {
    var style = document.createElement('dummy').style,
        prefixes = 'Webkit Moz O ms Khtml'.split(' '),
        memory = {};
    return function ( prop ) {
        if ( typeof memory[ prop ] === "undefined" ) {
            //实现一个ucfirst
            var ucProp  = ucfirst(prop),
            //拿到前缀化的属性名
                props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
            
            memory[ prop ] = null;
            for ( var i in props ) {
                if ( style[ props[i] ] !== undefined ) {
                    memory[ prop ] = props[i];
                    break;
                }
            }
        }
        
        return memory[ prop ];
    };
})();
//deal with pfx of transitionent event
function whichTransitionEvent(){  
    var t;  
    var el = document.createElement('p');  
    var transitions = {  
      'transition':'transitionend',  
      'OTransition':'oTransitionEnd',  
      'MozTransition':'mozTransitionEnd',  
      'WebkitTransition':'webkitTransitionEnd',  
      'MsTransition':'msTransitionEnd'  
    }  
    for(t in transitions){  
        if( el.style[t] !== undefined ){  
            return transitions[t];  
        }  
    }  
}

(function($){
	var curPage = 1;
	var nextPage = 1;
	var typ;
	var pageNum = $(".h5page").size();
	var progressBar = $(".progress-bar");
	var transition =pfx('transition');
	var transitionendEvent = whichTransitionEvent();
	var animation = pfx('animation');
	var h5pageWrap = $(".h5page-wrap");
	var h5method = h5pageWrap.data("role");
	h5pageWrap.addClass("h5page-"+h5method);
	var arrow = $("#arrow");
	var pageSwitch = false;
	var cfgMethod = {
		'unite':{
			swipeUpEvent:function(event){
				nextPage = curPage + 1;
				if(nextPage>pageNum){
					nextPage = curPage;
					return;
				}
				toggleArrow();
				h5pageWrap.css('transform', 'translateY(' + (-(nextPage-1)*100 +'%') +')' );
				addAnimation(nextPage);	
			},
			swipeDownEvent:function(event){
				nextPage = curPage-1;
				if(nextPage<1){
					nextPage = 1;
					return;
				}
				h5pageWrap.css('transform', 'translateY(' + (-(nextPage-1)*100 +'%') +')' );
				addAnimation(nextPage);		
				toggleArrow();
			},
			pageTransitionEndEvent:function(event){
				if(!$(event.target).hasClass("h5page-wrap")){
					return;
				}			
				$(".h5page").each(function(){
					var index = $(this).data("index");
					if(index!=nextPage){
						$(this).find("[data-role='animation']").css(animation,'')
					}
				})
				curPage = nextPage;
				updateProgressBar();
			},
		},
		'seperate':{
			swipeUpEvent:function(event){
				if(pageSwitch){
					return;
				}
				typ = "swipeup";
				nextPage = curPage + 1;
				if(nextPage>pageNum){
					nextPage = curPage;
					return;
				}
				toggleArrow();
				$(".h5page[data-index='"+nextPage +"']").removeClass("h5page-notShow").addClass("h5page-showing top");
				pageSwitch = true;
				addAnimation(nextPage);
			},
			swipeDownEvent:function(event){
				if(pageSwitch){
					return;
				}				
				typ = "swipedown";
				nextPage = curPage-1;
				if(nextPage<1){
					nextPage = 1;
					return;
				}
				$(".h5page").removeClass("top");
				$(".h5page[data-index='"+nextPage +"']").addClass("h5page-showing top").removeClass("h5page-hasShown");
				pageSwitch = true;
				addAnimation(nextPage);
				toggleArrow();
			},
			pageTransitionEndEvent:function(event){
				if(!$(event.target).hasClass("h5page")){
					return;
				}
				//其他h5page的过渡
				if(!$(event.target).hasClass("h5page-showing")){
					$(event.target).find("[data-role='animation']").css(animation,'');
					return;
				}
				//展示中的h5页面
				if(typ == 'swipeup'){
					$(".h5page[data-index='" + curPage +"']").removeClass("h5page-showing").addClass("h5page-hasShown");
				}else if(typ == 'swipedown'){
					$(".h5page[data-index='" + curPage +"']").removeClass("h5page-showing").addClass("h5page-notShow");
				}
				curPage = nextPage;
				pageSwitch = false;
				updateProgressBar();
			},
		},
	}
	var mode = cfgMethod[h5method];

	function addAnimation(pageNum){
		$(".h5page[data-index='"+pageNum +"']").find("[data-role='animation']").each(function(){
			$(this).css(animation,$(this).data("method"))
		});	
	}
	function toggleArrow(){
		nextPage == pageNum ? arrow.css("display",'none') : arrow.css('display','block');
	}
	function updateProgressBar(){
		progressBar.css("width",(curPage/pageNum)*100 +"%");
	}

	if(mode['swipeUpEvent']){
		$(document).on("swipeUp",mode['swipeUpEvent']);
	}
	if(mode['swipeDownEvent']){
		$(document).on("swipeDown",mode['swipeDownEvent']);
	}
	if(mode['pageTransitionEndEvent']){
		h5pageWrap.on(transitionendEvent,mode['pageTransitionEndEvent']);
	}

	//加载时第一页的动画效果
	addAnimation(1);
	updateProgressBar();
})(jQuery)