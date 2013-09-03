'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('ViewCtrl', ['$scope', function(sc) {
    sc.features = [
      {
         "title"                : "droids_were_looking_for"
        ,"description"          : "You can go about your business. Move along"
        ,"state"                : true
        ,"master_switch_state"  : true
      }
      ,{
         "title"                : "engage_hyper_drive"
        ,"description"          : "If I may say so, sir, I noticed earlier the hyperdrive motivator has been damaged. It's impossible to go to lightspeed"
        ,"state"                : true
        ,"master_switch_state"  : false
      }
      ,{
         "title"                : "open_the_blast_doors"
        ,"description"          : "Close the blast doors! Open the blast doors! Open the blast doors!"
        ,"state"                : false
        ,"master_switch_state"  : true
      }
    ];
  }])
  .controller('NewCtrl', [function() {

  }])
  .controller('EditCtrl', [function() {

  }]);