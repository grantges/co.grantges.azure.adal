# Alloy Widget for Microsoft Azure ADAL Authorization [![Appcelerator Titanium](http://www-static.appcelerator.com/badges/titanium-git-badge-sq.png)](http://appcelerator.com/titanium/) [![Appcelerator Alloy](http://www-static.appcelerator.com/badges/alloy-git-badge-sq.png)](http://appcelerator.com/alloy/)

This is a widget for the [Alloy](http://projects.appcelerator.com/alloy/docs/Alloy-bootstrap/index.html) MVC framework of [Appcelerator](http://www.appcelerator.com)'s [Titanium](http://www.appcelerator.com/platform) platform.

It provides an interface for using oAuth based authentication with Microsoft Azure Active Directory oAuth Login. To find out more about leveraging Microsoft Azure Active Directory Authentication, check out the [Azure oAuth Documentation](https://msdn.microsoft.com/en-us/library/azure/dn645545.aspx).

> Note: This widget assumes you have the correct configuration for Microsoft Azure and your app, and that an appropriate redirect URL is setup.

## Usage [![gitTio](http://gitt.io/badge.png)](http://gitt.io/component/co.grantges.azure.adal)

1. Install [this widget](http://gitt.io/component/co.grantges.azure.adal) via [gitTio](http://gitt.io):

	`gittio install co.grantges.azure.adal`

4. In your `app/views/index.js` use it like this:

	```
/**
 * Provide your specific Azure specific information
 */
var clientId = 'YOUR_AZURE_CLIENT_ID',
    clientSecret = 'YOUR_AZURE_CLIENT_SECRET=',
    tenant='YOUR_AZURE_TENANT_GUID',    //<-- optional
    resource = 'AZURE_AD_RESOURCE_ID';

/**
 * Create the widget
 */
var adalWidget = Alloy.createWidget('co.grantges.azure.adal');

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
	```

## The repository
The repository contains two branches. This master branch contains the widget. The other [test](https://github.com/grantges/co.grantges.azure.adal/tree/test) branch has a complete Titanium Alloy demo/test project.

## Changelog

- 1.0.2: Fixed bad widget name references
- 1.0.1: Initial release.

## License

<pre>
Copyright 2016 Bert Grantges

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
</pre>
