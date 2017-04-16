module.exports = function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'MainCtrl'
    })
    .when('/chat', {
      templateUrl: 'views/chat.html',
      controller: 'ChatCtrl'
    })
    .when('/about', {
      templateUrl: 'views/about.html'
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegistrationCtrl'
    })
    .when('/settings', {
      templateUrl: 'views/settings.html',
      controller: 'SettingsCtrl'
    })
    .otherwise({templateUrl:'views/404.html'});
      
  $locationProvider.html5Mode(true);
};