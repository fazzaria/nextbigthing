module.exports = function($http, $window) {
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
        } else {
            return {};
        }
    };

    logout = function() {
        $window.localStorage.removeItem('StalinForTime-token');
    };

    login = function(user) {
        return $http.post('/api/login', user).then(function(success) {
            saveToken(success.data.token);
        }, function(err) {
            console.log("authservice login error", err);
        });
    };

    register = function(user) {
        return $http.post('/api/register', user).then(function(success) {
            saveToken(success.data.token);
        }, function(err) {
            console.log(err);
        });
    };

    return {
        saveToken: saveToken,
        getToken: getToken,
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        logout: logout,
        login: login,
        register: register
    };
};