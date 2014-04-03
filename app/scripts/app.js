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
      .when('/Electric-Chapel', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/Credit', {
        templateUrl: 'views/credit.html',
        controller: 'CreditCtrl'
      })
      .when('/ARTPOP', {
        templateUrl: 'views/artpop.html',
        controller: 'ArtpopCtrl'
      })
      .when('/Todos', {
        templateUrl: 'views/todos.html',
        controller: 'TodosCtrl'
      })
      .otherwise({
        redirectTo: '/electric-chapel'
      });
  });
