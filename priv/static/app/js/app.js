'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/yodado', {templateUrl: 'partials/yodado.html', controller: 'YodadoCtrl'});
    $routeProvider.otherwise({redirectTo: '/yodado'});
  }]);


// utilities

var id_counter = 0;
function add_id_to_condition(condition) {
  if(condition != undefined) {
    if(condition.id == undefined) {
      condition.id = id_counter++;
    }

    for(var x in condition.conditions) {
      add_id_to_condition(condition.conditions[x]);
    }
  }
};

function conditions_specified_for(feature) {
  if(typeof feature.conditions == 'undefined') {
    return false;
  }
  return true;
};

function compute_view(features) {
  for(var i in features) {
    var view = { }

    switch(features[i].master_switch_state) {
      case true:
        view.master_switch = "ON"
        view.indicator = "indicator-on"
      break;
      case false:
        view.master_switch = "OFF"
        view.indicator = "indicator-off"
      break;
      case null:
        view.master_switch = "LOGIC"
        view.indicator = "indicator-logic"
      break;
    }

    features[i].view = view;

    add_id_to_condition(features[i].conditions);
  }
  
  return features;
};

function add_condition_to_feature(clicked_condition, current_condition) {
  // insert as child
  if(clicked_condition.operand == "any" || clicked_condition.operand== "all") {
    if(current_condition.id == clicked_condition.id) {
      add_condition(current_condition);
      return;
    }
  }
  // insert as sibling
  else {
    for(var i in current_condition.conditions) {
      if(current_condition.conditions[i].id == clicked_condition.id) {
        add_condition(current_condition);
        return;
      }
    }
  }

  //check next condition
  for(var i in current_condition.conditions) {
    add_condition_to_feature(clicked_condition, current_condition.conditions[i]);
  }
};

function add_condition(condition) {
  var new_condition = {
    param: null
    ,operand: null
    ,value: null
    ,id: id_counter++
  };

  if(condition.conditions == undefined) {
    condition.conditions = [];
  }

  condition.conditions[condition.conditions.length] = new_condition;
};

function remove_condition_from_feature(clicked_condition, current_condition) {
  for(var i in current_condition.conditions) {
    if(current_condition.conditions[i].id == clicked_condition.id) {
      current_condition.conditions.splice(i, 1);
      return;
    }
  }

  //check next condition
  for(var i in current_condition.conditions) {
    remove_condition_from_feature(clicked_condition, current_condition.conditions[i]);
  }
};

function copy_new_params_to_params(current_condition, params) {
  for(var i in current_condition.conditions) {
    if(current_condition.conditions[i].custom_param != undefined) {
      current_condition.conditions[i].param = current_condition.conditions[i].custom_param;
      params[params.length] = current_condition.conditions[i].custom_param;
      delete current_condition.conditions[i].custom_param;
    }
  }

  //check next condition
  for(var i in current_condition.conditions) {
    copy_new_params_to_params(current_condition.conditions[i], params);
  }
};

function convert_csv_to_array(current_condition) {
  for(var i in current_condition.conditions) {
    if(current_condition.conditions[i].value != undefined) {
      if(current_condition.conditions[i].value.indexOf(',') >= 0) {
        // split on ,
        current_condition.conditions[i].value = current_condition.conditions[i].value.split(',');
        for(var j in current_condition.conditions[i].value) {
          // trim whitespace
          current_condition.conditions[i].value[j] = current_condition.conditions[i].value[j].trim();
        }
      }
    }
  }

  //check next condition
  for(var i in current_condition.conditions) {
    convert_csv_to_array(current_condition.conditions[i]);
  }
};

function convert_array_to_csv(current_condition) {
  for(var i in current_condition.conditions) {
    if(current_condition.conditions[i].value instanceof Array) {
      current_condition.conditions[i].value = current_condition.conditions[i].value.join(', ');
    }
  }

  //check next condition
  for(var i in current_condition.conditions) {
    convert_array_to_csv(current_condition.conditions[i]);
  }
};

var params = [
  "host_name"
  ,"session_id"
  ,"client_id"
  ,"username"
  ,"user_role"
];
function fetch_params() {
  return params;
}

var yoda_quotes = [
  "Agree with you, the council does. Your apprentice, Skywalker will be.",
  "Always two there are, no more, no less: a master and an apprentice.",
  "Fear is the path to the Dark Side. Fear leads to anger, anger leads to hate; hate leads to suffering. I sense much fear in you.",
  "Qui-Gon's defiance I sense in you.",
  "Truly wonderful the mind of a child is.",
  "Around the survivors a perimeter create.",
  "Lost a planet Master Obi-Wan has. How embarrassing. how embarrassing.",
  "Victory, you say? Master Obi-Wan, not victory. The shroud of the Dark Side has fallen. Begun the Clone War has.",
  "Much to learn you still have...my old padawan... This is just the beginning!",
  "Twisted by the Dark Side young Skywalker has become.",
  "The boy you trained, gone he is, consumed by Darth Vader.",
  "The fear of loss is a path to the Dark Side.",
  "If into the security recordings you go, only pain will you find.",
  "Not if anything to say about it I have.",
  "Great warrior, hmm? Wars not make one great.",
  "Do or do not; there is no try.",
  "Size matters not. Look at me. Judge me by my size, do you?",
  "That is why you fail.",
  "No! No different. Only different in your mind. You must unlearn what you have learned.",
  "Always in motion the future is.",
  "Reckless he is. Matters are worse.",
  "When nine hundred years old you reach, look as good, you will not.",
  "No. There is... another... Sky... walker..."
];