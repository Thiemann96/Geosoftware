var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

/* GET Karte page. */
router.get('/karte/', function(req, res, next) {
  res.render('karte', {});
});

/* GET permalink etappe. */
router.get('/Etappe/:id/', function(req, res, next) {
  res.render('parkplaetze', {loadEtappe: req.params.id});
});

/* GET permalinks marker. */
router.get('/Marker/:id/', function(req, res, next) {
    res.render('parkplaetze', {loadMarker: req.params.id});
});


/* GET Parkplatze page. */
router.get('/parkplaetze', function(req, res, next) {
    res.render('parkplaetze', {});
});


/* GET Impressum page. */
router.get('/impressum', function(req, res, next) {
  res.render('impressum', {});
});


module.exports = router;
