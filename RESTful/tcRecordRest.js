/**
 * Created by Thomas on 6/8/15.
 */

var TcRecord = require('./../models/tc_record');

function rest(router) {
    router.route('/tcRecords')

        .post(function(req, res) {

            var tcRecord = new TcRecord();
            tcRecord.intl_no = req.body.intl_no;
            tcRecord.trop_cyc_no = req.body.trop_cyc_no;
            tcRecord.last_status = req.body.last_status;
            tcRecord.dur_hour = req.body.dur_hour;
            tcRecord.name = req.body.name;
            tcRecord.last_modi = req.body.last_modi;

            tcRecord.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Tc_Record created!' });
            });

        })

        // get all the bears (accessed at GET http://localhost:8080/api/bears)
        .get(function (req, res) {
            TcRecord.find(function (err, tcRecords) {
                if (err)
                    res.send(err);

                res.json(tcRecords);
            });
        });
}

module.exports.rest = rest;