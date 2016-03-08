/**
 * Created by Thomas on 2/3/2016.
 */

var TcRecord = require('./../models/tc_record');
var TcTrack = require('./../models/tc_track');

function rest(router){

    router.route('/test_socket').get(function(req, res){
        require('./../SocketIO/socket').broadcast();
        res.json();
    });

    //hrs: range from x hrs before to current time
    router.route('/curr_tc_records/:hrs')
        .get(function(req, res){
            var hrs = req.params.hrs
            var after = new Date();
            after.setHours(after.getHours() - hrs);

            TcTrack.find({ rec_time: { $gte: after } }).distinct('intl_no')
                .exec(function(err, intl_nos){
                    if(err || !intl_nos || !intl_nos.length) {
                        res.json([]);
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
                        if(err || !records || !records.length)
                            res.json([]);
                        records = records.map(function(each){
                           each.tracks = each.tracks.sort(function(a,b){
                               return a.rec_time - b.rec_time;
                           });
                           return each;
                        });
                        res.json(records);
                    });
                });

        });
}

module.exports.rest = rest;