//默认值
function log(x,y='world'){
	console.log(x,y);
}
log("hello");
function fetch(url,{body='abc',method='get',headers={}}){
	console.log(url,body,method,headers);
}
fetch("http://jiangshanmeta.github.io",{});
fetch("http://jiangshanmeta.github.io",{body:'z',method:'post',headers:"p"});

function m1({x=0,y=1} = {}){
	console.log(x,y);
}
function m2({x,y}= {x:0,y:0}){
	console.log(x,y);
}
m1({x:3});
m2({x:3});

//rest参数
function add(a,b,...values){
	let sum  = 0;
	console.log(values);
	for(var val of values){
		sum+=val;
	}
	return sum;
}
console.log(add(2,5,4,3));

//... 将一个数组打散
console.log(...[2,3,4]);

function f(x,y,z){
	console.log(x,y,z);
}
f(...[14,5,7]);

console.log(Math.max(...[99,88,101]));
[..."hello"];
var hello = [..."hello"];
console.log(hello);