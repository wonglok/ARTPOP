'use strict';
angular.module('artpopApp')
.factory('ObjPool', function (ObjPoolItem) {
	// Service logic

	function ObjPool(name){
		this.currentID = 0;
		this.pool = [];
		this.name = name || 'anonymous';
		this.config = {
			factory: function(){
				return new Image();
			}
		};
	}
	ObjPool.prototype.init = function(param){
		param = param || {};
		this.config = angular.extend(this.config, param);
	};
	ObjPool.prototype.makeNewPoolItem = function(){
		this.currentID++;
		var item = new ObjPoolItem(
			this.currentID,
			false,
			this.config.factory()
		);
		this.pool.push(item);
		return item;
	};
	ObjPool.prototype.getFreePoolItem = function(){
		for (var j = this.pool.length - 1; j >= 0; j--) {
			if (!this.pool[j].inUse){
				return this.pool[j];
			}
		}
		return -1;
	};
	ObjPool.prototype.alloc = function(){
		var itemSet = this.getFreePoolItem();
		if (itemSet === -1){
			itemSet = this.makeNewPoolItem();
		}
		itemSet.inUse = true;
		//console.log(this.name,this.pool.length, this.currentID);
		return itemSet;
	};
	ObjPool.prototype.reuse = function(item){
		item.inUse = false;
	};

	//return class reference.
	return ObjPool;
});
