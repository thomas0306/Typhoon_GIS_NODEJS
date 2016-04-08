/**
 * Created by Thomas on 15/2/2016.
 */
var TcTrack = require('./../models/tc_track');
var DataMine = require('./../generic/data_mining_basic');
var distanceUtil = require('./../generic/distance');
var rio_helper = require('./../data_mining/rio_config').rio_helper;
var LatLon = require('./../node_modules/geodesy/latlon-spherical');

var TREE = [
    'dist',
    'bear',
    'lat',
    'lon'
];

var TREE_PATH = '/project/typhoon_gis/r_tree/';

function checkDataIntegrity(target) {
    //11
    if (target.prev !== undefined && target.next !== undefined) return '11';
    //10
    else if (target.prev !== undefined) return '10';
    //01
    else if (target.next !== undefined) return '01';
    //00
    else return '00';
}

function rformat(key, value){
    if(value === true || value === false)
        value = '\''+value+'\'';
    return key+'='+value;
}
//handle loc
function handleLoc(loc, prefix){
    return [rformat((prefix||'')+'lon',loc[0]),rformat((prefix||'')+'lat',loc[1])];
}
//handle month
function handleMonth(date, prefix){
    return rformat((prefix||'')+'month', date.getMonth());
}


function json2rDataStr(target, prefix){
    var str = [];
    if(prefix === undefined) prefix = '';
    for(var prop in target){
        if(prop === 'loc')
            str = str.concat(handleLoc(target[prop], prefix));
        else if(prop === 'rec_time')
            str.push(handleMonth(target[prop], prefix));
        else if((prop === 'next' || prop === 'prev') && target[prop]._bsontype === undefined)
            str = str.concat(json2rDataStr(target[prop], prop+'_'));
        else if(typeof target[prop] !== Function && prop.charAt(0) !== '_' && prop !== 'next' && prop !== 'prev')
            str.push(rformat(prefix+prop, target[prop]));
    }

    return str;
}


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
                            },
                            '_id': { $ne: target._id }
                        })
                        .lean()
                        .populate('prev next', 'loc')
                        .select('intl_no loc prev next')
                        .sort('+intl_no +rec_time')
                        .exec(function(err, candidates){
                            if(err)
                                res.send(err);
                            if(target.prev === undefined)
                                res.json({message:'Unpredicted'});
                            for(each in candidates){
                                candidates[each].distance = distanceUtil.getDistanceFromLatLonInKm(target.loc[1], target.loc[0], candidates[each].loc[1], candidates[each].loc[0]);
                                candidates = DataMine.pruneDuplicateTyphoon(candidates);
                                var targetPastLoc = target.prev.loc;
                                candidates = DataMine.pruneTyphoonByDistance(targetPastLoc, candidates);
                            }

                            var prediction = DataMine.calculatePredictedCircle(candidates);
                            prediction.src = { lat: target.loc[1], lng: target.loc[0]};
                            //var prediction = distanceUtil.calculateIntersection(prediction, target.loc);
                            //{center: {lat: lat, lng: lng}, radius: radius, origin:{lat:lat, lng:lng}, intersects:[{lat:lat, lng:lng}]}
                            res.json(prediction);
                        });
                });
        });

    router.route('/predict_advance/:intl_no/:timestamp')
        .get(function(req, res){
            var intl_no = req.params.intl_no;
            var timestamp = req.params.timestamp;
            var rec_time = new Date(timestamp);

            TcTrack
                .findOne({
                    intl_no: intl_no,
                    rec_time: rec_time
                })
                .populate('next prev')
                .lean()
                .exec(function(err, target){
                    if(err||target === null)
                        res.send(err);
                    var integrity = checkDataIntegrity(target);
                    //target to data
                    var rDataStrArr = 'newdt <- data.frame('+json2rDataStr(target).join(',')+')';
                    rio_helper.code.push(rDataStrArr);

                    rio_helper.code.push("tmp <- c()");

                    for(idx in TREE){
                        var rda_name = ['tree',integrity,TREE[idx]];
                        var rda_file = rda_name.join('_')+'.rda';
                        rio_helper.code.push("load('" + TREE_PATH + rda_file + "')");
                        rio_helper.code.push("tmp <- c(tmp, predict("+rda_name.join('_')+", newdt))");

                    }
                    rio_helper.code.push("as.character(tmp)");

                    rio_helper.evaluate(function(err, val){
                        if(err){
                            res.json({message:'Unpredicted', err:err});
                            return;
                        }
                        val = val.map(function(each){
                           return parseFloat(each);
                        });
                        //[
                        //    106365.866525317,  distance
                        //    256.070414583614,  bearing
                        //    9.48874724197105,  lat
                        //    128.135055074323   lon
                        //]

                        var targetLatLon = new LatLon(target.loc[1], target.loc[0]);
                        var distbearLatLon = targetLatLon.destinationPoint(val[0],val[1]);
                        var predictLatLon = new LatLon(val[2], val[3]);
                        var midPt = predictLatLon.rhumbMidpointTo(distbearLatLon);
                        var radius = midPt.distanceTo(predictLatLon);
                        res.json({
                            center: {
                                //lat: distbearLatLon.lat,
                                //lng: distbearLatLon.lon
                                lat: midPt.lat,
                                lng: midPt.lon
                            },
                            src: {
                                lat: target.loc[1],
                                lng: target.loc[0]
                            },
                            radius: radius,
                            message: 'Predicted'
                        });
                    });
                });
        });
}

module.exports.rest = rest;
