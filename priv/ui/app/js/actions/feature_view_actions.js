var IodizedDispatcher = require("../dispatcher/iodized_dispatcher.js");
var FeatureConstants = require("../constants/feature_constants.js");
var Feature = require("../models/feature.js");
var FeatureRepo = require("../feature_repo.js");

module.exports = {
  newFeature: function() {
    IodizedDispatcher.handleViewAction({
      actionType: FeatureConstants.NEW,
      feature: new Feature()
    });
  },

  editFeature: function(feature) {
    IodizedDispatcher.handleViewAction({
      actionType: FeatureConstants.EDIT,
      feature: feature
    });
  },

  cancelEditFeature: function(feature) {
    IodizedDispatcher.handleViewAction({
      actionType: FeatureConstants.EDIT_CANCEL,
      feature: feature
    });
  },

  saveFeature: function(feature) {
    FeatureRepo.saveFeature(feature,
                            function(){ FeatureServerActions.savedOK(feature); },
                            function(){ FeatureServerActions.savedError(feature); });

    var isNew = feature.isNew;
    feature = feature.set("isNew", false);

    var actionType;
    if (isNew) {
      actionType = FeatureConstants.CREATE
    } else {
      actionType = FeatureConstants.UPDATE
    }

    IodizedDispatcher.handleViewAction({
      actionType: actionType,
      feature: feature
    });
  }
};
