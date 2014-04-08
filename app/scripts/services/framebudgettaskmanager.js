'use strict';

angular.module('artpopApp')
.factory('FrameBudgetTaskManager', function () {
	// Service logic
	// ...
	/* ===========================================
		 FrameBudgetTaskManager
	 ===========================================  */
	function FrameBudgetTaskManager(){
		var that = this;
		this.frameBudget = 10;
		this.asyncStack = [];
		this.state = {
			finished: false,
		};
		this.prebind = {
			digest: that.digest.bind(that)
		};
	}
	FrameBudgetTaskManager.prototype = {
		constructor: FrameBudgetTaskManager,
		updateFrameBudget: function(frameBudget){
			this.frameBudget = frameBudget;
		},
		addTask: function(task){
			this.asyncStack.push(task);
			this.state.finished = false;
		},
		stepTask: function(frameStartTime){
			this.taskStepper(this.asyncStack,frameStartTime, this.frameBudget);
		},
		taskStepper: function(stack,fStartTime,budget){
			if (stack.length === 0){
				return;
			}
			var todo;
			do {
				todo = stack.shift();
				if (
					typeof todo !== 'undefined' &&
					typeof todo.fn === 'function'
				){
					if (typeof todo.args !== 'undefined'){
						todo.fn.apply(todo.ctx,todo.args);
					}else{
						todo.fn.call(todo.ctx,todo.data);
					}
				}
			} while (
				(window.performance.now() - fStartTime) < budget &&
				stack.length > 0
			);
		},
		checkFinish: function(){
			var ans = (this.asyncStack.length === 0);
			if (ans){
				this.state.finished = true;
			}
			return ans;
		},
		digest: function (){
			this.stepTask(window.performance.now());
			if (!this.state.finished && !this.checkFinish()){
				window.requestAnimationFrame(this.prebind.digest);
			}
		}
	};

	// Public API here
	return FrameBudgetTaskManager;
});
