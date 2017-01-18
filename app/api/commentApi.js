var Comment = require('../models/comment');
var router = require('express').Router;

var commentApi = function(router) {
    router.route('/comments')
        // create a comment (accessed at POST http://localhost:8081/api/comments)
        .post(function(req, res, next) {
            var comment = new Comment();
            console.log(req.body);
            comment.Author = req.body.Author;
            comment.Content = req.body.Content;
            comment.DatePosted = new Date();

            comment.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Comment created!' });
            });
        })
        .get(function(req, res) {
            Comment.find(function(err, comments) {
                if (err) {
                    res.send(err);
                }

                res.json(comments);
            });
        }
    );
    router.route('/comments/:_id')
        // get the comment with that id (accessed at GET http://localhost:8081/api/comments/:_id)
        .get(function(req, res) {
            Comment.findById(req.params._id, function(err, comment) {
                if (err) {
                    res.send(err);
                }
                res.json(comment);
            });
        })
        // update the comment with this id (accessed at PUT http://localhost:8081/api/comments/:_id)
        .put(function(req, res) {
            // use our comment model to find the comment we want
            Comment.findById(req.params._id, function(err, comment) {
                if (err) {
                    res.send(err);
                }
                if (req.body.Author) {
                    comment.Author = req.body.Author;
                }
                if (req.body.Content) {
                    req.body.Content
                }
                if (req.body.DatePosted) {
                    comment.Content = req.body.Content;
                }

                // save the comment
                comment.save(function(err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({ message: 'Comment edited!' });
                });
            });
        })
        // delete the comment with this id (accessed at DELETE http://localhost:8081/api/comments/:_id)
        .delete(function(req, res) {
            Comment.remove({
                _id: req.params._id
            }, function(err, comment) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Comment deleted' });
            });
        }
    );
};

module.exports = commentApi;