//STALIN FOR TIME: A Chatroom-Based Game of Political Correctness
var angular        = require('angular');
var angularRoute   = require('angular-route');
var angularAnimate = require('angular-animate');
var $              = require('jquery');

window.$ = $;
window.jQuery = $;
require('bootstrap');

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
app.service('AuthService', ['$http', '$window', require('./public/js/services/AuthService')]);
app.factory('UserFactory', ['$http', require('./public/js/services/UserFactory')]);

//socket.io connection
app.factory('mySocket', function (socketFactory) {
  return socketFactory();
}).factory('MsgFactory', ['$http', 'mySocket', require('./public/js/services/MsgFactory')]);

//angular controllers
app.controller('MainCtrl', ['$scope', '$location', 'AuthService', require('./public/js/controllers/MainCtrl')]);
app.controller('RegistrationCtrl', ['$scope', '$location', 'AuthService', require('./public/js/controllers/RegistrationCtrl')]);
app.controller('SettingsCtrl', ['$scope', 'UserFactory', 'AuthService', require('./public/js/controllers/SettingsCtrl')]);
app.controller('ChatCtrl', ['$scope', 'AuthService', 'MsgFactory', 'mySocket', require('./public/js/controllers/ChatCtrl')]);

//initialize routes
var AppRoutes = require('./public/js/appRoutes');
app.config(['$routeProvider', '$locationProvider', AppRoutes]);

require('./public/js/ui')();