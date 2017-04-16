//STALIN FOR TIME: A Chatroom-Based Game of Political Correctness
var angular        = require('angular');
var angularRoute   = require('angular-route');
var angularAnimate = require('angular-animate');
var $              = require('jquery');
var moment         = require('moment');

window.$ = $;
window.jQuery = $;
require('bootstrap');

require('angular-socket-io');
var io = require('socket.io-client');
window.io = io;

var css = require('./public/css/style.css');

var app = angular.module('app', [angularRoute, 'ngAnimate', 'btford.socket-io']);

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
app.factory('UserFactory', ['$http', require('./public/js/services/UserFactory')]);
app.service('AuthService', ['$http', '$window', 'UserFactory', require('./public/js/services/AuthService')]);

//socket.io connection
var serverBaseUrl = window.location.origin;
app.factory('chatSocket', function (socketFactory) {
	var myIoSocket = io.connect(serverBaseUrl, {'forceNew': true});
  	var socket = socketFactory({
        ioSocket: myIoSocket
    });
    return socket;
}).factory('MsgFactory', ['$http', 'chatSocket', require('./public/js/services/MsgFactory')]);

//angular controllers
app.controller('MainCtrl', ['$scope', '$location', 'AuthService', require('./public/js/controllers/MainCtrl')]);
app.controller('RegistrationCtrl', ['$scope', '$location', 'AuthService', require('./public/js/controllers/RegistrationCtrl')]);
app.controller('SettingsCtrl', ['$scope', 'UserFactory', 'AuthService', require('./public/js/controllers/SettingsCtrl')]);
app.controller('ChatCtrl', ['$scope', 'AuthService', 'MsgFactory', 'chatSocket', require('./public/js/controllers/ChatCtrl')]);

//initialize routes
var AppRoutes = require('./public/js/appRoutes');
app.config(['$routeProvider', '$locationProvider', AppRoutes]);

require('./public/js/ui');