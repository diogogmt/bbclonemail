console.log("mail/router.js")
BBCloneMail.module("MailApp", {
  startWithParent: false,

  define: function(MailApp, App, Backbone, Marionette, $, _){
    "use strict";

    // Mail Router
    // -----------

    var Router = Backbone.Router.extend({
      routes: {
        "": "showInbox",
        "mail": "showInbox",
        "mail/inbox/:id": "showMailById"
      },

      // route filter before method
      // https://github.com/boazsender/backbone.routefilter
      before: function(){
        console.log("MailApp.Router - before");
        App.startSubApp("MailApp", {
          mainRegion: App.main,
          mainNavRegion: App.mainNav,
          mainFooterRegion: App.mainFooter,
          navRegion: App.nav,
          appSelectorRegion: App.appSelector
        });
      },

      showInbox: function(){
        console.log("MailApp.Router - showInbox");
        App.MailApp.controller.showInbox();
      },

      showMailById: function(id){
        console.log("MailApp.Router - showMailById");
        App.MailApp.controller.showMailById(id);
      },

      // showMailByCategory: function(category){
      //   console.log("MailApp.Router - showMailByCategory");
      //   App.MailApp.controller.showMailByCategory(category);
      // }
    });

    // Initializer
    // -----------
    //
    // The router must always be alive with the app, so that it can
    // respond to route changes and start up the right sub-app 
    App.addInitializer(function(){
      console.log("Creating Mail.Router")
      var router = new Router();
    });
  }
});
