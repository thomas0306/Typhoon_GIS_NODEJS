/**
 * Created by Thomas on 2/2/2016.
 */

function rest(router) {
    router.route('/test_ml')
        .get(function(req, res){
            var ml = require('machine_learning');
            var x = [[1,1,1,0,0,0],
                [1,0,1,0,0,0],
                [1,1,1,0,0,0],
                [0,0,1,1,1,0],
                [0,0,1,1,0,0],
                [0,0,1,1,1,0]];
            var y = [[1, 0],
                [1, 0],
                [1, 0],
                [0, 1],
                [0, 1],
                [0, 1]];

            var classifier = new ml.LogisticRegression({
                'input' : x,
                'label' : y,
                'n_in' : 6,
                'n_out' : 2
            });

            classifier.set('log level',1);

            var training_epochs = 800, lr = 0.01;

            classifier.train({
                'lr' : lr,
                'epochs' : training_epochs
            });

            x = [[1, 1, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 0],
                [1, 1, 1, 1, 1, 0]];

            console.log("Result : ",classifier.predict(x));
        });
}

module.exports.rest = rest;
