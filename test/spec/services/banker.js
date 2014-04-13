'use strict';

describe('Service: Banker', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var Banker, aBanker;
  beforeEach(inject(function (_Banker_) {
    Banker = _Banker_;
  }));

  var $cacheFactory;
  beforeEach(inject(function (_$cacheFactory_) {
    $cacheFactory = _$cacheFactory_;
  }));

  beforeEach(function(){
    aBanker = new Banker();
    aBanker.init({
      name: 'aBankerSample',
      factories: {
        test1: function(){
          return 'test1result';
        },
        test2: function(){
          return 'test2result';
        }
      }
    });
  });

  it('should do something', function () {
    expect(!!Banker).toBe(true);
  });

  it('should do int correctly', function () {
    expect($cacheFactory.get('aBankerSample')).toBe(aBanker.cache);
  });


  it('should not allow bad key', function () {
    expect($cacheFactory.get('noSuchCacheId')).not.toBeDefined();
  });


  it('should cache right values', function () {
    aBanker.cache.put('key', 'value');
    aBanker.cache.put('another key', 'another value');

    expect(aBanker.cache.info()).toEqual({id: 'aBankerSample', size: 2});
  });

  it('should get new', function () {
    aBanker.getNew('test1');

    expect(aBanker.cache.info()).toEqual({id: 'aBankerSample', size: 1});
  });

  it('should get lazy', function () {
    aBanker.getNew('test1');
    aBanker.getNew('test1');

    expect(aBanker.cache.info()).toEqual({id: 'aBankerSample', size: 1});
  });

  it('should get lazy', function () {
    aBanker.getNew('test1');
    aBanker.getNew('test1');
    aBanker.getNew('test2');
    aBanker.getNew('test2');
    aBanker.getNew('test1');

    aBanker.getNew('test2');
    aBanker.getNew('test2');
    aBanker.getNew('test1');

    expect(aBanker.cache.info()).toEqual({id: 'aBankerSample', size: 2});
  });

  it('should get correctly', function () {
    var r1 = aBanker.getNew('test1');
    var r2 = aBanker.getNew('test2');

    expect(r1).not.toEqual(r2);
    expect(r1).toEqual('test1result');
    expect(r2).toEqual('test2result');
  });





});
