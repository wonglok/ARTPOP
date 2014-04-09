'use strict';
angular.module('artpopApp')
  .factory('FrameBudgetEstimator', function (){
    // Service logic
    function FrameBudgetEstimator(){
      this.state = {
        finished: false,
        estimating: false,
        currentSkip: 0
      };
      this.estimation = 0;
      this.lastSample = null;
      this.samples = [];

      this.config = {
        skipSample: 120,
        validAmount: 60,
        filterTimes: 60/3,
        sample: 0,//to be calculated by the above factors

        tightenFactor: 0.6, //script time?
        doneSampleTask: null,

      };
      this.config.sample = this.config.validAmount + this.config.filterTimes * 2;
      //console.log('new FrameBudgetEstimator');
    }
    FrameBudgetEstimator.prototype = {
      constructor : FrameBudgetEstimator,
      /*
        {
          amount: 40,
          doneSampleTask: fn
        }
      */
      init: function(param){
        param = param || {};
        this.config.validAmount = param.amount;
        this.config.doneSampleTask = param.doneSampleTask;
      },
      takeSample: function(frameStartTime){
        var fst = frameStartTime || window.performance.now();
        if (this.config.skipSample < this.state.currentSkip){
          this.state.currentSkip++;
          return;
        }
        if (this.lastSample === null){
          this.lastSample = fst;
        }else{

          this.samples.push(  parseFloat( (fst - this.lastSample).toFixed(2) ,10) );
          this.lastSample = fst;

        }

        this.checkFinish();
      },
      requestTakeSample: function(frameStartTime){
        if (this.state.finished){
          return;
        }else{
          this.takeSample(frameStartTime);
        }
      },
      checkFinish: function(){
        if(this.samples.length === this.config.sample){

          this.state.finished = true;
          this.lastSample = 0;

          var task = this.config.doneSampleTask;
          if (typeof task === 'function'){
            task();
          }

          return true;
        }else{
          return false;
        }
      },
      decideMaxMin: function(item,index,array){
        return (
          item < Math.max.apply( null, array ) &&
          item > Math.min.apply( null, array )
        );
      },
      removeMaxMinError: function(samples,times){
        for (var i = times - 1; i >= 0; i--) {
          samples = samples.filter(this.decideMaxMin);
        }
        return samples;
      },
      getAverage: function(samples){
        var sum = 0, l = samples.length, i = 0;
        for (i = 0; i < l; i++) {
          sum = sum + samples[i];
        }
        return sum/samples.length;
      },
      guess: function(){
        var cleandSample = this.removeMaxMinError(this.samples,this.config.filterTimes);
        var avg = this.getAverage(cleandSample) ;
        avg *= this.config.tightenFactor;
        this.estimation = avg;
        return this.estimation;
      }
    };
    return FrameBudgetEstimator;
  });
