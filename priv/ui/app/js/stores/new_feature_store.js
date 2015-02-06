var IodizedDispatcher = require('../dispatcher/iodized_dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var FeatureConstants = require('../constants/feature_constants');
var merge = require('react/lib/merge');
var Immutable = require("immutable");

var CHANGE_EVENT = 'change';

var _newFeature = null;

function pushEdit(feature) {
  _newFeature = feature;
}

function cancel() {
  _newFeature = null;
}

var NewFeatureStore = merge(EventEmitter.prototype, {

  getNewFeature: function() {
    return _newFeature;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

IodizedDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case FeatureConstants.NEW:
      pushEdit(action.feature);
      break;

    case FeatureConstants.EDIT:
      var feature = action.feature;
      if (feature.isNew) {
        pushEdit(feature);
      }
      break;

    case FeatureConstants.CANCEL_EDIT:
      var feature = action.feature;
      if (feature.isNew) {
        cancel();
      }
      break;

    case FeatureConstants.CREATE:
      cancel();
      break;

    default:
      return true;
  }

  NewFeatureStore.emitChange();

  return true;
});

module.exports = NewFeatureStore;
