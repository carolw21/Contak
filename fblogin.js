
/* This extension automatically loads a facebook pop-up login (unless the local storage already has the token stored) */
/* Don't forget to replace the 'appID' and allow bunch of options in your Facebook APP Dashboard */

// This is the url to which facebook will return the token/error
var successURL = 'https://www.facebook.com/connect/login_success.html';

if ( ! localStorage.getItem('FBaccessToken')) {
   var path = 'https://www.facebook.com/dialog/oauth?';
   var appID = '1175228392628573';
   var queryParams = ['client_id=' + appID, 'redirect_uri=' + successURL, 'response_type=token', 'display=popup'];
   var query = queryParams.join('&');
   var url = path + query;

   chrome.windows.create({
      'url': url,
      'type': 'popup'
   }, function(window) {});
}


function onTabUpdated(tabId, changeInfo, tab) {
   if (changeInfo.url && changeInfo.url.indexOf(successURL) === 0) {
      localStorage.setItem('FBaccessToken', accessTokenFromSuccessURL(changeInfo.url), tabId);
      chrome.tabs.remove(tabId);
      chrome.tabs.onUpdated.removeListener(onTabUpdated);
      var options = {
        type: "basic",
        title: "Facebook Authentication Successful",
        message: "Enjoy your token!",
        iconUrl: ""
      }
      console.log("success");
   }
}

function accessTokenFromSuccessURL(url) {
   var hashSplit = url.split('#');
   if (hashSplit.length > 1) {
      var paramsArray = hashSplit[1].split('&');
      for (var i = 0; i < paramsArray.length; i++) {
         var paramTuple = paramsArray[i].split('=');
         if (paramTuple.length > 1 && paramTuple[0] == 'access_token')
            return paramTuple[1];
      }
   }
   return null;
}

if( ! localStorage.getItem('FBaccessToken')) {
  chrome.tabs.onUpdated.addListener(onTabUpdated);
}
