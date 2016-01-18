/**
 * Created by Thomas on 15/1/2016.
 */
var util = require('./../generic/util');
var TcRecord = require('./../models/tc_record');
var TcTrack = require('./../models/tc_track');

//Length: 8
//LineArr: 66666,6106,7,6106,0,6,19890601,
//
//Length: 9
//LineArr: 66666,6107,50,6107,0,6,DORIS,19890601,
//
//Length: 10
//LineArr: 66666,1501,032,0001,1501,0,6,MEKKHALA,20150217,
var parseRecordLine = function(line){
    console.log(line[1]);
    var tcRecord = new TcRecord();
    //case 8 and case 9 for old data...
    switch(line.length){
        case 8:
            tcRecord.intl_no = line[1];
            tcRecord.last_status = parseInt(line[4]);
            tcRecord.dur_hour = parseInt(line[5]);
            tcRecord.name = line[6];
            tcRecord.last_modi = util.parseYYYYMMDD(line[6]);
            break;
        case 9:
            tcRecord.intl_no = line[1];
            tcRecord.last_status = parseInt(line[4]);
            tcRecord.dur_hour = parseInt(line[5]);
            tcRecord.name = line[6];
            tcRecord.last_modi = util.parseYYYYMMDD(line[7]);
            break;
        case 10:
        default:
            tcRecord.intl_no = line[1];
            tcRecord.trop_cyc_no = parseInt(line[3]);
            tcRecord.last_status = parseInt(line[5]);
            tcRecord.dur_hour = parseInt(line[6]);
            tcRecord.name = line[7];
            tcRecord.last_modi = util.parseYYYYMMDD(line[8]);
            break;
    }

    return tcRecord;
};

//7:
//51021906 002 2 200 1385 1010
//[0]      1   2 3   4    5    6
//
//8:
//78010218 002 2 110 1235 1008     000
//[0]      1   2 3   4    5        6   7
//
//12:
//78010212 002 3 107 1245 1004     040     00000 0000 90050 0050
//[0]      1   2 3   4    5        6       7     8    9     10   11
var parseTrackLine = function(intlNo, line){
    var tcTrack = new TcTrack();
    switch(line.length){
        case 7:
            tcTrack.intl_no = intlNo;
            tcTrack.rec_time = util.toDate(line[0]);
            tcTrack.grade = parseInt(line[2]);
            if(parseInt(line[4])/10 > 180)
                tcTrack.loc = [(parseInt(line[4])/10)-360, parseInt(line[3])/10].map(Number);
            else
                tcTrack.loc = [parseInt(line[4])/10, parseInt(line[3])/10].map(Number);
            tcTrack.cent_pressure = parseInt(line[5]);
            break;
        case 8:
            tcTrack.intl_no = intlNo;
            tcTrack.rec_time = util.toDate(line[0]);
            tcTrack.grade = parseInt(line[2]);
            if(parseInt(line[4])/10 > 180)
                tcTrack.loc = [(parseInt(line[4])/10)-360, parseInt(line[3])/10].map(Number);
            else
                tcTrack.loc = [parseInt(line[4])/10, parseInt(line[3])/10].map(Number);
            tcTrack.cent_pressure = parseInt(line[5]);
            tcTrack.max_sus_wind_spd = parseInt(line[6]);
            break;
        case 12:
            tcTrack.intl_no = intlNo;
            tcTrack.rec_time = util.toDate(line[0]);
            tcTrack.grade = parseInt(line[2]);
            if(parseInt(line[4])/10 > 180)
                tcTrack.loc = [(parseInt(line[4])/10)-360, parseInt(line[3])/10].map(Number);
            else
                tcTrack.loc = [parseInt(line[4])/10, parseInt(line[3])/10].map(Number);
            tcTrack.cent_pressure = parseInt(line[5]);
            tcTrack.max_sus_wind_spd = parseInt(line[6]);
            tcTrack.min_wind_50kt_plus_radius = parseInt(line[8]);
            tcTrack.wind_dir_30kt_plus = parseInt(line[9].substr(0, 1));
            tcTrack.max_wind_30kt_plus_radius = parseInt(line[9].substr(1, 3));
            tcTrack.min_wind_30kt_plus_radius = parseInt(line[10]);
            tcTrack.landfall_passage_indi = (line[11] == "1") ? true : false;
            break;
    }
    return tcTrack;
};
//var file2Json = function(file){
//
//};

module.exports.parseRecordLine = parseRecordLine;
module.exports.parseTrackLine = parseTrackLine;
//module.exports.file2Json = file2Json;