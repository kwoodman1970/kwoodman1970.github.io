/*
This file contains almost everything needed to manage forms, including input field validation
functions and window management.

It doesn't contain form validation functions -- those should be coded in the same HTML file as
the forms themselves.
*/

var oldOnUnloadHandler    = window.onunload;   // previous onunload handler
var forms                 = new Object;        // array of browser sub-windows
var elementToReceiveFocus = null;              // the <INPUT> document element to receive focus

/*********************************************************************************************/

function refocus
(
  inputField,   // the document element that will receive focus (<INPUT> document element)
  alertMessage  // the message to display in an alert box just before focus is shifted (string)
)

/*
EVENT MODEL HACK!

This function gets around the problem of not being able to return focus to an <INPUT> document
element when its "ONCHANGE" event handler has been called.  This problem is a feature of the
W3C standards event model.

PRECONDITIONS:
This function must only be called as part of an "ONCHANGE" event handler.  "alertMessage" will
be placed in a generated function, so all backslashes must be escaped with another backslash.

POSTCONDITIONS:
"alertMessage" is displayed in an alert box, then focus is shifted to "inputField".
*/

{
  /*
  This hack works by waiting until all events have propagated before trying to shift focus.
  Since there's no practical way to determine when to take action, a specific delay time is
  assumed.  A generated function is called after that delay to display the message, then shift
  focus.

  The "elementToReceiveFocus" global variable is used to remember which element to shift the
  focus to after this function has exited.
  */

  var refocusDelay = 10;                           // time (in ms) to wait before taking action

  elementToReceiveFocus = inputField;
  window.setTimeout("window.alert(\"" + alertMessage + "\"); elementToReceiveFocus.focus(); " +
    "elementToReceiveFocus.select(); elementToReceiveFocus = null", refocusDelay);

  return;
}

/*********************************************************************************************/

function validateInt
(
  inputField,                      // the number to examine (<INPUT> document element)
  lowerBound,                      // the smallest number that the integer can be (int or null)
  upperBound                       // the largest number that the integer can be (int or null)
)

/*
This function checks to see if "inputField" contains a valid integer.  If "lowerBound" and/or
"upperBound" are non-null then the integer is checked to see if lies within those bounds.

The function can be used like this:

  <INPUT TYPE=TEXT ONCHANGE="validateInt(this, 0, 10)">

PRECONDITIONS:
None.

POSTCONDITIONS:
Iff "inputField" contains an invalid integer or the integer is less than "lowerBound" (if
specified) or greater then "upperBound" (if specified) then an alert box lets the user know.
*/

{
  if (inputField.value == "")
    inputField.value = "0";
  else
  {
    var numberFormat = /^-?\d+$/;

    if (!numberFormat.test(inputField.value))
      refocus(inputField, "That's not an integer!");
    else
    {
      var number = parseInt(inputField.value);

      if (((lowerBound != null) && (number < lowerBound)) ||
        ((upperBound != null) && (number > upperBound)))
      {
        if ((lowerBound != null) && (upperBound != null))
        {
          refocus(inputField, "Please enter an integer from " + lowerBound + " to " +
            upperBound + ".");
        }
        else if (lowerBound != null)
          refocus(inputField, "Please enter an integer no less than " + lowerBound + ".");
        else if (upperBound != null)
          refocus(inputField, "Please enter an integer no greater than " + upperBound + ".");
      }
    }
  }

  return;
}

/*********************************************************************************************/

function validatePostalCode
(
  inputField               // the postal code to examine & reformat (<INPUT> document element)
)

/*
This function checks to see if "inputField" contains a valid Canadian postal code.  It can be
used like this:

  <INPUT TYPE=TEXT ONCHANGE="validatePostalCode(this)">

PRECONDITIONS:
None.

POSTCONDITIONS:
Iff "inputField" isn't blank and contains an invalid Canadian postal code then an alert box
lets the user know.  Otherwise, all lowercase letters are converted to uppercase.
*/

{
  if (inputField.value != "")
  {
    /*
    The format of a postal code is <letter><number><letter><space><number><letter><number>.
    Letters must be uppercase, but lowercase letters are technically valid.
    */

    var postalCodeFormat = /^$|^([A-Z]\d[A-Z]) *(\d[A-Z]\d)$/i;
    var matches          = postalCodeFormat.exec(inputField.value);

    if (matches != null)
    {
      /*
      If a valid postal code is found then it's forced into a particular format.
      */

      inputField.value = matches[1].toUpperCase() + " " + matches[2].toUpperCase();
    }
    else
      refocus(inputField, "That's not a postal code!");
  }

  return;
}

/*********************************************************************************************/

function validatePhone
(
  inputField               // the phone number to examine & reformat (<INPUT> document element)
)

/*
This function checks to see if "inputField" contains a valid phone number.  It can be used like
this:

  <INPUT TYPE=TEXT onChange="validatePhone(this)">

PRECONDITIONS:
None.

POSTCONDITIONS:
Iff "inputField" isn't blank and contains a invalid phone number then an alert box lets the
user know.  Otherwise, the phone number is forced into a "###-####" or "###-###-####" format.
*/

{
  if (inputField.value != "")
  {
    /*
    There are a few formats that a phone number can be in:

      (###) ###-####
      ###-###-####
      ##########

    These must all be checked, but only the digits matter.
    */

    var phoneFormat = /^\D*(\d\d\d)\D*(\d\d\d)\D*(\d\d\d\d)\D*$/;
    var matches     = phoneFormat.exec(inputField.value);

    if (matches != null)
    {
      /*
      If a valid phone number is found then it's forced into a particular format.
      */

      inputField.value = "(" + matches[1] + ") " + matches[2] + "-" + matches[3];
      return true;
    }
    else
    {
      refocus(inputField, "That's not a phone number!\\n\\nDid you forget to include the " +
        "area code?");
    }
  }

  return;
}

/*********************************************************************************************/

function isIpAddressValid
(
  ipAddress                                     // the IP address to examine (array of strings)
)

/*
This function determines whether or not the strings in the array "ipAddress" are valid IP
dotted address components.

PRECONDITIONS:
Each string in "ipAddress" must contain a positive integer.

POSTCONDITIONS:
If all of the strings in "ipAddress" are valid IP dotted address components then "true" is
returned; otherwise, "false" is returned.
*/

{
  /*
  A string in "ipAddress" is considered to be a valid IP dotted address component if it can be
  parsed into a number betwwen 0 and 255.  Therefore, each element of "ipAddress" is checked
  for this condition.
  */

  var isValid = true;
  var i       = 1;

  while ((i < ipAddress.length) && isValid)
  {
    isValid = (parseInt(ipAddress[i]) <= 255)
    i++;
  }

  return isValid;
}

/*********************************************************************************************/

function isDomainNameValid
(
  domainName                                             // the domain name to examine (string)
)

/*
This function performs an exhaustive analysis of "domainName" to determine whether or not it's
a valid Internet domain name.

PRECONDITIONS:

None.

POSTCONDITIONS:

"true" is returned if "domainName" is found to be a valid Internet domain name; otherwise,
"false" is returned.
*/

{
  var isValid = false;

  /*
  A domain name can consist of alphanumeric characters, underscores, hyphens and periods.  It
  can't begin with or end with a period, nor can there be two periods together.
  */

  var validDomainNameChars = /^[\w\-.]+$/;
  var invalidDots      = /\.$|\.\.|^\./;

  if (validDomainNameChars.test(domainName) && !invalidDots.test(domainName))
  {
    /*
    A domain name must end with a valid suffix (e.g. ".com", ".net", ".org"...).
    */

    var findDomainSuffix = /.+\.(.+)$/;
    var matches          = findDomainSuffix.exec(domainName);

    if (matches != null)
    {
      var domainSuffix        = matches[1];
      var validDomainSuffixes = new RegExp("^(ac|ad|ae|aero|af|ag|ai|al|am|an|ao|aq|ar|arpa|" +
                                  "as|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bi|biz|bj|bm|bn|bo|" +
                                  "br|bs|bt|bv|bw|by|bz|ca|cc|cf|cg|ch|ci|ck|cl|cm|cn|co|" +
                                  "com|coop|cr|cs|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|" +
                                  "ee|eg|eh|er|es|et|fi|firm|fj|fk|fm|fo|fr|fx|ga|gb|gd|ge|" +
                                  "gf|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|" +
                                  "hr|ht|hu|id|ie|il|in|info|int|io|iq|ir|is|it|jm|jo|jp|ke|" +
                                  "kgkh|ki|km|kn|kp|kr|kw|ky|kz|la||lc|li|lk|lr|ls|lt|lu|lv|" +
                                  "ly|ma|mc|md|mg|mh|mil|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|" +
                                  "museum|mv|mw|mx|my|mz|na|nato|name|nc|ne|net|nf|ng|ni|nl|" +
                                  "no|nom|np|nr|nt|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|" +
                                  "pr|pro|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|" +
                                  "sj|sk|sl|sm|sn|so|sr|st|store|su|sv|sy|sz|tc|td|tf|tg|th|" +
                                  "tj|tk|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|" +
                                  "vc|ve|vg|vi|vn|vu|web|wf|ws|ye|yt|yu|za|zm|zr|zw)$");

      isValid = validDomainSuffixes.test(domainSuffix);
    }
  }

  return isValid;
}

/*********************************************************************************************/

function validateEmail
(
  inputField                        // the e-mail address to examine (<INPUT> document element)
)

/*
This function checks to see if "inputField" contains a valid e-mail address.  It can be used
like this:

  <INPUT TYPE=TEXT onChange="validateEmail(this)">

PRECONDITIONS:
None.

POSTCONDITIONS:
Iff "inputField" isn't blank and contains a invalid e-mail address then an alert box lets the
user know.
*/

{
  if (inputField.value != "")
  {
    var isValid     = false;
    var emailFormat = /^(.+)@(.+)$/;
    var matches     = emailFormat.exec(inputField.value);

    if (matches != null)
    {
      var userId           = matches[1];
      var domain           = matches[2];
      var quotedFormat     = /^"[^\x00-\x1f"\x7f-\xff]*"$/;
      var validUserIdChars = /^[^\x00-\x1f "\(\),:;<>@\[\\\]\x7f-\xff]+$/;

      if (quotedFormat.test(userId) || validUserIdChars.test(userId))
      {
        var dottedIpAddressFormat = /^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;

        matches = dottedIpAddressFormat.exec(domain)
        isValid = ((matches != null) ? isIpAddressValid(matches) : isDomainNameValid(domain));
      }
    }

    if (!isValid)
      refocus(inputField, "That's not an e-mail address!");
  }

  return;
}

/*********************************************************************************************/

function validateWebsite
(
  inputField                       // the website address to examine (<INPUT> document element)
)

/*
This function checks to see if "inputField" contains a valid website address.  It can be used
like this:

  <INPUT TYPE=TEXT onChange="validateWebsite(this)">

PRECONDITIONS:
None.

POSTCONDITIONS:
Iff "inputField" isn't blank and contains a invalid website address then an alert box lets the
user know.
*/

{
  if (inputField.value != "")
  {
    var isValid       = false;
    var websiteFormat = /^([^\/]+)\/?(.*)$/;
    var matches       = websiteFormat.exec(inputField.value);

    if (matches != null)
    {
      var domain                = matches[1];
      var page                  = matches[2];
      var dottedIpAddressFormat = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

      matches = dottedIpAddressFormat.exec(domain)

      if ((matches != null) ? isIpAddressValid(matches) : isDomainNameValid(domain))
      {
        if (page == "")
          isValid = true;
        else
        {
          var pageFormat = /^([^.]*)\.?([^\.#]*)#?([^#]*)$/;

          match = pageFormat.exec(page);

          if (match != null)
          {
            var pathAndFilename     = match[1];
            var extension           = match[2];
            var anchor              = match[3];
            var validFilenameChars  = /^[\w\/]+$/;
            var invalidSlashes      = /\/\//;
            var validExtensionChars = /^[\w]*$/;
            var validAnchorChars    = /^[^\x00-\x1f \x7f-\xff]*$/;

            isValid = (validFilenameChars.test(pathAndFilename) &&
              !invalidSlashes.test(pathAndFilename) && validExtensionChars.test(extension) &&
              validAnchorChars.test(anchor));
          }
        }
      }
    }

    if (!isValid)
      refocus(inputField, "That's not a website address!");
  }

  return;
}

/*********************************************************************************************/

function enableElements
(
  sourceElement      // the basis for enabling or disabling elements (<INPUT> document element)
  /*...*/            // the names (not ID's!) of the elements to enable or disable (string)
)

/*
This function is intended to be called by a radio button or checkbox's "ONCLICK" event handler.
If "sourceElement" is in a checked state then all of the elements in the document whose names
(not ID's!) are in the list of arguments are enabled; otherwise, they're disabled.

The object is to enable or disable <INPUT> elements when the user clicks on a radio button or
checkbox.

For example:

  <INPUT TYPE=RADIO NAME="Deacon" ONCLICK="disableElements(this, 'Title')" CHECKED>Deacon<BR>
  <INPUT TYPE=RADIO NAME="Elder" ONCLICK="disableElements(this, 'Title')">Elder<BR>
  <INPUT TYPE=RADIO NAME="Overseer" ONCLICK="disableElements(this, 'Ttile')">Overseer<BR>
  <INPUT TYPE=RADIO NAME="Other" ONCLICK="enableElements(this, 'Title')">Other<BR>
  Title:  <INPUT TYPE=TEXT NAME="Title" DISABLED>

Initially, the first radio button is set and the text field is disabled.  When the user sets
the last radio button, the text field is enabled; when the user sets one of the first three
radio buttons, the text field is disabled.

PRECONDITIONS:

None.

POSTCONDITIONS:

All of the elements named in the argument list are enabled or disabled according to whether
"sourceElement" is in a checked state or not.
*/

{
  /*
  Two loops are needed.  The outer loop iterates through all of the arguments that follow
  "sourceElement".  The inner loop retrieves all of the elements in the document with the same
  name as the current argument, then sets each one's "disabled" property according to whether
  "soruceElement" is in a checked state or not.

  It could be assumed that each <INPUT> element has a unique name and just process the first
  one retrieved, but it's better to be sure and process all of them.
  */

  for (var i = 1; i < arguments.length; ++i)
  {
    targetElements = document.getElementsByName(arguments[i]);

    for (var j = 0; j < targetElements.length; ++j)
      targetElements[j].disabled = !sourceElement.checked;
  }

  return;
}

/*********************************************************************************************/

function disableElements
(
  sourceElement      // the basis for enabling or disabling elements (<INPUT> document element)
  /*...*/            // the names (not ID's!) of the elements to enable or disable (string)
)

/*
This function is intended to be called by a radio button or checkbox's "ONCLICK" event handler.
If "sourceElement" is in a checked state then all of the elements in the document whose names
(not ID's!) are in the list of arguments are disabled; otherwise, they're enabled.

The object is to enable or disable <INPUT> elements when the user clicks on a radio button or
checkbox.

For example:

  <INPUT TYPE=RADIO NAME="Deacon" ONCLICK="disableElements(this, 'Title')" CHECKED>Deacon<BR>
  <INPUT TYPE=RADIO NAME="Elder" ONCLICK="disableElements(this, 'Title')">Elder<BR>
  <INPUT TYPE=RADIO NAME="Overseer" ONCLICK="disableElements(this, 'Ttile')">Overseer<BR>
  <INPUT TYPE=RADIO NAME="Other" ONCLICK="enableElements(this, 'Title')">Other<BR>
  Title:  <INPUT TYPE=TEXT NAME="Title" DISABLED>

Initially, the first radio button is set and the text field is disabled.  When the user sets
the last radio button, the text field is enabled; when the user sets one of the first three
radio buttons, the text field is disabled.

PRECONDITIONS:

None.

POSTCONDITIONS:

All of the elements named in the argument list are enabled or disabled according to whether
"sourceElement" is in a checked state or not.
*/

{
  /*
  Two loops are needed.  The outer loop iterates through all of the arguments that follow
  "sourceElement".  The inner loop retrieves all of the elements in the document with the same
  name as the current argument, then sets each one's "disabled" property according to whether
  "soruceElement" is in a checked state or not.

  It could be assumed that each <INPUT> element has a unique name and just process the first
  one retrieved, but it's better to be sure and process all of them.
  */

  for (var i = 1; i < arguments.length; ++i)
  {
    targetElements = document.getElementsByName(arguments[i]);

    for (var j = 0; j < targetElements.length; ++j)
      targetElements[j].disabled = sourceElement.checked;
  }

  return;
}

/*********************************************************************************************/

function showForm
(
  name,                                                // the name of the form to show (string)
  url
)

/*
This function makes the browser window for the form "name" appear, either by creating it or by
bringing it into focus.  It can be used like this:

  <A HREF="javascript:showForm('fillMeIn')">Click Here!</A>
  <INPUT TYPE=BUTTON VALUE="Click Here!" onClick="showForm('FillMeIn')">

PRECONDITIONS:
"name" must be a valid form name, and the file "name".html must exist.

POSTCONDITIONS:
The specified form is either displayed in a new window or brought into focus.
*/

{
  /*
  If the window "name" is in "forms" and isn't in a closed state then that means that it
  already exists and just needs to be brought into focus; otherwise, the window has to be
  (re-)created.
  */

  if (name && forms[name] && !forms[name].closed)
  {
    forms[name].focus();
  }
  else
  {
    /*
    "width" and "height" are arbitrary values for the size (in pixels) of the window.  From
    these values, though, the window is created in the centre of the screen.
    */

    var width    = 720;
    var height   = 480;
    var leftPos  = screen.width ? (screen.width - width ) / 2 : 50;
    var topPos   = screen.height ? (screen.height - height) / 2 : 50;
    var settings = "width=" + width + ",height=" + height + ",top=" + topPos + ",left=" +
                   leftPos + ",scrollbars=1,location=0,directories=0,status=0,menubar=0," +
                   "toolbar=0,resizable=1";

    if (!url && name)
      url = "forms/" + name + ".html";

    var form = window.open(url, name, settings);

    if (name)
      forms[name] = form;

    return;
  }
}

/*********************************************************************************************/

function closeAllForms()

/*
This function closes all open forms.

PRECONDITIONS:

None.

POSTCONDITIONS:

All sub-windows in "forms" are closed.
*/

{
  /*
  All open form windows are noted in the "forms" global variable.
  */

  for (var i = 0; i < forms.length; ++i)
  {
    if (!forms[i].closed)
      forms[i].close();
  }

  if (oldOnUnloadHandler != null)
    oldOnUnloadHandler();

  return;
}

window.onunload = closeAllForms;

/*********************************************************************************************/

function formUnavailable
(
  reason,
  contact
)

{
  var at      = "@";
  var message = "We're sorry, but this form is unavailable at the moment.";

  if (reason != null)
    message += "  " + reason;

  message += "\n\nWe'll try to get this form working again as quickly as possible."

  if (contact != null)
    message += "  In the meantime, you can try to e-mail your information to \"" + contact +
      at + "trainconference.com\".";

  window.alert(message);

  return;
}