/**
 * Created by Thomas on 26/1/2016.
 */
var FlagDir = require('./../models/flag_dir');

function rest(router) {
    router.route('/flag_dir')
        .get(function(req, res){
            FlagDir.find().sort({flag_no: 'asc'}).exec(function(err, flags){
                if(err)
                    res.send(err);
                res.json(flags);
            });
        });
}

module.exports.rest = rest;
