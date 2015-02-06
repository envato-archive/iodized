var Dispatcher = require('flux').Dispatcher;
var copyProperties = require('react/lib/copyProperties');
var IodizedDispatcher = copyProperties(new Dispatcher(), {

  handleViewAction: function(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  },

  handleServerAction: function(action) {
    this.dispatch({
      source: 'SERVER_ACTION',
      action: action
    });
  }

});

module.exports = IodizedDispatcher;
