var jquery = require('jquery')
var FeatureRepo = function(url){
  this.url = url;
};

FeatureRepo.prototype.fetchFeatures = function(onSuccess, onError){
  jquery.ajax({
    url: this.url,
    dataType: 'json',
    success: onSuccess,
    error: onError || function(xhr, status, err) {
      console.log(status, err);
    }
  });
};

FeatureRepo.prototype.createFeature = function(feature, onSuccess, onError){
  jquery.ajax({
    url: this.url,
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify(feature),
    success: onSuccess,
    error: onError || function(xhr, status, err) {
      console.log(status, err);
    }
  });
}

FeatureRepo.prototype.updateFeature = function(feature, onSuccess, onError){
  jquery.ajax({
    url: this.url + "/" + feature.id,
    contentType: 'application/json',
    type: 'PUT',
    data: JSON.stringify(feature),
    error: onError || function(xhr, status, err) {
    success: onSuccess,
      console.log(status, err);
    }
  });
}

FeatureRepo.prototype.deleteFeature = function(feature, onSuccess, onError){
  jquery.ajax({
    url: this.url + "/" + feature.id,
    type: 'DELETE',
    success: onSuccess,
    error: onError || function(xhr, status, err) {
      console.log(status, err);
    }
  })
}

module.exports = FeatureRepo;
