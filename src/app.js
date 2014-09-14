function switchQQ(webview, type)
{
    if(type == "web_qq")
    {
        webview.src = C('web_qq.url');
        window.resizeTo(C("web_qq.width.current"), C("web_qq.height.current"));
    }
    else
    {
        webview.src = C('smart_qq.url');
        window.resizeTo(C("smart_qq.width.current"), C("smart_qq.height.current"));
    }    
}
$(document).ready(function() {
    var webview = document.getElementById("qq");
    var aSmartQQ = document.getElementById("a_smart_qq");
    var aWebQQ = document.getElementById("a_web_qq");
    var aOptions = document.getElementById("a_options");
    var dOptions = document.getElementById("d_options");
    var isShowOption = false; 


    switchQQ(webview, C("global.default"));
    
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
        webview.src = C('smart_qq.url');
        window.resizeTo(C("smart_qq.width.current"), C("smart_qq.height.current"));
    };

    aWebQQ.onclick = function(e) {
        webview.src = C("web_qq.url");
        window.resizeTo(C("web_qq.width.current"), C("web_qq.height.current"));
    };
    

    // option button event
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

    // setting background color event
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
            less.modifyVars({
                '@bg_color': C("nav_style.bg_color"),
                '@fg_color': C("nav_style.fg_color")
            });
            updateColor(aOptions, isShowOption);

        $(this).parent().find("input").removeClass('color_chooser_checked');
        $(this).addClass("color_chooser_checked");
    });


    window.onresize = function() {
        $("#d_options").css("display","block");
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
        $("#d_options").css("display","none");

    };
    // $(document).click(function(e){        
    //     if(e.target != aOptions)
    //     {
    //         $(dOptions).slideUp(200, "easeInExpo");
    //     }
    // });
});


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
                less.modifyVars({
                    '@bg_color': C("nav_style.bg_color"),
                    '@fg_color': C("nav_style.fg_color")
                });
                updateColor(aOptions, isShowOption);
                return true;                     
            }
        }
        console.log("can't adapt to color format");
        return false;
              
    }
    else
    {
        C("nav_style.bg_color", bgColor);
        less.modifyVars({
            '@bg_color': C("nav_style.bg_color"),
            '@fg_color': C("nav_style.fg_color")
        });
        updateColor(aOptions, isShowOption);
        return true;
    }        
}

function updateColor(elem, reverse) 
{
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