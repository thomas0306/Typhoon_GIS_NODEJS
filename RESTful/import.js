/**
 * Created by Thomas on 15/1/2016.
 */
var parseData = require('../generic/parseData');
var request = require('request');
var TcRecord = require('./../models/tc_record');
var TcTrack = require('./../models/tc_track');

function rest(router) {
    router.route('/import/:filename')
        .post(function(req,res){
            var done = false;
            request.get('http://localhost:3000/uploads/' + req.params.filename + '?rand='+Math.floor((Math.random() * 100) + 1), function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //for each line

                    var linesArr = body.split('\n');
                    var currIntlNo = ""
                    for(var lineIdx in linesArr){
                        var lineArr = linesArr[lineIdx].split(/\s+/g);

                        //data line 1
                        if(lineArr[0] == '66666'){
                            if(currIntlNo !== '')
                                parseData.connectTracks(TcTrack, currIntlNo);
                            currIntlNo = lineArr[1];
                            var tcRecord = parseData.parseRecordLine(lineArr);
                            tcRecord.save(function(err){
                                if(err)
                                    console.log(err);
                            });
                        }
                        //data line 2
                        else if(lineArr[0].length == 8){
                            var tcTrack = parseData.parseTrackLine(currIntlNo, lineArr);
                            tcTrack.save(function(err){
                                if(err)
                                    console.log(err);
                            });
                        }

                    }

                    done = true;
                    // Continue with your processing here.
                }else{
                    res.json(error);
                }
            });
            require('deasync').loopWhile(function(){return !done;});
            res.json({message:'success'});
        });
}

module.exports.rest = rest;