var angular = require('angular');
//var angular = require('angular-route');

var appRoutes = function() {
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', '$qProvider', function($routeProvider, $locationProvider, $qProvider) {
        console.log($qProvider);
        var onlyLoggedIn = function($location, $qProvider, Auth) {
            var deferred = $qProvider.defer();
            if(Auth.isLoggedIn()) {

            }
            else console.log("onlyLoggedIn");
        };

        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'MainController'
            })
            .when('/users', {
                templateUrl: 'views/user.html',
                controller: 'UserController'
            })
            .when('/comments', {
                templateUrl: 'views/comment.html',
                controller: 'CommentController'
            })
            .when('/about', {
                templateUrl: 'views/about.html'
            })
            .when('/register', {
                templateUrl: 'views/register.html'
            })
            .when('/settings', {
                templateUrl: 'views/settings.html',
                resolve:{loggedIn: onlyLoggedIn}
            })
            .otherwise({templateUrl:'views/404.html'}); // Render 404 view;

        $locationProvider.html5Mode(true);

    }]);
};

module.exports = appRoutes;