var appRoutes = function() {

    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

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
                templateUrl: 'views/settings.html'/*,
                resolve:{loggedIn: onlyLoggedIn}*/
            })
            .otherwise({templateUrl:'views/404.html'}); // Render 404 view;

        $locationProvider.html5Mode(true);
    }]);
};

module.exports = appRoutes;