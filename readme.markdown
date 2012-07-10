FontUnstack
===========

WHAT IS IT?
-----------

FontUnstack is a jQuery plugin that provides a workaround for the CSS/browser limitation of not knowing which typeface in a CSS font stack is actually used on the client-side. It does this by adding a class with the name of the installed font to your desired HTML element(s). From there, you use CSS to do something interesting with that new class name, like change other type properties like type size, line-height, letter-spacing, margins, etc.


WHY MIGHT YOU WANT THIS?
------------------------

Different fonts have different metrics and can benefit from, say, different leading or letterspacing. Verdana benefits from more leading than Helvetica, for instance.

People have worked around this limitation by selecting font-stacks that are as similar as possible so that these differences are minimized, however, by knowing the installed font, you can choose different line-height values for the current font. However, it also opens up some advanced typography options. You could, for example, handle hanging quotes correctly because you could use the appropriate negative-margin to apply for Palatino, Georgia, or Times, depending on which was installed.

Andy Clarke has written on the subject recently in his article [Lead Pipes](http://forabeautifulweb.com/blog/about/lead_pipe/).


DISCLAIMER
----------

We can't programmatically discover the declared font stack for an element via JavaScript unless it is declared inline (don't do that). The current state of browsers are inconsistent in what they report (Safari, I'm looking in your direction).

Therefore, you need to repeat your font declaration in the javascript call to FontUnstack. This will no doubt cause frustration down the line when you change your CSS font stack but forget to update the JS and don't get what you expect. I apologize in advance.


BASIC USAGE
-----------

After including jQuery and the FontUnstack javascript file, call `fontunstack()` on a jquery selector and a class will be added to each element with the font that is actually be used.

So for example, assuming this CSS:

    body {
      font-family: "obscure font", Palatino, Georgia, Times, "Times New Roman", serif;
    }
    h1 {
      font-family: "Gill Sans", "Helvetica Neue", Helvetica, sans-serif;
    }

and assuming Gill Sans and Palatino were installed, this might result in:

    $(document).ready(function() {
      $("body").fontunstack();
      $("h1").fontunstack();
    })

Then the following classes would be applied:

    <body class="set_in_palatino">
      <h1 class="set_in_gillsans">Heading</h1>
      This is some text
    </body>

Notice that we add a prefix (which you can change), remove spaces, and force lowercase to ensure a valid name. With this, we can use CSS to do something useful.

    body                 { line-height: 1.5; }
    body.set_in_georgia  { line-height: 1.6; }
    body.set_in_palatino { line-height: 1.4; }
    h1                   { }
    h1.set_in_gillsans   { letter-spacing: .1em;  }


TIPS & TRICKS
-------------

If you were to do something like `$('p').fontunstack()`, every `<p>` tag would be individually tested. Try calling FontUnstack on containing divs for your baseline font, and then call it on particular elements to override.

Be careful with calling FontUnstack more than once. If your selectors overlap, the last one wins and removes and previous font classes.


ADVANCED USAGE
--------------

Ok, it isn't really that advanced, but you can change the prefix for the added class name by calling it like so:

    $(document).ready(function() {
      $("h1").fontunstack({ prefix: "rendered_in_" });
    });

resulting in:

    <h1 class="rendered_in_gotham">Change</h1>

While you can choose any valid prefix (avoid starting with a digit), a prefix **is** required as it is used by the script to ensure that you never have more than one font class applied. 


USING FONTUNSTACK WITH @FONT-FACE
---------------------------------

In general, FontUnstack doesn't care about @font-face. It should "just work". It simply checks whether the font is installed, regardless of how it got there.

However, there is one caveat. When the page loads, FontUnstack will probably run before your embedded font is downloaded. Thus you can run into a situation where your text is in one typeface, while the assigned class is corresponds to the fallback typeface, because at the time of testing the embedded font **wasn't** installed. Furthermore, sometimes the code might even run before the font is pulled from cache leading to unpredictable results (observed in FireFox 3.5.6).

The solution is to defer running FontUnstack until after your font is downloaded. You can do this by calling it after all assets (including images and the like, unfortunately) are downloaded by using `$(window).load` instead of `$(document).ready`:

    $(window).load(function() {
      $("h1").fontunstack();
    });

Suggestions welcome on how to defer until only the font is downloaded, not everything on the page.


HOW DOES IT WORK?
-----------------

Font detection through JavaSript has been solved several times by different people, the details vary, but the core idea is that each font has unique metrics (which is why we're doing this in the first place) which we can detect. We create an element off-screen, apply a baseline font, and measure the width. We then add a new font style to the same element, and measure again. If the width changes, the font must be installed.

We use a large type size of 144px and a string of "mmmmmmmmmmmmmmmmmmmmmmmmmmmml" to maximize the differences between typefaces. However, this will by no means be 100% accurate. However, in that case, hopefully the fonts just aren't that that different, so our CSS for our baseline typeface will probably be ok.


MORE INFO
---------
For an example open the index.html file in a web browser.


FOR THE NAYSAYERS
-----------------

*Arrrgh! You are cluttering up the HTML with purely presentational class-names!!! Epic Fail!*

Certainly not ideal, but what's the downside? The classes are only applied at rendertime. Screenreaders and the like don't actually read out loud class names, do they?

*Custom fonts? Bah, like 640k, the generic serif and sans-serif are good enough for everyone.*

No problem. You can be content in knowing that if no font is found, no classes are added. Nor are any kittens harmed.


WHAT'S NEXT?
------------

You tell me. I'm open to suggestions/patches.


LICENSE
------------

This software is licensed under the MIT license.
