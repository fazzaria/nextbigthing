module.exports = function($http) {
  return {
    // call to get user by UserName
    get: function(UserName) {
      return $http.get('/api/users/' + UserName)
        .then(function(success) {
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
          return success;
        },
        function(err) {
          console.log(err);
          return err;
        }
      );
    },
    // call to DELETE a user
    delete: function(id) {
      return $http.delete('/api/users/' + id);
    }
  };
};