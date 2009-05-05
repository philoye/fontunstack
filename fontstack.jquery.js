/*
 *
 * Font Stack 0.1
 *
 */

(function($) {
  $.fn.fontstack = function(defaults, opts) {
     $.fontstack.init(defaults,opts,this);
  };

  $.fontstack = {

    options: {
      class_prefix: "font_"
    },

    init: function(stack, opts, elems){
       var elems = elems || 'body';
       $.extend(this.options,opts);
       this.analyzeStack(stack,elems);
     },
     
  	// getComputedStyle for font-family is completely fubar in Safari, so this function is useless.
    // getStacksBySelector: function(selector_string) {
    //       var selectors = selector_string.split(',');
    // 
    //       for (var i in selectors) {
    //         selector = selectors[i];
    //         var font_family_declaration = $(selector).eq(0).css('font-family').replace(/['"]/g, '');
    //         $.fontstack.identifyStack(font_family_declaration);
    //       }
    // 
    // },
    //   
    //     // An array of font stacks, not needed anymore?
    //     identify: function(font_stacks) {
    //       for (var i in font_stacks) {
    //         var stack = font_stacks[i];
    //         $.fontstack.identifyStack(stack);
    //       }
    //     },
  
    analyzeStack: function(stack, elems) {
      console.log(elems);
      var num_fonts = stack.length
      var last_resort = stack[num_fonts -1];
      var baseline = "monospace";

      if ((last_resort != "monospace") && (last_resort != "sans-serif") && (last_resort != "serif") && (last_resort != "cursive") && (last_resort != "fantasy")) {
        stack.push(baseline);
        num_fonts++;
      }

      if (last_resort == "monospace") {
        baseline = "sans-serif";
      };
    
      for (var i=0; i<num_fonts -1; i++) {
        font = stack[i];

        if ($.fontstack.testFont(font,baseline)) {
          console.log("Found " + font + ", add body class and break");
          $(elems).addClass(this.options.class_prefix + font.replace( /\s/g, "").toLowerCase());
          break;
        }
      }
    },
	
  	testFont: function(requested_font, baseline_font) {
		
  		$('body').prepend('<span id="font_tester" style="font-family:' + baseline_font + '; font-size:72px;left:-10000px;position:absolute;top:-10000px;visibility:hidden;">mmmmmmmmmmmmmmmmmmmmmmmmmmmml</span>');
		
  		var baseline_width = $('#font_tester').width();
  		$('#font_tester').css('font-family', requested_font + ',' + baseline_font );
  		var requested_width = $('#font_tester').width();
  		$('#font_tester').remove();
		
  		// If the dimensions change, the font is installed
  		return((baseline_width != requested_width)? true: false);
  	}

	};

})(jQuery);