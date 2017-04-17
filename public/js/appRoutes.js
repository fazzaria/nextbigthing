module.exports = function($routeProvider, $locationProvider) {

  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'MainCtrl'
    })
    .when('/chat', {
      templateUrl: 'views/chat.html',
      controller: 'ChatCtrl',
      requireAuth: true
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
      controller: 'SettingsCtrl',
      requireAuth: true
    })
    .when('/401', {
      templateUrl: 'views/401.html'
    })
    .otherwise({templateUrl:'views/404.html'});
      
  $locationProvider.html5Mode(true);
};