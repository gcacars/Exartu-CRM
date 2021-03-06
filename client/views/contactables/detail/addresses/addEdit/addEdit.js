LocationSchema = new SimpleSchema({
    _id: {
        type: String,
        optional: true
    },
    linkId: {
        type: String,
        optional: true
    },
    addressTypeId: {
        type: String,
        optional: false
    },
    address: {
        type: String,
        label: 'Address line 1',
        optional: true
    },
    address2: {
        type: String,
        label: 'Address line 2',
        optional: true
    },
    streetNumber: {
        type: String,
        label: 'Street Number',
        optional: true
    },
    city: {
        type: String,
        label: 'City',
        optional: true
    },
    state: {
        type: String,
        label: 'State',
        optional: true
    },
    country: {
        type: String,
        label: 'Country',
        optional: true
    },
    postalCode: {
        type: String,
        label: 'Postal/Zip',
        optional: true
    }
});

var address = {
    _id: undefined,
    addressTypeId: undefined,
    linkId: undefined,
    address: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
};

var resetAddress = function () {
    address.addressTypeId = Utils.getAddressTypeDefault()._id;
    address.linkId = undefined;
    address.address = '';
    address.address2 = '';
    address.city = '';
    address.state = '';
    address.country = '';
    address.postalCode = '';
};

var addressDep = new Deps.Dependency();
var addressCreatedCallback;
var addDisabled = new ReactiveVar(false);
var formType = new ReactiveVar('insert');

AutoForm.hooks({
    addressAddEditForm: {
        onSubmit: function (insertDoc, updateDoc, currentDoc) {
            addDisabled.set(true);
            var selfautoform = this;
            //Copy properties from insert doc into current doc which has lat lng
            for (var k in insertDoc) currentDoc[k] = insertDoc[k];
            //Set the contactable id on the current doc
            currentDoc.linkId = Session.get("entityId");
            Meteor.call('addEditAddress', currentDoc, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    resetAddress();
                    selfautoform.resetForm();
                    addressCreatedCallback && addressCreatedCallback();
                }
                selfautoform.done();
                addDisabled.set(false);
            });


            return false;
        }
    }
});

Template.addressAddEdit.created = function() {
  var self = this;
  if (this.data.location){
        address = this.data.location;
  }else{
        address.addressTypeId = Utils.getAddressTypeDefault()._id;
  }
  if (self.data.location) address=self.data.location;

    addressCreatedCallback = self.data.callback;
  if(!(this.data.type === "update")) {
    resetAddress();
  }
  addressDep.changed();

};

Template.addressAddEdit.rendered = function () {

};

Template.addressAddEdit.helpers({
    address: function () {
        addressDep.depend();
        return address;
    },
    title: function() {
       if(this.type === "update"){
         var StringDire = "Update address:";
         if (this.location.address){
           StringDire = StringDire + this.location.address+", ";
         }
         if (this.location.city){
           StringDire = StringDire + this.location.city+", ";
         }
         if(this.location.country){
           StringDire = StringDire + this.location.country;
         }
         return StringDire;
       }
       else if(this.type === "insert"){
         return "New address";
       }
    },
    addDisabled: function () {
        return addDisabled.get();
    },
    searchInputOptions: function () {
        return {
            onChange: function (selectedAddress) {
                //resetAddress();
                // keep address type
                selectedAddress.addressTypeId = address.addressTypeId;
                selectedAddress._id = address._id;
                address = selectedAddress;

                addressDep.changed();

                //AutoForm.invalidateFormContext("addressAddEditForm");

            }
        };
    }
});

Template.addressAddEdit.events({
   'click .cancel-edit': function(){
       //$('#addressAddEdit-template').remove();
       Session.set( 'showLocationFormBox',  false);
       return false;
   }
});