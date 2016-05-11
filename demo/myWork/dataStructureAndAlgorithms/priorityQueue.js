function PriorityQueue(){
	var items = [];
	//这里规定pri越小权限越低
	function PriorityQueueNode(el,pri){
		this.element = el;
		this.priority = pri;
	}
	this.enqueue = function(el,pri){
		var newEle = new PriorityQueueNode(el,pri);
		if(this.isEmpty()){
			items.push(newEle);
		}else{
			var added = false;
			var size = this.size();
			for(var i=0;i<size;i++){
				if(pri<items[i].priority){
					items.splice(i,0,newEle);
					added = true;
					break;
				}
			}
			if(!added){
				items.push(newEle);
			}
		}
	}
	this.dequeue = function(){
		return items.shift();
	}
	this.clear = function(){
		items = [];
	}
	this.size = function(){
		return items.length;
	}  
	this.front = function(){
		return items[0];
	}
	this.isEmpty = function(){
		return items.length == 0;
	}
	this.print = function(){
		console.log(items,this.size())
	}
}