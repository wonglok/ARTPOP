'use strict';

describe('Service: FrameBudgetEstimator', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var FrameBudgetEstimator;
  beforeEach(inject(function (_FrameBudgetEstimator_) {
    FrameBudgetEstimator = _FrameBudgetEstimator_;
  }));

  it('should do something', function () {
    expect(!!FrameBudgetEstimator).toBe(true);
  });

  it('should have right constructor', function () {
    expect(FrameBudgetEstimator.prototype.constructor === FrameBudgetEstimator).toBe(true);
  });

  it('should construct new object', function () {
    var newEst = new FrameBudgetEstimator();
    expect(!!newEst).toBe(true);
  });

  it('should have right properties', function () {
    var newEst = new FrameBudgetEstimator();

    expect(newEst.state instanceof Object).toBe(true);
    expect('undefined' !== typeof newEst.state.finished).toBe(true);
    expect('undefined' !== typeof newEst.state.estimating).toBe(true);

    expect('undefined' !== typeof newEst.estimation).toBe(true);
    expect('undefined' !== typeof newEst.lastSample).toBe(true);
    expect('undefined' !== typeof newEst.samples).toBe(true);

    expect('undefined' !== typeof newEst.config.sample).toBe(true);
    expect('undefined' !== typeof newEst.config.filterTimes).toBe(true);
  });

  it('should have right type', function () {
    var newEst = new FrameBudgetEstimator();
    expect(newEst.samples instanceof Array).toBe(true);
    expect(newEst.config instanceof Object).toBe(true);
  });

  it('should have right methods', function () {
    var newEst = new FrameBudgetEstimator();
    expect(!!newEst.state).toBe(true);
    expect(newEst.takeSample !== undefined).toBe(true);
    expect(newEst.checkFinish !== undefined).toBe(true);
    expect(newEst.guess !== undefined).toBe(true);
  });

  it('should takeSample', function () {
    var newEst = new FrameBudgetEstimator();
    newEst.takeSample(window.performance.now());
    expect(newEst.samples.length === 0).toBe(true);
    newEst.takeSample(window.performance.now());
    expect(newEst.samples.length === 1).toBe(true);
    newEst.takeSample(window.performance.now());
    expect(newEst.samples.length === 2).toBe(true);
  });


  it('should guess frame budget', function () {
    var newEst = new FrameBudgetEstimator();
    var doneLoop = false;
    function loop(){
      newEst.takeSample(window.performance.now());
      if (!newEst.state.finished && !newEst.checkFinish()){
        window.requestAnimationFrame(loop);
      } else {
        doneLoop = true;
      }
    }
    loop();

    waitsFor(function(){
      return doneLoop;
    });
    runs(function finishAction(){
      //has sample
      expect(newEst.samples.length > 0 ).toBe(true);

      //clean sample error
      var cleandSample = newEst.removeMaxMinError(newEst.samples,2);
      expect(cleandSample.length < newEst.samples.length).toBe(true);

      console.log(newEst.samples);
      console.log(cleandSample.length);

      //calc avg
      var avg = newEst.getAverage(cleandSample);
      expect(avg > 0).toBe(true);

      //same as calc
      var finalEstimation = avg * newEst.config.tightenFactor;
      expect(finalEstimation > 0 && finalEstimation < 100).toBe(true);


    });
  });



});
