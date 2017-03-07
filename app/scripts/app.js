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
      .when('/', {
        redirectTo: '/list'
      })
      .when('/list', {
        templateUrl: 'views/list.html',
        controller: 'ListCtrl',
        controllerAs: 'ctrl',
        resolve: {
          pageName: function() {
            return 'This is the list page';
          }
        }
      })
      .when('/list/:id', {
        templateUrl: 'views/detail.html',
        controller: 'DetailCtrl',
        controllerAs: 'ctrl',
        resolve: {
          pageName: function() {
            return 'This is the detail page';
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('BMIService', ['$http', function($http) {
    return {
      index: function() {
        return $http.get('http://localhost:3000/api/bmi');
      },
      create: function(data) {
        return $http.post('http://localhost:3000/api/bmi', data);
      },
      show: function(id) {
        return $http.get('http://localhost:3000/api/bmi/' + id);
      }
    };
  }]);
