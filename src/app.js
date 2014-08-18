$(document).ready(function(){
    var webview = document.getElementById("web_qq");
    var aSmartQQ = document.getElementById("a_smart_qq");
    var aWebQQ = document.getElementById("a_web_qq");
    var aOptions = document.getElementById("a_options");
    var dOptions = document.getElementById("d_options");
    var isShowOption = false;  
    
    // Logic code

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
    

    var sliderOptions = [
      {
        klass         : 'power-ranger'
        ,min           : 0
        ,max           : 100
        ,start         : 100
        ,hideRange     : true
      },
      {
        klass         : 'power-ranger'
        ,min           : 30
        ,max           : 70
        ,start         : 30
        ,hideRange     : true    
      },
      {
        klass         : 'power-ranger'
        ,min           : 30
        ,max           : 70
        ,start         : 30
        ,hideRange     : true    
      },
      {
        klass         : 'power-ranger'
        ,min           : 30
        ,max           : 70
        ,start         : 30
        ,hideRange     : true    
      },
            {
        klass         : 'power-ranger'
        ,min           : 30
        ,max           : 70
        ,start         : 30
        ,hideRange     : true    
      },
      {
        klass         : 'power-ranger'
        ,min           : 30
        ,max           : 70
        ,start         : 30
        ,hideRange     : true    
      }
    ];

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


    var sliders = [];
    for(var i=0; i<elems.length; i++)
    {
      sliders[i] = new Powerange(elems[i], sliderOptions[i]);
      
      // set initial value
      var slider = sliders[i];
      var left = (slider.options.start - slider.options.min) / (slider.options.max - slider.options.min) 
          * width - 16;       
      left = left < 0 ? 0: left;      
      $(slider.handle).css("left", left);
      $(slider.slider).find(".range-quantity").css("width", left);

      // add value text to slider handle
      var oSliderValue1 = $(oSliderValue).clone();
      $(slider.handle).append(oSliderValue1);

      $(slider.handle).mousedown(function(){
        $(this).find("span.slider_value").css("display","inline");
      });
      $(document).mouseup(function(){
        $("span.slider_value").css("display", "none");
      });

      // change value text when slide the handle
      elems[i].onchange = function()
      {    
        var oSliderValue = $(this).next(".range-bar").find('.slider_value');      
        oSliderValue.text(this.value);
      };
    }


    var width = window.innerWidth - 145;
    $(".ranger-wrapper").each(function(){        
        $(this).css("width",width);        
    });

    // Event bindings
    $("span.radio_label").click(function(){
      var prevRadio = $(this).prev("span").find("input[type=radio]");
      
      $("input[type=radio][name="+prevRadio.attr('name')+"]").each(function(){
        $(this).get(0).checked = false;
      });
      $(this).prev("span").find("input[type=radio]").get(0).checked = true;
      
    });

    // WebView Events 
    webview.addEventListener("loadstart", function() {
      document.title = "正在加载...";
    });

    webview.addEventListener("loadstop", function() {
      document.title = "WebQQ";      
      //indicator.innerText = "";
      webview.style.width = window.innerWidth+"px";
      webview.style.height = (window.innerHeight-30)+"px";
    });

    webview.addEventListener('newwindow', function(e){
        window.open(e.targetUrl);
    });

    // UI Events
    aSmartQQ.onclick = function(){
      webview.src="http://w.qq.com";
      window.resizeTo(340,620);
    };

    aWebQQ.onclick = function(){
      webview.src="http://web2.qq.com/webqq.html";
      window.resizeTo(1000,620);
    };

    aOptions.onmouseenter = function(){
      var bgColor = $("nav").css("background-color");
      var fgColor = $("nav").css("color");
      $(this).css("background-color", fgColor);
      $(this).css("color", bgColor);
    };

    aOptions.onmouseleave = function(){
      var bgColor = $("nav").css("background-color");
      var fgColor = $("nav").css("color");
      if(!isShowOption)
      {
        $(this).css("background-color", bgColor);
        $(this).css("color", fgColor);
      }
    };

    aOptions.onclick = function(){
      options = document.getElementById("d_options");
      if(!isShowOption)
      {
        isShowOption = true;
        options.style.display="block";
        //this.style.color="black";
        //this.style.backgroundColor="white";
      }
      else
      {
        isShowOption = false;
        options.style.display="none";
        //this.style.color="white";
        //this.style.backgroundColor="black";
      }
    };

    window.onresize = function(){
      webview.style.width = window.innerWidth+"px";
      webview.style.height = (window.innerHeight-30)+"px";
      $(".ranger-wrapper").each(function(){
        var width = window.innerWidth - 145;
        $(this).css("width",width);
      });
     
      for(var i=0; i<sliders.length; i++)
      {
        var slider = sliders[i];        
        var left = (slider.element.value - slider.options.min) / (slider.options.max - slider.options.min) 
            * $(slider.slider).width() -16;
        left = left <0 ? 0 : left;
        $(slider.handle).css("left", left);
        $(slider.slider).find(".range-quantity").css("width", left);
      }
      

    };
});