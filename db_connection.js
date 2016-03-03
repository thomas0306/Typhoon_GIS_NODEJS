/**
 * Created by Thomas on 6/8/15.
 */
var mongoose = require('mongoose');
//mongoose.set('debug', true);
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){

});

var connection_string = 'mongodb://localhost/typhoon_gis'

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}
mongoose.connect(connection_string);

