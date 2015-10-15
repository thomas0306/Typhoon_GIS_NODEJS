/**
 * Created by Thomas on 6/8/15.
 */
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){

});
mongoose.connect('mongodb://localhost/typhoon_gis');

