function Graph(){
	//存放顶点
	var vertices = [];
	//实现邻接表
	var adjList = new Dictionary();
	var iniBFSstatus = function(){
		var status = [];
		for(var i=0;i<vertices.length;i++){
			status[vertices[i]] = 0;
		}
		return status;
	}
	//添加一个顶点
	this.addVertex = function(v){
		vertices.push(v);
		adjList.add(v,[]);
	}
	//添加一个边，两个顶点的相邻顶点都要更新
	this.addEdge = function(v,w){
		adjList.get(v).push(w);
		adjList.get(w).push(v);
	}
	this.bfs = function(v,callback){
		//状态0表示没有被访问，状态1表示被访问但没被探索，状态2表示被访问且被探索
		var status = iniBFSstatus();
		var queue = new Queue();
		queue.enqueue(v);
		while(!queue.isEmpty()){
			var u = queue.dequeue();
			var neighbors = adjList.get(u);
			status[u] = 1;
			//探索u节点的相邻顶点
			for(var i=0;i<neighbors.length;i++){
				var w = neighbors[i];
				//未访问
				if(status[w] == 0){
					status[w] = 1;
					queue.enqueue(w);
				}
			}
			status[u] = 2;
			callback&&callback(u);
		}
	}
	this.bfsShortWay = function(v){
		var status = iniBFSstatus();
		var queue = new Queue();
		var d = [];
		var pred = [];
		queue.enqueue(v);
		//初始化距离和上一个
		for(var i=0;i<vertices.length;i++){
			d[vertices[i]] = 0;
			pred[vertices[i]] = null;
		}

		while(!queue.isEmpty()){
			var u = queue.dequeue();
			var neighbors = adjList.get(u);
			status[u] = 1;
			for(var i = 0;i<neighbors.length;i++){
				var w = neighbors[i];
				if(status[w]==0){
					status[w] = 1;
					queue.enqueue(w);
					d[w] = d[u] + 1;
					pred[w] = u;
				}
			}
			status[u] = 2;
		}

		return {
			distance:d,
			predecessor:pred
		}
	}
	var dfsVisit = function(u,status,callback){
		status[u] = 1;
		callback&&callback(u);
		var neighbors = adjList.get(u);
		for(var i =0;i<neighbors.length;i++){
			var w = neighbors[i];
			if(status[w]==0){
				dfsVisit(w,status,callback);
			}
		}
		status[u] = 2;
		document.write(u+"done<br>")
	}
	this.dfs = function(callback){
		var status = iniBFSstatus();
		for(var i=0;i<vertices.length;i++){
			if(status[vertices[i]] == 0){
				dfsVisit(vertices[i],status,callback);
			}
		}
	}
	this.print = function(){
		console.log(vertices);
		adjList.print();
	}
}