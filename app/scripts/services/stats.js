'use strict';
/* global Stats */
angular.module('artpopApp')
.factory('stats', function () {
	var stats = new Stats();

	var statsContainer = document.getElementById('apwgl-stats');

	return {
		obj: stats,
		begin: stats.begin,
		end: stats.end,
		show: function(){
			// stats.domElement.style.display = 'block';
			if (statsContainer && typeof statsContainer.appendChild === 'function'){
				statsContainer.appendChild(stats.domElement);
			}
		},
		hide: function(){
			// stats.domElement.style.display = 'none';

			if (statsContainer && typeof statsContainer.removeChild === 'function'){
				statsContainer.removeChild(stats.domElement);
			}
		}
	};
});
