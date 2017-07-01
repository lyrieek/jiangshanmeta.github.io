function Dictionary(){
	var items = {};
	this.add = function(key,val){
		items[key] = val;
	}
	this.remove = function(key){
		delete items[key]
	}
	this.has = function(key){
		return items.hasOwnProperty(key);
	}
	this.get = function(key){
		return items[key];
	}
	this.clear = function(){
		items = {};
	}
	this.size = function(){
		return Object.keys(items).length;
	}
	this.keys = function(){
		return Object.keys();
	}
	this.values = function(){
		var values = [];
		for(k in items){
			if(this.has(k)){
				values.push(items[k])
			}
		}
		return values;
	}
	this.print = function(){
	//	console.log(this.values(),this.size());
		console.log(items);
	}
}