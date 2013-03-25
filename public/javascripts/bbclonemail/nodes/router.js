console.log("nodes - router.js")
BBCloneMail.module("NodesApp", {
  startWithParent: false,
  define: function(NodesApp, App){

    // Contacts Router
    // -----------

    var Router = Backbone.Router.extend({
      routes: {
        "nodes": "showNodes",
      },

      // route filter before method
      // https://github.com/boazsender/backbone.routefilter
      before: function(){
        console.log("Nodes.Router - before");
        App.startSubApp("NodesApp", {
          content1Region: App.content1,
          mainRegion: App.main,
          mainNavRegion: App.mainNav,
          mainFooterRegion: App.mainFooter,
          navRegion: App.nav,
          appSelectorRegion: App.appSelector
        });
      },

      showNodes: function(){
        console.log("Nodes.Router - showNodes");
        var curPage = "WebVirt Nodes Management"
        App.NodesApp.controller.showBreadcrumbs(curPage);
        App.NodesApp.controller.showNodes();
      }
    });

    // Initializer
    // -----------
    //
    // The router must always be alive with the app, so that it can
    // respond to route changes and start up the right sub-app 
    App.addInitializer(function(){
      console.log("Creating Nodes.router")
      var router = new Router();
    });

  }
});
