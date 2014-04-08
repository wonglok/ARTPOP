'use strict';

describe('Service: FrameBudgetTaskManager', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var FrameBudgetTaskManager, fbrT;
  beforeEach(inject(function (_FrameBudgetTaskManager_) {
    FrameBudgetTaskManager = _FrameBudgetTaskManager_;
    fbrT = new FrameBudgetTaskManager();
  }));

  it('should do something', function () {
    expect(!!FrameBudgetTaskManager).toBe(true);
  });

  it('should instantiate', function () {
    expect(!!fbrT).toBe(true);
  });

  it('should instantiate', function () {
    //expect(!!fbrT).toBe(true);
  });


  it('should add task', function () {
  });



});












