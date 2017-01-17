var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    Content: {type: String, default: ''},
    Author: {type: String, default: ''}
});