define(function(require,exports,module){
	var reset = false;
	var Conf = (function(reset)
	{
		var instance = null;

		var settings = null;
		// default settings.
		var defaultSettings = require("defaultConfig").data;

		//console.log(defaultSettings);
		load(reset);

		function load(reset)
		{
			if(reset)
			{
				settings = defaultSettings;         
			    chrome.storage.sync.set({'settings':defaultSettings});
			}		
			chrome.storage.sync.get("settings", function(items){
			    if(!items.settings)
			    {
			    	settings = defaultSettings;         
			        //chrome.storage.sync.set({'settings':defaultSettings});	        
			    }
			    else
			    {
			        settings = items.settings;
			    }
			    onload(settings);
			});
		}

		function __construct(){
			return{
				get:function(key){
					if(!key)
					{
						return null;
					}
					var keyArr = key.split(".");
					var testKey = null;
					var testElem = settings ? settings : defaultSettings;
					for(var i=0; i<keyArr.length; i++)
					{				
						testKey = keyArr[i];
						if(!testElem)
						{
							//console.log("Conf get: null element with key:"+ key);
							return null;
						}						
						if(testKey in testElem)
						{
							testElem = testElem[testKey];
						}
						else
						{
							return null;
						}
					}
					return testElem;
				},
				set:function(key, value){
					var keyArr = key.split(".");
					var testKey = null;
					var testElem = settings;
					var parentElem = testElem;
					for(var i=0; i<keyArr.length; i++)
					{				
						testKey = keyArr[i];
						parentElem = testElem;
						if(testKey in testElem)
						{						
							testElem = testElem[testKey];
						}
						else
						{
							testElem[testKey] = {};
							testElem = testElem[testKey];
						}
					}
					parentElem[testKey] = value;
					//settings[key] = value;
					chrome.storage.sync.set({'settings':settings});
				}
			}		
		}
		
		var onload = function(data){};

		return {
			getInstance:function(){
				if(!instance){
					instance = __construct();
				}
				return instance;
			},
			load:function(fn){
				onload = fn;
			},		
		};
	})(reset);

	var C = function()
	{   
	    if(arguments.length == 1)
	    {
	        var key = arguments[0];     
	        return Conf.getInstance().get(key);
	    }
	    else if(arguments.length == 2)
	    {
	        var key = arguments[0];
	        var value = arguments[1];
	        return Conf.getInstance().set(key,value);
	    }
	    else
	    {
	        return false;
	    }   
	}

	exports.Conf = Conf;
	exports.C = C;
});