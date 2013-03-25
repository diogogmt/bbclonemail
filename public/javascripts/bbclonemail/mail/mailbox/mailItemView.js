console.log("mailItemView.js");
// Mail Viewer
// -----------
//
// View an individual email

BBCloneMail.module("MailApp.Mailboxes", function(Mailboxes, App, Backbone, Marionette, $, _){
  "use strict";
  
  // Mail View
  // ---------
  // Displays the contents of a single mail item.

  Mailboxes.MailView = Marionette.ItemView.extend({
    template: "#email-view-template",
    tagName: "li",
  });

  Mailboxes.MailListView2 = Marionette.CollectionView.extend({
    itemView: Mailboxes.MailView,
    tagName: "ul",
  });

  Mailboxes.MailViewer = Marionette.Controller.extend({

    initialize: function(options){
      console.log("Mailboxes.MailViewer.Controller - initialize");
      this.region = options.region;
      this.email = options.email;
    },

    show: function(){
      console.log("Mailboxes.MailViewer.Controller - show");
      console.log("---this.email: ", this.email);
      console.log("creating Marionette.CollectionView")
      var view = new Mailboxes.MailListView2({
        collection: this.email
      });

      console.log("----showing view on region");
      console.log("view: ", view);
      this.region.show(view);
      console.log("this.region: ", this.region);
      console.log("view: ", view);
    }
  });

});
