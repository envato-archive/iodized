'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/yodado', {templateUrl: 'partials/yodado.html', controller: 'YodadoCtrl'});
    $routeProvider.otherwise({redirectTo: '/yodado'});
  }]);
