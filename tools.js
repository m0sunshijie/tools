/**
 * 
 * @authors Sun (447019583@qq.com)
 * @date    2014-07-29 20:08:43
 * @version v1.0.0
 */
if (typeof console === 'undefined') {
    console = {
        log: function() {}
    };
}

function $o(id,tag,classname){
	var id = typeof id !='string'?id:document.getElementById(id);
	var classElements = []
	if(classname){
		var allElements = id.getElementsByTagName(tag)
		for(var i = 0; i < allElements.length; i++){
			if(Element.hasClass(allElements[i],classname)){
				classElements.push(allElements[i]);
			}
		}
		return classElements;
	}else if(tag && !classname){
		return id.getElementsByTagName(tag);
	}else{
		return id;
	}
}
/*
 * String
 */
var str = {
	reverse : function(str){
		return str.split('').reverse().join('');
	},
	hump : function(str){
		return str.replace(/[A-Z]/g,function(v){
			return '-' + v.toLowerCase();
		})
	}

}

/*
 * Event
 */
var Event = {
	add : function(obj,typ,fun){
		obj.attachEvent?obj.attachEvent('on'+typ,fun):obj.addEventListener(typ,fun,false);
	},
	remove : function(obj,typ,fun){
		obj.detachEvent?obj.detachEvent('on'+typ,fun):obj.removeEventListener(typ,fun,false);
	},
	getType : function(event){
		return event.type;
	},
	getEvent : function(event){
		return event || window.event
	},
	getElement : function(event){
		return event.target || event.srcElement;
	},
	stop : function(event){
		event.stopPropagation?event.stopPropagation():event.cancelBubble;
		//window.event?eve.cancelBubble=true:eve.stopPropagation();
	}
}

/*
 * Element
 */
var Element = {
	hasClass : function (obj,name){
		return (" "+obj.className+" ").indexOf(" "+name+" ")>-1?true:false;
	},
	addClass : function (obj,name){
		if(Element.hasClass(obj,name)) return;
		obj.className = obj.className+" "+name;
	},
	removeClass : function (obj,name){
		obj.className = obj.className.replace(name,"");
	},
	getStyle : function(obj,attr){
		var reslut;
        if (attr == 'padding' || attr == 'margin') {
            result = '';
            for (var key in { top: 0, right: 0, bottom: 0, left: 0}) {
                result += Element.getStyle(obj, attr + '-' + key) + ' ';
            }
            result = result.replace(/\s$/, '');
            //console.log(result)
            return result;
        }

		function getComStyle(style){
			if(obj.currentStyle){
				return obj.currentStyle[style]
			}else{
				return getComputedStyle(obj,false)[style]
			}
		}

		if(attr == 'opacity'){
			reslut = getComStyle(attr);
			reslut = !reslut ? 1 :reslut;
			return reslut;
		}
		
		reslut = obj.style[attr];

		if(!reslut){
			reslut = getComStyle(attr)
		}
		if(reslut == 'auto'){
			reslut = '0';
		}

		return reslut;
	},
	setStyle : function(obj,attr){
		var s = '';
		for(var key in attr){
			//key = str.hump(key);
			if(key == 'opacity'){
				s+=key+":"+attr[key]+';filter:alpha(opacity='+attr[key]*100+');';
			}else{
				s+=str.hump(key)+":"+parseInt(attr[key])+'px; ';
			}		
			
		}
		//console.log(str)
		obj.style.cssText += s;
		s = '';
		return
	},
	getPosition : function(obj){
		var x = 0,
			y = 0;

		while(obj){
			x += obj.offsetLeft;
			y += obj.offsetTop;
			obj = obj.offsetParent;
		}

		return {
			x : x,
			y : y
		}
	},
    getChild: function(obj, node) {
        var o = typeof obj === 'string' ? document.getElementById(obj) : obj,
            list = o.childNodes,
            nodes = [];
        for (var i = 0, l = list.length; i < l; i++) {
            if (node) {
                if (list[i].nodeName == node.toUpperCase()) {
                    nodes.push(list[i]);
                }
            } else {
                if (list[i].nodeType == 1) nodes.push(list[i])
            }
        }
        o = null;
        list = null;
        return nodes;
    }

};

/*
 * Anima
 */
(function(){

	var timer = null,
		data = {},
		cur = 1;

	function init(obj,opt){
		var uid = guid();
		data[uid] = {
			obj : typeof obj !='string'?obj:document.getElementById(obj),
			time : opt.time,
			state : false,
			styles : {
				name : [],
				from : [],
				to : []
			}
		}
		return uid
	}


    function guid() {
        return 'xxxxxxx-xxxx-yxxxxxx'.replace(/[xy]/g, function(v) {
            var s = Math.random() * 16 | 0,
                c = v == 'x' ? s : (s & 0x3 | 0x8);
            return c.toString(16);
        })
    }

	function start(attr){
		var uid = this.uid;
		data[uid].beginTime = new Date().getTime();
		data[uid].endTime = data[uid].beginTime + data[uid].time;
		data[uid].styles = {
			name : [],
			from : [],
			to : []
		}
		data[uid].state = true;
		for(var key in attr){
			data[uid].styles.name.push(key);
			data[uid].styles.from.push(Element.getStyle(data[uid].obj,key));
			data[uid].styles.to.push(attr[key]);
		}
		
		
		clearInterval(timer);
		timer = setInterval(play,15);

	}

	function play(){
		var seq = 0;

		for(var key in data){
			if(data.hasOwnProperty(key)){
				//console.log(data)
				if(data[key].state == true){
					move(key)
				}else{
					seq++;
				}
			}	
		}

		render();
		if(seq == cur){
			clearInterval(timer);
			time = null;
			seq = 0;
			return;
		}

	}

	function move(key){
		var uid = key;
		var str = {};
		var nowTime = new Date().getTime();
		var styles = data[uid].styles;
		data[uid].m = (nowTime-data[uid].beginTime)/data[uid].time;
		//console.log(data[uid].endTime)
		data[uid].m = data[uid].m>1?1:data[uid].m;
		for(var i =0; i<styles.name.length; i++){
			str[styles.name[i]] = parseFloat(styles.from[i]) + (parseFloat(styles.to[i])-parseFloat(styles.from[i]))*data[uid].m;
			//console.log(str)
		}
		data[uid].cssText = str;
		//console.log(timer)

	}

	function render(){
		for(var key in data){
			//
			if(data.hasOwnProperty(key)){
				Element.setStyle(data[key].obj,data[key].cssText);
				//console.log(data[key].cssText)
				if(data[key].m == 1){
					if(data[key].complete){
						data[key].complete()
					}
					complete(key)
				}
			}
		}
	}

	function pause(){
		var uid = this.uid;
		var current  = new Date().getTime();
		data[uid].fixTime = current - data[uid].beginTime;
		data[uid].state = false;
		//console.log(data[uid])
	}

	function reStart(){
		var uid = this.uid;
		var current  = new Date().getTime();
		data[uid].beginTime = current - data[uid].fixTime
		data[uid].state = true;
		//console.log(data[uid])
		timer = setInterval(play,15);
	}

	function stop(uid){
		var uid = uid || this.uid;
		complete(uid);
	}

	function complete(key){
		data[key].m = 0;
		data[key].complete = null;
		data[key].styles = {
			name : [],
			from : [],
			to : []
		}
		data[key].state = false;
		timer =null;
	}

	function setComplete(fn){
		var uid = this.uid;
		data[uid].complete = fn;
	}

	function cancel(fn){
		var uid = uid || this.uid;
		if(!data[uid].state) return;
		stop(uid);
		fn && fn();
	}

	window['Anima'] = function(obj,opt){
		var uid = init(obj,opt);
		return {
			start : start,
			complete : setComplete,
			pause : pause,
			stop : stop,
			reStart : reStart,
			cancel : cancel,
			uid : uid
		}
	};


})();
