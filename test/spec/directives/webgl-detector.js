'use strict';

describe('Directive: webglDetector', function () {

  // load the directive's module
  beforeEach(module('artpopApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make a canvas', inject(function ($compile) {
    element = angular.element('<webgl-detector></webgl-detector>');
    element = $compile(element)(scope);
    expect(element.length).toBe(1);
  }));
});
