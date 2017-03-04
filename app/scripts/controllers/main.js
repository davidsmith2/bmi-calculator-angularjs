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
    var standardMeasurements = ['lb', 'ft', 'in'];
    this.calculations = [];
    this.isValidForm = false;
    this.calculateBMI = function() {
      self.bmi = self.standard.lb + self.standard.ft + self.standard.in;
      self.calculations.push({date: new Date(), bmi: this.bmi, mode: 'Standard'});
      self.standard = {};
      self.isValidForm = false;
      return self.bmi;
    };
    this.validateForm = function() {
      if (Object.keys(self.standard).length === standardMeasurements.length) {
        self.isValidForm = true;
      }
      return self.isValidForm;
    }
  });
