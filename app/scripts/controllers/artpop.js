'use strict';

angular.module('artpopApp')
  .controller('ArtpopCtrl', function ($scope,$rootScope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $rootScope.needStats = true;
  });
