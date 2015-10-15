/**
 * Created by Thomas on 15/10/15.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TcTrackSchema   = new Schema({
    intl_no : String,
    rec_time: Date,
    grade: Number,
    loc: { type: [Number], index: '2dsphere' },
    cent_pressure: Number,
    max_sus_wind_spd: Number,
    wind_dir_50kt_plus: Number,
    max_wind_50kt_plus_radius: Number,
    min_wind_50kt_plus_radius: Number,
    wind_dir_30kt_plus: Number,
    max_wind_30kt_plus_radius: Number,
    min_wind_30kt_plus_radius: Number,
    landfall_passage_indi: Boolean
});

module.exports = mongoose.model('tc_track', TcTrackSchema);
