/**
 * Created by Thomas on 17/1/2016.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UsrAccSchema   = new Schema({
    usr_name : String,
    password : String,
    email : String,
    last_login : Date
});

module.exports = mongoose.model('usr_acc', UsrAccSchema);