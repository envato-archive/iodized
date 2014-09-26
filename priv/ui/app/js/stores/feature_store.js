var IodizedDispatcher = require('../dispatcher/iodized_dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var FeatureConstants = require('../constants/feature_constants');
var merge = require('react/lib/merge');
var FeatureRepo = requrei('../feature_repo.js');

var CHANGE_EVENT = 'change';

var _features = {};

function create(feature) {
  update(feature) // same thing under the hood for now
}

function update(feature) {
  _features[feature.id] = feature;
}

function destroy(feature.id) {
  delete _features[feature.id];
}

var FeatureStore = merge(EventEmitter.prototype, {


  getAll: function() {
    return _features.sort(function(f1, f2) {
      return f1.title > f2.title;
    });
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
    case FeatureConstants.FEATURE_CREATE:
      create(action.feature);
      break;

    case FeatureConstants.FEATURE_UPDATE:
      update(action.feature);
      break;

    case FeatureConstants.FEATURE_DESTROY:
      destroy(action.feature);
      break;

    default:
      return true;
  }

  FeatureStore.emitChange();

  return true;
});

module.exports = FeatureStore;
