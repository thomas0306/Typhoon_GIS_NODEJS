/**
 * Created by Thomas on 8/4/2016.
 */
var JmaCrawler = require('./../crawler/jma_crawler').JmaCrawler;

var socket = require('./../SocketIO/socket');

function rest(router){
    router.route('/demo_push_typ')
        .get(function(req, res){
            var data = '66666 1601  062 0001 1601 0 6               CITYU               20160108\n16011400 002 2 148 1635 1004     000\n16011406 002 2 150 1630 1004     000';
            JmaCrawler.processData(data);
            res.json({});
        });
}

module.exports.rest = rest;