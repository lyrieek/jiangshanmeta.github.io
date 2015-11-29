//事件兼容
var EventUtil={
	addHandler:function(elem,type,handler){
		if(elem.addEventListener){
			elem.addEventListener(type,handler,false);
		}else if(elem.attachEvent){
			elem.attachEvent("on"+type,handler);
		}else{
			elem["on"+type]=handler;
		}
	},
	removeHandler:function(elem,type,handler){
		if(elem.removeEventListener){
			elem.removeEventListener(type,handler,false);
		}else if(elem.detachEvent){
			elem.detachEvent("on"+type,handler);
		}else{
			elem["on"+type]=null;
		}
	},
	getEvent:function(event){
		return event || window.event;
	},
	getTarget:function(event){
		return event.target || event.srcElement;
	},
	preventDefault:function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue=false;
		}
	},
	stopPropagation:function(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelBubble=true;
		}
	}
}
//添加移除类兼容
function addClass(elem,classname){
	if(elem.classList){
		 elem.classList.add(classname);
	}else{
		var classList=elem.className.split(/\s+/);
		var pos=classList.indexOf(classname);
		if(pos==-1){
			classList.push(classname);
		}
		 elem.className=classList.join(" ");
	}
}
function removeClass(elem,classname){
	if(elem.classList){
		elem.classList.remove(classname); 
	}else{
		var classList=elem.className.split(/\s+/);
		var pos=classList.indexOf(classname);
		if(pos!=-1){
			classList.splice(pos,1);
		}
		elem.className=classList.join(" ");
	}
}
//获得元素实际样式
function getStyle(elem,cssname){
	return window.getComputedStyle? window.getComputedStyle(elem)[cssname] : elem.currentStyle[cssname];
}
//动画函数封装
function animate(elem,json,duration,interval,callback){
	if(elem.timer){clearInterval(elem.timer);}
	var duration=duration || 3000;
	var interval=interval || 16.7;
 	var infos=[];
	for(var p in json){
		var infoitem={};
		var lastStyleItem=parseFloat(getStyle(elem,p));
		var targetStyleItem=json[p];
		var disItem=Math.abs(targetStyleItem-lastStyleItem);
		var symbolItem;
		if(disItem){
			symbolItem=(disItem)/(targetStyleItem-lastStyleItem);
		}else{
			symbolItem=1;
		}
		
		var stepLength=disItem/(duration/interval);
		infoitem.name=p;
		infoitem.lastStyle=lastStyleItem;
		infoitem.targetStyle=targetStyleItem;
		infoitem.dis=disItem;
		infoitem.symbol=symbolItem;
		infoitem.stepLength=stepLength;
		infoitem.cover=0;
		infos.push(infoitem);
	}
	var len=infos.length;
	var step=function(){
		var moving=false;
		var cssText="";
		for(var i=len;i--;){
			var item=infos[i];
			if(item.cover+item.stepLength<item.dis){
				item.lastStyle+=item.symbol*item.stepLength;
				cssText+=item.name +":"+item.lastStyle;
				moving=true;
				item.cover+=item.stepLength;
			}else{
				cssText+=item.name + ":"+item.targetStyle;
				item.lastStyle=item.targetStyle;
				item.cover=item.dis;
			}
			if(item.name != "opacity"){
				cssText+="px;";
			}else{
				cssText+=";";
			}
		}
		elem.style.cssText=cssText;
		if(!moving){
			clearInterval(elem.timer);
		}
	}
	elem.timer=setInterval(step,interval);
}
//淡入淡出图片轮播，其中type可选择 full fix ，分别对应全屏图片轮播和固定宽度图片轮播
function carousel_fade(id,type,changeDuration,stopDuration,interval){
	var changeDuration=changeDuration || 500;
	var stopDuration=stopDuration || 3000;
	var interval=interval || 16.7;
	var carousel=document.querySelector("#"+id);
	var carouselinner=carousel.querySelector(".carousel-inner");
	var carouselitem=carouselinner.querySelectorAll(".carousel-item");
	var carouselImg=carousel.querySelectorAll(".carousel-inner img");
	var controls=carousel.querySelectorAll(".carousel-indicators .controls");
	var len=carouselImg.length;
	var index=0;
	var height;
	if(type=="full"){
		carouselImg[0].onload=function(){
		  height=getStyle(carouselImg[0],"height");
  		  carouselinner.style.height=height;
	      carousel.style.height=height;			
		}
	}
	var fadeTo=function(index){
		for(var i=len;i--;){
			removeClass(carouselitem[i],"active");
			removeClass(controls[i],"active");
			animate(carouselImg[i],{opacity:0},500,16.7);
		}
		addClass(carouselitem[index],"active");
		addClass(controls[index],"active");
		animate(carouselImg[index],{opacity:1},500,16.7)
	}
	var auto=function(){
		index=(index+1)%len;
		fadeTo(index);
	}
	var timer=setInterval(auto,changeDuration+stopDuration);
	EventUtil.addHandler(carousel,"mouseenter",function(){
		clearInterval(timer);
	});
	EventUtil.addHandler(carousel,"mouseleave",function(){
		timer=setInterval(auto,changeDuration+stopDuration);
	});
	for(var i=len;i--;){
		var ctlitem=controls[i];
		ctlitem.index=i;
		ctlitem.onclick=function(){
			index=this.index;
			fadeTo(index);
		}
	}		
}
// 位移图片轮播，type 可选为 full 或 fix 对应全屏图片轮播和固定宽度图片轮播
function carousel_move(id,type,changeDuration,stopDuration,interval){
	var changeDuration=changeDuration || 500;
	var stopDuration=stopDuration || 3000;
	var changeInterval=16.7;
	var carousel=document.querySelector("#"+id);
	var carouselinner=carousel.querySelector(".carousel-inner");
	var carouselitem=carouselinner.querySelectorAll(".carousel-item");
	var controls=carousel.querySelectorAll(".carousel-indicators .controls");
	var len=controls.length;
	var index=0;
	var cWidth;
	if(type=="full"){
		cWidth=document.documentElement.clientWidth || document.body.clientWidth;
		for(var i=len;i--;){
			carouselitem[i].style.width=cWidth+"px";
		}		
	}else{
		cWidth=carousel.clientWidth;
	}
	var moveTo=function(index){
		for(var i=len;i--;){
			removeClass(controls[i],"active");
		}	
		addClass(controls[index],"active");		
		animate(carouselinner,{left:-index*cWidth},500,16.7);
	}
	var auto=function(){
		index=(index+1)%len;
		moveTo(index);

	}
	var timer=setInterval(auto,changeDuration+stopDuration);
	EventUtil.addHandler(carousel,"mouseenter",function(){
		clearInterval(timer);
	});
	EventUtil.addHandler(carousel,"mouseleave",function(){
		timer=setInterval(auto,changeDuration+stopDuration);
	});
	for(var i=len;i--;){
		var ctlitem=controls[i];
		ctlitem.index=i;
		ctlitem.onclick=function(){
			index=this.index;
			moveTo(index);
		}
	}
}

