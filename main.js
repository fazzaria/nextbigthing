//STALIN FOR TIME: A Chatroom-Based Game of Political Correctness
var angular        = require('angular');
var angularRoute   = require('angular-route');
var angularAnimate = require('angular-animate');
var $              = require('jquery');

require('angular-socket-io');
var io = require('socket.io-client');
window.io = io;

var css = require('./public/css/style.css');

var app = angular.module('app', [angularRoute, angularAnimate, 'btford.socket-io']);

app.config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.defaults.transformRequest = function(data) {
        if (data === undefined) {
            return data;
        }
        return $.param(data);
	};
});

//angular services and factories
var AuthService = require('./public/js/services/AuthService');
app.service('AuthService', ['$http', '$window', AuthService]);
var UserFactory = require('./public/js/services/UserFactory');
app.factory('UserFactory', ['$http', UserFactory]);
//socket.io connection
//var serverBaseUrl = 'http://localhost:8081';
app.factory('mySocket', function (socketFactory) {
  return socketFactory();
}).
controller('ChatCtrl', function (mySocket) {

});


//angular controllers
var MainCtrl = require('./public/js/controllers/MainCtrl');
app.controller('MainCtrl', ['$scope', '$location', 'AuthService', MainCtrl]);
var RegistrationCtrl = require('./public/js/controllers/RegistrationCtrl');
app.controller('RegistrationCtrl', ['$scope', '$location', 'AuthService', RegistrationCtrl]);
var SettingsCtrl = require('./public/js/controllers/SettingsCtrl');
app.controller('SettingsCtrl', ['$scope', 'UserFactory', 'AuthService', SettingsCtrl]);


//initialize routes
var AppRoutes = require('./public/js/appRoutes');
app.config(['$routeProvider', '$locationProvider', AppRoutes]);

require('./public/js/ui')();