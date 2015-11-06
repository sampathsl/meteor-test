Ideas = new Mongo.Collection("ideas");

if (Meteor.isServer) {

  Meteor.startup(function(){
    //code to run server at startup
  });

  //meteor remove autopublish
  //publish idea data
  Meteor.publish("ideas",function(){
    return Ideas.find();
  });

}

if (Meteor.isClient) {

  //subscribe from published ideas
  Meteor.subscribe("ideas");

  Template.body.helpers({
    ideas : function () {
      if(SessionAmplify.get('hideIdeas')){
        return Ideas.find({checked : { $ne : true}});
      }
      return Ideas.find();
    },
    hideIdeas : function () {
      return SessionAmplify.get("hideIdeas");
    }
  });

  //body events
  Template.body.events({
    'click .my-form-idea' : function(event){
      var txtIdea = document.getElementById('txtidea');
      if(txtIdea && txtIdea.value != ""){
        //remove the client side data insert part
        /*Ideas.insert({
          hope : txtIdea.value,
          created : new Date()
        });*/
        Meteor.call("addIdea",txtIdea.value);
      }
      document.getElementById('txtidea').value = "";
      return false;
    },
    'change .hide-ideas input': function (event) {
      SessionAmplify.set("hideIdeas", event.target.checked);
    }
  });

  //tempHope events
  Template.tempIdea.events({

    'click .btn-del-idea' : function(){
      //remove the client side data delete part
      //Ideas.remove(this._id);
      Meteor.call("deleteIdea",this._id);
    },
    'click .checkb-idea' : function(){
      //remove the client side data update part
      //Ideas.update(this._id,{$set : { checked : !this.checked }});
      Meteor.call("updateIdea",this._id,this.checked);
    }

  });

  //meteor add amplify
  //Sesssion override by amplify - ISSUE : due to page refresh reset session values
  SessionAmplify = _.extend({}, Session, {
    keys: _.object(_.map(amplify.store(), function(value, key) {
      return [key, JSON.stringify(value)]
    })),
    set: function (key, value) {
      Session.set.apply(this, arguments);
      amplify.store(key, value);
    }
  });

  //meteor add accounts-password accounts-ui
  Accounts.ui.config({
    passwordSignupFields : "USERNAME_ONLY"
  });
  
}

//meteor remove unsecure
//specifically tell meteor what are the things need to done
Meteor.methods({

  addIdea : function(idea_){
    Ideas.insert({
      idea : idea_,
      created : new Date()
    });
  },
  updateIdea : function(_id,isChecked){
    Ideas.update(_id,{$set : { checked : !isChecked }});
  },
  deleteIdea : function(_id){
    Ideas.remove(_id);
  }

});
