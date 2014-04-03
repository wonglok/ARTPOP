'use strict';

angular.module('artpopApp')
  .directive('doobStat', function (doobStat) {
    return {
      template: '',
      restrict: 'E',
      controller: function($element) {
        $element.html(doobStat.domElement);
      }
    };
  });
