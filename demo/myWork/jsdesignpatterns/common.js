Function.prototype.method = function(name,fn){
	this.prototype[name] = fn;
	return this;
}

//js实现接口
//js内置功能中没有接口，所以要通过各种方法模拟接口
//鸭式辨型  判断类是否实现接口中的方法，只要实现了接口中的方法就行
var Interface = function(name,methods){
	if(arguments.length != 2){
		throw new Error("Interface constructor called with " + arguments.length + "arguments,but expected exactly 2.");
	}
	this.name = name;
	this.methods = [];
	//这里还应加上判断methods是否是数组
	for(var i = 0,len = methods.length;i<len;i++){
		if(typeof methods[i] != 'string'){
			throw new Error("need string");
		}
		this.methods.push(methods[i]);
	}
}
Interface.ensureImplements = function(object){
	if(arguments.length<2){
		throw new Error("need at least two arguments");
	}
	for(var i = 1,len = arguments.length;i<len;i++){
		var interfaceIns = arguments[i];
		if(interfaceIns.constructor != Interface){
			throw new Error("need Interface");
		}
		var methods = interfaceIns.methods;
		for(var j =0;j<methods.length;j++){
			var method = methods[j];
			if(!object[method] || typeof object[method] != 'function'){
				throw new Error("implements " + method);
			}
		}


	}
}