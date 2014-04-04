'use strict';

angular.module('artpopApp')
  .controller('MainCtrl', function ($scope, $rootScope) {
    $scope.awesomeThings = [
      'ARTPOP',
      'WebGL',
      'Yeoman',
      'Facebook',
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $rootScope.needStats = true;
  });
