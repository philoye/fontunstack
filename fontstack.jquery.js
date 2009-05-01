jQuery.fontstack = {

	// getComputedStyle for font-family is completely fubar in Safari, so this function is useless.
	getStacksBySelector: function(selector_string) {

    var selectors = selector_string.split(',');

    for (var i in selectors) {
      selector = selectors[i];
      var font_family_declaration = $(selector).eq(0).css('font-family').replace(/['"]/g, '');
      $.fontstack.identifyStack(font_family_declaration);
    }

	},
  
  identify: function(font_stacks) {

    
    for (var i in font_stacks) {
      var stack = font_stacks[i];
      $.fontstack.identifyStack(stack);
    }
    
  },
  
  identifyStack: function(stack) {

    var num_fonts = stack.length
    var last_resort = stack[num_fonts -1];
    var baseline = "monospace";

    // I need to test if no generic specified at all, that's when we should add one.
    if (last_resort == "monospace") {
      baseline = "sans-serif";
      stack.push(baseline);
    };
    
		console.log(stack);
    for (var i=0; i<num_fonts; i++) {
      font = stack[i];
      
      if ($.fontstack.testFont(font,baseline)) {
        console.log("Found " + font + ", add body class and break");
        $('body').addClass(font.replace( /\s/g, "").toLowerCase());
        break;
      }
        
    }
    
  },
	
	testFont: function(requested_font, baseline_font) {
    console.log("testing " + requested_font + " against " + baseline_font);
		
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