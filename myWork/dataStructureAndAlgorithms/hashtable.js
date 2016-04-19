function HashTable(){
	var table = [];
	var loseloseHashCode = function(key){
		var hash = 0;
		for(var i = 0;i<key.length;i++){
			hash+= key.charCodeAt(i);
		}
		return hash;
	}
	this.put = function(key,value){
		var pos = loseloseHashCode(key);
		table[pos] = value;
	}
	this.remove = function(key){
		var pos = loseloseHashCode(key);
		table[pos] = undefined; 
	}
	this.get = function(key){
		var pos = loseloseHashCode(key);
		return table[pos];
	}
}