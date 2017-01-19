var UserService = function() {
    angular.module('UserService', []).factory('User', ['$http', function($http) {
        return {
            // call to get all users
            get: function() {
                return $http.get('/api/users')
                    .then(function(success) {
                        console.log(success);
                        return success;
                    },
                    function(err) {
                        console.log(err);
                        return err;
                    }
                );
            },
            // call to POST and create a new user
            create: function(userData) {
                return $http.post('/api/users', userData)
                    .then(function(success) {
                        console.log(success);
                        return success;
                    },
                    function(err) {
                        console.log(err);
                        return err;
                    });
            },

            // call to DELETE a user
            delete: function(id) {
                return $http.delete('/api/users/' + id);
            }
        };
    }]);
};

module.exports = UserService;