/**
 * Created by Thomas on 1/3/2016.
 */
var UsrPredict = require('./../models/usr_predict');
var Util = require('./../generic/util');

function rest(router){
    router.route('/usr_predict')
        .get(function(req, res){
           UsrPredict.find({}).exec(function(err, predicts){
               if(err)
                   res.send(err);
               res.json(predicts);
           });
        });

    router.route('/usr_predict/:token')
        .get(function(req, res){
            var token = req.params.token;

            UsrPredict.findOne({ token: token }).exec(function(err, predict){
                if(err){
                    res.send({message:'fail', err:err});
                }
                res.json(predict);
            });

        });

    router.route('/usr_predict/:name/:comment/:intl_no/:rec_time')
        .put(function(req, res){
            var predict = new UsrPredict();
            predict.name = req.params.name;
            predict.comment = req.params.comment;
            predict.intl_no = req.params.intl_no;
            predict.rec_time = new Date(req.params.rec_time);
            predict.last_update = new Date();
            var token = Util.generateToken();
            predict.token = token;

            predict.save(function(err){
                if(err)
                    res.send({message: 'failed', error: err });
                res.send({message: 'success', token: token});
            })
        });
}

module.exports.rest = rest;