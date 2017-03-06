'use strict';

/**
 * @ngdoc function
 * @name bmiCalculatorAngularApp.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the bmiCalculatorAngularApp
 */
angular.module('bmiCalculatorAngularApp')
  .controller('DetailCtrl', ['$routeParams', 'BMIService', function($routeParams, BMIService) {
    var self = this;
    this.item = {};
    this.fetchItem = function (id) {
      return BMIService
        .show(id)
        .then(function(response) {
          self.item = response.data;
        }, function(errorResponse) {
          console.log('error while fetching item');
        });
    };
    this.fetchItem($routeParams.id);
  }]);
