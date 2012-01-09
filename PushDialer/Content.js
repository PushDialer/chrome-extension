//
// PushDialer Chrome Extension
// Content.js
//
// Developed by Justin Mecham <justin@pushdialer.com>
// Copyright 2010-2012 Push Dialer, LLC. All rights reserved.
//

var phoneNumberExpression = /([0-9+(]{1}[0-9 (.\/-]{2,}([0-9A-Z()\/]{1,4}[ .\/-]?){2,}[0-9A-Z][0-9A-Z]{1,2}([,;0-9]+))/m;
var isMonitoringSelection = false;

//
// Returns the first phone number in the selected text, if any. Returns false
// if no phone number was detected.
//
function selectedPhoneNumber()
{
  var selectedText = window.getSelection().toString(),
      match        = selectedText.match(phoneNumberExpression),
      phoneNumber  = false;

  if (match)
    phoneNumber = match[0];

  return phoneNumber;
}

//
// Handle Requests from the Background Page
//
function onRequest(request, sender, sendResponse)
{
  if (request.action == "dialNumber")
  {
    window.location.href = "pushdialer://" + request.phoneNumber;
    sendResponse({});
  }
  else
    sendResponse({});
}
chrome.extension.onRequest.addListener(onRequest);

//
// Monitors the event triggered at the start of a selection so that we can
// add a context menu if the selected text matches.
//
function onSelectStart(event)
{
  if (!isMonitoringSelection)
  {
    isMonitoringSelection = true;
    document.body.addEventListener("mouseup", function()
    {
      var phoneNumber = selectedPhoneNumber();
      if (phoneNumber)
        chrome.extension.sendRequest({ "action": "enableContextMenu", "phoneNumber": phoneNumber });
      else
        chrome.extension.sendRequest({ "action": "disableContextMenu" });
    })
  }
}
document.body.addEventListener("selectstart", onSelectStart);
