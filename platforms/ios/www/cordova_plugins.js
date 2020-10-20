cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-inappbrowser.inappbrowser",
      "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
      "pluginId": "cordova-plugin-inappbrowser",
      "clobbers": [
        "cordova.InAppBrowser.open"
      ]
    },
    {
      "id": "cordova-plugin-safariviewcontroller.SafariViewController",
      "file": "plugins/cordova-plugin-safariviewcontroller/www/SafariViewController.js",
      "pluginId": "cordova-plugin-safariviewcontroller",
      "clobbers": [
        "SafariViewController"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-inappbrowser": "4.0.0",
    "cordova-plugin-safariviewcontroller": "1.6.0"
  };
});