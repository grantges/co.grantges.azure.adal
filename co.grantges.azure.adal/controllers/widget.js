

var _clientId,     // <-- GUID supplied by Azure
    _clientSecret, // <-- Azure calls this a Key in some places
    _tenant,       // <-- Your tenant GUID or domain (if you have one)
    _responseType, // <-- Almost always going to be 'code' which is the default
    _resourceId,   // <-- The Resource your trying to access.
    _redirectUrl,  // <-- If you want to supply a different redirectURL go for it.
    _grant_type,   // <-- For retrieving the bearer token, almost always going to be 'authorization_code'
    _onSuccess,    // <-- Callback for success
    _onError,      // <-- Callback for errors

    // URLs used to access authorization and bearer tokens
    _azureAdalTenantAuthUrl='https://login.microsoftonline.com/%s/oauth2/authorize?client_id=%s&response_type=%s',
    _azureAdalTenantTokenUrl='https://login.microsoftonline.com/%s/oauth2/token',
    _azureAdalAuthUrl='https://login.microsoftonline.com/oauth2/authorize?client_id=%s&response_type=%s',
    _azureAdalTokenUrl='https://login.microsoftonline.com/oauth2/token';

// A handle to the WebView component of the widget.
var _adalWebView = Alloy.createWidget('com.appcelerator.azure.adal', 'adalWebview');

/**
 * Constructor for the Appcelerator Azure ADAL widget
 * @constructor
 */
(function _constructor(_params){

  _clientId  = _params.client_id || null;
  _clientKey = _params.client_key || null;
  _tenant     = _params.tenant || null;
  _redirectUrl = _params.redirectUrl || null;
  _resource = _params.resource || null;
  _responseType = _params.responseType || 'code';
  _grantType = _params.grantType || 'authorization_code';


  if(_params.onSuccess){
      if(_.isFunction(_params.onSuccess)){
          _onSuccess = _params.onSuccess
      }
      else {
        Ti.API.error('WIDGET[com.appcelerator.azure.adal] Error creating widget, onSuccess property must be a function.');
      }
  }

  if(_params.onError){
      if(_.isFunction(_params.onError)){
          _onSuccess = _params.onError
      }
      else {
        Ti.API.error('WIDGET[com.appcelerator.azure.adal] Error creating widget, onError property must be a function.');
      }
  }


})($.args);

/**
 * Opens the WebView for authenticating against Azure AD.
 * @public
 */
function _authorize(){

    _getUserAuthorization(function(err, result){

        if(err){
          _onError && _onError(err) || Ti.API.error(err.message);
        }
        else{

          _getBearerToken(result.code, function(err, result){

            if(err){
              _onError && _onError(err);
            }
            else{
              _onSuccess && _onSuccess(result);
            }

          });
        }
    });

}
exports.authorize = _authorize;

/**
 * Closes the WebView for authenticating against Azure AD.
 * @private
 */
function _close(){
  _adalWebView && _adalWebView.close();
}

/**
 * Public interface for closing the widget
 */
exports.close = _close;

/**
 * Authenticates the user against Azure Active Directory and returns an
 * authorization code
 * @private
 */
function _getUserAuthorization(callback){

  /**
   * Must have a _clientId and _responseType to proceed
   */
  if(_clientId && _responseType){

    /**
     * Format the URL correctly for those users with a tenant ID / domain.
     */
    var url = _tenant ? String.format(_azureAdalTenantAuthUrl, _tenant, _clientId, _responseType) :
                        String.format(_azureAdalAuthUrl, _clientId, _responseType);

    if(_redirectUrl){
      url += '&redirect_uri='+_redirectUrl;
    }

    /**
     * Open the webview for the oAuth login.
     */
    _adalWebView.open(url, function(err, result){

      if(err){

        /**
         * Ooops! We hit a roadbloack, make sure your configured right with Azure.
         */
        Ti.API.info('WIDGET[com.appcelerator.azure.adal] Authorization Error');
        callback && callback(err);
      }
      else {
        Ti.API.info('WIDGET[com.appcelerator.azure.adal] Authorization Successful');
        callback && callback(null, result);
      }

    });
  }
}

/**
 * Retrieves the Azure Bearer Token
 * @private
 *
 * @param {String} _authCode - The authorization code returned by the authorize function
 */
function _getBearerToken(_authCode, callback){

  if(_clientId && _authCode && _resourceId && _grantType){

    /**
     * Format Token Url and Post Body params
     */
    var tokenUrl = _tenant ? String.format(_azureAdalTenantTokenUrl,  _tenant) : _azureAdalTokenUrl;
    var bodyParms = {
      client_id: _clientId,
      client_secret: _clientSecret,
      grant_type: _grantType,
      resource: _resourceId,
      code: _authCode
    };

    /**
     * Make Request to Azure for Bearer Token
     */
    var xhr = Ti.Network.createHTTPClient({
      onload: function(e){

        /**
         * Success! Return the access and refresh tokens to calling function
         */
        if(this.status == 200){
          var response = JSON.parse(this.responseText);
          callback && callback(null, {access_token: response.access_token, refresh_token: response.refresh_token});
        }
      },
      onerror: function(e){

        /**
         * Oops! Something went wrong here
         */
        callback && callback(e.error);
      },
      timeout: 10000
    });
    xhr.open('POST', tokenUrl);
    xhr.send(bodyParms);
  }
}

/**
 * Client ID Property
 */
Object.defineProperty($, 'clientId',{
  get: function _getClientId(){
    return _clientId;
  },
  set: function _setClientId(id){
    _clientId = id;
  }
});

/**
 * Client Secret Property
 */
Object.defineProperty($, 'clientSecret',{
  get: function _getClientKey(){
    return _clientSecret;
  },
  set: function _setClientKey(key){
    _clientSecret = key;
  }
});

/**
 * Tenant Property
 */
Object.defineProperty($, 'tenant',{
  get: function _getTenant(){
    return _tenant;
  },
  set: function _setTenant(t){
    _tenant = t;
  }
});

/**
 * Azure Resource Property
 */
Object.defineProperty($, 'resourceId',{
  get: function _getResourceId(){
    return _resourceId;
  },
  set: function _setResourceId(id){
    _resourceId = id;
  }
});

/**
 * onSuccess callback Property
 */
Object.defineProperty($, 'success',{
  get: function _getSuccessCallback(){
    return _onSuccess;
  },
  set: function _setSuccessCallback(func){
    if(_.isFunction(func)){
        _onSuccess = func
    }
    else {
      Ti.API.error('WIDGET[com.appcelerator.azure.adal] Error setting property - onSuccess must be a function.');
    }
  }
});

/**
 * onError callback Property
 */
Object.defineProperty($, 'error',{
  get: function _getErrorCallback(){
    return _onError;
  },
  set: function _setErrorCallback(func){
    if(_.isFunction(func)){
        _onError = func
    }
    else {
      Ti.API.error('WIDGET[com.appcelerator.azure.adal] Error setting property - onError must be a function.');
    }
  }
});
