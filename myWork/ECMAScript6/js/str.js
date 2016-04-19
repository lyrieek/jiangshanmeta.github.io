var unicode1 = "\u0061";
console.log(unicode1);

var unicode2 = "\u20BB7";
console.log(unicode2);

var unicode3 = "\u{20BB7}";
console.log(unicode3);

var str1= "𠮷a";
console.log(str1.length);//2
console.log(str1.codePointAt(0));
console.log(str1.codePointAt(1));

var str2 = "hello world";
console.log(str2.includes("ello"));

console.log(str2.startsWith("ello",1));//判断字符串是否以传入的字符串为开头，如果第二参数可选为起始位置
console.log(str2.endsWith("ld"));//判断字符串是否以传入的字符串为结尾，如果传入第二个参数则从前n的字符找。

var str3 = "abc";
var str4 = str3.repeat(3);//将字符串重复几次输出
console.log(str4);
console.log(String.prototype.padStart);//我的浏览器不支持
console.log(String.prototype.padEnd);//我的浏览器不支持

var str5 = `In javascript`;
console.log(str5);
var obj = {c:'ccc'}
var str6 = `I need to test ${str3.repeat(2)} , and also ${obj.c} `;
console.log(str6);

var x =1;
var y = 2;
var str7 = `${x} + ${y} = ${x+y}`;
console.log(str7);

console.log(`Hello ${`world`}`);

var a = 5;
var b = 10;
tag`Hello ${a+b} world ${a*b}`;
function tag(arr,arg1,arg2){
	console.log(arr);
	console.log(arg1);
	console.log(arg2);
}

var total = 30;
var msg = pass`the total is ${total}  ${total*1.05} with tax`;
function pass(literals){
	var results = '';
	var i = 0;
	console.log(literals,literals.length);
	while(i<literals.length){
		results += literals[i];
		i++;
		if(i<arguments.length){
			results += arguments[i];
		}
	}
	return results;
}
console.log(msg);

console.log(String.raw`Hi \n${2+5}`);


