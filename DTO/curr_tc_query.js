/**
 * Created by Thomas on 3/3/2016.
 */
var TcRecord = require('./../models/tc_record');
var TcTrack = require('./../models/tc_track');

function retrieveTcTracksWithinNhrs(hrs, callback){
    var after = new Date();
    after.setHours(after.getHours() - hrs);

    TcTrack.find({ rec_time: { $gte: after } }).distinct('intl_no')
        .exec(function(err, intl_nos){
            if(err || !intl_nos || !intl_nos.length) {
                callback([]);
                return;
            }
            TcRecord.aggregate([
                { $match: {
                    intl_no: { $in: intl_nos }
                }},
                { $lookup: {
                    from: 'tc_tracks',
                    localField: 'intl_no',
                    foreignField: 'intl_no',
                    as: 'tracks'
                }}
            ], function(err,records){
                if(err || !records || !records.length) {
                    callback([]);
                    return;
                }
                records = records.map(function(each){
                    each.tracks = each.tracks.sort(function(a,b){
                        return b.rec_time - a.rec_time;
                    });
                    return each;
                });
                callback(records);
            });
        });
}

module.exports = retrieveTcTracksWithinNhrs;