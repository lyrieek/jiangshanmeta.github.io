"use strict";

var [a,b,c] = [1,2,3];
console.log(b);
var [d,e] = "de";
console.log(d,e);//如果不是数组而是字符串，把字符串当成类数组使用
const [PI,E,ABC] = [3.14,2.71828,"abc"];
console.log(PI,E,ABC);

let [head,second,...tail] = [1,2,3,4];//??????????????
console.log(head,tail);



var [foo = "z"] = [];//解构赋值允许默认值
console.log(foo);

function f(){
	console.log("aaaaaaaaaaaa");
	return "a";
}
let [z = f()] = [];
console.log(z,"zzz")




var {foo,bar} = {bar:"aaa","foo":"bbb"};
console.log(foo,bar);

let {sin,cos} = Math;//对象的解构赋值
console.log(sin(Math.PI))



//函数的解构赋值，可以使用默认值
function add([x=0,y=0]){
	console.log(x,y);
}
add([1,2]);
add([]);

var x = 10;
var y = 20;
[x,y] = [y,x];//交换两个值
console.log(x,y)

//为什么感觉像php的list
function example(){
	return [4,5,6];
}
var [e,f,g] = example();
console.log(e,f,g);