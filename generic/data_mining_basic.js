/**
 * Created by Thomas on 15/2/2016.
 */
var distanceUtil = require('./distance');

var pruneDuplicateTyphoon = function(candidates){
    for(i = 0; i < candidates.length; i++){
        if(i < candidates.length - 1 && candidates[i].intl_no === candidates[i+1].intl_no)
            candidates.splice(i, 1);
    }

    return candidates;
};

var pruneTyphoonByDistance = function(targetPastLoc, candidates){
    for(each in candidates){
        if(candidates.prev === undefined) {
            candidates.splice(each, 1);
            continue;
        }
        var loc = candidates[each].prev.loc;
        var distanceKM = distanceUtil.getDistanceFromLatLonInKm(targetPastLoc[1], targetPastLoc[0], loc[1], loc[0]);
        if(distanceKM > this.PREV_NEAR_RADIUS_M / 1000){
            candidates.splice(each, 1);
        }
    }

    return candidates;
};

var calculatePredictedCircle = function(candidates){
    var result = {};
    if(candidates.length === 0) {
        result.message = 'Unpredicted';
    }
    result.center = this.getCentroid(candidates);
    result.radius = this.getRadiusM(result.center, candidates);
    result.message = 'Predicted';
    return result;
};
//{center: {lat: lat, lng: lng}, radius: radius}

var getCentroid = function(candidates){
    var center = {};
    center.lat = 0.0;
    center.lng = 0.0;
    var cnt = 0;

    for(each in candidates){
        if(candidates[each].next === undefined)
            continue;
        var loc = candidates[each].next.loc;
        center.lat += loc[1];
        center.lng += loc[0];
        cnt++;
    }

    center.lat /= cnt;
    center.lng /= cnt;

    return center;
};

var getRadiusM = function(center, candidates){
    var radius = 0.0;
    var cnt = 0;

    for(each in candidates){
        var loc = candidates[each].next.loc;
        if(loc !== undefined) {
            radius += distanceUtil.getDistanceFromLatLonInKm(loc[1], loc[0], center.lat, center.lng);
            cnt++;
        }
    }

    radius /= cnt;
    radius *= 1000;
    return radius;
};

module.exports.pruneDuplicateTyphoon = pruneDuplicateTyphoon;
module.exports.pruneTyphoonByDistance = pruneTyphoonByDistance;
module.exports.calculatePredictedCircle = calculatePredictedCircle;
module.exports.getCentroid = getCentroid;
module.exports.getRadiusM = getRadiusM;
//50km
module.exports.CURR_NEAR_RADIUS_M = 50000;
module.exports.PREV_NEAR_RADIUS_M = 50000;