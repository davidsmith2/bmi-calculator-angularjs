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
    MainCtrl.modes.standard = {lb: 1, ft: 1, in: 1};
    MainCtrl.modes.metric = {kg: 1, cm: 1};
  }));

  describe('recording calculations', function() {
    it('should record calculations', function () {
      expect(MainCtrl.calculations.length).toBe(0);
    });
  });

  describe('getting measurements', function() {
    it('should handle standard', function() {
      MainCtrl.mode = 'standard';
      expect(MainCtrl.getMeasurements()).toEqual(['lb', 'ft', 'in']);
    });
    it('should handle metric', function() {
      MainCtrl.mode = 'metric';
      expect(MainCtrl.getMeasurements()).toEqual(['kg', 'cm']);
    });
  });

  describe('calculating BMI', function() {
    it('should handle standard', function() {
      var bmi;
      MainCtrl.mode = 'standard';
      bmi = MainCtrl.calculateBMI();
      expect(bmi).toEqual(3);
      expect(MainCtrl.calculations.length).toEqual(1);
      expect(MainCtrl.modes.standard).toEqual({});
      expect(MainCtrl.isValidForm).toEqual(false);
    });
    it('should calculate BMI', function() {
      var bmi;
      MainCtrl.mode = 'metric';
      bmi = MainCtrl.calculateBMI();
      expect(bmi).toEqual(2);
      expect(MainCtrl.calculations.length).toEqual(1);
      expect(MainCtrl.modes.metric).toEqual({});
      expect(MainCtrl.isValidForm).toEqual(false);
    });
  });

  describe('setting the mode', function() {
    it('should start standard', function() {
      expect(MainCtrl.mode).toEqual('standard');
    });
    it('should change to metric', function() {
      MainCtrl.changeMode('metric');
      expect(MainCtrl.mode).toEqual('metric');
    });
    it('should change back to standard', function() {
      MainCtrl.changeMode('standard');
      expect(MainCtrl.mode).toEqual('standard');
    });
  });

});
