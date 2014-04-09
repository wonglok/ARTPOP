'use strict';
/* global Stats */
angular.module('artpopApp')
.factory('stats', function () {
	var stats = new Stats();
	//stats.setMode(1);
	var statsContainer = document.getElementById('apwgl-stats');
	return {
		obj: stats,
		begin: stats.begin,
		end: stats.end,
		show: function(){
			if (statsContainer && typeof statsContainer.appendChild === 'function'){
				statsContainer.appendChild(stats.domElement);
			}
		},
		hide: function(){
			if (statsContainer && typeof statsContainer.removeChild === 'function'){
				statsContainer.removeChild(stats.domElement);
			}
		}
	};
});
