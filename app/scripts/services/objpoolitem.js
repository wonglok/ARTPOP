'use strict';

angular.module('artpopApp')
.factory('ObjPoolItem', function () {
	// Service logic

	function ObjPoolItem( id, inUse, obj ){
		this.id = id;
		this.inUse = inUse;
		this.obj = obj;
	}
	ObjPoolItem.prototype.reuse = function(){
		this.inUse = false;
	};

	//return class reference.
	return ObjPoolItem;
});
