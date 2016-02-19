/**
 * Created by Thomas on 15/1/2016.
 */
var util = require('./../generic/util');
var TcRecord = require('./../models/tc_record');
var TcTrack = require('./../models/tc_track');

function isModifiedVal(oldVal, newVal){
    return oldVal !== newVal;
}

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

var updateRecordLine = function(tcRecord, line){
    console.log(line[1]);
    //case 8 and case 9 for old data...
    switch(line.length){
        case 8:
            if(isModifiedVal(tcRecord.last_status, parseInt(line[4]))) tcRecord.last_status = parseInt(line[4]);
            if(isModifiedVal(tcRecord.dur_hour, parseInt(line[5]))) tcRecord.dur_hour = parseInt(line[5]);
            if(isModifiedVal(tcRecord.name, line[6])) tcRecord.name = line[6];
            if(isModifiedVal(tcRecord.last_modi, util.parseYYYYMMDD(line[6]))) tcRecord.last_modi = util.parseYYYYMMDD(line[6]);
            break;
        case 9:
            if(isModifiedVal(tcRecord.last_status, parseInt(line[4]))) tcRecord.last_status = parseInt(line[4]);
            if(isModifiedVal(tcRecord.dur_hour, parseInt(line[5]))) tcRecord.dur_hour = parseInt(line[5]);
            if(isModifiedVal(tcRecord.name, line[6])) tcRecord.name = line[6];
            if(isModifiedVal(tcRecord.last_modi, util.parseYYYYMMDD(line[7]))) tcRecord.last_modi = util.parseYYYYMMDD(line[7]);
            break;
        case 10:
        default:
            if(isModifiedVal(tcRecord.trop_cyc_no, parseInt(line[3]))) tcRecord.trop_cyc_no = parseInt(line[3]);
            if(isModifiedVal(tcRecord.last_status, parseInt(line[5]))) tcRecord.last_status = parseInt(line[5]);
            if(isModifiedVal(tcRecord.dur_hour, parseInt(line[6]))) tcRecord.dur_hour = parseInt(line[6]);
            if(isModifiedVal(tcRecord.name, line[7])) tcRecord.name = line[7];
            if(isModifiedVal(tcRecord.last_modi, util.parseYYYYMMDD(line[8]))) tcRecord.last_modi = util.parseYYYYMMDD(line[8]);
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
            tcTrack.wind_dir_50kt_plus = parseInt(line[7].substr(0, 1));
            tcTrack.max_wind_50kt_plus_radius = parseInt(line[7].substr(1, 4));
            tcTrack.min_wind_50kt_plus_radius = parseInt(line[8]);
            tcTrack.wind_dir_30kt_plus = parseInt(line[9].substr(0, 1));
            tcTrack.max_wind_30kt_plus_radius = parseInt(line[9].substr(1, 4));
            tcTrack.min_wind_30kt_plus_radius = parseInt(line[10]);
            tcTrack.landfall_passage_indi = (line[11] == "1") ? true : false;
            break;
    }
    return tcTrack;
};

var updateTrackLine = function(tcTrack, line){
    switch(line.length){
        case 7:
            tcTrack.grade = parseInt(line[2]);
            if(parseInt(line[4])/10 > 180)
                tcTrack.loc = [(parseInt(line[4])/10)-360, parseInt(line[3])/10].map(Number);
            else
                tcTrack.loc = [parseInt(line[4])/10, parseInt(line[3])/10].map(Number);
            tcTrack.cent_pressure = parseInt(line[5]);
            break;
        case 8:
            tcTrack.grade = parseInt(line[2]);
            if(parseInt(line[4])/10 > 180)
                tcTrack.loc = [(parseInt(line[4])/10)-360, parseInt(line[3])/10].map(Number);
            else
                tcTrack.loc = [parseInt(line[4])/10, parseInt(line[3])/10].map(Number);
            tcTrack.cent_pressure = parseInt(line[5]);
            tcTrack.max_sus_wind_spd = parseInt(line[6]);
            break;
        case 12:
            tcTrack.grade = parseInt(line[2]);
            if(parseInt(line[4])/10 > 180)
                tcTrack.loc = [(parseInt(line[4])/10)-360, parseInt(line[3])/10].map(Number);
            else
                tcTrack.loc = [parseInt(line[4])/10, parseInt(line[3])/10].map(Number);
            tcTrack.cent_pressure = parseInt(line[5]);
            tcTrack.max_sus_wind_spd = parseInt(line[6]);
            tcTrack.wind_dir_50kt_plus = parseInt(line[7].substr(0, 1));
            tcTrack.max_wind_50kt_plus_radius = parseInt(line[7].substr(1, 4));
            tcTrack.min_wind_50kt_plus_radius = parseInt(line[8]);
            tcTrack.wind_dir_30kt_plus = parseInt(line[9].substr(0, 1));
            tcTrack.max_wind_30kt_plus_radius = parseInt(line[9].substr(1, 4));
            tcTrack.min_wind_30kt_plus_radius = parseInt(line[10]);
            tcTrack.landfall_passage_indi = (line[11] == "1") ? true : false;
            break;
    }

    return tcTrack;
};

var appendNextPointer = function(TcTrack, tracks){
    for(i = 0; i < tracks.length; i++){
        if(i !== tracks.length-1)
            TcTrack.update({ _id: tracks[i]._id }, { $set: { next: tracks[i+1]._id }}, updateCallback);
    }
};

var appendPrevPointer = function(TcTrack, tracks){
    for(i = tracks.length-1; i >= 0; i--){
        if(i !== 0)
            TcTrack.update({ _id: tracks[i]._id}, { $set: { prev: tracks[i-1]._id }}, updateCallback);
    }
};

var updateCallback = function(err){
    if(err) console.log(err);
}

var connectTracks = function(TcTrack, intl_no){
    TcTrack.find({ intl_no:intl_no }).select('_id').sort({'rec_time': 'asc'}).exec(function(err, tracks){
        if(err)
           console.log(err);
        appendNextPointer(TcTrack, tracks);
        appendPrevPointer(TcTrack, tracks);
    });
}

module.exports.parseRecordLine = parseRecordLine;
module.exports.updateRecordLine = updateRecordLine;
module.exports.parseTrackLine = parseTrackLine;
module.exports.updateTrackLine = updateTrackLine;
module.exports.connectTracks = connectTracks;
//module.exports.file2Json = file2Json;