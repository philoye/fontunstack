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
     
    analyzeStack: function(stack, elems) {
      var num_fonts = stack.length
      var last_resort = stack[num_fonts -1];
      var generics = ["monospace", "sans-serif", "serif", "cursive", "fantasy"];
      var baseline = generics[0];

      // If author hasn't included a generic (tsk, tsk), let's add one
      // TODO: Let's check if last resort is generics array instead of this ugly expression.
      if ((last_resort != "monospace") && (last_resort != "sans-serif") && (last_resort != "serif") && (last_resort != "cursive") && (last_resort != "fantasy")) {
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
          $(elems).addClass(this.options.class_prefix + font.replace( /\s/g, "").toLowerCase());
          break; //We only want one font...
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