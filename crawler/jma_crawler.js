/**
 * Created by Thomas on 18/2/2016.
 */
var schedule = require('node-schedule');
var request = require('request');
var TcRecord = require('./../models/tc_record');
var TcTrack = require('./../models/tc_track');
var parseData = require('./../generic/parseData');
var util = require('./../generic/util');


var JmaCrawler = {
    instance: undefined,

    PATTERN: '00 */5 * * * *',

    URL: ['http://www.jma.go.jp/jma/jma-eng/jma-center/rsmc-hp-pub-eg/Besttracks/bst','','.txt'],

    init: function(){
        this.instance = schedule.scheduleJob(this.PATTERN, this.crawl.bind(null,this));
    },

    crawl: function(crawler){
        crawler.setCurrentYear();
        console.log(new Date()+': Crawling from: '+ crawler.URL.join(''));
        request.get(crawler.URL.join(''), crawler.reqCallback.bind(crawler));
    },

    reqCallback: function(err, res, body){
        console.log('Response from JMA: '+ res.statusCode + ', ' + res.statusMessage);
        if(err){
            console.log(err);
        }else if(res.statusCode === 200){
            this.processData(body)
        }
    },

    processData: function(data){
        console.log(data);
        var lineArr = data.split('\n');
        var intl_no = '';
        for(i in lineArr){
            var colArr = lineArr[i].split(/\s+/g);
            if(colArr[0] === '66666') {
                if(intl_no !== ''){
                    parseData.connectTracks(TcTrack, intl_no);
                }
                intl_no = colArr[1];
                this.retrieveRecordLine(colArr);
            }
            else
                this.retrieveTrackLine(colArr, intl_no);
        }
        console.log('Update complete');
    },

    retrieveRecordLine: function(colArr){
        TcRecord.findOne(
            { intl_no: colArr[1] },
            function(err, record){
                if(record === null){
                    //create
                    var obj = parseData.parseRecordLine(colArr);
                    obj.save(function(err){
                        if(err)
                            console.log(err);
                    });
                }else{
                    //update
                    record = parseData.updateRecordLine(record, colArr);
                    if(record.isModified()) {
                        record.save(function (err) {
                            if (err)
                                console.log(err);
                        });
                    }
                }
            }
        );
    },

    retrieveTrackLine: function(colArr, intl_no){
        var rec_time = util.toDate(colArr[0]);
        TcTrack.findOne(
            { intl_no: intl_no, rec_time: rec_time },
            function(err, track){
                if(track === null){
                    //create
                    var obj = parseData.parseTrackLine(intl_no, colArr);
                    obj.save(function(err){
                        if(err)
                            console.log(err);
                    });
                }else{
                    //update
                    //track = parseData.updateTrackLine(track, colArr);
                    //if(track.isModified()) {
                    //    track.save(function (err) {
                    //        if (err)
                    //            console.log(err);
                    //    });
                    //}
                }
            }
        );
    },

    setCurrentYear: function(){
        this.URL[1] = new Date().getFullYear();
    }

};

module.exports.JmaCrawler = JmaCrawler;