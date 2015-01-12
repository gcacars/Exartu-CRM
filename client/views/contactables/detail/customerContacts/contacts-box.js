
var ContactablesHandler;
Template.contactableContactsBox.created = function () {

  if (!SubscriptionHandlers.ContactablesHandler){
    SubscriptionHandlers.ContactablesHandler = Meteor.paginatedSubscribe('contactables',{ filter: { 'Contact.customer': this.data._id  } });
  }else{
    SubscriptionHandlers.ContactablesHandler.setFilter({ filter: { 'Contact.customer': this.data._id  } });
  }
  ContactablesHandler = SubscriptionHandlers.ContactablesHandler;
};

Template.contactableContactsBox.helpers({
  hasContacts: function () {
    return _.isObject(this.Customer);
  },

  contacts: function () {
    return Contactables.find({'Contact.customer': this._id});
  }
});

Template.contactableContactsBox.events = {
  'click .addContact': function () {
    Session.set('options', {Contact: {customer: Session.get('entityId')}});
    Router.go('/contactableAdd/Contact');

  }
};