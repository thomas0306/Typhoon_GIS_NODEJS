/**
 * Created by Thomas on 15/2/2016.
 */
var TcTrack = require('./../models/tc_track');
var DataMineProp = require('./../generic/data_mining_prop');

function rest(router) {
    //1501 2015-03-29T16:00:00.000Z
    router.route('/predict_basic/:intl_no/:timestamp')
        .get(function(req, res){
            var intl_no = req.params.intl_no;
            var timestamp = req.params.timestamp;
            var rec_time = new Date(timestamp);

            var test = TcTrack
                .findOne({
                    intl_no: intl_no,
                    rec_time: rec_time
                })
                .populate('next prev', 'loc')
                .select('loc rec_time next prev')
                .exec(function(err, track){
                    if(err)
                        res.send(err);
                    TcTrack.aggregate(
                        [
                            {
                                '$geoNear': {
                                    'near': {
                                        type: 'Point',
                                        coordinates: [track.loc[0], track.loc[1]]
                                    },
                                    'distanceField': 'distance',
                                    'maxDistance': DataMineProp.CURR_NEAR_RADIUS_M,
                                    'spherical': true
                                    //'query': { 'loc.type': 'Point' }
                                }
                            },
                            {
                                '$sort': {'distance': -1}
                            }
                        ],
                        function(err, tracks){
                            if(err)
                                res.send(err);
                            res.json(tracks);
                        }
                    )
                });
        });
}

module.exports.rest = rest;
