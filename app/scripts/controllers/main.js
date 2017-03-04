'use strict';

/**
 * @ngdoc function
 * @name bmiCalculatorAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bmiCalculatorAngularApp
 */
angular.module('bmiCalculatorAngularApp')
  .controller('MainCtrl', function () {
    var self = this;
    this.calculations = [];
    this.isValidForm = false;
    this.validateForm = function() {
      if (Object.keys(self.standard).length === this.getMeasurements().length) {
        self.isValidForm = true;
      }
      return self.isValidForm;
    };
    this.calculateBMI = function() {
      self.bmi = self.standard.lb + self.standard.ft + self.standard.in;
      self.calculations.push({date: new Date(), bmi: this.bmi, mode: 'Standard'});
      self.standard = {};
      self.isValidForm = false;
      return self.bmi;
    };
    this.getMeasurements = function(mode) {
      if (mode === 'metric') {
        return ['kg', 'cm'];
      }
      return ['lb', 'ft', 'in'];
    };
  });
