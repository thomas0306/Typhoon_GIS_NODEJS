var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Typhoon GIS' });
});

router.get('/index-panel', function(req, res, next){
  res.render('index-panel');
});

router.get('/index-panel-drawer', function(req, res, next){
  res.render('index-panel-drawer');
});

router.get('/index-panel-main', function(req, res, next){
  res.render('index-panel-main');
});

router.get('/index-panel-main-toolbar', function(req, res, next){
  res.render('index-panel-main-toolbar');
});

module.exports = router;
