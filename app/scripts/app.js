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
  .module('bmiCalculatorAngularJSApp', ['btford.socket-io', 'ngRoute'])
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
    var bmiUrl = 'http://localhost:3000/api/bmi';
    return {
      index: function() {
        return $http.get(bmiUrl);
      },
      create: function(data) {
        return $http.post(bmiUrl, data);
      },
      show: function(id) {
        return $http.get(bmiUrl + '/' + id);
      },
      delete: function(id) {
        return $http.delete(bmiUrl + '/' + id);
      }
    };
  }])
  .factory('FormService', [function() {
    var forms = [
      {
        name: 'standard',
        fields: [
          {
            name: 'lb',
            placeholder: '175'
          },
          {
            name: 'ft',
            placeholder: '5'
          },
          {
            name: 'in',
            placeholder: '8'
          }
        ]
      },
      {
        name: 'metric',
        fields: [
          {
            name: 'kg',
            placeholder: '79'
          },
          {
            name: 'cm',
            placeholder: '173'
          }
        ]
      }
    ];
    return {
      getForms: function() {
        return forms;
      }
    };
  }])
  .factory('NotificationsService', [function() {
    var url = 'http://localhost:3000';
    var socket;
    return {
      sendMessage(message) {
        socket.emit('message', message);
      },
      getMessages() {
        var dfd = $.Deferred();
        socket = io(url);
        socket.on('message', function(data) {
          dfd.resolve(data);
        });
        return dfd.promise();
      }
    };
  }])
  .factory('SocketService', function(socketFactory) {
    var socket = io.connect('http://localhost:3000');
    return socketFactory({
      ioSocket: socket
    });
  });
