function HashTable(){
	var table = [];
	var loseloseHashCode = function(key){
		var hash = 0;
		for(var i = 0;i<key.length;i++){
			hash+= key.charCodeAt(i);
		}
		return hash;
	}
	var ValuePair = function(key,value){
		this.key = key;
		this.value = value;
	}
	this.put = function(key,value){
		var pos = loseloseHashCode(key);
		var ele = new ValuePair(key,value);
		if(table[pos] == undefined){
			table[pos] = ele;
		}else{
			pos++;
			while(table[pos] != undefined){
				pos++;
			}
			table[pos] = ele;
		}
	}
	this.remove = function(key){
		var pos = loseloseHashCode(key);
		if(table[pos] == undefined){return;}
		if(table[pos].key == key){
			 table[pos] = undefined;
		}else{
			pos++;
			while(table[pos] == undefined || table[pos].key != key ){
				pos++;
			}
			table[pos] = undefined;
		}
	}
	this.get = function(key){
		var pos = loseloseHashCode(key);
		if(table[pos] == undefined){return;}
		if(table[pos].key == key){
			return table[pos].value;
		}else{
			pos++;
			while(table[pos] == undefined || table[pos].key != key ){
				pos++;
			}
			if(table[pos] && table[pos].key == key){
				return table[pos].value;
			}
		}
		return undefined;

	}
}