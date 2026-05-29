/*
This file contains variables and functions that are common to most or all pages.
*/

/*********************************************************************************************/

function mailto
(
  name,    // the userID part of an e-mail address
  domain,  // the domain part of an e-mail address
  text     // (optional) text that user will see and click on
)

/*
This function generates HTML code for a "mailto" hyperlink.  It's purpose is to hide e-mail
addresses from spiders bent on selling them to spammers.

Spiders search HTML pages for text of the format "name@domain".  They specificly look for the
"@", which is the distinguishing characteristic of an e-mail address.  No "@" means no e-mail
address. This function will take a userID and a domain and generate an HTML "mailto" hyperlink.
Since the source HTML page doesn't contain an "@", spiders won't see an e-mail address;
however, the browser will correctly render the address and the user remains unaware of any
trickery that's been going on.

If "text" is null then the e-mail address is displayed instead.

This function was inspired by a simpler script at www.a1javascripts.com.
*/

{
  var at = "&#0064;";  // character code for "@" (for even more protection)

  document.write("<A HREF=\"mailto:" + name + at + domain + "\">");
  document.write((text == null) ? name + at + domain : text);
  document.write("<\/A>");

  return;
}

/*********************************************************************************************/

var common_paneResizers = new Array();            // array of functions that resize panes in IE

function resizePanes()

/*
*** INTERNET EXPLORER HACK ***

This function is an event handler that resizes all of the panes in Internet Explorer.  The
functions that resize these panes must be listed in "common_paneResizers".

Because Internet Explorer 6 doesn't support the "position:fixed" style attribute, such panes
must be simulated with some CSS hacks.  One of the side effects of these hacks is that these
panes are of a fixed size -- which means that if the Internet Explorer window is resized then
the panes aren't.  The only workaround is to manually change their sizes with JavaScript
functions.

This function must attached to "window.onload" and "window.onresize".
*/

{
  if (navigator.appName == "Microsoft Internet Explorer")
  {
    for (i = 0; i < common_paneResizers.length; ++i)
      common_paneResizers[i]();
  }

  return;
}

window.onload = resizePanes;
window.onresize = resizePanes;