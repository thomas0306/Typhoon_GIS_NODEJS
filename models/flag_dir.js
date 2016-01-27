/**
 * Created by Thomas on 17/1/2016.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FlagDirSchema   = new Schema({
    flag_no : Number,
    description : String
});

module.exports = mongoose.model('flag_dir', FlagDirSchema);