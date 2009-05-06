/*  
 *  Font UnStack
 * 
 *  Developed by Phil Oye
 *  Copyright (c) 2009 Phil Oye, http://philoye.com/
 *
 *  Permission is hereby granted, free of charge, to any person obtaining
 *  a copy of this software and associated documentation files (the
 *  "Software"), to deal in the Software without restriction, including
 *  without limitation the rights to use, copy, modify, merge, publish,
 *  distribute, sublicense, and/or sell copies of the Software, and to
 *  permit persons to whom the Software is furnished to do so, subject to
 *  the following conditions:
 *
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 *  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 *  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 *  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

(function($) {
  $.fn.fontstack = function(defaults, opts) {
     $.fontstack.init(defaults,opts,this);
  };

  $.fontstack = {

    options: {
      class_prefix: "set_in_"
    },

    init: function(stack, opts, elems){
       var elems = elems || 'body';
       $.extend(this.options,opts);

       if( this.options.class_prefix == "") {
         this.options.class_prefix = "set_in_";
       }

       // If a css-style font-family declaration (string) passed in, convert to array
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
    
      // At this point we're sure there is a generic fallback font, so we'll only iterate though the non-generics.
      for (var i=0; i<num_fonts -1; i++) {
        font = stack[i];
        if ($.fontstack.testFont(font, baseline)) {

          // Remove any class that has our prefix to prevent doubles.
          var re = new RegExp('\\b' + this.options.class_prefix + '.*?\\b','g');
          $(elems).get(0).className = $(elems).get(0).className.replace(re, '');

          // This should convert UTF8 to lowercase ANSI, removing all punctuation/spaces, but regexp scares me.
          safe_font_name = encodeURIComponent( font.replace( /[\s\-\.\!\~\*\'\(\)\']/g, "").toLowerCase() );
          $(elems).addClass(this.options.class_prefix + safe_font_name);
          break; //We only want to find one installed font per stack.
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