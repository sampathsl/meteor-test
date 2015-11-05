Hopes = new Mongo.Collection("hopes");

if (Meteor.isClient) {

  Template.body.helpers({
    hopes : function () {
      if(SessionAmplify.get('hideHopes')){
        return Hopes.find({checked : { $ne : true}});
      }
      return Hopes.find();
    },
    hideHopes : function () {
      return SessionAmplify.get("hideHopes");
    }
  });

  //body events
  Template.body.events({
    'click .my-form-hope' : function(event){
      var txtHope = document.getElementById('txthope');
      if(txtHope && txtHope.value != ""){
        //remove the client side data insert part
        /*Hopes.insert({
          hope : txtHope.value,
          created : new Date()
        });*/
        Meteor.call("addHope",txtHope.value);
      }
      document.getElementById('txthope').value = "";
      return false;
    },
    'change .hide-hopes input': function (event) {
      SessionAmplify.set("hideHopes", event.target.checked);
    }
  });

  //tempHope events
  Template.tempHope.events({
    'click .btn-del-hope' : function(){
      //remove the client side data delete part
      //Hopes.remove(this._id);
      Meteor.call("deleteHope",this._id);
    },
    'click .checkb-hope' : function(){
      //remove the client side data update part
      //Hopes.update(this._id,{$set : { checked : !this.checked }});
      Meteor.call("updateHope",this._id,this.checked);
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

//specifically tell meteor what are the things need to done
Meteor.methods({
  addHope : function(hope_){
    Hopes.insert({
      hope : hope_,
      created : new Date()
    });
  },
  updateHope : function(_id,isChecked){
    Hopes.update(_id,{$set : { checked : !isChecked }});
  },
  deleteHope : function(_id){
    Hopes.remove(_id);
  }
});
