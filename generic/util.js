/**
 * Created by Thomas on 15/10/15.
 */

var logger = require('./../winston.js');

//expected string format: YYMMDDHH
var toDate = function(date){
    date = date.substr(0, 2) + "," + date.substr(2, 2) + "," + date.substr(4, 2) + "," + date.substr(6, 2);
    logger.debug("Parsing date String: " + date);
    var dateArr = date.split(",");
    dateArr[0] = parseInt(dateArr[0]) + (dateArr[0] <= new Date().getFullYear()%100)?2000:1900;
    dateArr[1] = parseInt(dateArr[1])-1;

    var toReturn = new Date(dateArr[0], dateArr[1], dateArr[2], dateArr[3]);
    logger.debug('Parsed date: ' + toReturn.toString());
    return toReturn;
}

module.exports.toDate = toDate;