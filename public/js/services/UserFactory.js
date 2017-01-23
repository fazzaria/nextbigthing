module.exports = function($http) {
    return {
        // call to get user by UserName
        get: function(UserName) {
            console.log("userfactory get", UserName);
            return $http.get('/api/users/' + UserName)
                .then(function(success) {
                    console.log("user factory get success", success);
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
};