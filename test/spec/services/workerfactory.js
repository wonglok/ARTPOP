'use strict';

describe('Service: workerFactory', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var workerFactory;
  var InlineWorkerFactory;
  beforeEach(inject(function (_workerFactory_, _InlineWorkerFactory_) {
    workerFactory = _workerFactory_;
    InlineWorkerFactory = _InlineWorkerFactory_;
  }));

  it('should do something', function () {
    expect(!!workerFactory).toBe(true);
    expect(workerFactory instanceof InlineWorkerFactory).toBe(true);
  });



});
