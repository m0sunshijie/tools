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
        if (style == 'padding' || style == 'margin') {
            result = '';
            for (var key in { top: 0, right: 0, bottom: 0, left: 0}) {
                result += Element.getStyle(obj, style + '-' + key) + ' ';
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

		return reslut;
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

}

/*
 * Animation
 */
var Animation = {
	
}