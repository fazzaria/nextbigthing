module.exports = function($http) {
    return {
        // call to get all comments
        get: function() {
            return $http.get('/api/comments')
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

        // call to POST and create a new comment
        create : function(userData) {
            return $http.post('/api/comments', userData);
        },

        // call to DELETE a comment
        delete : function(id) {
            return $http.delete('/api/comments/' + id);
        }
    }
};