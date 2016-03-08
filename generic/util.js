/**
 * Created by Thomas on 15/10/15.
 */
var moment = require('moment-timezone');

//expected string format: YYMMDDHH
var toDate = function(date){
    date = date.substr(0, 2) + "," + date.substr(2, 2) + "," + date.substr(4, 2) + "," + date.substr(6, 2);
    var dateArr = date.split(",");
    dateArr[0] = ((dateArr[0] <= new Date().getFullYear()%100)?"20":"19") + dateArr[0];
    dateArr[1] = parseInt(dateArr[1])-1;

    var toReturn = new Date(dateArr[0], dateArr[1], dateArr[2], dateArr[3]);
    return toReturn;
};

//YYMMDDHH
var japanTime2UTCDate = function(date){
    var year = date.substr(0,2);
    date = ((year <= new Date().getFullYear()%100)?"20":"19") + date;
    return moment.tz(date, 'YYYYMMDDHH', 'Asia/Tokyo').tz('UTC').toDate();
};

var parseYYYYMMDD = function (str) {
    return moment.tz(str, 'YYYYMMDD', 'Asia/Tokyo').tz('UTC').toDate();
}

var generateToken = function(){
    return Math.random().toString(36).slice(2);
}

module.exports.toDate = toDate;
module.exports.japanTime2UTCDate = japanTime2UTCDate;
module.exports.parseYYYYMMDD = parseYYYYMMDD;
module.exports.generateToken = generateToken;