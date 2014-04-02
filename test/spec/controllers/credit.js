'use strict';

describe('Controller: CreditCtrl', function () {

  // load the controller's module
  beforeEach(module('artpopApp'));

  var CreditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreditCtrl = $controller('CreditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
