'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  
  .controller('YodadoCtrl', ['$scope', '$dialog', '$http', '$timeout', function($scope, $dialog, $http, $timeout) {

    $scope.get_features = function () {
      $http({
        method: 'GET'
        ,url: 'http://localhost:8080/admin/api/features'
      })
      .success(function(data, status) {
        $scope.features = compute_view(data);
        $scope.show_alert('success');
      })
      .error(function(data, status) {
        $scope.show_alert('error');
      });
    }

    $scope.put_features = function() {
      var payload = JSON.stringify($scope.features);

      // nuke view specific crap
      payload = payload.replace(/,"\$\$hashKey":"[0-9A-Z]+"/gi, '');
      payload = payload.replace(/,"view":\{.*?\}/gi, '');
      payload = payload.replace(/[,]*"id":[0-9]+/gi, '');
      payload = payload.replace(/\{"param_name":null,"operand":(.*?),"value":null\}/gi, '');

      // let yodado know
      $http({
        method: 'PUT'
        ,url: 'http://localhost:8080/admin/api/features'
        ,data: payload
        ,headers: {'Content-Type': 'application/json'}
      })
      .success(function(data, status) {
        $scope.remove_alert();
        $scope.show_alert('success');
      })
      .error(function(data, status) {
        $scope.remove_alert();
        $scope.show_alert('error');
      });
    };

    $scope.remove_alert = function() {
      $scope.error = false;
      $scope.success = false;
    }

    $scope.show_alert = function(alert) {
      switch(alert) {
        case 'success':
          $scope.success = true;
        break;
        case 'error':
          $scope.error = true;
        break
      }

      $timeout(function() {
        $scope.remove_alert();
      }, 3000);
    };

    $scope.edit_feature = function(feature) {
      var feature_to_edit = feature;
      
      $dialog.dialog(
        angular.extend(
          { 
            controller: 'EditCtrl'
            ,templateUrl: 'partials/edit.html'
            ,dialogClass: 'modal modal-huge' 
          }, 
          { resolve: { feature: function() { return angular.copy(feature_to_edit) } } }
        )
      )
      .open()
      .then(function(result) {
        if(result) {
          if(feature_to_edit) {
            angular.copy(result, feature_to_edit);
          }
          else {
            $scope.features[$scope.features.length] = result;
            compute_view($scope.features);
          }
        $scope.put_features();
        }

        feature_to_edit = undefined;
      });
    };

    $scope.delete_feature = function(feature) {
      var title = 'Delete ' + feature.title + ', this will!';
      var msg = 'Sure are you, hmm? Hmmmmmm.';
      var btns = [{result:'cancel', label: 'Cancel'}, {result:'delete', label: 'Delete', cssClass: 'btn-primary'}];

      $dialog.messageBox(title, msg, btns)
      .open()
      .then(function(result){
        if(result == 'delete') {
          for(var i in $scope.features) {
            if($scope.features[i].title == feature.title) {
              $scope.features.splice(i, 1);
            }
          }
        }

        $scope.put_features();
      });
    };

    $scope.toggle_master_state = function(feature, state) {
      var master_state = 'logic'
      if(state == true) {
        master_state = 'on';
      }
      else if(state == false) {
        master_state = 'off'
      }
      
      feature.view.master_state = master_state.toUpperCase();
      feature.view.indicator = 'indicator-' + master_state;
      feature.master_switch_state = state;

      $scope.put_features();
    };

    $scope.quote = yoda_quotes[Math.floor((Math.random()*yoda_quotes.length)+1)];
    $scope.features = [];
  }])


  .controller('EditCtrl', ['$scope', 'feature', 'dialog', function($scope, feature, dialog) {
    $scope.feature = feature;
    
    // if we're creating a new feature, set it up
    if(typeof $scope.feature == 'undefined') {
      $scope.feature = {
         title                : undefined
        ,description          : undefined
        ,master_switch_state  : false
        ,definition           : undefined
      };
    }
    if(typeof $scope.feature.definition == 'undefined') {
      $scope.feature.definition = { 
        operand: "any", conditions: [
          { param_name: null, operand: null, value: null }
        ]
      };
      add_id_to_condition($scope.feature.definition);
    }

    each_condition(
      $scope.feature.definition,
      convert_array_to_csv
    );

    $scope.container_operands = ['any', 'all'];
    $scope.all_operands = ['is', 'included_in', 'within', 'any', 'all'];

    $scope.params = fetch_params();

    $scope.has_no_conditions = function() {
      return !conditions_specified_for($scope.feature.definition);
    };

    $scope.condition_is_a_container = function(condition) {
      if(
        (condition.operand == 'any' || condition.operand== 'all') && 
        (condition.conditions != undefined && condition.conditions.length > 0)
      ) {
        return true;
      }
      return false;
    }

    $scope.condition_is_not_a_container = function(condition) {
      return !$scope.condition_is_a_container(condition);
    }
    
    $scope.save = function() {
      each_condition(
        $scope.feature.definition,
        copy_new_params_to_params,
        $scope.params
      );
      each_condition(
        $scope.feature.definition,
        convert_csv_to_array
      );
      dialog.close($scope.feature);
    };

    $scope.close = function() {
      dialog.close(undefined);
    };

    $scope.new_condition = function(clicked_condition) {
      add_condition_to_feature(clicked_condition, $scope.feature.definition);
    };

    $scope.delete_condition = function(clicked_condition) {
      each_condition(
        $scope.feature.definition, 
        remove_condition_from_feature, 
        clicked_condition
      );
    };
  }]);