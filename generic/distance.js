/**
 * Created by Thomas on 16/2/2016.
 */
var LatLon = require('./../node_modules/geodesy/latlon-spherical');

var getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
    var p1 = new LatLon(lat1,lon1);
    var p2 = new LatLon(lat2,lon2);
    return p1.distanceTo(p2)/1000;
};

var calculateIntersection = function(circle, origin) {
};

module.exports.getDistanceFromLatLonInKm = getDistanceFromLatLonInKm;
module.exports.calculateIntersection = calculateIntersection;