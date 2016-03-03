/**
 * Created by Thomas on 1/3/2016.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UsrPredictSchema   = new Schema({
    token: String,
    name : String,
    comment: String,
    last_update : Date
});

module.exports = mongoose.model('usr_predict', UsrPredictSchema);