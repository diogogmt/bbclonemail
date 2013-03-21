console.log("mail.js");
BBCloneMail.module("MailApp.Mail", function(Mail, App, Backbone, Marionette, $, _){
  "use strict";

  // Entities
  // --------

  var Email = Backbone.Model.extend({
  });

  var EmailCollection = Backbone.Collection.extend({
    model: Email,
    url: "/email"
  });

  // Mailbox Controller
  // ------------------

  Mail.Mailbox = Marionette.Controller.extend({
    getAll: function(){
      console.log("Mail.Mailbox.Controller - getAll");
      var deferred = $.Deferred();

      this._getMail(function(mail){
        deferred.resolve(mail);
      });

      return deferred.promise();
    },

    getById: function(id){
      console.log("Mail.Mailbox.Controller - getById");
      var deferred = $.Deferred();

      this._getMail(function(mailList){
        var mail = mailList.get(id);
        deferred.resolve(mail);
      });

      return deferred.promise();
    },

    getByCategory: function(categoryName){
      console.log("Mail.Mailbox.Controller - getByCategory");
      var deferred = $.Deferred();

      this._getMail(function(unfiltered){
        var filtered = unfiltered.filter(function(mail){
          var categories = mail.get("categories");
          return _.include(categories, categoryName);
        });

        var mail = new EmailCollection(filtered);
        deferred.resolve(mail);
      });

      return deferred.promise();
    },

    _getMail: function(callback){
      console.log("Mail.Mailbox.Controller - _getMail");
      var emailCollection = new EmailCollection();
      emailCollection.on("reset", callback);
      emailCollection.fetch();
    }
  });
});
