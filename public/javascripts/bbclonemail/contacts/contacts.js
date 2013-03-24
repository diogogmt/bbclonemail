console.log("contacts.js");

BBCloneMail.module("ContactsApp.Contacts", function(Contacts, App, Backbone, Marionette, $, _){
  "use strict";

  // Entities
  // --------

  // var Contact = Backbone.Model.extend({
  //   initialize: function(){
  //     console.log("Contact.Model - initialize");
  //     Backbone.Compute(this);
  //   },

  //   fullName: { 
  //     fields: ["firstName", "lastName"], 
  //     compute: function(fields){
  //       return fields.lastName + ", " + fields.firstName;
  //     }
  //   }
  // });

var Contact = Backbone.Model.extend({
  defaults: {
    'timestamp' : '',
    'file'      : '',
    'line'      : '',
    'message'   : '',
  },

  idAttribute: "id",

  initialize: function () {
    console.log("Contact.Model - initialize");
  },

  save: function () {
    console.log("Contact.Model - save");
    return true;
  }
});



  // var ContactCollection = Backbone.Collection.extend({
  //   model: Contact,
  //   url: "/contacts"
  // });

  var ContactCollection = Backbone.Collection.extend({
    model: Contact,

    initialize: function (options) {
      console.log("ContactCollection - initialize");
      console.log("options: ", options);
      options = options || {};
      this.start = options.start || 1;
      this.rows = options.rows || 10;
      this.type = options.type || 'redis';
      this.level = options.level || 'error';
      this.viewMore =  options.viewMore || true;
      this.repo = options.repo;
    },

    url: function () {
      console.log("ContactCollection - url");
      var url = "http://142.204.133.138:3000/logs/" + this.type + "/" + this.level + "/" + this.start + "/" + this.rows;
      console.log("url: ", url);
      return url;
    },

    fetch: function () {
      console.log("ContactCollection - fetch");
      if (this.start === 1) {
        console.log("--- fecthing for the first time");
        var options = {
          success: function (model, response) {
          },
          // update: true,
          // remove: false,
          // merge: false
        };
      } else {
        console.log("--- logs were already fecthing, this time just  updatind")
        var options = {
          success: function (model, response) {
          },
          update: true,
          remove: false,
          merge: false
        };
      }

      return Backbone.Collection.prototype.fetch.call(this, options);
    },

    parse: function (response) {
      console.log("****ContactCollection - parse");
      console.log("response.length: ", response.length);
      console.log("this.rows: ", this.rows);
      console.log("this.start: ", this.start);

      if (response.length < this.rows - this.start) {
        // Trigger signal to hide viewMore button
        this.viewMore = false;
        // this.trigger("change:viewMoreBtn");
        console.log("----****trigerring toggle:view more event");
        // App.vent.trigger("toggle:viewmore", true);
        this.repo.toggleIsFull(true);
        // Marionette.triggerMethod.call(App.ContactsApp.controller, "toggle:viewmore", this.level, false);

      }

      // Increment logs range
      this.start += response.length;
      this.rows += response.length;
      console.log("response: ", response);
      return response;
    },

    viewMoreStatus: function () {
      console.log("ContactCollection - viewMoreStatus");
      return this.viewMore;
    }
  });

  // Contacts Repository
  // -------------------

  Contacts.Repository = Marionette.Controller.extend({

    initialize: function (options) {
      console.log("Contacts.Repository - initialize");
      this.options = options;
      this.options.repo = this;
      this._isFull = false;
      this.contactCollection = new ContactCollection(this.options);
      // console.log("options: ", options);
    },

    getAll: function(){
      console.log("Contacts.Repository - getAll");
      console.log("this.contactCollection: ", this.contactCollection);
      // var deferred = $.Deferred();

      // this._getContacts(function(contacts){
      //   console.log("Contacts.Repository - _getContacts callback");
      //   console.log("contacts: ", contacts);
      //   deferred.resolve(contacts);
      // });

      // return deferred.promise();
      return this.contactCollection;
    },

    _getContacts: function(callback){
      console.log("Contacts.Repository - _getContacts");
      this.contactCollection.on("reset", callback);
    },

    showMore: function () {
      console.log("Contacts.Repository - showMore");

      console.log("fecthing collection...");
      this.contactCollection.fetch();
    },

    toggleIsFull: function (flag) {
      console.log("Contatcs.Repository - toggleIsFull");
      console.log("flag: ", flag);
      this._isFull = flag;
    },

    loadData: function () {
      console.log("Contacts.Repository - loadData");
      this.contactCollection.fetch();
    },

    isFull: function () {
      console.log("Contacts.Repository - isFull");
      return this._isFull;
    }

  });
});
