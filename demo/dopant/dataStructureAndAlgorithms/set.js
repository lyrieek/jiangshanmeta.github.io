function Set(){
	var items = {};
	this.add = function(val){
		if(!this.has(val)){
			items[val] = val;
			return true;
		}
		return false;
	}
	this.remove = function(val){
		if(this.has(val)){
			delete items[val];
			return true;
		}
		return false;
	}
	this.has = function(val){
		return items.hasOwnProperty(val);
	}
	this.size = function(){
		return Object.keys(items).length;
	}
	this.clear = function(){
		items = {};
	}
	this.values = function(){
		return Object.keys(items);
	}
	this.print = function(){
		console.log(this.values(),this.size());
	}
	this.union = function(otherSet){
		var unionSet = new Set();
		var values = this.values();
		values.forEach(function(val){
			unionSet.add(val);
		})
		values = otherSet.values();
		values.forEach(function(val){
			unionSet.add(val);
		});
		return unionSet;
	}
	this.intersection = function(otherSet){
		var intersectionSet = new Set();
		var values = this.values();
		values.forEach(function(val){
			if(otherSet.has(val)){
				intersectionSet.add(val);
			}
		})
		return intersectionSet;
	}
	this.diffference = function(otherSet){
		var differenceSet = new Set();
		var values = this.values();
		values.forEach(function(val){
			if(!otherSet.has(val)){
				differenceSet.add(val);
			}
		})
		return differenceSet;
	}
	this.subset = function(otherSet){
		var size = this.size();
		if(size>otherSet.size()){
			return false;
		}else{
			var values = this.values();
			for(var i=0;i<size;i++){
				if(!otherSet.has(values[i])){
					return false;
				}
			}
			return true;
		}
		

	}
}