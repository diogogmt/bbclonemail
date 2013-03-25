console.log("NodesApp.js");
BBCloneMail.module("NodesApp", function(NodesApp, App){
  "use strict";
 
  // Contact List Views
  // ------------------

  NodesApp.NodeView = Marionette.ItemView.extend({
    template: "#node-item-template",
    tagName: "li"
  });

  NodesApp.NodeListView = Marionette.CollectionView.extend({
    itemView: NodesApp.NodeView,
    tagName: "ul",
    id: "contact-list",
    className: "contact-list"
  });
  

  NodesApp.NavView = Marionette.ItemView.extend({
    // template: "#contact-categories-view-template"
    template: "#node-nav-template",

    events: {
      // "click .log-level-btn": "showLogs"
      // "click button": "showLogs"
      'click .deleteBtn':  'deleteDaemon',
      'click #addDaemon': 'createDaemon',
    },

    deleteDaemon: function (e) {
      console.log("NodesApp.NavView - deleteDaemon");
      var ip = $(e.currentTarget).data("ip");
      console.log("ip: ", ip);
      Marionette.triggerMethod.call(NodesApp.controller, "node:delete", ip);
      // daemon.destroy({success: function(model, response) {
      //   app.Daemons.remove(daemon);
      // }});
      // consloe.log("e: ", e);
    },

    createDaemon: function (e) {
      console.log("NodesApp.NavView - createDaemon");
      var ip = $("#newDaemon").val();
      console.log("ip: ", ip);
      Marionette.triggerMethod.call(NodesApp.controller, "node:create", ip);
    },

    // showLogs: function(e){
    //   console.log("ContactsApp.Category.ItemView - showLogs");
    //   e.preventDefault();

    //   var logLevel = $(e.currentTarget).data("level");
    //   this.trigger("logLevel:changed", logLevel);
    // }
  });

  // Contact App Controller
  // -----------------------

  NodesApp.Controller = App.AppController.extend({
    initialize: function(options){
      console.log("NodesApp.Controller - initialize");
      this.repo = options.repo;
      var that = this;

      $('input[id=file]').change(function() {
        $('#pretty-input').val($(this).val().replace("C:\\fakepath\\", ""));
      });

    },

    bindAjaxUploadForm: function () {
      console.log("NodesApp.Controller - bindAjaxUploadForm");
      var that = this;
      $("#hostManagementForm").ajaxForm({
        url: "http://142.204.133.138:3000/daemons/upload",
        type: "POST",
        dataType: "json",
        clearForm: true,
        beforeSubmit: function (formData, jqForm, options) {
          console.log("beforeSubmit");
          // formData is an array of objects containing the values of the form
          // jqForm is the html form element
          // options are the object initialized with ajaxForm
          // maybe validate the for before submiting
          // if form is not valid return false
          console.log("formData: ", formData);
          console.log("jqForm: ", jqForm);
          console.log("options: ", options);
          return true;;
        },
        success: function (data) {
          console.log("ajaxform success");
          console.log("data: ", data);

          var data = data.data;
          var dataLen = data && data.length || 0;
          console.log("dataLen: ", dataLen);
          for (var i = 0; i < dataLen; i++) {
            var obj = data[i];
            console.log("obj: ", obj);
            if (obj.err) {
              console.log("Failed to add host " + obj.ip, 'An error occured.');
            } else {
              console.log("Add host " + obj.ip, 'Action completed.');
            }
          }
          console.log("showing nodes");
          that.showNodes();
        },
        error: function () {
          console.log("ajaxform error");
        },
        complete: function () {
          console.log("ajaxform complete");
        }
      });
    },

    onShow: function(){
      console.log("NodesApp.Controller - onShow");
      this._showNavRegion();
    },

    onNodeCreate: function(ip){
      console.log("NodesApp.Controller - onNodeCreate");
      console.log("creating new node");
      this.repo.createNode(ip);
    },

    onNodeDelete: function(ip){
      console.log("NodesApp.Controller - onNodeDelete");
      console.log("deleting node from repo");
      this.repo.deleteNode(ip);
    },

    _showNavRegion: function(){
      console.log("NodesApp.Controller - _showNavRegions");
      var categoryNav = new NodesApp.NavView();
      console.log("---- this.mainNavRegion: ", this.mainNavRegion);
      this.mainNavRegion.show(categoryNav);
      // this.listenTo(categoryNav, "logLevel:changed", this._changeLogLevel);

      console.log("---- this.mainNavRegion: ", this.mainNavRegion);
      this.bindAjaxUploadForm();
    },

    onNodesShow: function(){
      console.log("NodesApp.Controller - onNodesShow");
      this.showNodes;
    },

    showNodes: function(){
      console.log("NodesApp.Controller - showNodes");
      var that = this;
      

      $.when(this.repo.getAll()).then(function(nodes){
        console.log("when callback");
        var view = new NodesApp.NodeListView({
          collection: nodes
        });

        console.log("view: ", view);
        console.log("showing view on mainRegion")
        that.mainRegion.show(view);
        // that.mainRegion.open(view);

        Backbone.history.navigate("nodes");
      });
    },

  });

  // Initializers and Finalizers
  // ---------------------------

  NodesApp.addInitializer(function(args){
    console.log("NodesApp.addInitializer");
    console.log("args: ", args);

    console.log("creating ContactsApp.Contacts.Repository")
    var repo = new NodesApp.Nodes.Repository();

    console.log("creating NodesApp.Controller");
    NodesApp.controller = new NodesApp.Controller({
      mainRegion: args.mainRegion,
      mainNavRegion: args.mainNavRegion,
      mainFooterRegion: args.mainFooterRegion,
      navRegion: args.navRegion,
      appSelectorRegion: args.appSelectorRegion,
      repo: repo
    });

    console.log("show() NodesApp.controller");
    NodesApp.controller.show();
    console.log("triggering app:started event for contacts module");
    App.vent.trigger("app:started", "nodes");
  });

  NodesApp.addFinalizer(function(){
    console.log("NodesApp.addFinalizer");
    if (NodesApp.controller){
      console.log("---- closing regions");
      App._regionManager._regions.main.close();
      App._regionManager._regions.mainNav.close();
      App._regionManager._regions.mainFooter.close();
      console.log("---- NodesApp.controller.close")
      NodesApp.controller.close();
      console.log("---- delete NodesApp.controller")
      delete NodesApp.controller;
    }
  });

});
