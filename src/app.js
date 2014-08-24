$(document).ready(function() {
    var webview = document.getElementById("qq");
    var aSmartQQ = document.getElementById("a_smart_qq");
    var aWebQQ = document.getElementById("a_web_qq");
    var aOptions = document.getElementById("a_options");
    var dOptions = document.getElementById("d_options");
    var isShowOption = false;

    // Logic code

    // Setting code

/*
    if(localStorage.getItem('settings'))
    {
        C("=") localStorage.getItem('settings');
    }
    else
    {

    }
    */
    // UI code
    var elems = document.querySelectorAll('.js-range');
    /*
        var settings = {
                callback      : function() {}
             ,decimal       : false
             ,disable       : false
             ,disableOpacity: 0.5
             ,hideRange     : true
             ,klass         : 'power-ranger'
             ,min           : 0
             ,max           : 100
             ,start         : null
             ,step          : null
             ,vertical      : false
        };
        */


    var sliderOptions = [{
        klass: 'power-ranger',
        min: 0,
        max: 100,
        start: 100,
        hideRange: true
    }, {
        klass: 'power-ranger',
        min: 30,
        max: 70,
        start: 30,
        hideRange: true
    }, {
        klass: 'power-ranger',
        min: 30,
        max: 70,
        start: 30,
        hideRange: true
    }, {
        klass: 'power-ranger',
        min: 30,
        max: 70,
        start: 30,
        hideRange: true
    }, {
        klass: 'power-ranger',
        min: 30,
        max: 70,
        start: 30,
        hideRange: true
    }, {
        klass: 'power-ranger',
        min: 30,
        max: 70,
        start: 30,
        hideRange: true
    }];

    var oSliderValue = document.createElement("span");
    oSliderValue.setAttribute("class", "slider_value");
    oSliderValue.style.display = "none";
    oSliderValue.style.fontSize = "8px";
    oSliderValue.style.zIndex = "100";
    oSliderValue.style.width = "24px";
    oSliderValue.style.height = "16px";
    oSliderValue.style.textAlign = "center";
    oSliderValue.style.marginLeft = "-4px";
    oSliderValue.style.color = "black";
    oSliderValue.style.fontFamily = "serif";
    oSliderValue.style.lineHeight = "16px";

    var width = window.innerWidth - 145;

    $(".ranger-wrapper").each(function() {        
        $(this).css("width", width);
    });

    sliders = [];
    for (var i = 0; i < elems.length; i++) {
        // set initial value        
        sliders[i] = new Powerange(elems[i], sliderOptions[i]);

        var slider = sliders[i];

        /*
        var left = (slider.options.start - slider.options.min) / (slider.options.max - slider.options.min) * width - 16;
        left = left < 0 ? 0 : left;

        $(slider.handle).css("left", left);
        $(slider.slider).find(".range-quantity").css("width", left);
        */

        // add value text to slider handle
        var oSliderValue1 = $(oSliderValue).clone();
        $(slider.handle).append(oSliderValue1);

        $(slider.handle).mousedown(function() {
            $(this).find("span.slider_value").css("display", "inline");
        });
        $(document).mouseup(function() {
            $("span.slider_value").css("display", "none");
        });

        // change value text when slide the handle
        elems[i].onchange = function() {
            var oSliderValue = $(this).next(".range-bar").find('.slider_value');
            oSliderValue.text(this.value);
        };                
    }


    // Event bindings
    $("span.radio_label").click(function() {
        var prevRadio = $(this).prev("span").find("input[type=radio]");

        $("input[type=radio][name=" + prevRadio.attr('name') + "]").each(function() {
            $(this).get(0).checked = false;
        });
        $(this).prev("span").find("input[type=radio]").get(0).checked = true;

    });

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

    // UI Events
    aSmartQQ.onclick = function() {
        webview.src = "http://w.qq.com";
        window.resizeTo(C("smart_qq.width.current"), C("smart_qq.height.current"));
    };

    aWebQQ.onclick = function(e) {
        webview.src = "http://web2.qq.com/webqq.html";
        window.resizeTo(C("web_qq.width.current"), C("web_qq.height.current"));
    };

    function updateColor(elem, reverse) {
        var bgColor = C("nav_style.bg_color");
        var fgColor = C("nav_style.fg_color");
        if (!reverse) {
            $(elem).css("background-color", bgColor);
            $(elem).css("color", fgColor);
        } else {
            $(elem).css("background-color", fgColor);
            $(elem).css("color", bgColor);
        }
    }
    aOptions.onmouseenter = function(e) {
        updateColor(this, true);

    };

    aOptions.onmouseleave = function(e) {
        updateColor(this, isShowOption);
    };

    aOptions.onclick = function(e) {
        if (!isShowOption) {
            isShowOption = true;
            $("#d_options").slideDown(700, "easeOutBounce");
        } else {
            isShowOption = false;
            $("#d_options").slideUp(200, "easeInExpo");
        }
    };

    $("#f_nv_style input[name=op_nav_style_bg_color]").click(function(e) {
        C("nav_style.bg_color", $(this).css("background-color"));
        less.modifyVars({
            '@bg_color': C("nav_style.bg_color"),
            '@fg_color': C("nav_style.fg_color")
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

    $("#f_nv_style input[name=op_nav_style_fg_color]").click(function(e) {
        C("nav_style.fg_color", $(this).css("background-color"));
        less.modifyVars({
            '@bg_color': C("nav_style.bg_color"),
            '@fg_color': C("nav_style.fg_color")
        });
        updateColor(aOptions, isShowOption);

        $(this).parent().find("input").removeClass('color_chooser_checked');
        $(this).addClass("color_chooser_checked");
    });

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
            C("nav_style.bg_color", $(this).val());
            less.modifyVars({
            '@bg_color': C("nav_style.bg_color"),
            '@fg_color': C("nav_style.fg_color")
            });
            updateColor(aOptions, isShowOption);
        }
    ).keypress(function(e) {
        if(e.which == 13)
        {
            C("nav_style.bg_color", $(this).val());
            less.modifyVars({
            '@bg_color': C("nav_style.bg_color"),
            '@fg_color': C("nav_style.fg_color")
            });
            updateColor(aOptions, isShowOption);
        }
    });;
    window.onresize = function() {
        webview.style.width = window.innerWidth + "px";
        webview.style.height = (window.innerHeight - 30) + "px";
        $(".ranger-wrapper").each(function() {
            var width = window.innerWidth - 145;
            $(this).css("width", width);
        });

        for (var i = 0; i < sliders.length; i++) {
            var slider = sliders[i];
            var left = (slider.element.value - slider.options.min) / (slider.options.max - slider.options.min) * $(slider.slider).width() - 16;
            left = left < 0 ? 0 : left;
            $(slider.handle).css("left", left);
            $(slider.slider).find(".range-quantity").css("width", left);
        }

    };
    // $(document).click(function(e){        
    //     if(e.target != aOptions)
    //     {
    //         $(dOptions).slideUp(200, "easeInExpo");
    //     }
    // });
});


