console.log("appController.js");
// AppController
// --------------
//
// A base controller object to hide a lot of the 
// guts and implementation detail of showing the
// lists and individual items

BBCloneMail.AppController = (function(App, Marionette){
  "use strict";

  var AppController = Marionette.Controller.extend({
    constructor: function(options){
      console.log("\n**AppController - constructor");
      options = options || {};

      this.mainRegion = options.mainRegion;
      this.mainNavRegion = options.mainNavRegion;
      this.mainFooterRegion = options.mainFooterRegion;
      this.navRegion = options.navRegion;
      this.appSelectorRegion = options.appSelectorRegion;

      Marionette.Controller.prototype.constructor.call(this, options);
    },

    // show this component in the app
    show: function(){
      console.log("AppController - show");
      this._showAppSelector("mail");
      console.log("calling method show on this: ", this);
      Marionette.triggerMethod.call(this, "show");
    },

    // show the specified component, closing any currently
    // displayed component before showing the new one
    showComponent: function(component){
      console.log("AppController - showComponent");
      console.log("----component: ", component);
      console.log("----this._currentComponent: ", this._currentComponent);
      if (this._currentComponent){
        console.log("----close current component");
        this._currentComponent.close();
      }

      console.log("show component")
      component.show();
      this._currentComponent = component;
    },

    // Show the app selector drop down list, which allows
    // the app to be changed from mail app to contacts app
    _showAppSelector: function(appName){
      console.log("AppController - _showAppSelector");
      console.log("appName: ", appName);
      var appSelector = new App.AppSelector({
        region: this.appSelectorRegion,
        currentApp: appName
      });

      console.log("calling AppSelector show()")
      appSelector.show();
    }
  });

  return AppController;
})(BBCloneMail, Marionette);
