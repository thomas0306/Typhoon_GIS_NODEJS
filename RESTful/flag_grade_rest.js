/**
 * Created by Thomas on 17/2/2016.
 */
var FlagGrade = require('./../models/flag_grade');

function rest(router) {
    router.route('/flag_grade')
        .get(function(req, res){
            FlagGrade.find().sort({flag_no: 'asc'}).exec(function(err, flags){
                if(err)
                    res.send(err);
                res.json(flags);
            });
        });
}

module.exports.rest = rest;
