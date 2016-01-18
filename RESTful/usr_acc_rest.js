/**
 * Created by Thomas on 17/1/2016.
 */
var UsrAcc = require('./../models/usr_acc');
var Util = require('./../generic/util')

function rest(router) {
    router.route('/users')
        .get(function(req, res){
            UsrAcc.find(function(err, users){
                if(err)
                    res.send(err);
                res.json(users);
            });
        })
        .post(function(req, res){
            var user = new User(req.body);
            user.save(function(err){
                if(err)
                    res.send(err);
                res.send({message: 'usr_acc created!'});
            });
        });
    router.route('/users/:usr_name')
        .get(function(req, res){
            UsrAcc.findOne({usr_name:req.params.usr_name}, function(err, usr_acc){
                if(err)
                    res.send(err);
                res.json(usr_acc);
            });
        })
        .put(function(req, res) {
            UsrAcc.findOne({usr_name:req.params.usr_name}, function(err, usr_acc){
                if(err)
                    res.send(err);

                for(prop in req.body){
                    usr_acc[prop] = req.body[prop];
                }

                usr_acc.save(function(err){
                    if(err)
                        res.json(err);
                    res.json({message: 'Usr_acc updated!'});
                });
            });
        });
}

module.exports.rest = rest;