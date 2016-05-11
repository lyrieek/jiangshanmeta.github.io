window.onload=function(){
  var banner=document.getElementById('banner');
  var imgs=banner.getElementsByTagName('img');
  var imgnum=imgs.length;
  var index=0;
  var fadeDuration=500;
  var fadeInterval=20;
  var stopDuration=3000;
  var timer=setInterval(auto,fadeDuration+stopDuration);
  var prev=document.getElementById('prev');
  var next=document.getElementById('next');
  prev.onclick=function(){
    index++;
    index=index%imgnum;
    fadeTo(index);
  }
  next.onclick=function(){
    index--;
    if(index===-1){index=imgnum-1;}
    fadeTo(index);
  }
  banner.onmouseover=function(){
    clearInterval(timer);
  }
  banner.onmouseout=function(){
    timer=setInterval(auto,fadeDuration+stopDuration);
  }





  function auto(){
    index++;
    index=index%imgnum;
    fadeTo(index);
  }
  function fadeTo(index){
    for (var i=0;i<imgnum;i++){
      fade(imgs[i],0,fadeDuration,fadeInterval);
    }
    fade(imgs[index],1,fadeDuration,fadeInterval);


  }





  //将一个元素的透明度变位to，总时间duration，定时器间隔interval
  function fade(elem,to,duration,interval){
      if(elem.timer){clearInterval(elem.timer)}
      var curr=getStyle(elem,'opacity');
      var dis=Math.abs(to-curr);
      var symbol=(to-curr)/dis;
      var stepLength=dis/(duration/interval);
      var cover=0;
      var step=function(){
        if(cover+stepLength<dis){
          elem.style.opacity=parseFloat(getStyle(elem,'opacity'))+stepLength*symbol;
          cover+=stepLength;
        }else{
          elem.style.opacity=to;
          clearInterval(elem.timer);
        }

      }
      elem.timer=setInterval(step,interval);





  }



  //获得一个元素的某个实际样式
  function getStyle(elem,cssname){
    if(window.getComputedStyle){
        return window.getComputedStyle(elem)[cssname];
    }else{
      return elem.currentStyle[cssname];
    }
  }


}