/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function(global) {
	var bound = false;
	var doc = global.document;
	var body = doc.body;
	
	var filterMouseMove = function(e) {
		return {
			screenX: e.screenX,
			screenY: e.screenY,
			clientX: e.clientX,
			clientY: e.clientY,
			button: e.button,
			relatedTarget: e.relatedTarget
		};
	};
	
	var synthesizer = function(e) {
		// See http://www.quirksmode.org/js/events_properties.html#target
		e = e || window.event;
		var target = e.target ? e.target : e.srcElement;
		if (target.nodeType == 3) {
			target = target.parentNode; // Fix for Safari bug
		}
		var eventDoc = target.ownerDocument || document;
		var doc = eventDoc.documentElement;
		var body = eventDoc.body;
		
		if (e.pageX == null || e.pageY == null) {
			e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			e.pageY = e.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
		}
		
		lowland.bom.Events.dispatch(e.target, "hook_mousemove", false, filterMouseMove(e));
		lowland.bom.Events.preventDefault(e);
	};
	
	var startListen = function() {
		lowland.bom.Events.set(body, "mousemove", synthesizer, false);
	};
	
	core.Module("lowland.bom.event.MouseEvents", {
		listen : function(element, type, handler, capture) {
			if (!bound) {
				bound=true;
				startListen();
			}
			lowland.bom.Events.listen(element, "hook_"+type, handler ,capture);
		},
		unlisten : function(element, type, handler, capture) {
			lowland.bom.Events.unlisten(element, "hook_"+type, handler ,capture);
		}
	});
	
	lowland.bom.Events.registerHook("mousemove", lowland.bom.event.MouseEvents);
	lowland.bom.Events.registerHook("mousedown", lowland.bom.event.MouseEvents);
	lowland.bom.Events.registerHook("mouseup", lowland.bom.event.MouseEvents);
})(this);