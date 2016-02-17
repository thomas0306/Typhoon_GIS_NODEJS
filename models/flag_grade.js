/**
 * Created by Thomas on 17/1/2016.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FlagGradeSchema   = new Schema({
    flag_no : Number,
    description : String,
    colorHSB: Array
});

module.exports = mongoose.model('flag_grade', FlagGradeSchema);