/**
 * Created by Thomas on 23/2/2016.
 */
var TcTrack = require('./../models/tc_track');
var LatLon = require('./../node_modules/geodesy/latlon-spherical');
var json2csv = require('json2csv');

var fields = [
    { label: 'bearing', value: 'bearing', default: '' },
    { label: 'distance', value: 'distance', default: '' },
    { label: 'cent_pressure', value: 'cent_pressure', default: '' },
    { label: 'grade', value: 'grade', default: '' },
    { label: 'lat', value: function(row){ return row.loc[1]; } },
    { label: 'lon', value: function(row){ return row.loc[0]; } },
    { label: 'landfall_passage_indi', value: 'landfall_passage_indi', default: '' },
    { label: 'max_sus_wind_spd', value: 'max_sus_wind_spd', default:'' },
    { label: 'max_wind_30kt_plus_radius', value: 'max_wind_30kt_plus_radius', default: '' },
    { label: 'max_wind_50kt_plus_radius', value: 'max_wind_50kt_plus_radius', default: '' },
    { label: 'min_wind_30kt_plus_radius', value: 'min_wind_30kt_plus_radius', default: '' },
    { label: 'min_wind_50kt_plus_radius', value: 'min_wind_50kt_plus_radius', default: '' },
    { label: 'month', value: function(row){ return row.rec_time.getMonth(); }, default: '' },
    { label: 'wind_dir_30kt_plus', value: 'wind_dir_30kt_plus', default: '' },
    { label: 'wind_dir_50kt_plus', value: 'wind_dir_50kt_plus', default: '' },
    { label: '', value: '', default: '' },

    { label: 'next_cent_pressure', value: 'next.cent_pressure', default: '' },
    { label: 'next_grade', value: 'next.grade', default: '' },
    { label: 'next_lat', value: function(row){ return row.next.loc[1]; } },
    { label: 'next_lon', value: function(row){ return row.next.loc[0]; } },
    { label: 'next_landfall_passage_indi', value: 'next.landfall_passage_indi', default: '' },
    { label: 'next_max_sus_wind_spd', value: 'next.max_sus_wind_spd', default:'' },
    { label: 'next_max_wind_30kt_plus_radius', value: 'next.max_wind_30kt_plus_radius', default: '' },
    { label: 'next_max_wind_50kt_plus_radius', value: 'next.max_wind_50kt_plus_radius', default: '' },
    { label: 'next_min_wind_30kt_plus_radius', value: 'next.min_wind_30kt_plus_radius', default: '' },
    { label: 'next_min_wind_50kt_plus_radius', value: 'next.min_wind_50kt_plus_radius', default: '' },
    { label: 'next_month', value: function(row){ return row.next.rec_time.getMonth(); }, default: '' },
    { label: 'next_wind_dir_30kt_plus', value: 'next.wind_dir_30kt_plus', default: '' },
    { label: 'next_wind_dir_50kt_plus', value: 'next.wind_dir_50kt_plus', default: '' },

    { label: 'prev_cent_pressure', value: 'prev.cent_pressure', default: '' },
    { label: 'prev_grade', value: 'prev.grade', default: '' },
    { label: 'prev_lat', value: function(row){ return row.prev===undefined?'':row.prev.loc[1]; } },
    { label: 'prev_lon', value: function(row){ return row.prev===undefined?'':row.prev.loc[0]; } },
    { label: 'prev_landfall_passage_indi', value: 'prev.landfall_passage_indi', default: '' },
    { label: 'prev_max_sus_wind_spd', value: 'prev.max_sus_wind_spd', default:'' },
    { label: 'prev_max_wind_30kt_plus_radius', value: 'prev.max_wind_30kt_plus_radius', default: '' },
    { label: 'prev_max_wind_50kt_plus_radius', value: 'prev.max_wind_50kt_plus_radius', default: '' },
    { label: 'prev_min_wind_30kt_plus_radius', value: 'prev.min_wind_30kt_plus_radius', default: '' },
    { label: 'prev_min_wind_50kt_plus_radius', value: 'prev.min_wind_50kt_plus_radius', default: '' },
    { label: 'prev_month', value: function(row){ return row.prev===undefined?'':row.prev.rec_time.getMonth(); }, default: '' },
    { label: 'prev_wind_dir_30kt_plus', value: 'prev.wind_dir_30kt_plus', default: '' },
    { label: 'prev_wind_dir_50kt_plus', value: 'prev.wind_dir_50kt_plus', default: '' }
    //{ label: '', value: '', default: '' },
];

function calculateDistance(lat1, lng1, lat2, lng2){
    var p1 = new LatLon(lat1,lng1);
    var p2 = new LatLon(lat2,lng2);
    return p1.distanceTo(p2);
}

function calculateBearing(lat1, lng1, lat2, lng2){
    var p1 = new LatLon(lat1,lng1);
    var p2 = new LatLon(lat2,lng2);
    return p1.bearingTo(p2);
}

function fieldManipulation(data){
    return data.filter(function(each){
        if(each.next !== undefined) {
            each.distance = calculateDistance(each.loc[1], each.loc[0], each.next.loc[1], each.next.loc[0]);
            each.bearing = calculateBearing(each.loc[1], each.loc[0], each.next.loc[1], each.next.loc[0]);
            return true;
        }
        return false;
    });
}

function rest(router) {
    router.route('/getCSV')
        .get(function(req, res){
            TcTrack
                .find()
                .populate('next prev')
                .lean()
                .exec(function(err, data){
                    if(err)
                        res.send(err);
                    data = fieldManipulation(data);
                    json2csv({ data: data, fields: fields }, function(err, csv) {
                        if (err) console.log(err);
                        res.contentType('csv');
                        res.send(new Buffer(csv));
                    });
                    //res.json(data);
                });
        });
}

module.exports.rest = rest;
