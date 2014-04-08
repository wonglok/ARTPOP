'use strict';
/* global Stats */
angular.module('artpopApp')
  .factory('stats', function () {
    var stats = new Stats();
    //stats.setMode(1);
    return stats;
  });
