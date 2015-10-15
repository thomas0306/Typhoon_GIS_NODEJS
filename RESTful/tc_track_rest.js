/**
 * Created by Thomas on 15/10/15.
 */

var TcTrack = require('./../models/tc_track');
var Util = require('./../generic/util')

function rest(router) {
    router.route('/tc_tracks')

        .post(function(req, res) {

            var tcTrack = new TcTrack();
            tcTrack.intl_no = req.body.intl_no;
            tcTrack.rec_time = Util.toDate(req.body.rec_time);
            tcTrack.grade = req.body.grade;

            tcTrack.loc = req.body.loc.split(',').map(Number);
            tcTrack.cent_pressure = req.body.cent_pressure;
            tcTrack.max_sus_wind_spd = req.body.max_sus_wind_spd;
            tcTrack.wind_dir_50kt_plus = req.body.wind_dir_50kt_plus;
            tcTrack.max_wind_50kt_plus_radius = req.body.max_wind_50kt_plus_radius;
            tcTrack.min_wind_50kt_plus_radius = req.body.min_wind_50kt_plus_radius;
            tcTrack.wind_dir_30kt_plus = req.body.wind_dir_30kt_plus;
            tcTrack.max_wind_30kt_plus_radius = req.body.max_wind_30kt_plus_radius;
            tcTrack.min_wind_30kt_plus_radius = req.body.min_wind_30kt_plus_radius;
            tcTrack.landfall_passage_indi = req.body.landfall_passage_indi;

            tcTrack.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'tc_track created!' });
            });

        })

        .get(function (req, res) {
            TcTrack.find(function (err, tcTracks) {
                if (err)
                    res.send(err);

                res.json(tcTracks);
            });
        });
}

module.exports.rest = rest;