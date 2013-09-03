'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view', {templateUrl: 'partials/view.html', controller: 'ViewCtrl'});
    $routeProvider.when('/new',  {templateUrl: 'partials/new.html',  controller: 'NewCtrl' });
    $routeProvider.when('/edit', {templateUrl: 'partials/edit.html', controller: 'EditCtrl'});
    $routeProvider.otherwise({redirectTo: '/view'});
  }]);
