'use strict';
/* global dat */
angular.module('artpopApp')
  .factory('datGUI', function () {
	// Service logic
	// ...

	var gui = new dat.GUI({ autoPlace: false });
	var guiContainer = document.getElementById('apwgl-slider');
	return {
		obj: gui,
		show: function(){
			if (guiContainer && typeof guiContainer.appendChild === 'function'){
				guiContainer.appendChild(gui.domElement);
			}
		},
		hide: function(){
			if (guiContainer && typeof guiContainer.removeChild === 'function'){
				guiContainer.removeChild(gui.domElement);
			}
		}
	};
});
