//Array.from的作用是将一个类数组转化为数组，然而在es5时代依然有方法，下面有例子
let arrayLike = {
	'0':"1",
	'1':'2',
	'2':'3',
	length:3 //这里必须要加一个长度
}
let arr1 = [].slice.call(arrayLike);
console.log(arr1);
let arr2 = Array.from(arrayLike);
console.log(arr2);

let arr3 = Array.from(document.getElementsByClassName("a"));
console.log(arr3);

function foo(a,b){
	var args = [...arguments];
	console.log(args);
}
foo("a","b");
//Array.from支持第二个参数，相当于map
var arr4 = Array.from(arrayLike,x=>x*x);
console.log(arr4);


//Array.of();  并不觉得有什么用，它是作为构造函数Array的替代品的，然而，正常声明个数组会有女朋友啊
var arr5 = Array.of(3,11,8);
console.log(arr5,"arr5");

//这个方法似乎没什么用
var arr6 = [1,2,3,4,5];
arr6.copyWithin(1,0,2);
console.log(arr6);

//数组遍历的方法,find返回第一个满足条件的值，findIndex返回第一个满足条件的值的索引
var arr7 = [1,4,-5,10];
var firstOne = arr7.find(function(item,index,arr){
	return item>9;
})
console.log(firstOne);

var firstIndx = arr7.findIndex(function(item,index,arr){
	return item == -5;
})
console.log(firstIndx);

for(let index of arr7.keys()){
	console.log(index);
}
console.log(Array.prototype.keys);
console.log(Array.prototype.values);//我的浏览器暂不支持values
// for(let ele of arr7.values()){
// 	console.log(ele);
// }

//类似于字符串的includes，作为indexOf的替代品
console.log(arr7.includes(0))
