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
							frbT.updateFrameBudget(
								frbE.guess()
							);
						},
						ctx: null,
						args: null,
					});
					frbT.digest();
					console.log('Finish FrameBudget Estimation');
				}
			});
		}
	};

	var serviceInstnace = new FrameBudget();
	serviceInstnace.init();

	return serviceInstnace;
});
