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
app.factory('UserFactory', ['$http', require('./public/js/services/UserFactory.js')]);
app.service('AuthService', ['$http', '$window', 'UserFactory', require('./public/js/services/AuthService.js')]);

//socket.io connection
var serverBaseUrl = window.location.origin;
app.factory('chatSocket', function (socketFactory) {
	var myIoSocket = io.connect(serverBaseUrl, {'forceNew': true});
	var socket = socketFactory({
    ioSocket: myIoSocket
  });
  return socket;
}).factory('MsgFactory', ['$http', 'chatSocket', require('./public/js/services/MsgFactory.js')]);

//angular controllers
app.controller('MainCtrl', ['$scope', '$location', 'AuthService', require('./public/js/controllers/MainCtrl.js')]);
app.controller('RegistrationCtrl', ['$scope', '$location', 'AuthService', require('./public/js/controllers/RegistrationCtrl.js')]);
app.controller('SettingsCtrl', ['$scope', 'UserFactory', 'AuthService', require('./public/js/controllers/SettingsCtrl.js')]);
app.controller('ChatCtrl', ['$scope', 'AuthService', 'MsgFactory', 'chatSocket', require('./public/js/controllers/ChatCtrl.js')]);

//initialize routes
var AppRoutes = require('./public/js/appRoutes.js');
app.config(['$routeProvider', '$locationProvider', AppRoutes]);

//toggle navbar active class on view change
app.run(function($rootScope) {
  $rootScope.$on("$locationChangeStart", function(event, next, current) {
    $('ul.nav > li').removeClass('active');
    $('ul.nav > li > a').each(function() {
      if(next == window.location.origin + $(this).attr('href')) {
        $(this).parent().addClass('active');
      };
    });
  });
});

require('./public/js/ui.js');