'use strict';

angular.module('artpopApp')
.factory('InlineWorkerFactory', function () {
	// Service logic
	// ...
	/*
	Kudos:
	WebWorker Tutorial
	http://www.html5rocks.com/en/tutorials/workers/basics/
	Transferable Object
	http://updates.html5rocks.com/2011/09/Workers-ArrayBuffer
	*/
	function InlineWorkerFactory(){
	}
	InlineWorkerFactory.prototype = {
		constructor: InlineWorkerFactory,
		init: function(){
			//
		},
		serialize: function(item){
			if (typeof item === 'function'){
				return item.toString();
			}else if (typeof item === 'string'){
				return '"'+item+'"';
			}else if (typeof item === 'number'){
				return item;
			}else if (typeof item === 'object'){
				return JSON.stringify(item, null, '\t');
			}
		},
		getNetworkPrefix: function(){
			var networkPrefix = window.location.protocol + '//'  + window.location.hostname + '/' ;
			return networkPrefix;
		},
		getDepsString: function(deps){
			var cDep, i, depWorkerString = '';
			for (i = 0; i < deps.length; i++) {
				cDep = deps[i];
				depWorkerString += ' \n\tself[' + this.serialize(cDep[0]) + '] = ' + this.serialize(cDep[1]) + ';\n';
				cDep = null;
			}
			return depWorkerString;
		},
		getImportsString: function(imports){
			var cImport, i, importString = '';
			for (i = 0; i < imports.length; i++) {
				cImport = imports[i];
				importString += '\n\t'+cImport +';\n' ;
			}
			return importString;
		},
		buildWorkerString: function(config){
			config = config || {};
			config.deps = config.deps || [];
			config.imports = config.imports || [];
			config.noopImportScript = config.noopImportScript || false;
			config.fn = config.fn || function(){};
			config = this.checkConfig(config);

			//add a head.
			if (config.noopImportScript){
				config.deps.unshift([ 'importScripts', function(){} ]);
			}
			config.deps.unshift([ 'networkPrefix', this.getNetworkPrefix() ]);
			config.deps.unshift([ 'location', window.location ]);

			var workerString = '';


			workerString += '(function(self){ \n';
			workerString += this.getDepsString(config.deps);
			workerString += '}(this)); \n';

			workerString += this.getImportsString(config.imports);


			workerString += '\n('+this.serialize(config.fn)+')(this);';

			return workerString;
		},
		makeBlobURL: function(workerString){
			var blob = new Blob([workerString], { type : 'application/javascript'} );
			var blobURL = window.URL.createObjectURL(blob);
			return blobURL;
		},
		newWorkerWithURL: function(blobURL){
			return new Worker(blobURL);
		},
		checkConfig: function(config){
			config = config || {};
			if(!config.fn instanceof Function){
				throw new Error('fn requires a funciton!');
			}
			if(!config.deps instanceof Array){
				throw new Error('deps requires array!');
			}
			if(!config.imports instanceof Array){
				throw new Error('imports requires array!');
			}
			return config;
		},
		spawn: function(config){
			var workerString = this.buildWorkerString(config);

			var blobURL = this.makeBlobURL(workerString);

			var neWorker = this.newWorkerWithURL(blobURL);

			return neWorker;
		}
	};

	return InlineWorkerFactory;
});
