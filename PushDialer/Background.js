//
// PushDialer Chrome Extension
// Background.js
//
// Developed by Justin Mecham <justin@pushdialer.com>
// Copyright 2010-2012 Push Dialer, LLC. All rights reserved.
//

var contextMenuId = false;

//
// Handle Context Menu Actions
//
function handleContextMenuAction(info, tab)
{
  var phoneNumberExpression = /([0-9+(]{1}[0-9 (.\/-]{2,}([0-9A-Z()\/]{1,4}[ .\/-]?){2,}[0-9A-Z][0-9A-Z]{1,2}([,;0-9]+))/m;
  var match                 = info.selectionText.match(phoneNumberExpression);
  var phoneNumber;

  if (match)
    phoneNumber = match[0];
  else
    return false;

  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(tab.id, { "action": "dialNumber", "phoneNumber": phoneNumber });
  });
}

//
// Enable Context Menu w/Phone Number
//
function enableContextMenu(phoneNumber)
{
  if (contextMenuId)
    return;

  contextMenuId = chrome.contextMenus.create({
    "title": "Dial \"" + phoneNumber + "\" on iPhone",
    "contexts": [ "selection" ],
    "onclick": handleContextMenuAction
  });
}

//
// Disable Context Menu
//
function disableContextMenu()
{
  chrome.contextMenus.remove(contextMenuId, function() {
    contextMenuId = null;
  });
}

//
// Handle Requests from Content Script
//
function onRequest(request, sender, sendResponse)
{
  if (request.action == "enableContextMenu")
  {
    var phoneNumber = request.phoneNumber;
    enableContextMenu(phoneNumber);
  }
  else if (request.action == 'disableContextMenu')
    disableContextMenu();
}
chrome.extension.onRequest.addListener(onRequest);
