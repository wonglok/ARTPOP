'use strict';
/* global NProgress */
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
      .when('/Detecotr', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',

        // templateUrl: 'views/artpop.html',
        // controller: 'ArtpopCtrl'

      })
      .when('/3DMix', {
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
        redirectTo: '/Detecotr'
      });
  })
  .run(function ($rootScope, Modernizr){
    $rootScope.Modernizr = Modernizr;
    $rootScope.$on('$routeChangeStart', function () {
      console.log('$routeChangeStart');
      NProgress.start();
    });
    $rootScope.$on('$routeChangeSuccess', function () {
      console.log('$routeChangeSuccess');
      setTimeout(function(){
        NProgress.done();
      },300);
    });
    $rootScope.$on('$routeChangeError', function () {
      console.log('$routeChangeError');
      NProgress.done();
    });
  });

