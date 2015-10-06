/** Created by Thomas on 6/8/15. */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TcRecordSchema   = new Schema({
    intl_no : String,
    trop_cyc_no : Number,
    last_status : Number,
    dur_hour : Number,
    name : String,
    last_modi : Date
});

module.exports = mongoose.model('TcRecord', TcRecordSchema);
