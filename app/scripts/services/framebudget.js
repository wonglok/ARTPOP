'use strict';

angular.module('artpopApp')
.factory('frameBudget', function (FrameBudgetEstimator, FrameBudgetTaskManager) {
	// Service logic
	// ...
	function FrameBudget(){
		this.frbE = new FrameBudgetEstimator();
		this.frbT = new FrameBudgetTaskManager();
	}
	FrameBudget.prototype = {
		constructor: FrameBudget,
		init : function(){
			var frbE = this.frbE;
			var frbT = this.frbT;

			//when sample taking finish
			frbE.init({
				doneSampleTask: function (){
					//schedule the
					frbT.addTask({
						fn: function(){
							var finalAnswer = frbE.guess();

							var fps = 55;
							if (finalAnswer > 1000/fps){
								finalAnswer = 1000/fps*frbE.config.tightenFactor;
							}

							frbT.updateFrameBudget(finalAnswer);
							console.log(
								'Finish FrameBudget Estimation',
								frbT.frameBudget.toFixed(2)
							);
						}
						// ,
						// ctx: null,
						// args: null,
					});
					frbT.digest();
				}
			});
		}
	};
	var obj = new FrameBudget();
	obj.init();
	return obj;
})
.factory('frbE', function (frameBudget) {
	return frameBudget.frbE;
})
.factory('frbT', function (frameBudget) {
	return frameBudget.frbT;
})
;

