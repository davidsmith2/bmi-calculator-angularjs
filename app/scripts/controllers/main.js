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
    this.validationStates = {};
    this.helpBlocks = {
      success: {
        msg: 'Success',
        className: 'has-success'
      },
      warning: {
        msg: 'Warning',
        className: 'has-warning'
      },
      error: {
        msg: 'Error',
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
    this.onKeyupInput = function(event) {
      console.log('keyup');
      if (!event.target.value) return;
      self.validationStates[event.target.name] = (event.which < 48 || event.which > 57) ? 'warning' : 'success';
    };
    this.onBlurInput = function(event) {
      console.log('blur');
      self.validationStates[event.target.name] = (!event.target.value) ? 'error' : 'success';
    };
    this.onFocusInput = function(event) {
      console.log('focus');
      if (event.target.value) {
        console.log(event);
      }
    };
    this.getHelpBlock = function(inputName) {
      var validationState = self.validationStates[inputName];
      if (typeof validationState === 'undefined') return;
      return self.helpBlocks[self.validationStates[inputName]];
    };
    this.showHelpBlock = function(inputName) {
      var validationState = self.validationStates[inputName];
      if (typeof validationState === 'undefined') return;
      return validationState !== 'success';
    };
  });
