function ArrayList(){
	var array = [];
	this.insert = function(item){
		array.push(item);
	}
	this.print = function(){
		console.log(array);
	}
	//冒泡排序，O(n^2),这里实现的是从小到大排
	this.bubbleSort = function(){
		var length = array.length;
		var temp;
		for(var i=0;i<length;i++){
			for(var j=0;j<length-1-i;j++){
				if(array[j]>array[j+1]){
					temp = array[j];
					array[j] = array[j+1];
					array[j+1] = temp;
				}
			}
		}
	}
	//选择排序 O(n^2)
	this.selectionSort = function(){
		var length = array.length;
		var indexMin;
		for(var i=0;i<length-1;i++){
			indexMin = i;
			for(var j=i+1;j<length;j++){
				if(array[indexMin]>array[j]){
					indexMin = j;
				}
			}
			if(indexMin != i){
				var temp = array[i];
				array[i] = array[indexMin];
				array[indexMin] = temp;
			}
		}
	}
	this.quickSort = function(){

	}
	//顺序搜索
	this.sequentialSearch = function(item){
		for(var i = 0;i<array.length;i++){
			if(item == array[i]){
				return i;
			}
		}
		return -1;
	}
	//二分查找  需要已排序
	this.binarySearch = function(item){
		this.quickSort();
		var low = 0;
		var high = array.length-1;
		var mid,ele;
		while(low<=high){
			mid = Math.floor((low+high)/2);
			ele = array[mid];
			if(ele<item){
				low = mid+1;
			}else if(ele>item){
				high = mid-1;
			}else{
				return mid;
			}
		}
		return -1;
	}
}