var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(router) {
  router.route('/users')
    // create a user (accessed at POST http://localhost:8081/api/users)
    .post(function(req, res, next) {
      var user = new User();
      user.UserName = req.body.UserName;
      user.DisplayName = req.body.UserName;
      user.Pwd = req.body.Pwd;
      user.save(function(err) {
        if (err) {
          res.send(err);
        }
        return res.json({ message: 'User created!' });
      });
    }
  );
  router.route('/users/:UserName')
    .get(function(req, res) {
      User.findOne(req.body, function(err, user) {
        if (err) {
          res.send(err);
        }
        res.json(user);
      });
    }
  );
  router.route('/users/:_id')
    // get the user with that id (accessed at GET http://localhost:8081/api/users/:_id)
    .get(function(req, res) {
      User.findById(req.params._id, function(err, user) {
        if (err) {
          res.send(err);
        }
        res.json(user);
      });
    })
    // update the user with this id (accessed at PUT http://localhost:8081/api/users/:_id)
    .put(function(req, res) {
      // use our user model to find the user we want
      User.findById(req.params._id, function(err, user) {
        if (err) {
          res.send(err);
        }
        if(req.body.UserName) {
          user.UserName = req.body.UserName;
        }
        if(req.body.Pwd) {
          user.Pwd = req.body.Pwd;
        }
        if(req.body.DisplayName) {
          user.DisplayName = req.body.DisplayName;
        }

        // save the user
        user.save(function(err) {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'User updated!' });
        });
      });
    })
    // delete the user with this id (accessed at DELETE http://localhost:8081/api/users/:_id)
    .delete(function(req, res) {
      User.remove({
        _id: req.params._id
      }, function(err, user) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
      });
    }
  );
};