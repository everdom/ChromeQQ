//console.log(C("nav_style.bg_color"));
var Conf = (function()
{
	var instance = null;

	var settings = null;
	// default settings.
	var defaultSettings = {
		'app':{
			'title':"ChromeQQ",
			'loading_text':"正在加载..."
		},		
		'global':{
			'default':"smart_qq",
		},
		'nav_position':"top",
		'nav_show':"always_show",
		'nav_style':{
			'bg_color':"rgb(110, 195, 244)",
			'fg_color':"rgb(255, 255, 255)",
			'opacity':{
				'current':0.9,
				'min':0.0,
				'max':1.0
			},
			'height':{
				'current':30,
				'min':30,
				'max':70,
			},
		},
		'smart_qq':{
			'width':{
				'current':360,
				'min':250,
				'max':screen.availWidth
			},
			'height':{
				'current':620,
				'min':272,
				'max':screen.availHeight
			},
		},
		'web_qq':{
			'width':{
				'current':1000,
				'min':620,
				'max':screen.availWidth
			},
			'height':{
				'current':620,
				'min':620,
				'max':screen.availHeight
			},
		}
	};

	chrome.storage.sync.get("settings", function(items){
	    if(!items.settings)
	    {   
	    	settings = defaultSettings;         
	        chrome.storage.sync.set({'settings':defaultSettings});	        
	    }
	    else
	    {
	        settings = items.settings;
	    }
	    onload(settings);
	});

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
			},
			resetSettings:function(){
				settings = defaultSettings;         
	        	chrome.storage.sync.set({'settings':defaultSettings});
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
		reset:function(){
			resetSettings();
		}
	};
})();


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
Conf.load(function(data){	
	less.globalVars.nav_height = data.nav_style.height.current + "px";
	less.globalVars.bg_color = data.nav_style.bg_color;
	less.globalVars.fg_color = data.nav_style.fg_color;

	var defaultqq = data.global.default;	
	if(defaultqq == "smart_qq")
	{
		less.globalVars.win_width = data.smart_qq.width.current + "px";
		less.globalVars.win_height = data.smart_qq.height.current + "px";
	}
	else if(defaultqq == "web_qq")
	{
		less.globalVars.win_width = data.web_qq.width.current + "px";
		less.globalVars.win_height = data.web_qq.height.current + "px";
	}
	else
	{
		less.globalVars.win_width = "360px";
		less.globalVars.win_height = "620px";
	}
	initSettings();
});

var less = {
	fileAsync:true,
	globalVars:{},
};

var defaultqq = C("global.default");
if(defaultqq == "smart_qq")
{
	less.globalVars.win_width = C("smart_qq.width.current") + "px";
	less.globalVars.win_height = C("smart_qq.height.current") + "px";
}
else if(defaultqq == "web_qq")
{
	less.globalVars.win_width = C("web_qq.width.current") + "px";
	less.globalVars.win_height = C("web_qq.height.current") + "px";
}
else
{	
	less.globalVars.win_width = "360px";
	less.globalVars.win_height = "620px";
}
less.globalVars.nav_height = C("nav_style.height.current") + "px";
less.globalVars.bg_color = C("nav_style.bg_color");
less.globalVars.fg_color = C("nav_style.fg_color");

function initSettings(){
    function checkRadio($radioElems, value)
    {
        $radioElems.each(function(){            
            if($(this).val() == value)
            {
                this.checked = true;
            }
            else
            {
                this.checked = false;
            }
        });
    }

    function checkColorChoser($chooserElems, color)
    {        
        $chooserElems.each(function(){
            // console.log(color);
            // console.log($(this).css("background-color"));
            if($(this).css("background-color") == color)
            {
                $(this).addClass('color_chooser_checked');
            }
            else
            {
                $(this).removeClass('color_chooser_checked');
            }
        });
    }
    
    var checkRadioArr = {
        'global_default':'global.default',
        'nav_position':'nav_position',
        'nav_show':'nav_show'
    };
    for(name in checkRadioArr)
    {
        eleStr = "#d_options input[name=op_"+name+"]";        
        checkRadio($(eleStr), C(checkRadioArr[name]));
    }
    var checkColorArr = {
        'nav_style_bg_color':'nav_style.bg_color', 
        'nav_style_fg_color':'nav_style.fg_color'
    };
    for(name in checkColorArr)
    {
        eleStr = "#d_options input[name=op_"+name+"]";        
        checkColorChoser($(eleStr), C(checkColorArr[name]));
    }
}
