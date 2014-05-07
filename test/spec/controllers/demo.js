'use strict';

describe('Controller: DemoCtrl', function () {

  // load the controller's module
  beforeEach(module('artpopApp'));

  var DemoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DemoCtrl = $controller('DemoCtrl', {
      $scope: scope
    });
  }));

  //
  // it('should attach a list of demoImages to the scope', function () {
    // expect(scope.demoImages.length > 3).toBe(true);
  // });
});
