var IodizedDispatcher = require('../dispatcher/iodized_dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var FeatureConstants = require('../constants/feature_constants');
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var _editingFeatures = {};

function edit(feature) {
  _editingFeatures[feature.id] = feature;
}

function stopEditing(feature) {
  delete _editingFeatures[feature.id];
}

function toggleEditingFeature(feature) {
  if (_editingFeatures[feature.id]) {
    _editingFeatures[feature.id].toggle(feature.master_state);
  }
};

var EditingFeatureStore = merge(EventEmitter.prototype, {

  getFeature: function(id) {
    return _editingFeatures[id];
  },

  isFeatureIdBeingEdited: function(id) {
    return getFeature(id) !== undefined;
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
    case FeatureConstants.FEATURE_EDIT:
      edit(action.feature);
      break;

    case FeatureConstants.FEATURE_EDIT_STOP:
      stopEditing(action.feature);
      break;

    case FeatureConstants.FEATURE_TOGGLE:
      toggleEditingFeature(action.feature);
      break;

    default:
      return true;
  }

  EditingFeatureStore.emitChange();

  return true;
});

module.exports = EditingFeatureStore;
