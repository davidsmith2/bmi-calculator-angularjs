'use strict';

/**
 * @ngdoc overview
 * @name bmiCalculatorAngularApp
 * @description
 * # bmiCalculatorAngularApp
 *
 * Main module of the application.
 */
angular
  .module('bmiCalculatorAngularApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/list', {
        templateUrl: 'views/list.html',
        controller: 'ListCtrl',
        controllerAs: 'ctrl'
      })
      .when('/list/:id', {
        templateUrl: 'views/detail.html',
        controller: 'DetailCtrl',
        controllerAs: 'ctrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
