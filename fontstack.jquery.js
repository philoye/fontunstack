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

       if( this.options.class_prefix == "") {
         this.options.class_prefix = "font_";
       }

       // Handle a css-style font-family declaration (string) passed in.
        if (stack.constructor.toString().indexOf("Array") == -1) {
          stack = stack.replace(/['";]/g, '').split(',');
        }
       this.analyzeStack(stack,elems);
     },

     analyzeStack: function(stack, elems) {
       var generics = ["monospace", "sans-serif", "serif", "cursive", "fantasy"];
       var baseline = generics[0];
       var num_fonts = stack.length
       var last_resort = stack[num_fonts -1];

      // If author hasn't included a generic (tsk, tsk), let's add one
      if ($.inArray(last_resort, generics)) { 
        stack.push(baseline);
        num_fonts++;
      }
      
      // If the generic is the same as our baseline, let's use another.
      if (last_resort == baseline) {
        baseline = generics[1]; 
      };
    
      // At this point we're sure there is a generic fallback font, so we are only iterating though the non-generics.
      for (var i=0; i<num_fonts -1; i++) {
        font = stack[i];
        if ($.fontstack.testFont(font, baseline)) {
          // TODO: Remove any class that has our prefix.
          // TODO: Convert to dumb ascii, remove punctuation, etc.
          safe_font_name = font.replace( /\s/g, "").toLowerCase()
          $(elems).addClass(this.options.class_prefix + safe_font_name);
          break; //We only want to find one font.
        }
      }
    },
	
  	testFont: function(requested_font, baseline_font) {
  		$('body').prepend('<span id="font_tester" style="font-family:' + baseline_font + '; font-size:144px;position:absolute;left:-10000px;top:-10000px;visibility:hidden;">mmmmmmmmmmmmmmmmmmmmmmmmmmmml</span>');
		
  		var baseline_width = $('#font_tester').width();
  		$('#font_tester').css('font-family', requested_font + ',' + baseline_font );
  		var requested_width = $('#font_tester').width();
  		$('#font_tester').remove();
		
  		// If the dimensions change, the font is installed
  		return((requested_width != baseline_width)? true: false);
  	}

	};

})(jQuery);