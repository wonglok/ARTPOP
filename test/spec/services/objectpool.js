'use strict';
describe('Service: ObjPool', function () {
  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var ObjPool;
  beforeEach(inject(function (_ObjPool_) {
    ObjPool = _ObjPool_;
  }));

  var ObjPoolItem;
  beforeEach(inject(function (_ObjPoolItem_) {
    ObjPoolItem = _ObjPoolItem_;
  }));

  it('should do something', function () {
    expect(!!ObjPool).toBe(true);
  });

  it('should have defined props', function () {
    var newPool = new ObjPool();
    expect(!!newPool).toBe(true);
    expect(!!newPool.pool).toBe(true);
    expect(!!newPool.options).toBe(true);
  });

  it('should be correct ObjPoolItem type', function () {
    var newPool = new ObjPool();
    var newItem = newPool.alloc();
    expect(!!newItem).toBe(true);
    expect(newItem instanceof ObjPoolItem).toBe(true);
  });

  it('should be correct ObjPoolItem type and member', function () {
    var newPool = new ObjPool();
    var newItem = newPool.alloc();
    expect(newItem instanceof ObjPoolItem).toBe(true);
    expect(!!newItem).toBe(true);
    expect(!!newItem.id).toBe(true);
    expect(!!newItem.inUse).toBe(true);
    expect(!!newItem.obj).toBe(true);
  });

  it('should alloc default object', function () {
    var newPool = new ObjPool();
    var newItem = newPool.alloc();
    expect(!!newItem.obj).toBe(true);
    expect(newItem.obj instanceof Image).toBe(true);
    expect(newItem.inUse).toBe(true);
    expect(newItem.id).toBe(1);
  });

  it('should alloc custom object', function () {
    var newPool = new ObjPool();
    newPool.init({
      factory: function(){
        return document.createElement('canvas');
      }
    });
    var newItem = newPool.alloc();
    expect(!!newItem.obj).toBe(true);
    expect(newItem.obj instanceof HTMLCanvasElement).toBe(true);
    expect(newItem.obj instanceof Image).toBe(false);
    expect(newItem.inUse).toBe(true);
    expect(newItem.id).toBe(1);
  });

  it('should alloc with correct id', function () {
    var newPool = new ObjPool();
    var newItem = newPool.alloc();
    expect(newItem.id).toBe(1);
    var newItem2 = newPool.alloc();
    expect(newItem2.id).toBe(2);
  });

  it('should alloc with correct number of item', function () {
    var newPool = new ObjPool();
    newPool.alloc();
    newPool.alloc();
    expect(newPool.pool.length).toBe(2);
  });

  it('should alloc with correct number of item after reset', function () {
    var newPool = new ObjPool();
    var obj1 = newPool.alloc();
    newPool.reset(obj1);
    newPool.alloc();
    expect(newPool.pool.length).toBe(1);
  });




});
