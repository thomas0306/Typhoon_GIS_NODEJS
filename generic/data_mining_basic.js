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

var calculateIntersection = function(prediction, target_loc){
    var
        x1 = target_loc[0],
        y1 = target_loc[1],
        x2 = prediction.center.lat,
        y2 = prediction.center.lng,
        distance = distanceUtil.getDistanceFromLatLonInKm(x1, y1, x2, y2);
        r2 = prediction.radius,
        r1 = Math.sqrt(Math.pow(distance*1000,2) * Math.pow(r2,2));

    var
        intersections = [],
        aIntersect = {},
        bIntersect = {};

    aIntersect.lat = (1/2) * (x2+x1) + (1/2) * (x2-x1) * (Math.pow(r1,2) - Math.pow(r2,2)) / Math.pow(d,2) + 2 * (y2-y1) * K / Math.pow(d,2);
    aIntersect.lng = (1/2) * (x2+x1) + (1/2) * (x2-x1) * (Math.pow(r1,2) - Math.pow(r2,2)) / Math.pow(d,2) - 2 * (y2-y1) * K / Math.pow(d,2);
    bIntersect.lat = (1/2) * (y2+y1) + (1/2) * (y2-y1) * (Math.pow(r1,2) - Math.pow(r2,2)) / Math.pow(d,2) + (-2) * (x2-x1) * K / Math.pow(d,2);
    bIntersect.lng = (1/2) * (y2+y1) + (1/2) * (y2-y1) * (Math.pow(r1,2) - Math.pow(r2,2)) / Math.pow(d,2) - (-2) * (x2-x1) * K / Math.pow(d,2);

    intersections.push(aIntersect);
    intersections.push(bIntersect);
}

module.exports.pruneDuplicateTyphoon = pruneDuplicateTyphoon;
module.exports.pruneTyphoonByDistance = pruneTyphoonByDistance;
module.exports.calculatePredictedCircle = calculatePredictedCircle;
module.exports.getCentroid = getCentroid;
module.exports.getRadiusM = getRadiusM;
//50km
module.exports.CURR_NEAR_RADIUS_M = 50000;
module.exports.PREV_NEAR_RADIUS_M = 50000;