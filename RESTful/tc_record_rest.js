/**
 * Created by Thomas on 6/8/15.
 */

var TcRecord = require('./../models/tc_record');

function rest(router) {
    router.route('/tc_records')
        //Create
        .post(function(req, res) {
            var tcRecord = new TcRecord(req.body);
            tcRecord.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'tcRecord created!' });
            });

        })
        //Retrieve all
        .get(function (req, res) {
            TcRecord.find(function (err, tcRecords) {
                if (err)
                    res.send(err);

                res.json(tcRecords);
            });
        });

    router.route('/tc_records/:intl_no')
        //Retrieve single
        .get(function(req,res){
           TcRecord.findOne({intl_no:req.params.intl_no}, function(err, tcRecord){
               if(err)
                 res.send(err);

               res.json(tcRecord);
           })
        })
        //Update
        .put(function(req, res){
            TcRecord.findOne({intl_no:req.params.intl_no}, function(err, tcRecord){
                if(err)
                    res.send(err);

                for(prop in req.body){
                    tcRecord[prop] = req.body[prop];
                }

                tcRecord.save(function(err){
                    if(err)
                        res.send(err);

                    res.json({ message: 'tcRecord updated!'});
                })
            })
        })
        .delete(function(req, res){
            TcRecord.remove({
                intl_no: req.params.intl_no
            }, function(err, tcRecord){
                if(err)
                    res.send(err);

                res.json({message: 'tcRecord deleted!'});
            })
        });

    router.route('/tc_records_search/list')
        .get(function (req, res) {
            TcRecord.find(function (err, tcRecords) {
                if (err)
                    res.send(err);

                res.json(tcRecords);
            });
        });
    router.route('/tc_records_search/')
        .get(function (req, res) {
            res.json([]);
        });

    router.route('/tc_records_search/:criteria')
        .get(function(req, res){
            var crits = req.params.criteria.split(/\s+/g);

            var and = [];
            crits.forEach(function(each) {
                var or = [];
                each = each.toUpperCase();
                or.push({'intl_no': new RegExp('.*' + each + '.*')});
                or.push({'name': new RegExp('.*' + each + '.*')});
                or.push({'trop_cyc_no': parseInt(each) || -1});
                and.push({$or:or});
            });

            TcRecord.find({
                $and: and
            }, function(err, tcRecords){
               if(err)
                   res.send(err);

               res.json(tcRecords);
            });
        });
}

module.exports.rest = rest;