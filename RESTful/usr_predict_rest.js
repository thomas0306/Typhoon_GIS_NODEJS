/**
 * Created by Thomas on 1/3/2016.
 */
var UsrPredict = require('./../models/usr_predict');
var TcRecord = require('./../models/tc_record')
var Util = require('./../generic/util');

function rest(router){
    router.route('/usr_predict/:token')
        .get(function(req, res){
            var token = req.params.token;
            UsrPredict.findOne({ token: token }).exec(function(err, predicts){
                if(err)
                    res.send(err);
                else{
                    TcRecord.aggregate([
                        { $match: {
                            intl_no: predicts.intl_no
                        }},
                        { $lookup: {
                            from: 'tc_tracks',
                            localField: 'intl_no',
                            foreignField: 'intl_no',
                            as: 'tracks'
                        }}
                    ], function(err,records){
                        if(err || !records || !records.length)
                            res.json([]);
                        records = records.map(function(each){
                            each.tracks = each.tracks.sort(function(a,b){
                                return b.rec_time - a.rec_time;
                            });
                            return each;
                        });
                        res.json({info: predicts, record: records[0]});
                    });
                }
            });

        });

    router.route('/usr_predict/:info/:circle')
        .put(function(req, res){
            console.log(req.params.obj);
            console.log(req.params.circle);
            res.json({message:'success'});
        });

    router.route('/usr_predict')
        .put(function(req, res){
            var obj = req.body;

            var predict = new UsrPredict();
            predict.name = obj.name === ''?'anonymous':obj.name;
            predict.comment = obj.comment === ''?'No comment':obj.comment;
            predict.intl_no = obj.intl_no;
            predict.rec_time = new Date(obj.rec_time);
            predict.path = obj.path;
            predict.last_update = new Date();
            var token = Util.generateToken();
            predict.token = token;

            predict.save(function(err){
                if(err)
                    res.send({message: 'failed', error: err });
                res.send({message: 'success', token: token});
            });
        });
}

module.exports.rest = rest;