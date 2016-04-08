/**
 * Created by Thomas on 6/8/15.
 */
// ROUTES FOR OUR API
// =============================================================================
var express = require('express');
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log(new Date()+': Receiving API call...');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

require('./tc_record_rest').rest(router);
require('./tc_track_rest').rest(router);
require('./usr_acc_rest').rest(router);
require('./flag_dir_rest').rest(router);
require('./flag_grade_rest').rest(router);
require('./import').rest(router);
require('./geo_query_rest').rest(router);
require('./predict_rest').rest(router);
require('./csv_rest').rest(router);
require('./usr_predict_rest').rest(router);
require('./curr_tc_query_rest').rest(router);
require('./demo_rest').rest(router);

module.exports = router;