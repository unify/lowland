/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function(global) {
	
	var objectRegistry = {};
	var id = 0;
	
	/**
	 * Generic queue manager supporting simple dependency dissolving.
	 */
	core.Module("lowland.ObjectManager", {
		getHash : function(obj) {
			if (!obj) {
				return;
			}
			
			if (obj.$$hash) {
				return obj.$$hash;
			}
			
			return obj.$$hash = id++;
		},
		
		register : function(obj) {
			objectRegistry[this.getHash(obj)] = obj;
		},
		
		unregister : function(obj) {
			var hash = this.getHash(obj);
			objectRegistry[hash] = null;
		},
		
		find : function(hash) {
			return objectRegistry[hash];
		},
		
		dispose : function() {
			var keys = Object.keys(objectRegistry);
			var disposeCounter = 0;
			var length = keys.length;
			
			for (var i=length-1; i>=0; i--) {
				var key = keys[i];
				var val = objectRegistry[key];
				
				if (val && val.dispose) {
					try {
						val.dispose();
						disposeCounter++;
						
						if (!val.isCoreDestructed()) {
							console.error("Wrong destruction hierarchy of ", val, val.toString());
						}
					} catch (e) {
						console.error(this, "Could not dispose object " + val, e);
					}
				}
				
				objectRegistry[key] = null;
			}
			
			console.log("Disposed " + disposeCounter + " Objects");
		}
	});
	
})(this);