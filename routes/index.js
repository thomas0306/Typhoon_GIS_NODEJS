var express = require('express');
var router = express.Router();

/* GET home page. */
router
    .get('/', function(req, res, next) {
      res.render('index', { title: 'Typhoon GIS'});
    })

    .get('/index-panel', function(req, res, next){
      res.render('index-panel');
    })

    .get('/index-panel-drawer', function(req, res, next){
      res.render('index-panel-drawer');
    })

    .get('/index-panel-main', function(req, res, next){
      res.render('index-panel-main', {apiKey: 'AIzaSyCg41XC9fHNb22opdSPUWHrLSpS6dxzRzw'});
    })

    .get('/index-panel-main-dialog', function(req, res, next){
      res.render('index-panel-main-dialog');
    });


module.exports = router;
