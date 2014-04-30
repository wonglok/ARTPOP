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
			this.paramArr = [];
			this.factoryProxy = {};
			this.ctrList = [];
			this.gui = datGUI.obj;

			return this;
		},
		find: function(name){
			var i, arl = this.paramArr.length;
			for (i = 0; i < arl; i++) {
				if (this.paramArr[i].name === name){
					return this.paramArr[i];
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
			this.paramArr.push(param);
			this.configCtr(param);
		},
		resetAnimation: function(){
			var j,
				paramArr = this.paramArr,
				param;
				// factoryProxy = this.factoryProxy;

			for (j = paramArr.length - 1; j >= 0; j--) {
				param = paramArr[j];
				param.ctx.___animateControl = true;
			}
		},
		configCtr: function(param){
			param = param || {};
			var ctx = param.ctx || (function(){throw new Error('requires ctx');}()),
				name = param.name || (function(){throw new Error('requires name');}()),
				_getter = param.get || (function(){throw new Error('requires get');}()),
				_setter = param.set || (function(){throw new Error('requires set');}()),
				_finish = param.finish || function(){},
				folder = this.folder,
				factoryProxy = this.factoryProxy,

				controller;

			factoryProxy[name] = _getter.call(ctx);

			ctx.___animateControl = true;

			if (param.type === 'color'){
				controller = folder.addColor(factoryProxy, name);
			} else if (param.type === 'slider'){
				var args = [factoryProxy,name];
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
				controller = folder.add(factoryProxy, name);
			} else if (param.type === 'select'){
				controller = folder.add(factoryProxy, name);
			}

			controller.onChange( function(val){
				ctx.___animateControl = false;
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
			this.folder.close();
			// this.clearInnerItems();
			this.gui.removeFolder(this.folderName);
		},
		syncController: function(){
			var j,
				paramArr = this.paramArr,
				factoryProxy = this.factoryProxy,
				param;

			if (this.paramArr.length === 0){
				return;
			}

			for (j = paramArr.length - 1; j >= 0; j--) {
				param = paramArr[j];
				if (param.ctx.___animateControl){
					factoryProxy[param.name] = param.get.call(param.ctx);
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
