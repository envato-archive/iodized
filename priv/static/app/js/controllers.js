'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('YodadoCtrl', ['$scope', function(sc) {
    sc.view_state = {
      "new_visible" : false
    };

    sc.features = [
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

    sc.new_feature=function() {
      sc.view_state.new_visible = !sc.view_state.new_visible;
    };

    sc.indicator_for=function(feature) {
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
  }]);