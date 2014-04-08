'use strict';
/* global dat */
angular.module('artpopApp')
  .factory('datGUI', function () {
    // Service logic
    // ...

    var gui = new dat.GUI();
    return gui;
  });
