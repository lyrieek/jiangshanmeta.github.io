if (!String.prototype.str_supplant) {
    String.prototype.str_supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
    };
}
//http://phpjs.org/functions/in_array/
function in_array(needle, haystack, argStrict) {
  var key = '',
    strict = !! argStrict;
  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        return true;
      }
    }
  }
  return false;
}
//require jquery and jquery-blockui
function ajax_post(opts){
    var dft_opt = {
        m: 'index',
        a: 'index',
        plus: '',
        data: {},
        callback: function(json){
           console.log(json);
        }
    };
    opts = $.extend({},dft_opt,opts);
    $.blockUI();
    var url = req_url_template.str_supplant({ctrller:opts.m,action:opts.a})+'/'+opts.plus;
    $.ajax(
        {type: "POST",
        url: url,
        dataType:"json",
        data: opts.data}
    ).done(function(json) {
        opts.callback(json);
    }).fail(function() {
        alert( "error" );
    }).always(function() {
        $.unblockUI();
    });
}

function ajax_get(opts){
    var dft_opt = {
        m: 'index',
        a: 'index',
        id: '',
        data: {},
        callback: function(json){
            console.log(json);
        }
    };
    opts = $.extend({},dft_opt,opts);
    $.blockUI();
    var url = req_url_template.str_supplant({ctrller:opts.m,action:opts.a});
    url = url + '/'+opts.id;
    $.each(opts.data,function(k,v){
        url = url + '&'+k+'='+v;
    });
    $.ajax(
        {type: "GET",
        url: url,
        dataType:"json"}
    ).done(function(json) {
        opts.callback(json);
    }).fail(function() {
        alert( "error" );
    }).always(function() {
        $.unblockUI();
    });
}

function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (Object.prototype.toString.call(value) == '[object Array]') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}


//form 序列化 https://github.com/macek/jquery-serialize-object
(function(root, factory) {

  // AMD
  if (typeof define === "function" && define.amd) {
    define(["exports", "jquery"], function(exports, $) {
      return factory(exports, $);
    });
  }

  // CommonJS
  else if (typeof exports !== "undefined") {
    var $ = require("jquery");
    factory(exports, $);
  }

  // Browser
  else {
    factory(root, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(exports, $) {

  var patterns = {
    validate: /^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,
    key:      /[a-z0-9_]+|(?=\[\])/gi,
    push:     /^$/,
    fixed:    /^\d+$/,
    named:    /^[a-z0-9_]+$/i
  };

  function FormSerializer(helper, $form) {

    // private variables
    var data     = {},
        pushes   = {};

    // private API
    function build(base, key, value) {
      base[key] = value;
      return base;
    }

    function makeObject(root, value) {

      var keys = root.match(patterns.key), k;

      // nest, nest, ..., nest
      while ((k = keys.pop()) !== undefined) {
        // foo[]
        if (patterns.push.test(k)) {
          var idx = incrementPush(root.replace(/\[\]$/, ''));
          value = build([], idx, value);
        }

        // foo[n]
        else if (patterns.fixed.test(k)) {
          value = build([], k, value);
        }

        // foo; foo[bar]
        else if (patterns.named.test(k)) {
          value = build({}, k, value);
        }
      }

      return value;
    }

    function incrementPush(key) {
      if (pushes[key] === undefined) {
        pushes[key] = 0;
      }
      return pushes[key]++;
    }

    function encode(pair) {
      switch ($('[name="' + pair.name + '"]', $form).attr("type")) {
        case "checkbox":
          return pair.value === "on" ? true : pair.value;
        default:
          return pair.value;
      }
    }

    function addPair(pair) {
      if (!patterns.validate.test(pair.name)) return this;
      var obj = makeObject(pair.name, encode(pair));
      data = helper.extend(true, data, obj);
      return this;
    }

    function addPairs(pairs) {
      if (!helper.isArray(pairs)) {
        throw new Error("formSerializer.addPairs expects an Array");
      }
      for (var i=0, len=pairs.length; i<len; i++) {
        this.addPair(pairs[i]);
      }
      return this;
    }

    function serialize() {
      return data;
    }

    function serializeJSON() {
      return JSON.stringify(serialize());
    }

    // public API
    this.addPair = addPair;
    this.addPairs = addPairs;
    this.serialize = serialize;
    this.serializeJSON = serializeJSON;
  }

  FormSerializer.patterns = patterns;

  FormSerializer.serializeObject = function serializeObject() {
    return new FormSerializer($, this).
      addPairs(this.serializeArray()).
      serialize();
  };

  FormSerializer.serializeJSON = function serializeJSON() {
    return new FormSerializer($, this).
      addPairs(this.serializeArray()).
      serializeJSON();
  };

  if (typeof $.fn !== "undefined") {
    $.fn.serializeObject = FormSerializer.serializeObject;
    $.fn.serializeJSON   = FormSerializer.serializeJSON;
  }

  exports.FormSerializer = FormSerializer;

  return FormSerializer;
}));

function refresh(){
    window.location.reload(true);
}
function gotoUrl(url){
    window.location.href = url;
}
function gotoPage(m,a){
    window.location.href = req_url_template.str_supplant({ctrller:m,action:a});;
}
// var alertPlug = {
//     modal : function(opts){
//         var dft_opt = {
//             m: 'index',
//             a: 'index',
//             id: '',
//             data: {},
//         };
//         opts = $.extend({},dft_opt,opts);
//         $.blockUI({ css: {
//                 border: 'none',
//                 padding: '15px',
//                 backgroundColor: '#000',
//                 'border-radius': '5px',
//                 opacity: .7,
//                 color: '#fff'
//             },
//             message:  '<h3>请稍候</h3>'  });
//         var url = req_url_template.str_supplant({ctrller:opts.m,action:opts.a});
//         url = url + '/'+opts.id;
//         $.each(opts.data,function(k,v){
//             url = url + '&'+k+'='+v;
//         });
//         $("#common_modal").html('').load(url,function(){
//             $.unblockUI();
//             $(this).modal('show').css({
//                 'top': function () { //vertical centering
//                     return (($(this).height() - $('#common_modal .modal-dialog').height())/ 2);
//                 }
//             });
//         });
//     },
//     confirmCon : function(domId){

//             $("#"+domId).modal('show').css({
//                 'top': function () { //vertical centering
//                     return (($(this).height() - $('#'+domId+' .modal-dialog').height())/ 2);
//                 }
//             });
//         // }
//     },
//     showPic : function(picHolderDom,imgDom){
//         var imgWidth = $(imgDom).width();
//         var imgHeight = $(imgDom).height();
//         var realHeight = $(window).width()/imgWidth*imgHeight;

//         $.blockUI({
//             message: $(imgDom),
//             css: {
//                 border: 'none',
//                 left: 0,
//                 top: ($(window).height() -realHeight)/2 + 'px',
//                 height:realHeight + 'px',
//                 width: '100%' ,
//                 fadeIn:0

//             }
//         });
//         $(".blockUI "+imgDom).one('click',function(){
//             $.unblockUI();
//         })

//     },
//     alert: function(msg,type){

//         var _bt_html = '';
//         var title = '';
//         var pop_title_style = '';
//         if(type == 'c'){
//             //confirm TODO
//         }else if(type == 's'){
//             //成功
//             title = "成功了";
//             pop_title_style = 'pop_title_blue';
//             _bt_html = '<button type="button" onclick="alertPlug.close();" class="btn btn-success">确　定</button>';
//         } else {
//             //error
//             title = "出错了";
//             pop_title_style = 'pop_title_red';
//             _bt_html = '<button type="button" onclick="alertPlug.close();" class="btn btn-danger">确　定</button>';
//         }

//             var _html = '<div class="modal" id="popAlertbox" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
//   '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">'+
//         '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
//         '<h4 class="modal-title" id="myModalLabel">{title}</h4>'+
//       '</div><div class="modal-body">{msg}</div>'+
//       '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal">关闭</button></div>'+
//     '</div></div></div>';
//             _html = _html.str_supplant({pop_title_style:pop_title_style,title:title,msg:msg,_bt_html:_bt_html});

//         $("#popAlertbox").remove();
//         $('.page').append(_html);

//             $('#popAlertbox').modal('show').css({
//                 'top': function () { //vertical centering
//                     return (($(this).height() - $('#popAlertbox .modal-dialog').height())/ 2);
//                 }
//             });

//     },
//     inputs: function(msg,type){

//         var _bt_html = '';
//         var title = '';
//         var pop_title_style = '';
//         if(type == 'c'){
//             //confirm TODO
//         }else if(type == 's'){
//             //成功
//             title = "成功了";
//             pop_title_style = 'pop_title_blue';
//             _bt_html = '<button type="button" onclick="alertPlug.close();" class="btn btn-success">确　定</button>';
//         } else {

//             title = "出错了";
//             pop_title_style = 'pop_title_red';
//             _bt_html = '<button type="button" onclick="alertPlug.close();" class="btn btn-danger">确　定</button>';
//         }
//             var _html = '<div class="modal" id="popAlertbox" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
//   '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">'+
//         '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
//         '<h4 class="modal-title" id="myModalLabel">{title}</h4>'+
//       '</div><div class="modal-body">{msg}</div>'+
//       '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal">关闭</button></div>'+
//     '</div></div></div>';
//             _html = _html.str_supplant({pop_title_style:pop_title_style,title:title,msg:msg,_bt_html:_bt_html});
//         // }

//         $("#popAlertbox").remove();
//         $('.page').append(_html);
//             $('#popAlertbox').modal('show').css({
//                 'top': function () { //vertical centering
//                     return (($(this).height() - $('#popAlertbox .modal-dialog').height())/ 2);
//                 }
//             });
//     },
//     close:function(){
//         $.unblockUI();
//     }
// }
function tab_load(module,menu){
    $("#nav-"+module+" li").removeClass("active");
    $("#nav-"+module+"-"+menu).addClass("active");
    $(".info-"+module).addClass("hidden");
    $("#info-"+module+"-"+menu).removeClass("hidden");  
}