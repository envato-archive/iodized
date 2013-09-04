'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('YodadoCtrl', ['$scope', '$dialog', function($scope, $dialog) {
    $scope.view_state = {
      "new_visible" : false
    };

    $scope.features = [
      {
         "title"                : "droids_were_looking_for"
        ,"description"          : "You can go about your business. Move along"
        ,"state"                : true
        ,"master_switch_state"  : true
        ,"view" : {
          "master_switch" : "ON"
        }
      }
      ,{
         "title"                : "engage_hyper_drive"
        ,"description"          : "If I may say so, sir, I noticed earlier the hyperdrive motivator has been damaged. It's impossible to go to lightspeed"
        ,"state"                : false
        ,"master_switch_state"  : false
        ,"conditions"           : []
        ,"view" : {
          "master_switch" : "LOGIC"
        }
      }
      ,{
         "title"                : "open_the_blast_doors"
        ,"description"          : "Close the blast doors! Open the blast doors! Open the blast doors!"
        ,"state"                : false
        ,"master_switch_state"  : false
        ,"view" : {
          "master_switch" : "OFF"
        }
      }
    ];

    $scope.edit_feature = function(feature) {
      var feature_to_edit = feature;

      // begin black magic
      $dialog.dialog(
        angular.extend(
          { controller: 'EditCtrl', templateUrl: 'partials/edit.html' }, 
          { resolve: { feature: function() { return angular.copy(feature_to_edit) } } }
        )
      )
      .open()
      .then(function(result) {
        if(result) {
          angular.copy(result, feature_to_edit);
        }
        feature_to_edit = undefined;
      });
    };

    $scope.indicator_for = function(feature) {
      switch(feature.view.master_switch) {
        case "ON":
          return "indicator-on";
        break;
        case "LOGIC":
          return "indicator-logic";
        break;
        case "OFF":
          return "indicator-off";
        break;
      }
    };
  }])
  .controller('EditCtrl', ['$scope', 'feature', 'dialog', function($scope, feature, dialog) {
    $scope.feature = feature;
    $scope.any_all = 'any';

    $scope.comparisons = ['is', 'contains', 'any', 'all'];

    $scope.params = [
      "host_name"
      ,"session_id"
      ,"client_id"
    ];

    
    $scope.save = function() {
      dialog.close($scope.feature);
    };

    $scope.close = function() {
      dialog.close(undefined);
    };
  }]);