'use strict';

angular.module('artpopApp')
  .controller('CreditCtrl', function ($scope, $rootScope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $rootScope.needStats = false;
  });
