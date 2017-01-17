var angular = require('angular');
var angularRoute = require('angular-route');
var $ = require('jquery');
var css = require('./public/css/style.css');

var app = angular.module('app', []);
angular.module('app', [angularRoute]);

require('./public/js/controllers/MainCtrl')();

require('./public/js/controllers/UserCtrl')();
require('./public/js/services/UserService')();

require('./public/js/controllers/CommentCtrl')();
require('./public/js/services/CommentService')();

require('./public/js/appRoutes')();

angular.module('app', ['ngRoute', 'appRoutes', 'MainCtrl', 'UserCtrl', 'UserService', 'CommentCtrl', 'CommentService']);

app.config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.defaults.transformRequest = function(data) {
        if (data === undefined) {
            return data;
        }
        return $.param(data);
	};
});