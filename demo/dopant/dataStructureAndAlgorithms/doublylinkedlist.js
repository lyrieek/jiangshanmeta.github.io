function DoublyLinkedList(){
	var Node = function(el){
		this.element = el;
		this.prev = null;
		this.next = null;
	}
	var length = 0;
	var head = null;
	var tail = null;
	this.insert = function(index,el){
		if(index<0 || index > length){return;}
		var nodeEle = new Node(el);
		if(index==0){
			if(!head){
				head = nodeEle;
				tail = nodeEle;
			}else{
				head.prev = nodeEle;
				nodeEle.next = head;
				head = nodeEle;
			}
		}else{
			var current = head;
			var prev;
			var curPos = 0;
			while(curPos<index){
				prev = current;
				current = current.next;
				curPos++;
			}
			prev.next = nodeEle;
			nodeEle.prev = prev;
			nodeEle.next = current;
			if(index != length){
				current.prev = nodeEle;
			}else{
				tail = nodeEle;
			}
		}
		length++;
	}
	this.removeAt = function(index){
		if(index<0 || index>=length){return;}
		if(index == 0){
			head = head.next;
			if(length == 1){
				tail = null;
			}else{
				head.prev = null;
			}
		}else if(index == length-1){
			tail = tail.prev;
			tail.next = null;
		}else{
			var current = head;
			var prev;
			var curPos = 0;
			while(curPos<index){
				prev = current;
				current = current.next;
				curPos++;
			}
			prev.next = current.next;
			current.next.prev = prev; 
			current.next = null;
			current.prev = null;

		}
		length--;
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
	this.remove = function(el){
		var index = this.indexOf(el);
		this.removeAt(index);
	}
	this.size = function(el){
		return length;
	}
	this.getHead = function(){
		return head;
	}
	this.getTail = function(){
		return tail;
	}
}