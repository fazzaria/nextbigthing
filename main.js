//STALIN FOR TIME: A Chatroom-Based Game of Political Correctness
var angular = require('angular');
var angularRoute = require('angular-route');
var $ = require('jquery');

var css = require('./public/css/style.css');

var app = angular.module('app', [angularRoute]);

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
var CommentFactory = require('./public/js/services/CommentFactory');
app.factory('CommentFactory', ['$http', CommentFactory]);

//angular controllers
var MainCtrl = require('./public/js/controllers/MainCtrl');
app.controller('MainCtrl', ['$scope', '$location', 'AuthService', MainCtrl]);
var UserCtrl = require('./public/js/controllers/UserCtrl');
app.controller('UserCtrl', ['$scope', 'UserFactory', 'AuthService', UserCtrl]);
var CommentCtrl = require('./public/js/controllers/CommentCtrl');
app.controller('CommentCtrl', ['$scope', 'CommentFactory', CommentCtrl]);

//initialize routes
var AppRoutes = require('./public/js/appRoutes');
app.config(['$routeProvider', '$locationProvider', AppRoutes]);

require('./public/js/ui')();