var IodizedDispatcher = require("../dispatcher/iodized_dispatcher.js");
var EventEmitter = require("events").EventEmitter;
var ServerConstants = require("../constants/server_constants.js");
var merge = require("react/lib/merge");

var CHANGE_EVENT = "change";

var _errors = []

function addError(error) {
  _errors = _errors.concat([error]);
}

var ErrorStore = merge(EventEmitter.prototype, {
  getErrors: function() {
    return _errors;
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
    case ServerConstants.ERROR:
      addError(action.error);
      break;

    default:
      return true;
  }

  ErrorStore.emitChange();

  return true;
});

module.exports = ErrorStore;
