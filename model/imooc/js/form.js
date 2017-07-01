
//登陆注册弹出窗口
var dengluBtn=document.getElementById('dengluBtn');
var zhuceBtn=document.getElementById('zhuceBtn');
  //创建表单区
function loginWin(){
  var mask=document.createElement('div');
  mask.setAttribute("id",'mask');
  var cHeight=document.documentElement.clientHeight+'px';
  var cWidth=document.documentElement.clientWidth+'px';
  mask.style.width=cWidth;
  mask.style.height=cHeight;
  document.body.appendChild(mask);
  var login=document.createElement('div');
  login.className='login';
  login.innerHTML="<p><span id='dengluTab' >登陆</span><span id='zhuceTab'>注册</span></p><form id='denglu' ><input type='text' name='username' placeholder='请输入登录邮箱' required><input type='password' name='password' placeholder='请输入密码' required><section><input type='checkbox' value='rem' id='rem'><label for='rem'>下次自动登录</label><a href='#'>忘记密码</a></section><input type='submit' value='登录'></form><form id='zhuce' ><input type='text' name='uesrname' placeholder='请输入电子邮箱' required id='name'><p></p><input type='password' name='password' placeholder='6-16位密码，区分大小写，不能用空格' id='password'><p></p><input type='text' placeholder='昵称为2-18位。中英文、数字及下划线' name='nickname' id='nickname'><p></p><input type='submit' value='注册' id='submitBtn'></form><span id='close'></span>"
  document.body.appendChild(login);
}
  //移除表单区
function removeLogin(){
  var mask=document.getElementById('mask');
  var login=document.getElementsByClassName('login')[0];
  document.body.removeChild(mask);
  document.body.removeChild(login);
}
  
dengluBtn.onclick=function(){
  loginWin();
  var dengluTab=document.getElementById('dengluTab');
  dengluTab.className='on';
  var denglu=document.getElementById('denglu');
  denglu.className='active';
  var login=document.getElementsByClassName('login')[0];
  var oWidth=login.offsetWidth;
  var oHeight=login.offsetHeight;
  var cHeight=document.documentElement.clientHeight;
  var cWidth=document.documentElement.clientWidth; 
  login.style.left=(cWidth/2-oWidth/2)+'px';
  login.style.top=(cHeight/2-oHeight/2)+'px';
  var close=document.getElementById('close');
  close.onclick=function(){
    removeLogin();
  }
  var zhuceTab=document.getElementById('zhuceTab');
  zhuceTab.onclick=function(){
    dengluTab.className='';
    denglu.className='';
    zhuceTab.className='on';
    zhuce.className='active';
  }
  var dengluTab=document.getElementById('dengluTab');
  dengluTab.onclick=function(){
    zhuceTab.className='';
    zhuce.className='';
    dengluTab.className='on';
    denglu.className='active';
  }
  var mask=document.getElementById('mask');
  mask.onclick=function(){
    removeLogin();
  }
  formCheck();
  return false;
}

zhuceBtn.onclick=function(){
  loginWin();
  var zhuceTab=document.getElementById('zhuceTab');
  zhuceTab.className='on';
  var zhuce=document.getElementById('zhuce');
  zhuce.className='active';
  var login=document.getElementsByClassName('login')[0];
  var oWidth=login.offsetWidth;
  var oHeight=login.offsetHeight;
  var cHeight=document.documentElement.clientHeight;
  var cWidth=document.documentElement.clientWidth; 
  login.style.left=(cWidth/2-oWidth/2)+'px';
  login.style.top=(cHeight/2-oHeight/2)+'px';
  var close=document.getElementById('close');
  close.onclick=function(){
    removeLogin();
  }
  var dengluTab=document.getElementById('dengluTab');
  dengluTab.onclick=function(){
    zhuceTab.className='';
    zhuce.className='';
    dengluTab.className='on';
    denglu.className='active';
  }
  var zhuceTab=document.getElementById('zhuceTab');
  zhuceTab.onclick=function(){
    dengluTab.className='';
    denglu.className='';
    zhuceTab.className='on';
    zhuce.className='active';
  }
  var mask=document.getElementById('mask');
  mask.onclick=function(){
    removeLogin();
  }
  formCheck();
  return false;
}

//表单验证函数
function formCheck(){
  var name=document.getElementById('name');
  var password=document.getElementById('password');
  var nickname=document.getElementById('nickname');
  var submit=document.getElementById('submitBtn');
  //用户邮箱验证，这里仅验证是否含有@这一符号
  name.onblur=function(){
    var nameP=name.nextElementSibling;
    if(name.value.indexOf('@')==-1){
    nameP.innerHTML='请按要求输入邮箱';
    submit.setAttribute('disabled');
     }else{
     nameP.innerHTML='';
     submit.removeAttribute('disabled');
    }
  }
  //密码验证，6-16位，字母数字下划线
  password.onblur=function(){
    var pswReg=/[^\w]/g;
    var pswP=password.nextElementSibling;
    var pswValue=password.value;
    if(pswReg.test(pswValue)||pswValue.length<6||pswValue.length>16){
      pswP.innerHTML='请按要求输入密码';
      submit.setAttribute('disabled');
    }else{
      pswP.innerHTML='';
      submit.removeAttribute('disabled');
    }

  }
  // 昵称验证
  nickname.onblur=function(){
    var nickP=nickname.nextElementSibling;
    var nickValue=nickname.value;
    var nickLen=formStr(nickValue);
    var nickReg=/[^\u4e00-\u9fa5\w]/g;
    if(nickLen<2||nickLen>18||nickReg.test(nickValue)){
      nickP.innerHTML='请按要求输入昵称';
      submit.setAttribute('disabled');
    }else{
      nickP.innerHTML='';
      submit.removeAttribute('disabled');
    }

  }



}
//将双字节字符替换为xx，返回字节数
function formStr(str){
  return str.replace(/[^\x00-\xff]/g,'xx').length;
}