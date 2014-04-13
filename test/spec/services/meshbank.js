'use strict';

describe('Service: meshBank', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var meshBank;
  beforeEach(inject(function (_meshBank_) {
    meshBank = _meshBank_;
  }));

  var Banker;
  beforeEach(inject(function (_Banker_) {
    Banker = _Banker_;
  }));

  var $cacheFactory;
  beforeEach(inject(function (_$cacheFactory_) {
    $cacheFactory = _$cacheFactory_;
  }));

  it('should do something', function () {
    expect(!!meshBank).toBe(true);
  });

  it('should inherit', function () {
    expect(meshBank instanceof Banker).toBe(true);
  });

  it('should do int correctly', function () {
    expect($cacheFactory.get('meshBank')).toBe(meshBank.cache);
  });

  it('should do int correctly', function () {
    expect($cacheFactory.get('shaderBank')).not.toBe(meshBank.cache);
  });

  it('should do int correctly', function () {
    expect($cacheFactory.get('meshBankaFore')).not.toBe(meshBank.cache);
  });



});
