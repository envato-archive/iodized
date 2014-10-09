var IodizedDispatcher = require("../dispatcher/iodized_dispatcher.js");
var EventEmitter = require("events").EventEmitter;
var FeatureConstants = require("../constants/feature_constants");
var merge = require("react/lib/merge");

var Feature = require("../models/feature.js");

var CHANGE_EVENT = "change";

var _newFeature = new Feature();

function edit(feature) {
  _newFeature = feature;
}

function stopEditing(feature) {
  _newFeature = new Feature();
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
    case FeatureConstants.FEATURE_NEW_EDIT:
      edit(action.feature);
      break;

    case FeatureConstants.FEATURE_NEW_EDIT_CANCEL:
      stopEditing(action.feature);
      break;

    default:
      return true;
  }

  NewFeatureStore.emitChange();

  return true;
});

module.exports = NewFeatureStore;
