/**
 * 
 * @authors Sun (447019583@qq.com)
 * @date    2014-07-29 20:08:43
 * @version $Id$
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
		var str = '';
		for(var key in attr){
			if(key == 'opacity'){
				str+=key+":"+attr[key]+';filter:alpha(opacity='+attr[key]*100+');';
			}else{
				str+=key+":"+parseInt(attr[key])+'px; ';
			}		
			
		}
		//console.log(str)
		obj.style.cssText += str;
		str = '';
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
	}

};

/*
 * Anima
 */
(function(){

	var timer = null,
		data = {};

	function init(obj,opt){
		var uid = guid();
		data[uid] = {
			obj : typeof obj !='string'?obj:document.getElementById(obj),
			time : opt.time,
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
		};
		for(var key in attr){
			data[uid].styles.name.push(key);
			data[uid].styles.from.push(Element.getStyle(data[uid].obj,key));
			data[uid].styles.to.push(attr[key]);
		}
		
		//console.log(data)
		clearInterval(data[uid].obj.timer);
		data[uid].obj.timer = setInterval(play,15);

	}

	function play(){

		for(var key in data){
			if(data.hasOwnpropertype(key)){
				move(key)
			}
			
		}


	}

	function move(key){
		var uid = key;
		var str = {};
		var nowTime = new Date().getTime();
		var styles = data[uid].styles;
		data[uid].m = (nowTime-data[uid].beginTime)/data[uid].time;
		data[uid].m = data[uid].m>1?1:data[uid].m;
		for(var i =0; i<styles.name.length; i++){
			str[styles.name[i]] = parseFloat(styles.from[i]) + (parseFloat(styles.to[i])-parseFloat(styles.from[i]))*data[uid].m;
			console.log(str)
		}

		Element.setStyle(data[uid].obj,str)
		if(data[uid].m >= 1){
			clearInterval(data[uid].obj.timer)
			if(data[uid].complete){
				data[uid].complete()
			}
		}

	}

	function setComplete(fn){
		var uid = this.uid;
		data[uid].complete = fn;
	}

	window['Anima'] = function(obj,opt){
		var uid = init(obj,opt);
		return {
			start : start,
			complete : setComplete,
			uid : uid
		}
	};


})();
