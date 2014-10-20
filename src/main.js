define(function(require,exports,module){
	defaultSettings = require("defaultConfig");	
	var settings = defaultSettings.data;

	chrome.storage.onChanged.addListener(function(changes, areaName){		
		settings = changes.settings.newValue;		
	});
	
	//chrome.storage.sync.set({"settings":settings});

	chrome.storage.sync.get("settings", function(items){		
		if(!items.settings)
		{
			settings = defaultSettings.data;
		}         
		else
		{
		    settings = items.settings;			    
		}		
			
	});

	exports.launch = function(){
		chrome.app.runtime.onLaunched.addListener(function() {					
			var defaultQQ = settings['global']['default'];				
			var width = parseInt(settings[defaultQQ]['width']['current']);
			var height = parseInt(settings[defaultQQ]['height']['current']);	
		    chrome.app.window.create('window.html', {
		        'bounds': {
		            'width': width,
		            'height': height
		        }
		 	});
		});							
	}   
});