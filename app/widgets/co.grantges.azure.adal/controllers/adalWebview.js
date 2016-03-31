
var _callback;

/**
 * Opens the window and the contained webview to the past in URL.
 * while also setting up callback functions to check for Azure Authorization
 * success.
 * @private
 *
 * @param {String} url - The URL to open in the webview
 * @param {Function} callback - The callback function to handle asynchronous events
 */
function _open(url, callback){

  /**
   * May need a handle to this if the user hits "close"
   */
  _callback = callback;

  /**
   * Navigate the webview to the correct Azure ADAL login page
   */
  $.webview.url = url;

  /**
   * If a callback is defined lets set up to capture the 'beforeload' event
   */
  callback && $.webview.addEventListener('beforeload', function(e){
    if(e && e.url){

      /**
       * There is a an error with your AZure configuration, check the error and your setup.
       */
      if(_getParameterByName('error', e.url)){
        var description = _getParameterByName('error', e.url) - _getParameterByName('error_description', e.url)
        var err = new Error(description, 'adalWebview.js', 19);
        callback && callback(err);
      }
      /**
       * Success, return the appropriate authCode
       */
      else if(_getParameterByName('code', e.url)){
        var authCode = _getParameterByName('code', e.url);
        callback && callback(null, {code: authCode});
      }
    }

  });

  $.win.open({modal:true});
}

/**
 * Public interface for the `_open` function.
 */
exports.open = _open;

/**
 * Closes the modal window and resets the webview url.
 * @private
 */
function _close(){
  $.webview.url = "";
  $.win.close();
}

/**
 * Public interface for the `_close` function.
 */
exports.close = _close;

/**
 * Closes the modal dialog and returns an User initated close result
 * @private
 */
function _onClickCloseButton(e){ 
  _close();
  _callback && _callback(new Error('com.appcelerator.azure.adal::USER_EXIT - User initiated close of dialog', 'adalWebview.js', 78));
}

/**
 * Helper function for retrieving query parameters from a URL.
 * @private
 *
 * @param {String} name - The name of the query parameter to fetch from the URL
 * @param {String} url  - The URL to check for the query parameter
 */
function _getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
