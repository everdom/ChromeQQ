seajs.config({
    base: "./", 
    alias:{
        "defaultConfig":"config/default.config.js",
        "config":"config/conf.js",
        //"less":"lib/less-1.7.4.js",
        //"jquery":"lib/jquery-2.1.1.min.js",
        //"powerange":"lib/powerange.js",
        //"jquery.easing":"lib/jquery.easing.1.3.js",    
    }
});

seajs.use("config/global");
seajs.use("lib/jquery-2.1.1.min");
seajs.use("lib/powerange");
seajs.use("lib/jquery.easing.1.3");

define(function(require, exports, module){
    var config = require("config");
    var Conf = config.Conf;
    var C = config.C;    

    Conf.load(function(data){        
        less.globalVars.nav_height = data.nav_style.height.current + "px";
        less.globalVars.bg_color = data.nav_style.bg_color;
        less.globalVars.fg_color = data.nav_style.fg_color;
        less.globalVars.bg_opacity = data.nav_style.opacity.current + "%";

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

        require.async("lib/less-1.7.4");
        initSliders(data);
        initSettings(data);
    });
    

    var isShowOption = false;
    function switchQQ(webview, type)
    {
        toggleOptionPanel(false);
        updateColor("#a_options", false);
        if(type == "web_qq")
        {
            C("app.current", "web_qq");
            webview.src = C('web_qq.url');
            window.resizeTo(C("web_qq.width.current"), C("web_qq.height.current"));
        }
        else
        {
            C("app.current", "smart_qq");
            webview.src = C('smart_qq.url');
            window.resizeTo(C("smart_qq.width.current"), C("smart_qq.height.current"));
        }    
    }

    function toggleOptionPanel(open)
    {
        if(open)
        {
            isShowOption = true;
            $("#d_options").slideDown(700, "easeOutBounce");
        }
        else
        {
            isShowOption = false;
            $("#d_options").slideUp(200, "easeInExpo");
        }    
    }
    function setBgColor(bgColor, isCheck)
    {        
        var colorReg = [
            /^\s*(rgb\(\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\))\s*$/i,
            /^\s*#([0-9a-f]{3})\s*$/i,
            /^\s*#([0-9a-f]{6})\s*$/i
        ];
        if(isCheck)
        {
            for(var i in colorReg)
            {
                if(colorReg[i].test(bgColor))
                {
                    C("nav_style.bg_color", bgColor);
                    less.globalVars.bg_color = C("nav_style.bg_color");
                    less.modifyVars({
                        '@bg_color': C("nav_style.bg_color"),                    
                    });
                    updateColor(aOptions, isShowOption);
                    return true;                     
                }
            }        
            return false;
                  
        }
        else
        {
            C("nav_style.bg_color", bgColor);
            less.globalVars.bg_color = C("nav_style.bg_color");
            less.modifyVars({
                '@bg_color': C("nav_style.bg_color"),            
            });
            updateColor(aOptions, isShowOption);
            return true;
        }        
    }

    function updateColor(elem, reverse) 
    {
        var bgColor = C("nav_style.bg_color");
        var fgColor = C("nav_style.fg_color");
        if (!reverse) 
        {
            $(elem).removeClass("pressed").addClass("normal");                     
        } 
        else 
        {  
            $(elem).removeClass("normal").addClass("pressed");        
        }    
    }


    function initSliders(settings){
         // UI code
        var elems = document.querySelectorAll('.js-range');


        var sliderOptions = [{
            klass: 'power-ranger',
            min: settings.nav_style.opacity.min,
            max: settings.nav_style.opacity.max,
            start: settings.nav_style.opacity.current,
            hideRange: true,
            bindKey:"test",
        }, {
            klass: 'power-ranger',
            min: settings.nav_style.height.min,
            max: settings.nav_style.height.max,
            start: settings.nav_style.height.current,
            hideRange: true,
            bindKey:"test",
        }, 
        ];

        var oSliderValue = document.createElement("span");
        $(oSliderValue).addClass("slider_value");
        $(oSliderValue).css({
            "font-size": "8px",
            "z-index": "100",
            "width": "36px",
            "height": "16px",
            "text-align": "center",
            "margin-left": "-10px",
            "color": "black",    
            "line-height": "16px",
            "position": "relative",
            "margin-top": "-15px",
            "display": "none",
            "border-top-left-radius": "3px",
            "border-top-right-radius": "3px",
            "border-bottom-right-radius": "3px",
            "border-bottom-left-radius": "3px",
            "background": "rgb(255, 255, 255)"
        });

        var width = window.innerWidth - 145;

        $(".ranger-wrapper").each(function() {        
            $(this).css("width", width);
        });

        sliders = [];
        for (var i = 0; i < elems.length; i++) {
            // set initial value        
            sliders[i] = new Powerange(elems[i], sliderOptions[i]);

            var slider = sliders[i];

            
            var left = (slider.options.start - slider.options.min) / (slider.options.max - slider.options.min) * width - 16;
            left = left < 0 ? 0 : left;

            $(slider.handle).css("left", left);
            $(slider.slider).find(".range-quantity").css("width", left);
            

            // add value text to slider handle
            var oSliderValue1 = $(oSliderValue).clone();
            $(oSliderValue1).text(slider.options.start);

            $(slider.handle).append(oSliderValue1);

            //var isSliderDrag = false;
            var dragingElem = null;
            $(slider.handle).mouseover(function() {
                if(!$(this).attr("draging") || $(this).attr("draging") == "false")
                {
                    $(this).find("span.slider_value").css("display", "inline");
                }
            });

            $(slider.handle).mouseout(function() {
                if(!$(this).attr("draging") || $(this).attr("draging") == "false")
                {
                    $(this).find("span.slider_value").css("display", "none");
                }
            });

            $(slider.handle).mousedown(function() {
                //isSliderDrag = true;
                $(this).attr("draging", true);
                $(this).find("span.slider_value").css("display", "inline");
                dragingElem = this;
            });

            // change value text when slide the handle
            elems[i].onchange = function() {
                var oSliderValue = $(this).next(".range-bar").find('.slider_value');
                oSliderValue.text(this.value);            
            };                
        }

        $(document).mouseup(function() {
            if(dragingElem)
            {
                $(dragingElem).attr("draging", false);              
                $(dragingElem).find("span.slider_value").css("display", "none");
                var jValueElem = $(dragingElem).parent("span.range-bar").prev("input.js-range");
                var bindConf = jValueElem.attr("bindConf");
                var webview = document.getElementById("qq");
                C(bindConf, $.trim(jValueElem.val()));
                switch(bindConf)
                {
                    case "nav_style.opacity.current":
                        less.globalVars.bg_opacity = C(bindConf);
                        less.modifyVars({
                            '@bg_opacity': C(bindConf),             
                        });
                    break;
                    case "nav_style.height.current":
                        less.globalVars.nav_height = C(bindConf);
                        less.modifyVars({
                            '@nav_height': C(bindConf),
                        });
                        adjustWebview();
                    break;              
                }           
            }              
        });
    }
    function initSettings(settings){
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

        var webview = document.getElementById("qq");
        switchQQ(webview, settings.global.default);
        
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
        setNavShow();
    }
    function setNavShow()
    {
        switch(C("nav_show"))
        {
            case "always_show":
                $("header").css({"visibility":"visible", "position":"relative"});
                $("nav").css({"visibility":"initial", "position":"initial"});
                break;
            case "auto_hide":
                $("header").css({"visibility":"visible", "position":"fixed"});
                $("nav").css({"visibility":"initial", "position":"initial"}); 
                break;
            case "not_show":
                $("header").css({"visibility":"initial", "position":"initial"});
                $("nav").css({"visibility":"hidden", "position":"fixed"});
                break;
        }
        $("#s_options").css({"visibility":"visible"});
        adjustWebview();
    }

    function adjustWebview()
    {
        jWebview = $("#qq");
        jWebview.css({"width":window.innerWidth+"px"});    
        switch(C("nav_show"))
        {
            case "always_show":
                jWebview.css({"height":(window.innerHeight - C("nav_style.height.current")) + "px"});            
                break;
            case "auto_hide":
            case "not_show":
            default:
                jWebview.css({"height": window.innerHeight + "px"});
            break;
        }
        
        
        $(".ranger-wrapper").each(function() {
            var width = window.innerWidth - 145;
            $(this).css("width", width);
        });
    }

    $(document).ready(function() {
        var webview = document.getElementById("qq");
        var aSmartQQ = document.getElementById("a_smart_qq");
        var aWebQQ = document.getElementById("a_web_qq");
        var aOptions = document.getElementById("a_options");
        var dOptions = document.getElementById("d_options");    
                

        // Event bindings
        // bind radio input control choose event to radio label click event.
        $("span.radio_label").click(function() {
            var prevRadio = $(this).prev("span").find("input[type=radio]");

            $("input[type=radio][name=" + prevRadio.attr('name') + "]").each(function() {
                $(this).get(0).checked = false;
            });
            $(this).prev("span").find("input[type=radio]").get(0).checked = true;

        });

        // UI Events
        // WebView Events 
        webview.addEventListener("loadstart", function() {
            document.title = C("app.loading_text");
        });

        webview.addEventListener("loadstop", function() {
            document.title = C("app.title");
            //indicator.innerText = ""; 
            webview.style.width = window.innerWidth + "px";
            webview.style.height = window.innerHeight - C("nav_style.height") + "px";
        });

        webview.addEventListener('newwindow', function(e) {
            window.open(e.targetUrl);
        });

        // switch button event
        aSmartQQ.onclick = function() {
            switchQQ(webview, "smart_qq")
        };

        aWebQQ.onclick = function(e) {
            switchQQ(webview, "web_qq");
        };
        

        // option button event
        aOptions.onmouseenter = function(e) {
            updateColor(this, true);

        };

        aOptions.onmouseleave = function(e) {
            updateColor(this, isShowOption);
        };

        aOptions.onclick = function(e) {
            if (!isShowOption) 
            {
                toggleOptionPanel(true);
            }
            else
            {
                toggleOptionPanel(false);
            }
        };


        // setting default boot
        $("span.radio_label").click(function() {            
            $(this).prev("span").find("input[type=radio]").change();

        });

        $("input[name=op_global_default]").click(function(){
            $(this).change();
        });
        
        $("input[name=op_global_default]").change(function(){
            C("global.default", $(this).val());
        });

        // setting nav position
        $("input[name=op_nav_position]").change(function(){
            C("nav_position", $(this).val());
        });

        // setting nav show style
         $("input[name=op_nav_show]").change(function(){
            C("nav_show", $(this).val());
            setNavShow();        
        });

        // setting background color event
        $("#f_nv_style input[name=op_nav_style_bg_color]").click(function(e) {
            C("nav_style.bg_color", $(this).css("background-color"));
            less.globalVars.bg_color = C("nav_style.bg_color");
            less.modifyVars({
                '@bg_color': C("nav_style.bg_color"),            
            });

            updateColor(aOptions, isShowOption);
            $(this).parent().find("input[name=op_nav_style_bg_color_custom]").val("")
                .animate({
                        width: "13px"
                    },
                    500);
            $(this).parent().find("input").removeClass('color_chooser_checked');
            $(this).addClass("color_chooser_checked");
        });

        // setting customed background color event
        $("#f_nv_style input[name=op_nav_style_bg_color_custom]").click(
            function(e) {
                $(this).animate({
                        width: "42px"
                    },
                    500);
            }        
        ).mouseleave(
            function(e) {
                if (!$(this).val() && document.activeElement != this) {
                    $(this).animate({
                            width: "12px"
                        },
                        500);
                }
            }
        ).blur(
            function(e) {
                if (!$(this).val()) {
                    $(this).animate({
                            width: "12px"
                        },
                        500);
                }

                if(!setBgColor($(this).val(), true))
                {
                    $(this).css("outline", "2px solid red");
                    $(this).select();
                }
                else
                {
                    $(this).css("outline", "none");   
                }
            }
        ).keypress(function(e) {
            if(e.which == 13)
            {
                if(!setBgColor($(this).val(), true))
                {
                    $(this).css("outline", "2px solid red");
                    $(this).select();
                }
                else
                {
                    $(this).css("outline", "none");   
                }
            }
        });    

        // setting frontground color event
        $("#f_nv_style input[name=op_nav_style_fg_color]").click(function(e) {        
            C("nav_style.fg_color", $(this).css("background-color"));
            less.globalVars.fg_color = C("nav_style.fg_color");
            less.modifyVars({            
                '@fg_color': C("nav_style.fg_color")
            });
            updateColor(aOptions, isShowOption);

            $(this).parent().find("input").removeClass('color_chooser_checked');
            $(this).addClass("color_chooser_checked");
        });


        adjustWebview();
        
        window.onresize = function() {        
            
            adjustWebview();

            if(!isShowOption)
            {
                $("#d_options").css({"display":"block","visibility":"hidden"});
            }
            
            for (var i = 0; i < sliders.length; i++) {
                var slider = sliders[i];
                var left = (slider.element.value - slider.options.min) / (slider.options.max - slider.options.min) * $(slider.slider).width() - 16;
                left = left < 0 ? 0 : left;
                $(slider.handle).css("left", left);
                $(slider.slider).find(".range-quantity").css("width", left);
            }
            less.globalVars.win_height = window.innerHeight;        
            less.globalVars.win_width = window.innerWidth;
            less.modifyVars({
                '@win_height': window.innerHeight,
                '@win_width': window.innerWidth,
            });
            currentQQ = C("app.current");
            C(currentQQ+".width.current",window.innerWidth);
            C(currentQQ+".height.current",window.innerHeight);

            if(!isShowOption)
            {
                $("#d_options").css({"display":"none", "visibility":"visible"});
            }
            
        };


        var isNavShow = false;
        var aniTimeId = null;
        $(document).mousemove(function(e){    
            if(C("nav_show") == "auto_hide")
            {
                clearTimeout(aniTimeId);
                if(e.clientY < C("nav_style.height.current"))
                {
                    if(!isNavShow)
                    {                    
                        aniTimeId = setTimeout(function(){
                            $("nav").slideDown();
                            $("nav #s_options").slideDown();
                            isNavShow = true;
                        }, C("nav_auto_hide_timeout.appear"));
                    }
                }
                else
                {
                    if(isNavShow && !isShowOption)
                    {
                        aniTimeId = setTimeout(function(){
                            $("nav").slideUp();
                            $("nav #s_options").slideUp();
                            isNavShow = false;
                        }, C("nav_auto_hide_timeout.disappear"));
                    }
                } 
            }    
        });
    });
});
seajs.use("app.js");