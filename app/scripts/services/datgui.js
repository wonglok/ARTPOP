'use strict';
/* global dat */
angular.module('artpopApp')
  .factory('datGUI', function () {
	// Service logic
	// ...

	//Remove Folder
	//http://stackoverflow.com/questions/14710559/dat-gui-how-hide-menu-from-code
	//https://code.google.com/p/dat-gui/issues/detail?id=21
	/*enhanced so that it can remove folder*/
	dat.GUI.prototype.removeFolder = function(name) {
		var folder = this.__folders[name];
		if (!folder) {
			return;
		}
		folder.close();
		this.__ul.removeChild(folder.domElement.parentNode);
		delete this.__folders[name];

		var _this = this;
		dat.utils.common.defer(function(){
			_this.onResize();
		});
	};

	var gui = new dat.GUI({autoPlace: true});
	gui.domElement.style.display = 'none';
	//insert into dom tree but display none,
	//so that no render.

	// var guiContainer = document.getElementById('apwgl-slider');
	return {
		obj: gui,
		show: function(){
			gui.domElement.style.display = 'block';
			// if (guiContainer && typeof guiContainer.appendChild === 'function'){
				// gui.domElement.parentNode.appendChild(gui.domElement);
			// }
		},
		hide: function(){
			gui.domElement.style.display = 'none';

			// if (guiContainer && typeof guiContainer.removeChild === 'function'){
			//gui.domElement.parentNode.removeChild(gui.domElement);
			// }
		}
	};
});
