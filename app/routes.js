var User = require('./models/user');
var path = require('path');

module.exports = function(app) {
    app.get('/api/users', function(req, res) {
        User.find(function(err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        });
    });
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../public/index.html')); 
    });
    app.get('eh', function(req, res) {
            res.sendfile('./public/views/first.html'); // load our public/index.html file
        });
};