理解CSS3中 新的几个关键字成员

最近看了[张鑫旭大神的一片文章](http://www.zhangxinxu.com/wordpress/2016/05/css3-width-max-contnet-min-content-fit-content/),介绍了```width```属性的几个关键字成员：```fill-available```、```max-content```、```min-content```、```fit-content```。如果有不熟悉的链接都有了自己点过去看。他的那篇文章偏重于概念介绍，我想介绍一些细节以及应用

## fill-available

```CSS
.fill-available{
	width:fill-available;
}
```

这个关键字使得盒子尽可能填充满剩余空间，听起来很像是```width:100%;```。那么直接用```width:100%;```行吗,至少没有兼容问题啊？

其实是分情况的。如果对这个盒子设置了```box-sizing:border-box```,那真的无所谓，用什么都行。但是默认的```box-sizing```是*content-box*在这种情况下如果有margin padding border的，此时使用```width:100%```就会面临超出父盒子的问题，但是```width:fill-available```就没有这个问题。

//像我们这种基于bootstrap改改用的，已经有了```*{box-sizing:border-box;}```，所以好像没什么用。

## max-content

> max-content的行为表现可以这么理解，假设我们的容器有足够的宽度，足够的空间，此时，所占据的宽度是就是max-content所表示的尺寸。

说实话至今我没想起来这个能用来干什么

## min-content
这个就比较有意思了，我们可以用来自适应内部元素。
```
<div style="" class="responsive-wrap">
	<img src="http://jiangshanmeta.github.io/demo/myWork/csssecrets/2.jpg">
</div>
```
以往常见的图片展示效果是规定外层div的大小，然后图片大小跟着外层div来。bootstrap里的一个实现是
```
img-responsive{
	display: block;
	max-width: 100%;
	height: auto;
}
```
如果我偏要父元素的宽度跟着子元素走，以往我可能会这么做：给外层div加个```display:table;```利用其尺寸收缩的特性。有点hack的味道在这里。而且这么做健壮性不够，如果我想给图片下面加上几行描述，尤其是字数要长长长，这时候```display:table;```的效果，[点开自己看](http://jiangshanmeta.github.io/blogdemo/css3width/table.html)。

如果把div的width设为min-content,就能在长描述的存在下，依然做到父元素大小跟着图片大小走。结果请点击上面链接

## fit-content

这个属性的性质和上面说的```display:table;```最终表现可以说一模一样。我没找到区别。

## 结束语
好像也就min-content用处多点，其他的我还在想能做什么特别而且能用到的事情