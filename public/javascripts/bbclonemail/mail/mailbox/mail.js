console.log("mail.js");
BBCloneMail.module("MailApp.Mail", function(Mail, App, Backbone, Marionette, $, _){
  "use strict";

  // Entities
  // --------

  var VmInstance = Backbone.Model.extend({
    defaults: {
      id: '',
      status: '',
      ip: '',
    },

    initialize: function () {
      console.log("VmInstance - initialize");
    },

  });

  var VmInstanceCollection = Backbone.Collection.extend({
    model: VmInstance,

    initialize: function (options) {
      console.log("VmInstanceCollection - initialize");
      console.log("----options: ", options);
      options = options || {};
      this.ip = options.ip;
      this.url = "http://142.204.133.138:3000/list/vms/" + this.ip;
      console.log("this.url: ", this.url);
    },

    parse: function (response) {
      console.log("VmInstanceCollection - parse");
      console.log("----response: ", response);
      return response.instances;
    },
  });



  var Email = Backbone.Model.extend({
    defaults: {
      ip: '',
      hypervisor: '',
      load: '',
      memFree: '',
      memUsed: '',
    },

    initialize: function () {
      console.log("Email.Model - initialize");
    },

  });

  var EmailCollection = Backbone.Collection.extend({
    model: Email,
    url: "http://142.204.133.138:3000/list/models/hosts",

    parse: function (response) {
      console.log("****ContactCollection - parse");
      console.log("response: ", response);
      console.log("response.length: ", response.length);
      return response.hosts;
    },
  });

  // Mailbox Controller
  // ------------------

  Mail.Mailbox = Marionette.Controller.extend({
    getAll: function(){
      console.log("Mail.Mailbox.Controller - getAll");
      var deferred = $.Deferred();

      this._getMail(function(mail){
        console.log("mail: ", mail)
        deferred.resolve(mail);
      });

      return deferred.promise();
    },

    getById: function(ip){
      console.log("Mail.Mailbox.Controller - getById");
      console.log("----ip: ", ip);
      var deferred = $.Deferred();

      this._getVmInstances({ip: ip}, function(instanceList){
        console.log("----instanceList: ", instanceList);
        // var mail = mailList.get(id);
        console.log("----resolving deffered promise");
        deferred.resolve(instanceList);
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
    },

    _getVmInstances: function(options, callback){
      console.log("Mail.Mailbox.Controller - _getVmInstances");
      options = options || {};
      var ip = options.ip;
      var vmInstanceCollection = new VmInstanceCollection({
        ip: ip
      });
      vmInstanceCollection.on("reset", callback);
      console.log("----fecthing VmInstanceCollection");
      vmInstanceCollection.fetch();
    }
  });
});
