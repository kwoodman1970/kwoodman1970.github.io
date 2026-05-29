/*
This file contains variables and functions that support the handbook's menu
system.
*/

/*********************************************************************************************/

var currentSectionHeadingID = "";     // which section of the menu is currently being displayed

/*********************************************************************************************/

function showSection(newElement)

/*
This function hides the current section of the menu (if one is being displayed) and shows the
section who's DOM ID is "Section_X", where "X" is the DOM ID of "newElement".

For example, if "newElement" has an ID of "Security" then this function would show the menu
section who's ID is "Section_Security".
*/

{
  if ((newElement != null) && (newElement.id != currentSectionHeadingID))
  {
    var currentSection = document.getElementById("Section_" + currentSectionHeadingID);
    var newSection     = document.getElementById("Section_" + newElement.id);

    if ((currentSection != null) && (currentSection.style != null))
      currentSection.style.display = "";
    if (newSection != null)
      newSection.style.display = "block";

    currentSectionHeadingID = newElement.id;
  }

  return;
}

/*********************************************************************************************/

function resizeMenu()

/*
*** INTERNET EXPLORER HACK ***

This function resizes the menu pane whenever the Internet Explorer window is resized.  This
function must be listed in "common_paneResizers" in order to work.

Because Internet Explorer 6 doesn't support the "position:fixed" style attribute, such panes
must be simulated with some CSS hacks.  One of the side effects of these hacks is that these
panes are of a fixed size -- which means that if the Internet Explorer window is resized then
the panes aren't.  The only workaround is to manually change their sizes with JavaScript
functions.
*/

{
  if (navigator.appName == "Microsoft Internet Explorer")
  {
    var element = document.getElementById("Menu");

    if (element != null)
      element.style.height = document.body.clientHeight + "px";
  }

  return;
}

common_paneResizers[common_paneResizers.length] = resizeMenu;