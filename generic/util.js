/**
 * Created by Thomas on 15/10/15.
 */

//expected string format: YYMMDDHH
var toDate = function(date){
    date = date.substr(0, 2) + "," + date.substr(2, 2) + "," + date.substr(4, 2) + "," + date.substr(6, 2);
    var dateArr = date.split(",");
    dateArr[0] = ((dateArr[0] <= new Date().getFullYear()%100)?"20":"19") + dateArr[0];
    dateArr[1] = parseInt(dateArr[1])-1;

    var toReturn = new Date(dateArr[0], dateArr[1], dateArr[2], dateArr[3]);
    return toReturn;
};

var parseYYYYMMDD = function (str) {
    var y = str.substr(0,4),
        m = str.substr(4,2) - 1,
        d = str.substr(6,2);
    var D = new Date(y,m,d);
    return (D.getFullYear() == y && D.getMonth() == m && D.getDate() == d) ? D : 'invalid date';
}

module.exports.toDate = toDate;
module.exports.parseYYYYMMDD = parseYYYYMMDD;