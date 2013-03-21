console.log("categoryView.js")
// Navigation Menu
// ---------------
//
// Show the list of mail categories and handle
// clicking them to navigate to the mail category

BBCloneMail.module("MailApp.Navigation", function(Nav, App, Backbone, Marionette, $, _){
  "use strict";

  // Category List View
  // ------------------
  // Display a list of categories in the navigation area

  Nav.CategoryListView = Marionette.ItemView.extend({
    template: "#mail-categories-view-template",

    events: {
      "click .mail-category": "mailCategoryClicked"
    },

    mailCategoryClicked: function(e){
      console.log("Nav.CategoryListView.ItemView - mailCategoryClicked");
      e.preventDefault();

      var category = $(e.currentTarget).data("category");
      this.trigger("category:selected", category);
    }
  });

  // Navigation Component Controller
  // -------------------------------

  Nav.Menu = Marionette.Controller.extend({
    
    initialize: function(options){
      console.log("Nav.Menu.Controller - initialize");
      this.region = options.region;
    },

    show: function(){
      console.log("Nav.Menu.Controller - show");
      var showCatListView = _.bind(this._showCatListView, this);
      this._getCategories(showCatListView);
    },

    _showCatListView: function(categories){
      console.log("Nav.Menu.Controller - _showCatListView");
      var view = new Nav.CategoryListView({
        collection: categories
      });

      this.listenTo(view, "category:selected", this._categorySelected);

      this.region.show(view);
    },

    _categorySelected: function(category){
      console.log("Nav.Menu.Controller - _categorySelected");
      this.trigger("category:selected", category);
    },

    _getCategories: function(callback){
      console.log("Nav.Menu.Controller - _getCategories");
      var categoryLoader = App.request("mail:categories");
      $.when(categoryLoader).then(callback);
    }
  });

});
