"use strict";//let必须要用严格模式，否则浏览器报错

//let声明的只在代码块里有效
{
	let a = 10;
	var b = 1;
	console.log(a);
	console.log(b);
}
try{
	console.log(a);
}catch(e){
	console.log("a is not defined");
}
console.log(b);

//在for循环里let声明的变量，只在循环里有效
for(let i=0;i<10;i++){
	console.log(i);
}
try{
	console.log(i)
}catch(e){
	console.log("i only exit in for loop");
}

//这是引出闭包的经典例子
var c = [];
for(var j=0;j<10;j++){
	c[j] = function(){
		console.log(j);
	}
}
c[6]();

//k 是用let声明的，k只在本轮循环有效，每次循环的k都相当于一个新的变量
var d= [];
for(let k = 0;k<10;k++){
	d[k] = function(){
		console.log(k);
	}
}
d[6]();//这里输出的是6，如果用var声明就会输出10

var tmp = 123;
if(true){
	let temp = 'abc';
	//let temp;
}
console.log(tmp);


function f1(){
	let n = 5;
	if(true){
		let n = 10;
	}
	console.log(n);
}
f1();

{
	function f(){
		console.log("a");
	}
}
//f();  //ECMAScript6支持块级作用域，所以这里在外部调用块级作用域的函数是会报错的


//const
const PI = 3.14;
console.log(PI);
// PI = 3.1415926;
// console.log(PI);//常数声明的时候就要赋值，然后就不能再赋值了，否则会报错

if(true){
	const MAX = 5;
	console.log(MAX);
}
//console.log(MAX);//块级作用域，所以这里会报错

