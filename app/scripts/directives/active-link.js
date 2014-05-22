'use strict';
//http://jsfiddle.net/p3ZMR/3/
angular.module('artpopApp')
  .directive('activeLink', function ($location) {
    return {
      //http://jsfiddle.net/p3ZMR/3/
      restrict: 'A',
      link: function(scope, element, attrs) {
        var activeClass = attrs.activeLink;
        var path = element.find('a').attr('ng-href');

        //detelte hashbang
        if (path.indexOf('#') !== -1){
          path = path.substring(1);
        }

        scope.location = $location;
        scope.$watch('location.path()', function(newPath) {
          //remove leaning slash
          if (newPath.indexOf('/') === 0){
            newPath = newPath.substring(1);
          }
          if (path === newPath) {
            element.addClass(activeClass);
          } else {
            element.removeClass(activeClass);
          }
        });
      }
    };
  });
