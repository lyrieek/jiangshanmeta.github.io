if (!String.prototype.str_supplant) {
    String.prototype.str_supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}


(function($){
	var Fullpage = function(id,options){
		var self = this;
		this.container = $("#" + id);
		this.container.addClass("sectionWrap");
		//todo 导航条
		//todo 浏览器兼容性
		var def_opt = {
			scrollingSpeed:800,   //滚动速度
			navigation:false,	  //是否有导航
			navigationPosition:"right",	//导航的位置
		//	navigationTooltips:["section1"],//导航的内容
			continuousVertical:false		//是否在垂直方向上连续
		}
		this.opt = $.extend({},def_opt,options);

		this.size = $("#" + id + " .section").size();
		this.index = 0;
		this.moving = false;
		this.height = $("body").height();

		if(this.opt.navigation){
			this.setNavbar();
		}
		//监听事件 

		//支持滚轮事件 //兼容firefox
		$(document).on("mousewheel DOMMouseScroll",function(event){
			if(self.moving){return;}
			self.direction = event.originalEvent.wheelDelta? -event.originalEvent.wheelDelta : event.originalEvent.detail;
			self.goByDirection();
			//direction >0 表示向下
		});

		//支持键盘上下键切换
		$(document).on("keyup",function(event){
			if(self.moving){return;}
			if(event.which != 38 && event.which != 40){return;}
			if(event.which==38){
				self.direction = -1;
			}else{
				self.direction = 1;
			}
			self.goByDirection();
		})
		//todo 手机的滑动事件
		//touch事件
		$(document).on("touchstart",function(event){
			self.touchstartY = event.originalEvent.touches[0].clientY;
			//console.log(self.touchstartY);
		});
		$(document).on("touchmove",function(event){
			event.preventDefault();
		})
		$(document).on("touchend",function(event){
			self.touchendY = event.originalEvent.changedTouches[0].clientY;
			//console.log(self.touchendY);
			//touchend 的时候 如果纵坐标更小，说明应该向下走
			if(self.touchendY<self.touchstartY){
				self.direction = 1;
			}else{
				self.direction =-1;
			}
			self.goByDirection();
		})


	}
	Fullpage.prototype={
		//根据方向判断向进入哪一页
		goByDirection:function(){
			if(this.direction>0){
				this.goto(this.index + 1);
			}else{
				this.goto(this.index - 1);
			}			
		},
		//goto 用来对传入的页数进行处理
		goto:function(num){

			if(num<0){
				if(this.opt.continuousVertical){
					//this.wrap.
					
					this.moveTo(this.size-1);
				}
			//	return;
			}
			if(num<this.size ){
				this.moveTo(num);
			//	return;
			}
			if(num==this.size){
				if(this.opt.continuousVertical){
					this.moveTo(0);
				}
			}
			//callback&&callback();
		},
		//moveto用来真正的移动，同时 onLeave 和 afterLoad回调都在这里
		moveTo:function(num){

			var self = this;
			if(this.opt.navigation){
				this.activeNav(num);
			}
			this.moving = true;
			if(self.opt.onLeave){
				self.opt.onLeave(this.index)
			}
			this.container.animate({top:-num*self.height},self.opt.scrollingSpeed,function(){
				self.moving = false;
				self.index = num;
				if(self.opt.afterLoad){
					self.opt.afterLoad(self.index);
				}
			})
		},
		//生成导航栏的代码
		setNavbar:function(){
			this.navigationWrap = $("<div class='navigationWrap'></div>");
			if(this.opt.navigationPosition=="right"){
				this.navigationWrap.addClass("right-nav");
			}else{
				this.navigationWrap.addClass("left-nav");
			}
			var navHTML = "";
			var template = "<div class='nav {isActive}' data-index='{i}'></div>";
			for(var i =0;i<this.size;i++){

				
				navHTML += template.str_supplant({isActive:(i==0)?"active":"",i:i});
			}
			this.navigationWrap.html(navHTML);
			$("body").append(this.navigationWrap);
			this.navbar_nav();
			//todo 悬浮时的文字显示
		},
		//导航栏绑定点击导航
		navbar_nav:function(){
			var self = this;
			this.navigationWrap.delegate(".nav","click",function(){
				var index = $(this).data("index");
				self.goto(index);
			});


		},
		//导航栏按钮active状态切换
		activeNav:function(num){
			$(".nav").eq(num).addClass("active").siblings().removeClass("active");
		}

	}

	window['Fullpage'] = Fullpage;

})(jQuery);