  	var index=0;
  	var navs=document.getElementById('nav').getElementsByTagName('span');
  	var cHeight=document.documentElement.clientHeight || document.body.clientHeight;
  	var main=document.getElementById('main');
  	var moveDuration=500;
  	var moveInterval=20;
  	var moving=false;
  	for(var i=0,navLen=navs.length;i<navLen;i++){
  		navs[i].onclick=(function(i){
  			return function(){
  				index=i;
  				changeColor();
  				moveToY(main,-i*cHeight,moveDuration,moveInterval);
  			}
  		})(i)
  	}
       document.onmousewheel=wheelScroll;
       document.addEventListener('DOMMouseScroll',wheelScroll,false);
       //滚轮事件时如何滚动页面
     function wheelScroll(event){
           if(moving){return;}
       	   moving=true;
       		var wheelDelta=getWheelDelta(event);     		
       		if(wheelDelta<0){
       			index++;
       			index=index%navLen;      			
       		}else{
       			index--;
       			if(index==-1){index=navLen-1;}      			
       		}
       		changeColor();
       	    moveToY(main,-index*cHeight,moveDuration,moveInterval);
     }

     //获得滚轮事件时滚动的方向
  	function getWheelDelta(event){
  		if(event.wheelDelta){
  			return event.wheelDelta;
  			
  		}else{
  			return -event.detail*40;
  		}
  	}

    //改变控制点的颜色
  	function changeColor(){
  		for(var i=0;i<navLen;i++){
  			navs[i].className='';
  		}
  		navs[index].className='curr';
  	}

    //把元素移动到某个位置（在竖直方向）
  	function moveToY(elem,to,duration,interval){
  		if(elem.timer){clearInterval(elem.timer)}
  		var currPos=parseFloat(getStyle(elem,'top'));
  		var dis=Math.abs(to-currPos);
  		var symbol=(to-currPos)/dis;
  		var stepLength=dis/(duration/interval);
  		var cover=0;
  		var step=function(){
  			if(cover+stepLength<dis){
  				elem.style.top=parseFloat(getStyle(elem,'top'))+stepLength*symbol+'px';
  				cover+=stepLength;
  			}else{
  				elem.style.top=to+'px';
  				clearInterval(elem.timer);
  				moving=false;
  			}
  		}
  		elem.timer=setInterval(step,interval);
  	}


    //获得元素的样式
  	function getStyle(elem,cssname){
  		if(window.getComputedStyle){
  			return window.getComputedStyle(elem)[cssname];
  		}else{
  			return elem.currentStyle[cssname];
  		}
  	}
