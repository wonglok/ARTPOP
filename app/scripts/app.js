'use strict';

angular
  .module('artpopApp', [
    'ngCookies',
    'ngResource',
    'ngAnimate',
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
      .when('/artpop', {
        templateUrl: 'views/artpop.html',
        controller: 'ArtpopCtrl'
      })
      .when('/ARTPOP', {
        templateUrl: 'views/artpop.html',
        controller: 'ArtpopCtrl'
      })
      .otherwise({
        redirectTo: '/electric-chapel'
      });
  });
