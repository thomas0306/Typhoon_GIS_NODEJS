/**
 * Created by Thomas on 23/2/2016.
 */
var rio = require('rio');

var options = {
    host : "localhost",
    port : 6311,
    callback: function (err, val) {
        if (!err) {
            console.log("RETURN:"+val);
        } else {
            console.log("ERROR:Rserve call failed")
        }
    }

};
options.command = "pi / 2 * 2 * 2";
rio.enableDebug(true);
rio.evaluate(options);