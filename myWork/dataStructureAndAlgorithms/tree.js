function BinarySearchTree(){
	var Node = function(key){
		this.key = key;
		this.left = null;
		this.right = null;
	}
	var root = null;
	var insertNode = function(node,newNode){
		if(newNode.key<node.key){
			if(node.left == null){
				node.left = newNode;
			}else{
				insertNode(node.left,newNode);
			}
		}else{
			if(node.right == null){
				node.right = newNode;
			}else{
				insertNode(node.right,newNode);
			}
		}
	}
	var inOrderTraverseNode = function(node,callback){
		if(node!=null){
			inOrderTraverseNode(node.left,callback);
			callback(node.key);
			inOrderTraverseNode(node.right,callback);
		}
	}
	var preOrderTraverseNode = function(node,callback){
		if(node!=null){
			callback(node.key);
			preOrderTraverseNode(node.left,callback);
			preOrderTraverseNode(node.right,callback);
		}		
	}
	var postOrderTraverseNode = function(node,callback){
		if(node!=null){
			postOrderTraverseNode(node.left,callback);
			postOrderTraverseNode(node.right,callback);			
			callback(node.key);
		}		
	}	
	var minNode = function(node){
		if(node){
			while(node.left){
				node = node.left;
			}
			return node.key;
		}
		return null;
	}
	// var getMinNode = function(node){
	// 	if(node){
	// 		while(node.left){
	// 			node = node.left;
	// 		}
	// 		return node;
	// 	}		
	// }
	var maxNode = function(node){
		if(node){
			while(node.right){
				node = node.right;
			}
			return node.key;
		}
		return null;
	}
	var searchNode = function(node,key){
		if(node == null){
			return false;
		}
		if(key<node.key){
			return searchNode(node.left,key);
		}else if(key>node.key){
			return searchNode(node.right,key);
		}else{
			return true;
		}
	}
	var removeNode = function(node,key){
		if(node == null){
			return null;
		}
		if(key<node.key){
			node.left = removeNode(node.left,key);
			return node;
		}else if(key>node.key){
			node.right = removeNode(node.right,key);
			return node;
		}else{
			if(node.left == null && node.right == null){
				node = null;
				return node;
			}
			if(node.left == null){
				node = node.right;
				return node;
			}else if(node.right == null){
				node = node.left;
				return node;
			}
			var aux = minNode(node.right);
			node.key = aux;
			node.right = removeNode(node.right,aux);
			return node;
		}
	}	
	this.insert = function(key){
		var ele = new Node(key);
		if(root == null){
			root = ele;
		}else{
			insertNode(root,ele);
		}
	}
	this.search = function(key){
		return searchNode(root,key);
	}
	this.inOrderTraverse = function(callback){
		inOrderTraverseNode(root,callback);
	}
	this.preOrderTraverse = function(callback){
		preOrderTraverseNode(root,callback);
	}
	this.postOrderTraverse = function(callback){
		postOrderTraverseNode(root,callback);
	}
	this.min = function(){
		return minNode(root);
	}
	this.max = function(){
		return maxNode(root);
	}
	this.remove = function(key){
		removeNode(root,key);
	}
}