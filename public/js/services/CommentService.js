var CommentService = function() {
    angular.module('CommentService', []).factory('Comment', ['$http', function($http) {
        return {
            // call to get all comment
            get : function() {
                return $http.get('/api/comments');
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
    }]);
};

module.exports = CommentService;