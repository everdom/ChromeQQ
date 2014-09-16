define(function(require,exports,module){
	defaultSettings = require("defaultConfig");	
	var settings = defaultSettings.data;

	chrome.storage.onChanged.addListener(function(changes, areaName){		
		settings = changes.settings.newValue;		
	});
	
	chrome.storage.sync.get("settings", function(items){
		if(!items.settings)
		{   
			settings = defaultSettings;		    
		}         
		else
		{
		    settings = items.settings;			    
		}		
			
	});

	exports.launch = function(){
		chrome.app.runtime.onLaunched.addListener(function() {
				var defaultQQ = settings['global']['default'];		
				var width = settings[defaultQQ]['width']['current'];
				var height = settings[defaultQQ]['height']['current'];	
			    chrome.app.window.create('window.html', {
			        'bounds': {
			            'width': width,
			            'height': height
			        }
			 	});
			});							
		}   
	});