var IodizedDispatcher = require("../dispatcher/iodized_dispatcher.js");
var FeatureRepo = require("../feature_repo.js");
var FeatureConstants = require("../constants/feature_constants.js");

function receiveFeatures(features) {
  IodizedDispatcher.handleServerAction({});
}

FeatureServerActions = {};

FeatureServerActions.fetchFeatures = function() {
  FeatureRepo.fetchFeatures(function(features) {
    IodizedDispatcher.handleServerAction({
      actionType: FeatureConstants.FETCH_FEATURES,
      features: features
    });
  });
}

FeatureServerActions.savedOK = function(feature) {
  IodizedDispatcher.handleServerAction({
    actionType: FeatureConstants.SAVED_OK,
    feature: feature
  });
}

module.exports = FeatureServerActions;
