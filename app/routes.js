var User = require('./models/user');
var path = require('path');

var routes = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/users', function(req, res) {
        // use mongoose to get all nerds in the database
        User.find(function(err, users) {

            if (err)
                res.send(err);

            res.json(users);
        });
    });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)
    
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../public/index.html')); // load our public/index.html file
    });
};

module.exports = routes;