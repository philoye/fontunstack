/*
 *  Font UnStack 0.1
 *
 *  Developed by Phil Oye
 *  Copyright (c) 2009 Phil Oye, http://philoye.com/
 *
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 */

(function($) {
  $.fn.fontunstack = function(opts) {
    $.fontunstack.init(opts,this);
    return this;
  };

  $.fontunstack = {

    options: {
      prefix: "set_in_"
    },

    init: function(opts, elems){
      var elems = elems || "body";
      $.extend(this.options, opts);

      if( this.options.prefix == "") {
        this.options.prefix = "set_in_";
      }

      var stack = $(elems).css('font-family');
      // If a css-style font-family declaration (string) passed in, convert to array
      if (typeof stack == "string") {
        stack = stack.match(/[^'",;\s][^'",;]*/g) || [];
      }
      this.analyzeStack(stack, elems);
     },

     analyzeStack: function(stack, elems) {
       var generics = ["monospace", "sans-serif", "serif", "cursive", "fantasy"];
       var baseline = generics[0];
       var num_fonts = stack.length;
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
        if ($.fontunstack.testFont(font, baseline)) {

          // Remove any class that has our prefix to prevent doubles.
          var re = new RegExp("\\b" + this.options.prefix + ".*?\\b","g");
          $(elems).get(0).className = $(elems).get(0).className.replace(re, "");

          // This should convert UTF8 to lowercase ANSI, removing all punctuation/spaces, but regexp scares me.
          safe_font_name = encodeURIComponent( font.replace( /[\s\-.!~*'()"]/g, "").toLowerCase() );
          $(elems).addClass(this.options.prefix + safe_font_name);
          break; //We only want to find one installed font per stack.
        }
      }
    },

    testFont: function(requested_font, baseline_font) {
      var span = $('<span id="font_tester" style="font-family:' + baseline_font + '; font-size:144px;position:absolute;left:-10000px;top:-10000px;visibility:hidden;">mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmml</span>');
      $("body").prepend(span);

      var baseline_width = span.width();
      span.css("font-family", requested_font + "," + baseline_font );
      var requested_width = span.width();
      span.remove();

      // If the dimensions change, the font is installed
      return (requested_width != baseline_width);
    }

  };

})(jQuery);
