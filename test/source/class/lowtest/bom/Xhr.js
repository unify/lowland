
(function() {
	
	var XHRSpy = function(xhr, result) {
		var old = {
			send: xhr.prototype.send,
			open: xhr.prototype.open,
			setRequestHeader: xhr.prototype.setRequestHeader
		};
		
		xhr.prototype.send = function(data) {
			result.send = arguments;
			
			var self = this;
			window.setTimeout(function() {
				self.onreadystatechange && self.onreadystatechange.call(self);
			}, 50);
		};
		xhr.prototype.open = function(method, url, async, user, password) {
			result.open = {
				method: method,
				url: url,
				async: async,
				user: user,
				password: password
			};
		};
		xhr.prototype.setRequestHeader = function() {};
		
		return old;
	};

	core.Module("lowtest.bom.Xhr", {
		test : function() {
			
			module("lowland.bom.Xhr");
			
			test("test Xhr object", function() {
				var x = new lowland.bom.Xhr();
			});
			
			test("url", function() {
				var url = "http://example.com";
				var url2 = "http://example2.com";
				var x = new lowland.bom.Xhr();
				
				x.setUrl(url);
				equals(url, x.getUrl());
				
				x.setUrl(url2);
				equals(url2, x.getUrl());
			});
			
			test("method", function() {
				var method1 = "GET";
				var method2 = "POST";
				var x = new lowland.bom.Xhr();
				
				equals(method1, x.getMethod());
				
				x.setMethod(method1);
				equals(method1, x.getMethod());
				
				x.setMethod(method2);
				equals(method2, x.getMethod());
			});
			
			test("request headers", function() {
				var x = new lowland.bom.Xhr();
				
				x.setRequestHeader("X-Test", "abc");
				equals("abc", x.getRequestHeader("X-Test"));
				
				x.setRequestHeaders({
					"X-Test2" : "def",
					"X-Test3" : "ghi"
				});
				equals("def", x.getRequestHeader("X-Test2"));
				equals("ghi", x.getRequestHeader("X-Test3"));
			});
			
			test("timeout", function() {
				var x = new lowland.bom.Xhr();
				
				x.setTimeout(200);
				equals(200, x.getTimeout());
			});
			
			test("cache", function() {
				var x = new lowland.bom.Xhr();
				
				x.setCache(true);
				equals(true, x.getCache());
				
				x.setCache(false);
				equals(false, x.getCache());
			});
			
			test("user data", function() {
				var x = new lowland.bom.Xhr();
				
				x.setUserData("test1", "ab");
				x.setUserData("test2", "cd");
				
				equals("ab", x.getUserData("test1"));
				equals("cd", x.getUserData("test2"));
			});
			
			test("request data", function() {
				var data = "Body data";
				var x = new lowland.bom.Xhr();
				
				x.setRequestData(data);
				equals(data, x.getRequestData());
			});
			
			test("test for result functions", function() {
				var x = new lowland.bom.Xhr();
				equals("function", typeof x.send);
				equals("function", typeof x.getResponseText);
				equals("function", typeof x.getResponseType);
				equals("function", typeof x.getResponseXML);
				equals("function", typeof x.getStatus);
			});
			
			test("send", function() {
				var origReq = XMLHttpRequest;
				XMLHttpRequest = function() {
					origReq.apply(this, arguments);
				};
				XMLHttpRequest.prototype = origReq.prototype;
				XMLHttpRequest.prototype.send = function() {
					called = true;
				};
				XMLHttpRequest.prototype.setRequestHeader = function() {
				};
				window.bbb = XMLHttpRequest;
				
				var x = new lowland.bom.Xhr();
				
				x.setUrl("http://www.example.com");
				
				var called = false;
				
				x.send();
				equals(true, called);
			});
			
			test("get cycle", function() {
				var result = {};
				var old = XHRSpy(XMLHttpRequest, result);
				
				var x = new lowland.bom.Xhr();
				x.setUrl("http://www.example.com");
				x.send();
				
				equal(true, !!result.send);
				equal("GET", result.open.method);
				equal("http://www.example.com", result.open.url);
				equal(true, result.open.async);
				equal(null, result.open.user);
				
				for (var key in old) {
					XMLHttpRequest.prototype[key] = old[key];
				}
			});
			/*
			asyncTest("done event", function() {
				expect(1);
				stop();
				
				var result = {};
				XHRSpy(XMLHttpRequest, result);
				
				var x = new lowland.bom.Xhr();
				x.addListener("done", function(e) {
					console.log(e.getData());
					ok(e.getData().getReadyState() == 4);
					start();
				}, this);
				x.setUrl("http://www.example.com");
				x.send();
				x.setReadyState(4);
			});*/
			
		}
	});

})();