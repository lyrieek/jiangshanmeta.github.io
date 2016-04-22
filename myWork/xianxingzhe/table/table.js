"use strict";
{


}

(function(){
	let body = document.body;
	let btn = document.getElementById("createTable");
	let rowInput = document.getElementById("rowNum");
	let colInput = document.getElementById("colNum");
	function createTable(){
		let rowNum = rowInput.value;
		let colNum = colInput.value;
		console.log(colNum)
		if( Math.sign(rowNum)!=1 || Math.sign(colNum)!=1 ){
			alert("行数列数都必须是正整数");
			return;
		}
		let table = document.createElement("table");
		let tbody = document.createElement("tbody");
		let tableCont = '';
		for(let i = 0;i<rowNum;i++){
			tableCont += "<tr>";
			for(let j = 0;j<colNum;j++){
				tableCont += "<td></td>";
			}
			tableCont += "<td><a href='javascript:void(0);' onclick='(this.parentNode.parentNode.parentNode).removeChild(this.parentNode.parentNode)'>del</a></td>"
			tableCont += "</tr>";
		}
		tbody.innerHTML = tableCont;
		table.appendChild(tbody);
		body.appendChild(table);
	}
	btn.addEventListener("click",createTable,false);
})()