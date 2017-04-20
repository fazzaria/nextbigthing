module.exports = function($http, mySocket) {
  return {
    // call to get msgs
    get: function(data) {
      console.log(data);
      return $http.get('/api/msgs/' + data)
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
    // call to POST and create a new msg
    create : function(msgData) {
      return $http.post('/api/msgs', msgData);
    },
    // call to DELETE a msg
    delete : function(id) {
      return $http.delete('/api/msgs/' + id);
    }
  };
};