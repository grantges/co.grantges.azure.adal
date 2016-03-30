



/**
 * Provide your specific Azure specific information
 */
var clientId = 'YOUR_AZURE_CLIENT_ID',
    clientSecret = 'YOUR_AZURE_SECRET_KEY',
    tenant='YOUR_AZURE_TENANT_ID',
    resource = 'YOUR_AZURE_RESOURCE_ID';

/**
 * Create the widget
 */
var adalWidget = Alloy.createWidget('com.appcelerator.azure.adal');

/**
 * Setup the widget properties (could also be done as an object on the `createWidget` command)
 */
adalWidget.clientId = clientId;
adalWidget.clientSecret = clientSecret;
adalWidget.tenant = tenant;
adalWidget.resourceId = resource;

/**
 * Define your callbacks
 */
adalWidget.success = function(e){
  Ti.API.info('Azure Login and Token Retrieval was a success');
  console.log(JSON.stringify(e));

  /**
   * Close the widget
   */
   adalWidget.close();
}
adalWidget.error = function(e){
  Ti.API.info('Azure Login and Token Retrieval had an issue, try again');
  console.log(JSON.stringify(e));
}

/**
 * To use the widget, just call the `authorize` function.
 */
adalWidget.authorize();
