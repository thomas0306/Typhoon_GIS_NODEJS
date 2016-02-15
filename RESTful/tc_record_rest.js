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

            var dateCriteria = {};

            var and = [];
            crits.forEach(function(each) {

                each = each.toUpperCase();
                if(each.match(/(before|BEFORE):(0[1-9]|1[0-9]|2[0-9]|3[0-1])\-(0[1-9]|1[0-2])-[1-9][0-9]{3}/)){
                    var dateArr = each.split(':')[1].split('-');
                    dateCriteria['before'] = new Date(dateArr[2], dateArr[1]-1, dateArr[0]);
                }else if(each.match(/(after|AFTER):(0[1-9]|1[0-9]|2[0-9]|3[0-1])\-(0[1-9]|1[0-2])-[1-9][0-9]{3}/)){
                    var dateArr = each.split(':')[1].split('-');
                    dateCriteria['after'] = new Date(dateArr[2], dateArr[1]-1, dateArr[0], 23, 59, 59);
                }else if(each.match(/(between|BETWEEN)(:(0[1-9]|1[0-9]|2[0-9]|3[0-1])\-(0[1-9]|1[0-2])-[1-9][0-9]{3}){2}/)){
                    var dateStr = each.split(':');
                    var startArr = dateStr[1].split('-');
                    var endArr = dateStr[2].split('-');
                    dateCriteria['between']['start'] = new Date(startArr[2], startArr[1]-1, startArr[0]);
                    dateCriteria['between']['end'] = new Date(endArr[2], endArr[1]-1, endArr[0], 23, 59, 59);
                }else {
                    var or = [];
                    or.push({'intl_no': new RegExp('.*' + each + '.*')});
                    or.push({'name': new RegExp('.*' + each + '.*')});
                    or.push({'trop_cyc_no': parseInt(each) || -1});
                    and.push({$or:or});
                }
            });

            var o = [];
            if(and.length > 0){
                o.push({ $match: { $and: and}});
            }else if(dateCriteria === {}){
                o.push({ $match: { trop_cyc_no: -1}});
            }

            o.push({$sort: { intl_no: 1 }});
            o.push({
                $lookup: {
                    from: 'tc_tracks',
                    localField: 'intl_no',
                    foreignField: 'intl_no',
                    as: 'rec_dates'
                }
            });

            TcRecord.aggregate(o,
                function(err, data){
                    if(err)
                        res.send(err);
                    if(dateCriteria !== {}){
                        console.log(dateCriteria);
                        for(x = 0; x < data.length; x++){
                            data[x].rec_dates.sort(function(a, b){
                                return a.rec_time - b.rec_time;
                            });
                            data[x].rec_dates.splice(1, data[x].rec_dates.length-2);
                            var trim = false;
                            if(dateCriteria['before'] !== undefined){
                                if(!dateCriteria['before'].getTime() > data[x].rec_dates[0].rec_time.getTime()) trim = true;
                            }
                            if(dateCriteria['after'] !== undefined){
                                if(!dateCriteria['after'].getTime() < data[x].rec_dates[1].rec_time.getTime()) trim = true;
                            }
                            if(dateCriteria['between'] !== undefined){
                                if(!(dateCriteria['between'].start.getTime() < data[x].rec_dates[1].rec_time.getTime() && dateCriteria['between'].end.getTime() > data[x].rec_dates[0].rec_time.getTime())) trim = true;
                            }

                            if(trim)
                                data.slice(x, 1);
                        }
                    }

                    res.json(data);
                }
            );
        });
}

module.exports.rest = rest;