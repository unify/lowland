(function() {

	var URL = window.URL || window.webkitURL;
	var supported = true;
	if (!URL) {
		supported = false;
		URL = {
			createObjectURL : function() {
				if (jasy.Env.isSet("debug")) {
					console.error("Browser don't support ObjectURL");
				}
			},
			revokeObjectURL : function() {
				if (jasy.Env.isSet("debug")) {
					console.error("Browser don't support ObjectURL");
				}
			}
		};
	}

	core.Module("lowland.bom.Binary", {
		isSupported : supported,

		createUrl : URL.createObjectURL,

		revokeUrl : URL.revokeObjectURL,

		createBlob : function(content, options) {
			// this is a fix for iOS/iPad as it don't support creating blobs from typed arrays (only from buffer of them)
			var contentLength = content.length;
			var nc = new Array(contentLength);
			for (var i=0; i<contentLength; i++) {
				var c = content[i];
				if (c.buffer) {
					nc[i] = c.buffer;
				} else {
					nc[i] = c;
				}
			}

			return new Blob(nc, options);
		}
	});
})();
