/**
 * Created by Thomas on 3/2/2016.
 */
var TcTrack = require('./../models/tc_track');

function rest(router) {
    router.route('/geo_query_rect/:lat1/:lng1/:lat2/:lng2')
        .get(function(req, res){
            var ilat1 = parseInt(req.params.lat1);
            var ilng1 = parseInt(req.params.lng1);
            var ilat2 = parseInt(req.params.lat2);
            var ilng2 = parseInt(req.params.lng2);

            TcTrack.find({
                'loc': {
                    '$geoWithin': {
                        '$box': [
                            [ilng1, ilat1],
                            [ilng2, ilat2]
                        ]
                    }
                }
            }).distinct('intl_no', function(err, intl_nos){
                if(err)
                    res.send(err);
                intl_nos.sort();
                res.json(intl_nos);
            });
        });

    router.route('/get_heatmap_data')
        .get(function(req, res){
           TcTrack.aggregate(
                {
                    $group:{ _id: '$loc', weight: {$sum: 1}}
                }, function(err, data){
                    if(err)
                        res.send(err);
                   res.json(data);
                })
        });
}

module.exports.rest = rest;
