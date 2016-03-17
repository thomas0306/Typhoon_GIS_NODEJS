/**
 * Created by Thomas on 1/3/2016.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UsrPredictSchema   = new Schema({
    token: String,
    name : String,
    comment: String,
    path: Array,
    last_update : Date,
    intl_no: String,
    rec_time: Date
});

module.exports = mongoose.model('usr_predict', UsrPredictSchema);