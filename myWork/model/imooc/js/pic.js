//图片墙区最后每一行最后两块区域描述文字向左显示
  var photo=document.getElementsByClassName('photo')[0];
  var photoBlock=photo.getElementsByClassName('photoBlock');
  var lenPhoto=photoBlock.length;
  for (var j=0;j<lenPhoto;j++){
    if(j%6==4||j%6==5){
      var elem=photoBlock[j].getElementsByClassName('family-info');
      var lenElem=elem.length;
      for(var k=0;k<lenElem;k++){
        elem[k].style.left='-150%';
      }
    }
  }
