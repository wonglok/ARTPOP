'use strict';

angular.module('artpopApp')
  .directive('doobStat', function (stats) {
    return {
      template: '',
      restrict: 'E',
      controller: function($element) {
        $element.html(stats.domElement);
      }
    };
  });
