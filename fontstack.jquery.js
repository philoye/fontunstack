jQuery.fontstack = {
	
	getStacksBySelector: function(selector_string) {

    var selectors = selector_string.split(',');

    for (var i in selectors) {
      selector = selectors[i];
      var font_family_declaration = $(selector).eq(0).css('font-family').replace(/['"]/g, '');
      $.fontstack.identifyStack(font_family_declaration);
    }

	},
  
  identifyStack: function(stack) {

    var fonts = stack.split(',');
    var numFonts = fonts.length;
    var last_resort = fonts[numFonts -1];
    var baseline = "monospace";

    // Use the monospace generic, unless it is specifed as the generic.
    // If so, use sans-serif and add it to the stack as the new generic.

    // I need to test if no generic specified at all, that's when we should add one.
    if (last_resort == "monospace") {
      baseline = "sans-serif";
      fonts.push(baseline);
    };
    
    for (var i in fonts) {
      font = fonts[i];
      if ($.fontstack.testFont(font)) {
        $("body").addClass(font.replace( /\s/g, "").toLowerCase());
        break;
      }
        
    }
    
  },
	
	testFont: function(requested_font, baseline_font) {
		
		// Insert test div offscreen
		$('body').prepend('<span id="font_tester" style="font-family:' + baseline_font + '; font-size:72px;left:-10000px;position:absolute;top:-10000px;visibility:hidden;">mmmmmmmmmmmmmmmmmmmmmmmmmmmml</span>');
		
		// Get baseline font width
		var baseline_width = $('#font_tester').width();
		
		// Apply the requested font.
		$('#font_tester').css('font-family', requested_font + ',' + baseline_font );

		// Get the width again
		var requested_width = $('#font_tester').width();
		
		// Remove our test span
		$('#font_tester').remove();
		
		// If the dimensions change, the font is installed
		return((baseline_width != requested_width)? true: false);
	}
};