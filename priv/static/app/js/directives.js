'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('ngIf', function() {
      return {
          link: function(scope, element, attrs) {
              if(scope.$eval(attrs.ngIf)) {
                  // remove '<div ng-if...></div>'
                  element.replaceWith(element.children())
              } else {
                  element.replaceWith(' ')
              }
          }
      }
  });
