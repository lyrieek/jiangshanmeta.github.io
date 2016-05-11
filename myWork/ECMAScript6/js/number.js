var num1 = 15;
var num2 = Infinity;
var num3 = NaN;
var num4 = '11';
//isFinite和isNaN先转成数字在判断，而Number上的不转
console.log(Number.isFinite(num1));//判断是否是正常的数字
console.log(Number.isFinite(num2));
console.log(Number.isFinite(num3));
console.log(Number.isFinite(num4));
console.log("a");
console.log(Number.isNaN(num1));
console.log(Number.isNaN(num2));
console.log(Number.isNaN(num3));
console.log(Number.isNaN(num4));
console.log("b");
var num5 = "-12.34";
console.log(Number.parseInt(num5));
console.log(Number.parseFloat(num5));

console.log("c");

console.log(Number.isInteger(25));
console.log(Number.isInteger(25.1));

console.log(Number.EPSILON);

console.log("d");
console.log(Math.trunc(4.1));//取整，参数自动转成数字
console.log(Math.trunc(-4.1));
console.log(Math.trunc(4.9));
console.log(Math.trunc("abc"));

console.log(Math.sign("-3.4"));//将参数强转成数字再处理

console.log(Math.hypot(3,4));//返回所有参数平方和的平方根
