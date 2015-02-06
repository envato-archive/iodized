var IodizedDispatcher = require('../dispatcher/iodized_dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var FeatureConstants = require('../constants/feature_constants');
var merge = require('react/lib/merge');
var Immutable = require("immutable");

var CHANGE_EVENT = 'change';

var _features = Immutable.Map();

function pushEdit(feature) {
  _features = _features.updateIn([feature.id], Immutable.Stack(), function(featureStack) {
    return featureStack.push(feature);
  });
}

function setFeature(feature) {
  _features = _features.set(feature.id, Immutable.Stack([feature]));
}

function receiveFeatures(features) {
  _features = Immutable.Map();
  features.forEach(function(feature) {
    setFeature(feature);
  });
}

var FeatureStore = merge(EventEmitter.prototype, {

  getAll: function() {
    return _features.toKeyedSeq().
      map(function(featureStack){
        return featureStack.peek();
      }).
      sortBy(function(feature){
        return feature.title;
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
    case FeatureConstants.FETCH_FEATURES:
      receiveFeatures(action.features);
      break;

    case FeatureConstants.CREATE:
      setFeature(action.feature);

    default:
      return true;
  }

  FeatureStore.emitChange();

  return true;
});

module.exports = FeatureStore;
