'use strict';

/**
 * @ngdoc function
 * @name bmiCalculatorAngularApp.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the bmiCalculatorAngularApp
 */
angular.module('bmiCalculatorAngularJSApp')
  .controller('DetailCtrl', ['$routeParams', 'BMIService', 'pageName', function($routeParams, BMIService, pageName) {
    console.log(pageName);
    var self = this;
    var fetchItem = function (id) {
      return BMIService
        .show(id)
        .then(function(response) {
          self.item = response.data;
        }, function(errorResponse) {
          console.log('error while fetching item');
        });
    };
    this.item = {};
    fetchItem($routeParams.id);
  }]);
