'use strict';
angular
  .module('artpopApp', [
    'ngCookies',
    'ngResource',
    'ngTouch',
    'ngAnimate',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/Electric-Chapel', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
      })
      .when('/ARTPOP', {
        templateUrl: 'views/artpop.html',
        controller: 'ArtpopCtrl'
      })
      .when('/Todos', {
        templateUrl: 'views/todos.html',
        controller: 'TodosCtrl'
      })
      .when('/Credit', {
        templateUrl: 'views/credit.html',
        controller: 'CreditCtrl'
      })
      .otherwise({
        redirectTo: '/Electric-Chapel'
      });
  })
  .run(function ($rootScope){
    $rootScope.$on('$routeChangeSuccess', function () {
      console.log('$routeChangeSuccess');
    });
    $rootScope.$on('$routeChangeStart', function () {
      console.log('$routeChangeStart');

    });
    $rootScope.$on('$routeChangeError', function () {
      console.log('$routeChangeError');

    });
  });

