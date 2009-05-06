FontUnstack
=========

WHAT IS IT?
-----------

FontUnstack is a jQuery plugin that provides a workaround for the CSS/browser limitation of not knowing which typeface in a CSS font stack is actually used on the client-side. It simply adds a class with the name of the installed font to your desired HTML element(s). From there, you use CSS to do something interesting with that new class name.


WHY MIGHT YOU WANT THIS?
------------------------

Different fonts have different metrics and can benefit from, say, different leading or letterspacing. Verdana benefits from more leading than Helvetica, for instance.

People have worked around this limitation by selecting font-stacks that are as similar as possible so that these differences are minimized, however, by knowing the installed font, it opens up some advanced typography options. You could, for example, handle hanging quotes correctly because you could use the appropriate negative-margin to apply for Palatino, Georgia, or Times, depending on which was installed.


DISCLAIMER
----------

We can't programmatically discover the declared font stack for an element via JavaScript unless it is declared inline (don't do that). The current state of browsers are inconsistent in what they report (Safari, I'm looking in your direction).

Therefore, you need to repeat your font declaration in the javascript call to FontStack. This will no doubt cause frustration down the line when you change your CSS font stack but forget to update the JS and don't get what you expect. I apologize in advance.


BASIC USAGE
-----------

After including the JS file, call it with a CSS-style font stack declaration on the element of choice. Make sure you wrap each font in quotes.

    $(document).ready(function() {
      $("h1").fontstack( "Gill Sans" );
      $("p").fontstack( ' "obscure font", Palatino, Georgia, monospace ' ] );
    });

Assuming Gill Sans and Palatino were installed, this would result in:

    <h1 class="font_gillsans">Heading</h1>
    <p class="font_palatino">This is some text</p>

Notice that we add a prefix (which you can override), remove spaces, and force lowercase to ensure a valid name. With this, we can use CSS to do something useful.

    h1                  { }
    h1.font_gillsans    { letter-spacing: .1em;  }
    p                   { line-height: 1.4; }
    p.font_obscurefont  { line-height: 1.6; }
    p.font_palatino     { line-height: 1.5; }


TIPS& TRICKS
------------

*  Be careful with calling FontStack more than once. If your selectors overlap, the last one wins and removes and previous font classes. Use descendent selectors so you override the font class.


ADVANCED USAGE
--------------

Ok, it isn't really that advanced, but you can change the prefix for the added class name by calling it like so:

    $(document).ready(function() {
      $("h1").fontstack( [ "Gotham Bold", "Gill Sans" ], "rendered_in_" );
    });

resulting in:

    <h1 class="rendered_in_gillsans">Heading</h1>

A prefix is required as it is used to ensure that you never have more than one font class applied.


HOW DOES IT WORK?
-----------------

Font detection through JavaSript has been solved several times by different people, the details vary, but the core idea is that each font has unique metrics (which is why we're doing this in the first place) which we can detect. We create an element off-screen, apply a baseline font, and measure the width. We then add a new font style to the same element, and measure again. If the width changes, the font must be installed.

We use a large type size of 144px and a string of "mmmmmmmmmmmmmmmmmmmmmmmmmmmml" to maximize the differences between typefaces. However, this will by no means be 100% accurate. However, in that case, hopefully the fonts just aren't that that different, so our CSS for our baseline typeface will probably be ok.


MORE INFO
---------
For an example open the index.html file in a web browser.


FOR THE NAYSAYERS
-----------------

*Arrrgh! You are cluttering up the HTML with purely presentational class-names!!!*

Certainly not ideal, but what's the downside? The classes are only applied at rendertime. Screenreaders and the like don't actually read out loud class names, do they?

*Custom fonts? Bah, the generic serif and sans-serif are good enough for everyone.*

No problem. You can be content in knowing that if no font is found, no classes are added. Nor are any kittens harmed. 


WHAT NOT USE __________ ?
-------------------------

sIFR: Requires flash, adds a rendering delay, is somewhat difficult to work with, however, you can use any font without licensing restrictions.

CSS Image Replacement: Doesn't allow cut/copy/paste, adds maintenance overhead, and may have accessibility concerns (depending on the implementation). But you can use any font you want without any licensing restrictions.

@font-face (aka font embedding): This is most certainly the future, however, there are significant licensing issues for non-free fonts, and it doesn't yet work in all browsers (Opera).


WHAT'S NEXT?
------------

A good example file is first on the agenda, but apart from that, you tell me. I'm open to suggestions/patches.


LICENSE
------------

This software is licensed under the MIT license.