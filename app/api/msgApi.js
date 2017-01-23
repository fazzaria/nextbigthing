var Msg = require('../models/msg');

module.exports = function(router) {
    router.route('/msgs')
        // create a msg (accessed at POST http://localhost:8081/api/msgs)
        .post(function(req, res, next) {
            var msg = new Msg();
            msg.Author = req.body.Author;
            msg.Content = req.body.Content;
            msg.DatePosted = new Date();

            msg.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Msg created!' });
            });
        })
        .get(function(req, res) {
            Msg.find(function(err, msgs) {
                if (err) {
                    res.send(err);
                }

                res.json(msgs);
            });
        }
    );
    router.route('/msgs/:_id')
        // get the msg with that id (accessed at GET http://localhost:8081/api/msgs/:_id)
        .get(function(req, res) {
            Msg.findById(req.params._id, function(err, msg) {
                if (err) {
                    res.send(err);
                }
                res.json(msg);
            });
        })
        // update the msg with this id (accessed at PUT http://localhost:8081/api/msgs/:_id)
        .put(function(req, res) {
            // use our msg model to find the msg we want
            Msg.findById(req.params._id, function(err, msg) {
                if (err) {
                    res.send(err);
                }
                if (req.body.Author) {
                    msg.Author = req.body.Author;
                }
                if (req.body.Content) {
                    req.body.Content
                }
                if (req.body.DatePosted) {
                    msg.Content = req.body.Content;
                }

                // save the msg
                msg.save(function(err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({ message: 'Msg edited!' });
                });
            });
        })
        // delete the msg with this id (accessed at DELETE http://localhost:8081/api/msgs/:_id)
        .delete(function(req, res) {
            Msg.remove({
                _id: req.params._id
            }, function(err, msg) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Msg deleted' });
            });
        }
    );
};