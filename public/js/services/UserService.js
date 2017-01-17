var angular = require('angular');

var UserService = function() {
    angular.module('UserService', []).factory('User', ['$http', function($http) {
        return {
            // call to get all users
            get: function() {
                return $http.get('/api/users');
            },

            // call to POST and create a new user
            create: function(userData) {
                return $http.post('/api/users', userData);
            },

            // call to DELETE a user
            delete: function(id) {
                return $http.delete('/api/users/' + id);
            }
        };
    }]);
};

module.exports = UserService;