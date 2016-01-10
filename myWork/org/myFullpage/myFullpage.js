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
		$(document).on("mousewheel DOMMouseScroll",function(event){
			if(self.moving){return;}
			self.direction = event.originalEvent.wheelDelta? -event.originalEvent.wheelDelta : event.originalEvent.detail;
			console.log(self.direction)
			//direction>0表示向下滚动
			if(self.direction>0){
				console.log(self.index+1);
				self.goto(self.index + 1);
				
			}else{
				console.log(self.index-1);
				self.goto(self.index - 1);
				
			}
		})





	}
	Fullpage.prototype={
		goto:function(num){

			if(num<0){
				if(this.opt.continuousVertical){
					//this.wrap.
					console.log("a");
					this.moveTo(this.size-1);
				}
				return;
			}
			if(num<this.size ){
				this.moveTo(num);
				return;
			}
			if(num==this.size){
				if(this.opt.continuousVertical){
					this.moveTo(0);
				}
			}
		},
		moveTo:function(num){

			var self = this;
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
		}
	}

	window['Fullpage'] = Fullpage;

})(jQuery);