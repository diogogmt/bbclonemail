console.log("contacts - router.js")
BBCloneMail.module("ContactsApp", {
  startWithParent: false,
  define: function(ContactsApp, App){

    // Contacts Router
    // -----------

    var Router = Backbone.Router.extend({
      routes: {
        "contacts": "showContacts",
      },

      // route filter before method
      // https://github.com/boazsender/backbone.routefilter
      before: function(){
        console.log("Contacts.Router - before");
        App.startSubApp("ContactsApp", {
          mainRegion: App.main,
          mainNavRegion: App.mainNav,
          mainFooterRegion: App.mainFooter,
          navRegion: App.nav,
          appSelectorRegion: App.appSelector
        });
      },

      showContacts: function(){
        console.log("Contacts.Router - showContacts");
        App.ContactsApp.controller.showContacts();
        App.ContactsApp.controller.showViewMore();
      }
    });

    // Initializer
    // -----------
    //
    // The router must always be alive with the app, so that it can
    // respond to route changes and start up the right sub-app 
    App.addInitializer(function(){
      console.log("Creating Contacts.router")
      var router = new Router();
    });

  }
});
