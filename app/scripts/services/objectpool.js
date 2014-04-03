'use strict';

angular.module('artpopApp')
.factory('ObjPool', function () {
	// Service logic
	function ObjPool(){
		this.currentID = 0;
		this.pool = [];
		this.options = {
			factory: function(){
				return new Image();
			}
		};
	}
	ObjPool.prototype.init = function(param){
		param = param || {};
		this.options = angular.extend(this.options, param);
	};
	ObjPool.prototype.makeNewItemSet = function(){
		this.currentID++;
		var item = {
			id: this.currentID,
			inUse: false,
			obj: this.options.factory()
		};
		this.pool.push(item);
		return item;
	};
	ObjPool.prototype.getFreeItemSet = function(){
		for (var j = this.pool.length - 1; j >= 0; j--) {
			if (!this.pool[j].inUse){
				return this.pool[j];
			}
		}
		return -1;
	};
	ObjPool.prototype.alloc = function(){
		var itemSet = this.getFreeItemSet();
		if (itemSet === -1){
			itemSet = this.makeNewItemSet();
		}

		itemSet.inUse = true;
		return itemSet;
	};
	ObjPool.prototype.reset = function(item){
		item.inUse = false;
	};

	//return class reference.
	return ObjPool;
});
