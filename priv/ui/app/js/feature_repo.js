var jquery = require('jquery');
var Feature = require("./models/feature");

var URL = "admin/api/features";

var FeatureRepo = {};

FeatureRepo.fetchFeatures = function(onSuccess, onError){
  var featureModelBuilder = function(featureData){
    var featureModelData = featureData.map(function(feature){
      feature.isNew = false;
      return new Feature(feature);
    });
    onSuccess(featureModelData);
  };

  jquery.ajax({
    url: URL,
    dataType: 'json',
    success: featureModelBuilder,
    error: onError || function(xhr, status, err) {
      console.error(status, err);
    }
  });
};

FeatureRepo.saveFeature = function(feature, onSuccess, onError){
  jquery.ajax({
    url: URL + "/" + feature.id,
    contentType: 'application/json',
    type: 'PUT',
    data: JSON.stringify(feature),
    dataType: "text", // because JQuery doesn't like 201 response with empty body (it tries to JSON parse it). "text" stops it blowing up
    success: onSuccess,
    error: onError || function(xhr, status, err) {
      console.error("something barfed saving feature", xhr, status, err);
    }
  });
}

FeatureRepo.deleteFeature = function(feature, onSuccess, onError){
  jquery.ajax({
    url: URL + "/" + feature.id,
    type: 'DELETE',
    success: onSuccess,
    error: onError || function(xhr, status, err) {
      console.error(status, err);
    }
  })
}

module.exports = FeatureRepo;
