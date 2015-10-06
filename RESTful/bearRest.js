/**
 * Created by Thomas on 6/8/15.
 */

var Bear = require('./../models/bear');

function rest(router) {
    router.route('/bears')

        .post(function(req, res) {

            var bear = new Bear();      // create a new instance of the Bear model
            bear.name = req.body.name;  // set the bears name (comes from the request)

            // save the bear and check for errors
            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear created!' });
            });

        })

        // get all the bears (accessed at GET http://localhost:8080/api/bears)
        .get(function (req, res) {
            Bear.find(function (err, bears) {
                if (err)
                    res.send(err);

                res.json(bears);
            });
        });
}

module.exports.rest = rest;