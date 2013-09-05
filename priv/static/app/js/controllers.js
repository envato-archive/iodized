'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  
  .controller('YodadoCtrl', ['$scope', '$dialog', '$http', function($scope, $dialog, $http) {
    $scope.sync = function() {
      var payload = JSON.stringify($scope.features.concat($scope.features));
      
      // nuke view specific crap
      payload = payload.replace(/,"\$\$hashKey":"[0-9A-Z]+"/gi, '');
      payload = payload.replace(/,"view":\{.*?\}/gi, '');
      payload = payload.replace(/,"id":[0-9]+/gi, '');
      
      $http({
        method: 'POST'
        ,url: 'http://localhost:4567/json'
        ,data: 'json=' + payload
        ,headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        //method: 'PUT'
        //,url: 'http://localhost:8080/admin/api/feature/i_like_cheese'
        //,data: payload
        //,headers: {'Content-Type': 'application/json'}
      })
      .success(function(data, status) {
        $scope.features = compute_view(data);
      });
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
            $scope.features[$scope.features.length] = compute_view_for(result);
          }
        }
        feature_to_edit = undefined;
      });
    };

    $scope.delete_feature = function(feature) {
      var title = 'Delete ' + feature.title + ' this will!';
      var msg = 'Sure you are?';
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
      });
    };

    $scope.toggle_master_state = function(feature, state) {
      var master_state = (state == 'on' ? true : false)
      
      feature.view.master_state = state.toUpperCase();
      feature.view.indicator = 'indicator-'+state;
      feature.master_switch_state = master_state;
    };

    $scope.quote = yoda_quotes[Math.floor((Math.random()*yoda_quotes.length)+1)];

    $scope.features = compute_view([
      {
         title                : "droids_were_looking_for"
        ,description          : "You can go about your business. Move along"
        ,master_switch_state  : true
      }
      ,{
         title                : "engage_hyper_drive"
        ,description          : "If I may say so, sir, I noticed earlier the hyperdrive motivator has been damaged. It's impossible to go to lightspeed"
        ,master_switch_state  : null
        ,conditions           : { 
          operand: "any", conditions: [
            { operand: "all", conditions: [
                { param: "host_name", operand: "is", value: "death star"},
                { param: "username", operand: "is", value: "darth vader"}
              ]
            },
            { operand: "all", conditions: [
                { param: "username", operand: "included_in", value: "luke, obi wan, yoda" },
                { param: "user_role", operand: "is", value: "jedi" }
              ]
            }
          ]
        }
      }
      ,{
         title                : "open_the_blast_doors"
        ,description          : "Close the blast doors! Open the blast doors! Open the blast doors!"
        ,master_switch_state  : false
      }
    ]);
  }])


  .controller('EditCtrl', ['$scope', 'feature', 'dialog', function($scope, feature, dialog) {
    $scope.feature = feature;
    
    // if we're creating a new feature, set it up
    if(typeof $scope.feature == 'undefined') {
      $scope.feature = {
         title                : undefined
        ,description          : undefined
        ,master_switch_state  : false
      };
    }
    if(typeof $scope.feature.conditions == 'undefined') {
      $scope.feature.conditions = { 
        operand: "any", conditions: [
          { param: null, operand: null, value: null }
        ]
      };
      add_id_to_condition($scope.feature.conditions);
    }

    $scope.container_operands = ['any', 'all'];
    $scope.all_operands = ['is', 'included_in', 'any', 'all'];

    $scope.params = fetch_params();

    $scope.has_no_conditions = function() {
      return !conditions_specified_for($scope.feature.conditions);
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
      copy_new_params_to_params($scope.feature.conditions, $scope.params);
      dialog.close($scope.feature);
    };

    $scope.close = function() {
      dialog.close(undefined);
    };

    $scope.new_condition = function(clicked_condition) {
      add_condition_to_feature(clicked_condition, $scope.feature.conditions);
    };

    $scope.delete_condition = function(clicked_condition) {
      remove_condition_from_feature(clicked_condition, $scope.feature.conditions);
    };
  }]);