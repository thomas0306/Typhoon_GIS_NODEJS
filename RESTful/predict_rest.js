/**
 * Created by Thomas on 15/2/2016.
 */
var TcTrack = require('./../models/tc_track');
var DataMine = require('./../generic/data_mining_basic');
var distanceUtil = require('./../generic/distance');

function rest(router) {
    //1501 2015-03-29T16:00:00.000Z
    router.route('/predict_basic/:intl_no/:timestamp')
        .get(function(req, res){
            var intl_no = req.params.intl_no;
            var timestamp = req.params.timestamp;
            var rec_time = new Date(timestamp);

            TcTrack
                .findOne({
                    intl_no: intl_no,
                    rec_time: rec_time
                })
                .populate('next prev', 'loc')
                .select('loc rec_time next prev')
                .exec(function(err, target){
                    if(err)
                        res.send(err);

                    TcTrack
                        .find({
                            'loc': {
                                "$nearSphere": {
                                    "$geometry": {
                                        "type": "Point",
                                        "coordinates": [target.loc[0], target.loc[1]],
                                        'spherical': true
                                    },
                                    "$maxDistance": DataMine.CURR_NEAR_RADIUS_M
                                }
                            }
                        })
                        .lean()
                        .populate('prev next', 'loc')
                        .select('intl_no loc prev next')
                        .sort('+intl_no +rec_time')
                        .exec(function(err, candidates){
                            if(err)
                                res.send(err);
                            for(each in candidates){
                                candidates[each].distance = distanceUtil.getDistanceFromLatLonInKm(target.loc[1], target.loc[0], candidates[each].loc[1], candidates[each].loc[0]);
                                candidates = DataMine.pruneDuplicateTyphoon(candidates);
                                var targetPastLoc = target.prev.loc;
                                candidates = DataMine.pruneTyphoonByDistance(targetPastLoc, candidates);
                            }

                            var prediction = DataMine.calculatePredictedCircle(candidates);
                            //var prediction = distanceUtil.calculateIntersection(prediction, target.loc);
                            //{center: {lat: lat, lng: lng}, radius: radius, origin:{lat:lat, lng:lng}, intersects:[{lat:lat, lng:lng}]}
                            res.json(prediction);
                        });
                    //TcTrack.aggregate(
                    //    [
                    //        {
                    //            '$geoNear': {
                    //                'near': {
                    //                    type: 'Point',
                    //                    coordinates: [target.loc[0], target.loc[1]]
                    //                },
                    //                'distanceField': 'distance',
                    //                'maxDistance': DataMineProp.CURR_NEAR_RADIUS_M,
                    //                'spherical': true
                    //                //'query': { 'loc.type': 'Point' }
                    //            }
                    //        },
                    //        {
                    //            '$sort': {'distance': -1}
                    //        }
                    //    ],
                    //    function(err, tracks){
                    //        if(err)
                    //            res.send(err);
                    //        res.json(tracks);
                    //    }
                    //);
                });
        });
}

module.exports.rest = rest;
