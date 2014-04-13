'use strict';

angular.module('artpopApp')
.factory('Banker', function ($cacheFactory) {
	// Service logic
	// ...

	function Banker(){
		this.cache = null;
		this.factories = {};
	}
	Banker.prototype = {
		constructor: Banker,
		init: function(param){
			param = param || {};
			this.cache = $cacheFactory(param.name || 'sample');
			this.factories = param.factories || {};
		},
		getNew: function(key, param){
			var factory = this.factories[key];
			if (typeof factory !== 'function'){
				throw new Error('Factory Not Found');
			}
			var newItem = factory(param);
			this.cache.put(key, newItem);
			return newItem;
		},
		getLazy:function(key, param){
			var oldItem = this.cache.get(key);
			if (typeof oldItem === 'undefined'){
				var newItem = this.getNew(key, param);
				return newItem;
			}else{
				return oldItem;
			}
		}
	};

	// Public API here
	return Banker;
});
