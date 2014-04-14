'use strict';

angular.module('artpopApp')
.factory('CustomControl', function (datGUI) {
	// Service logic
	// ...
	function CustomControl(){
		this.init();
		return this;
	}
	CustomControl.prototype = {
		constructor: CustomControl,
		init: function(){
			this.folderName = '';
			this.folder = null;
			this.lib = [];
			this.factors = {};
			this.ctrList = [];
			this.gui = datGUI.obj;

			return this;
		},
		find: function(name){
			var i, arl = this.lib.length;
			for (i = 0; i < arl; i++) {
				if (this.lib[i].name === name){
					return this.lib[i];
				}
			}
			return -1;
		},
		addFolder: function(name){
			if (typeof name !== 'string'){
				throw new Error('requires string as folder.');
			}
			this.folderName = name;
			this.folder = this.gui.addFolder(name);
		},
		addCtr: function(param){
			this.lib.push(param);
			this.configCtr(param);
		},
		configCtr: function(param){
			param = param || {};
			var ctx = param.ctx || (function(){throw new Error('requires ctx');}()),
				name = param.name || (function(){throw new Error('requires name');}()),
				_getter = param.get || (function(){throw new Error('requires get');}()),
				_setter = param.set || (function(){throw new Error('requires set');}()),
				_finish = param.finish || function(){},

				folder = this.folder,
				factors = this.factors,

				controller;

			factors[name] = _getter.call(ctx);

			if (param.type === 'color'){
				controller = folder.addColor(factors, name);
			} else if (param.type === 'slider'){
				var args = [factors,name];
				if (param.min && param.max){
					args.push(param.min);
					args.push(param.max);
				}
				controller = folder.add.apply(folder, args);
				if (param.step){
					controller.step(param.step);
				}
				args = null;
			} else if (param.type === 'checkbox'){
				controller = folder.add(factors, name);
			} else if (param.type === 'select'){
				controller = folder.add(factors, name);
			}

			controller.__manualUpdate = true;
			controller.onChange( function(val){
				ctx.animate = false;
				_setter.call(ctx,val);
			});
			controller.onFinishChange(function(val){
				_finish.call(ctx,val);
			});

			this.ctrList.push(controller);
		},
		// clearInnerItems: function(){
		// 	var i, listLength = this.ctrList, currentCtr;
		// 	for (i = 0; i <= listLength; i++) {
		// 		currentCtr = this.ctrList[i];
		// 		this.folder.remove(currentCtr);
		// 	}
		// },
		removeAll: function(){
			//remove all items from the
			//this.folder.close();
			//this.ctrClearInnerItems();
			this.gui.removeFolder(this.folderName);
		},
		syncController: function(){
			var j,
				lib = this.lib,
				factors = this.factors,
				param;

			if (this.lib.length === 0){
				return;
			}

			for (j = lib.length - 1; j >= 0; j--) {
				param = lib[j];
				if (param.ctx.animate){
					factors[param.name] = param.get.call(param.ctx);
				}
			}

			// var i, listLength = this.ctrList, currentCtr;
			// for (i = 0; i <= listLength; i++) {
			// 	currentCtr = this.ctrList[i];
			// 	currentCtr[i].updateDisplay();
			// }

			for (var i in this.folder.__controllers) {
				this.folder.__controllers[i].updateDisplay();
			}
		},
	};


	// Public API here
	return CustomControl;
});
