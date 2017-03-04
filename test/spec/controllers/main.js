'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('bmiCalculatorAngularApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
    MainCtrl.standard = {lb: 1, ft: 1, in: 1};
  }));

  it('should record calculations', function () {
    expect(MainCtrl.calculations.length).toBe(0);
  });

  it('should validate input', function () {
    expect(MainCtrl.isValidForm).toEqual(false);
    MainCtrl.validateForm();
    expect(MainCtrl.isValidForm).toEqual(true);
  });

  it('should required measurements based on mode', function() {
    expect(MainCtrl.getMeasurements()).toEqual(['lb', 'ft', 'in']);
    expect(MainCtrl.getMeasurements('metric')).toEqual(['kg', 'cm']);
  });

  it('should calculate BMI', function() {
    var bmi = MainCtrl.calculateBMI();
    expect(bmi).toEqual(3);
    expect(MainCtrl.calculations.length).toEqual(1);
    expect(MainCtrl.standard).toEqual({});
    expect(MainCtrl.isValidForm).toEqual(false);
  });

});
