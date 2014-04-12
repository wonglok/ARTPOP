'use strict';
/* global dat */
angular.module('artpopApp')
  .factory('datGUI', function () {
	// Service logic
	// ...

	var gui = new dat.GUI({ autoPlace: false });

	/*enhanced so that it can remove folder*/
	dat.GUI.prototype.removeFolder = function(name) {
		var folder = this.__folders[name];
		if (!folder) {
			return;
		}
		folder.close();
		this.__ul.removeChild(folder.domElement.parentNode);
		delete this.__folders[name];

		//

		var _this = this;
		_this.onResize();
	};

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
