'use strict';
/* global waitsFor*/
/* global runs*/

describe('Service: InlineWorkerFactory', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var InlineWorkerFactory, workerFactory;
  beforeEach(inject(function (_InlineWorkerFactory_) {
    InlineWorkerFactory = _InlineWorkerFactory_;
    workerFactory = new InlineWorkerFactory();
  }));
  afterEach(function () {
    InlineWorkerFactory = null;
    workerFactory = null;
  });


  it('should do something', function () {
    expect(!!InlineWorkerFactory).toBe(true);
  });

  it('Is a constructor', function () {
    expect(InlineWorkerFactory instanceof Function).toBe(true);
    expect(InlineWorkerFactory.prototype.constructor === InlineWorkerFactory).toBe(true);
  });

  it('should be able to buildWorkerString', function () {
    var workerString = workerFactory.buildWorkerString({
      deps: [
        ['ma', function ma(self){ self.postMessage('ok'); }]
      ],
      fn: function(self){
        self.ma();
      }
    });

    expect(workerString.length > 0).toBe(true);
  });

  it('should be able to build blob', function () {
    var workerString = workerFactory.buildWorkerString({
      deps: [
        ['ma', function ma(self){ self.postMessage('ok'); }]
      ],
      fn: function(self){
        self.ma();
      }
    });

    var blobUrl = workerFactory.makeBlobURL(workerString);
    expect(blobUrl.length > 0).toBe(true);
  });

  it('should be able to build worker form url', function () {
    var workerString = workerFactory.buildWorkerString({
      deps: [
        ['ma', function ma(self){ self.postMessage('ok'); }]
      ],
      fn: function(self){
        self.ma(self);
      },
    });
    var blobUrl = workerFactory.makeBlobURL(workerString);
    var newWorker = workerFactory.newWorkerWithURL(blobUrl);

    newWorker.postMessage('test');

    var doneMsg = false, msg = '';
    newWorker.onmessage = function(e){
      msg = e.data;
      doneMsg = true;
    };

    waitsFor(function(){
      return doneMsg;
    });

    runs(function(){
      console.log(msg);
      expect(msg).toBe('ok');
    });

  });

  it('should be able to spawn worker form config', function () {
    var newWorker = workerFactory.spawn({
      deps: [
        ['ma', function ma(){ return 'ok'; }],
        ['ma2', function ma2(){ return 'ok2'; }],
        ['ma3', function ma3(){ return 'ok3'; }]
      ],
      noopImportScript: true,
      imports: [
        'self["ma4"] = "ok4"; '
      ],
      fn: function(self){
        var result = self.ma();
        result += self.ma2();
        result += self.ma3();
        result += self.ma4;

        self.postMessage(result);
      },
    });


    var doneMsg = false, msg = '';
    newWorker.onmessage = function(e){
      msg = e.data;
      doneMsg = true;
    };

    waitsFor(function(){
      return doneMsg;
    });

    runs(function(){
      console.log(msg);
      expect(msg).toBe('okok2ok3ok4');
    });

  });





});
