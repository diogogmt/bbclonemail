console.log("mailapp.js")
BBCloneMail.module("MailApp", function(MailApp, App){
  "use strict";

  // Controller
  // ----------
  MailApp.Controller = App.AppController.extend({
    initialize: function(options){
      console.log("MailApp.Controller - initialize");
      options = options || {};
      this.mailbox = options.mailbox;
      _.bindAll(this, "_showMail", "_showMailList");
    },
    
    showInbox: function(){
      console.log("MailApp.Controller - showInbox");
      // var mailbox = new MailApp.Mail.Mailbox();
      console.log("this.mailbox: ", this.mailbox);
      var that = this;
      $.when(this.mailbox.getAll()).then(function (emailList) {
        that.mainNavRegion.close();
        var navView = new MailApp.Mailboxes.Content2Emtpy();
        console.log("----navView: ", navView);
        console.log("---- this.mainNavRegion: ", that.mainNavRegion);
        that.mainNavRegion.show(navView);
        that._showMailList(emailList);
      });

      Backbone.history.navigate("#mail");
    },

    showMailById: function(id){
      console.log("MailApp.Controller - showMailById");
      // var mailbox = new MailApp.Mail.Mailbox();
      var that = this;
      $.when(this.mailbox.getById(id)).then(function (email) {
        console.log("---email: ", email);
        console.log("that.mailbox.getEmailCollection(): ", that.mailbox.getEmailCollection());
        var host = that.mailbox.getEmailCollection().get(id);
        console.log("----id: ", id);
        console.log("----host: ", host);

        var hostJSON = JSON.stringify(host);
        console.log("----hostJSON: ", hostJSON);

        // var navView = new MailApp.Mailboxes.MailPreview(hostJSON);
        var navView = new MailApp.Mailboxes.MailPreview({
          model: host
        });
        console.log("----navView: ", navView);
        console.log("---- this.mainNavRegion: ", that.mainNavRegion);
        // navView.render();
        that.mainNavRegion.show(navView);
        console.log("---- this.mainNavRegion: ", that.mainNavRegion);
        that._showMail(email);
      });

      
    },

    onShow: function(){
      console.log("MailApp.Controller - onShow");
      // this._showCategories();
    },


    // show a single email in the app
    _showMail: function(email){
      console.log("MailApp.Controller - _showMail");
      console.log("----email: ", email);
      var viewer = new App.MailApp.Mailboxes.MailViewer({
        region: this.mainRegion,
        email: email
      });

      console.log("showing component viewer");
      this.showComponent(viewer);

      console.log("navigation backbone history");
      Backbone.history.navigate("#mail/inbox/" + email.ip);
    },

    // show a list of email in the apps - the inbox, 
    // or a category, for example
    _showMailList: function(emailList){
      console.log("MailApp.Controller - _showMailList");
      var inbox = new App.MailApp.Mailboxes.Inbox({
        region: this.mainRegion,
        email: emailList
      });

      // when an email is selected, show it
      inbox.on("email:selected", function(email){
        this._showMail(email);
      }, this);

      this.showComponent(inbox);
    }
  });

  // Initializers
  // ------------

  MailApp.addInitializer(function(args){
    console.log("MailApp.addInitializer");
    console.log("----args: ", args);
    console.log("----creating mailApp controller")
    var mailbox = new MailApp.Mail.Mailbox();

    MailApp.controller = new MailApp.Controller({
      content1Region: args.content1Region,
      navRegion: args.navRegion,
      mainNavRegion: args.mainNavRegion,
      mainRegion: args.mainRegion,
      mainFooterRegion: args.mainFooterRegion,
      appSelectorRegion: args.appSelectorRegion,
      mailbox: mailbox
    });

    console.log("showing MailApp.controller")
    MailApp.controller.show();
    App.vent.trigger("app:started", "mail");
  });

  MailApp.addFinalizer(function(){
    if (MailApp.controller){
      console.log("closing MailApp.controller")
      MailApp.controller.close();
      delete MailApp.controller;
    }
  });

});
