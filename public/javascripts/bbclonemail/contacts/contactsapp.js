console.log("contactsapp.js");
BBCloneMail.module("ContactsApp", function(ContactsApp, App){
  "use strict";
 
  // Contact List Views
  // ------------------

  ContactsApp.ContactView = Marionette.ItemView.extend({
    // template: "#contact-item-template",
    template: "#log-item-template",
    tagName: "li"
  });

  ContactsApp.ContactListView = Marionette.CollectionView.extend({
    itemView: ContactsApp.ContactView,
    tagName: "ul",
    id: "contact-list",
    className: "contact-list"
  });
  
  // Category View
  // -------------

  ContactsApp.CategoryView = Marionette.ItemView.extend({
    // template: "#contact-categories-view-template"
    template: "#log-levels-tab-template",

    events: {
      "click .log-level-btn": "showLogs"
      // "click button": "showLogs"
    },

    showLogs: function(e){
      console.log("ContactsApp.Category.ItemView - showLogs");
      e.preventDefault();

      var logLevel = $(e.currentTarget).data("level");
      this.trigger("logLevel:changed", logLevel);
    }
  });

  ContactsApp.ViewMoreLogsView = Marionette.ItemView.extend({
    template: "#view-more-logs-template",

    events: {
      "click .view-more-logs-btn": "viewMoreLogs"
      // "click button": "showLogs"
    },

    viewMoreLogs: function(e){
      console.log("ContactsApp.ViewMoreLogsView.ItemView - viewMoreLogs");
      e.preventDefault();

      // var logLevel = $(e.currentTarget).data("level");
      this.trigger("more:logs", true);
      Marionette.triggerMethod.call(ContactsApp.controller, "more:logs", 123);
    }
  });

  // Contact App Controller
  // -----------------------

  ContactsApp.Controller = App.AppController.extend({
    initialize: function(options){
      console.log("ContactsApp.Controller - initialize");
      this.repo = options.repo;
      this.repos = options.repos;
      this.currentTab = options.currentTab;
    },

    onShow: function(){
      console.log("ContactsApp.Controller - onShow");
      this._showCategories();
    },

    onToggleViewmore: function(level, flag){
      console.log("ContactsApp.Controller - onToggleViewmore");
      console.log("level: ", level);
      console.log("flag: ", flag);
      this.repos[level].toggleIsFull(!flag);
      // Update viewMore button visibility
      flag
        ? $(".view-more-logs-btn").show()
        : $(".view-more-logs-btn").hide()
      // this._showCategories();
    },

    onMoreLogs: function(){
      console.log("ContactsApp.Controller - onViewMoreLogs");
      console.log("currentTab: ", this.currentTab);
      this.repos[this.currentTab].showMore();
    },

    showContacts: function(){
      console.log("ContactsApp.Controller - showContacts");
      console.log("currentTab: ", this.currentTab);
      var that = this;
      // var categoryNav = new ContactsApp.CategoryView();
      // categoryNav.render();
      // console.log("categoryNav: ", categoryNav.$el.html());
      // this.navRegion.show(categoryNav);
      // $.when(this.repos[that.currentTab].getAll()).then(function(contacts){
      //   var view = new ContactsApp.ContactListView({
      //     collection: contacts
      //   });

      //   that.mainRegion.show(view);
        // that.mainRegion.$el.prepend(categoryNav.$el.html());

        
        // this.repos[that.currentTab].getAll();
        var view = new ContactsApp.ContactListView({
          collection: this.repos[this.currentTab].getAll()
        });

        that.mainRegion.show(view);
        // that.mainRegion.$el.prepend(categoryNav.$el.html());

        console.log("Backbone.history.navigate to contacts");
        Backbone.history.navigate("contacts");
      // });
    },

    showViewMore: function(){
      console.log("******ContactsApp.Controller - showViewMore");
      console.log("----currentTab: ", this.currentTab);
      var footerView = new ContactsApp.ViewMoreLogsView();
      this.mainFooterRegion.show(footerView);
    },

    // show the list of categories for the mail app
    _showCategories: function(){
      console.log("ContactsApp.Controller - _showCategories");
      var categoryNav = new ContactsApp.CategoryView();
      console.log("---- this.mainNavRegion: ", this.mainNavRegion);
      this.mainNavRegion.show(categoryNav);
      this.listenTo(categoryNav, "logLevel:changed", this._changeLogLevel);

      console.log("---- this.mainNavRegion: ", this.mainNavRegion);
    },

    getContacts: function(callback){
      console.log("ContactsApp.Controller - getContacts");
      return this.contactsRepo.getAll();
    },

    _changeLogLevel: function (level) {
      console.log("ContactsApp.Controller - _changeLogLevel")
      console.log("level: ", level);
      this.currentTab = level;
      console.log("this.currentTab: ", this.currentTab);
      console.log("this.repos[currentTab]: ", this.repos[this.currentTab]);
      console.log("this.repos[]isFull(): ", this.repos[this.currentTab].isFull());
      Marionette.triggerMethod.call(App.ContactsApp.controller, "toggle:viewmore", this.currentTab, !this.repos[this.currentTab].isFull());
      this.showContacts();
    },

  });

  // Initializers and Finalizers
  // ---------------------------

  ContactsApp.addInitializer(function(args){
    console.log("ContactsApp.addInitializer");
    console.log("args: ", args);

    var repos = [];
    console.log("creating ContactsApp.Contacts.Repository")
    var repo = new ContactsApp.Contacts.Repository();

    repos['error'] = new ContactsApp.Contacts.Repository({level: 'error'});
    repos['info'] = new ContactsApp.Contacts.Repository({level: 'info'});
    repos['error'].loadData();
    repos['info'].loadData();

    console.log("creating ContactsApp.Controller");
    ContactsApp.controller = new ContactsApp.Controller({
      mainRegion: args.mainRegion,
      mainNavRegion: args.mainNavRegion,
      mainFooterRegion: args.mainFooterRegion,
      navRegion: args.navRegion,
      appSelectorRegion: args.appSelectorRegion,
      repo: repo,
      repos: repos,
      currentTab: "error"
    });

    console.log("show() ContactsApp.controller");
    ContactsApp.controller.show();
    console.log("triggering app:started event for contacts module");
    App.vent.trigger("app:started", "contacts");
  });

  ContactsApp.addFinalizer(function(){
    console.log("ContactsApp.addFinalizer");
    if (ContactsApp.controller){
      console.log("---- closing regions");
      App._regionManager._regions.main.close();
      App._regionManager._regions.mainNav.close();
      App._regionManager._regions.mainFooter.close();

      console.log("---- ContactsApp.controller.close");
      ContactsApp.controller.close();
      console.log("---- delete ContactsApp.controller")
      delete ContactsApp.controller;
    }
  });

});
