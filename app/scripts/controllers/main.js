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
    this.calculations = [];
    this.isValidForm = false;
    this.mode = 'standard';
    this.modes = {};
    this.helpBlocks = {
      success: {
        msg: 'OK',
        className: 'has-success'
      },
      pattern: {
        msg: 'Not a valid number',
        className: 'has-warning'
      },
      required: {
        msg: 'This field is required',
        className: 'has-error'
      }
    };
    var self = this;
    this.calculateBMI = function() {
      if (self.mode === 'standard') {
        self.bmi = self.modes.standard.lb + self.modes.standard.ft + self.modes.standard.in;
      } else if (self.mode === 'metric') {
        self.bmi = self.modes.metric.kg + self.modes.metric.cm;
      }
      self.calculations.push({date: new Date(), bmi: this.bmi, mode: self.mode});
      self.modes[self.mode] = {};
      self.isValidForm = false;
      return self.bmi;
    };
    this.getMeasurements = function() {
      if (self.mode === 'metric') {
        return ['kg', 'cm'];
      }
      return ['lb', 'ft', 'in'];
    };
    this.changeMode = function(mode) {
      self.mode = mode;
    };
    this.getHelpBlock = function(error) {
      return self.helpBlocks[this.getErrorType(error)];
    };
    this.showHelpBlock = function(error) {
      return this.getErrorType(error) !== 'success';
    };
    this.getErrorType = function(error) {
      var errorType;
      if (error.required) {
        errorType = 'required';
      } else if (error.pattern) {
        errorType = 'pattern';
      } else {
        errorType = 'success';
      }
      return errorType;
    }
  });
