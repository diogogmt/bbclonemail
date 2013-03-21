console.log("bbclonemail.js");
BBCloneMail = (function(Backbone, Marionette){
  "use strict";

  console.log("create Marionette app");
  var App = new Marionette.Application();

  App.addRegions({
    nav: "#navigation",
    main: "#main",
    mainNav: "#main-nav",
    mainFooter: "#main-footer",
    appSelector: "#app-selector"
  });

  App.on("initialize:after", function(){
    console.log("App.on initialize:after");
    if (Backbone.history){
      console.log("starting backbone history");
      Backbone.history.start();
    }
  });

  App.startSubApp = function(appName, args){
    console.log("App.startSubApp");
    console.log("---- appName: ", appName);
    console.log("---- args: ", args);
    var currentApp = App.module(appName);
    if (App.currentApp === currentApp){ return; }

    if (App.currentApp){
      App.currentApp.stop();
    }

    App.currentApp = currentApp;
    console.log("starting app...");
    currentApp.start(args);
  };

  return App;
})(Backbone, Marionette);
