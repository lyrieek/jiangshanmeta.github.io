  var headerForm=document.getElementsByTagName('header')[0].getElementsByTagName('form')[0];
  var headerText=headerForm.getElementsByTagName('input')[0];
  var headerSub=headerForm.getElementsByTagName('input')[1];
  headerText.onfocus=function(){
    headerForm.className='on';
    headerSub.className='active';
  }
  headerText.onblur=function(){
    headerForm.className='';
    headerSub.className='';
  }

  //mobile区两个图片切换效果
  var weibo=document.getElementById('weibo');
  var mobilePics=document.getElementsByClassName('mobile')[0].getElementsByTagName('img');
  var moPic1=mobilePics[0];
  var moPic2=mobilePics[1];
  weibo.onmouseover=function(){

     moPic1.className='on';
     moPic2.className='on';
  }
  weibo.onmouseout=function(){
    moPic1.className='';
    moPic2.className='';
  }

  //二维码出现与消失
  var erweima=document.getElementById('erweima');
  var erweiPic=document.getElementById('erweiPic');
  erweima.onmouseover=function(){
    erweiPic.style.opacity=1;
  }
  erweima.onmouseout=function(){
    erweiPic.style.opacity=0;
  }
