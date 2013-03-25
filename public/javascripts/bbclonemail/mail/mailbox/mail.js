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

    idAttribute: "ip",

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

    initialize: function () {
      console.log("Mail.Mailbox.Controller - initialize");
      this.emailCollection = new EmailCollection();
      this.emailCollection.fetch();
    },

    getEmailCollection: function () {
      console.log("Mail.Mailbox.Controller - getEmailCollection");
      return this.emailCollection;
    },

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

    

    _getMail: function(callback){
      console.log("Mail.Mailbox.Controller - _getMail");
      this.emailCollection.on("reset", callback);
      this.emailCollection.fetch();
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
