function LinkedList(){
	var Node = function(el){
		this.element = el;
		this.next = null;
	}
	var length = 0;
	var head = null;
	this.append = function(el){
		var nodeEle = new Node(el);
		if(head == null){
			head = nodeEle;
		}else{
			current = head;
			while(current.next){
				current = current.next;
			}
			current.next = node;
		}
		length++;
	}
	this.insert = function(index,el){
		if(index<0 || index>length){return;}
		var nodeEle = new Node(el);
		var current = head;
		if(index == 0){
			nodeEle.next = current;
			head = nodeEle;
		}else{
			var curPos = 0;
			var prev;
			while(curPos<index){
				prev = current;
				current = current.next;
				curPos++;
			}
			prev.next = nodeEle;
			nodeEle.next = current;
		}
		length++;
	} 
	this.removeAt = function(index){
		if(index<0 || index>=length){return null;}
		var current = head;
		if(index == 0){
			head = head.next;
		}else{
			var curPos = 0;
			var prev;		
			while(curPos<index){
				prev = current;
				current = current.next;
				curPos++;
			}
			prev.next = current.next;

		}
		length--;
		return current.element;
	}
	this.remove = function(el){
		var index = this.indexOf(el);
		this.removeAt(index);
	}
	this.indexOf = function(el){
		var current = head;
		var curPos = 0;
		while(current){
			if(current.element == el){
				return curPos;
			}
			current = current.next;
			curPos++;
		}

		return -1;
	}
	this.isEmpty = function(){
		return length == 0;
	}
	this.size = function(){
		return length;
	}
	this.getHead = function(){
		return head;
	}
}