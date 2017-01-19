var setupAuth = function() {
    angular.module('app').service('authentication', authentication);

    authentication.$inject = ['$http', '$window'];

    function authentication ($http, $window) {
        var saveToken = function (token) {
            $window.localStorage['StalinForTime-token'] = token;
        };

        var getToken = function () {
            return $window.localStorage['StalinForTime-token'];
        };

        var isLoggedIn = function() {
            var token = getToken();
            var payload;

            if(token) {
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function() {
            if (isLoggedIn()) {
                var token = getToken();
                var payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return {
                    UserName: payload.UserName,
                    DisplayName: payload.DisplayName
                };
            }
        };

        logout = function() {
            $window.localStorage.removeItem('StalinForTime-token');
        };

        register = function(user) {
            return $http.post('/api/register', user).success(function(data) {
                saveToken(data.token);
            });
        };

        login = function(user) {
            return $http.post('/api/login', user).success(function(data) {
                saveToken(data.token);
            });
        };

        return {
            saveToken: saveToken,
            getToken: getToken,
            logout: logout,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser
        };
    };
};

module.exports = setupAuth;