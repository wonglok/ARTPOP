'use strict';

angular
  .module('artpopApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/electric-chapel', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/credit', {
        templateUrl: 'views/credit.html',
        controller: 'CreditCtrl'
      })
      .otherwise({
        redirectTo: '/electric-chapel'
      });
  });
