//基于fontawesome && 一个类 text-warning
var scoreControl = {
    initScore:function(num,idArr){
        var _html = [];
        for(var i = 0;i<num;i++){
            _html[i] = '<span class="fa fa-star-o text-warning" onclick="scoreControl.clickScore(this)"></span>';
        }
        var fmt = _html.join("");
        idArr.forEach(function(id){
            var el = document.getElementById(id);
            el.innerHTML = fmt;
        })
    },
    clickScore:function(obj){
        var parent = obj.parentNode;
        var parentId = parent.getAttribute("id");
        var children = parent.children;
        var index = indexOfEle(obj);
        removeClass(arrayify(children),"fa-star");
        addClass(children,"fa-star-o");
        var j = index+1;
        for(var i=0; i<j; i++){
            removeClass(children[i],"fa-star-o");
            addClass(children[i],"fa-star");
        }
        document.getElementById(parentId+"_input").value=j;
    }
};