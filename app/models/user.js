var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    UserName: {type: String, default: ''},
    Password: {type: String, default: ''},
    DisplayName: {type: String, default: ''} 
});