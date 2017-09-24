var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('192.168.0.16:27017/neu');

/**Load marker
 *
 */
router.post('/save/marker/', function(req, res, next) {

    // Set collection
    var jsoncollection = db.get('jsoncollection');
    //res.setHeader('Content-type', 'application/json');
    // Submit to the DB
    jsoncollection  .insert({
        "geometry" : req.body.geometry,
        "name" : req.body.name,
        "art" : req.body.art,
        "cap":req.body.cap,
        "info":req.body.info

    }, function (err, doc) {
        if (err) {
            res.status(500).end("Failed to write Geometry to Database");
        }
        else {
            res.status(200).end("Successfully written Geometry to Database.");
        }
    });
});


/* GET stored marker */
router.get('/load/marker/:name/', function(req, res, next) {

    // Set Collection
    var collection = db.get('jsoncollection');
    //res.setHeader('Content-type', 'application/json');
    // Retrieve Entries with matching Name from Database. Compelete Entry is returned on match.
    collection.find({name: { $eq: req.params.name }},{},function(e,geometry){
        // Check for connection/syntax errors
        if(e){
            res.status(500).end("Failed to retrieve results from Database.");
        }else{
            // Check if there is an Entry - else fail
            if(geometry.length != 0){
                // Entry is returned
                res.send(geometry);
            } else {
                // No entry was found
                res.status(404).end("No such Object in the Database.");
            }
        };
    });
});


/* GET stored Route */
router.get('/load/etappe/:name/', function(req, res, next) {
  
  // Set Collection
  var collection = db.get('jsoncollection');
    //res.setHeader('Content-type', 'application/json');
    // Retrieve Entries with matching Name from Database. Compelete Entry is returned on match.
    collection.find({Etappenname: { $eq: req.params.name }},{},function(e,route){
    // Check for connection/syntax errors
    if(e){
      res.status(500).end("Failed to retrieve results from Database.");  
    }else{
      // Check if there is an Entry - else fail
      if(route.length != 0){
        // Entry is returned
        res.send(route);
      } else {
        // No entry was found
        res.status(404).end("No such Object in the Database.");
      }
    };
  });
});




/* POST Geojson to be saved to database. */
router.post('/save/etappe/', function(req, res, next) {

    // Set collection
    var jsoncollection = db.get('jsoncollection');
    //res.setHeader('Content-type', 'application/json');
    // Submit to the DB
    jsoncollection.insert({
        "Etappenname" : req.body.name,
        "Start":req.body.start,
        "Startort":req.body.startort,
        "Ende":req.body.end,
        "Zielort":req.body.zielort,
        "Website":req.body.website,
        "StartBild":req.body.picstart,
        "StartEnde":req.body.picende,
        "route" : req.body.route
    }, function (err, doc) {
        if (err) {
            res.status(500).end("Failed to write Route to Database");
        }
        else {
            res.status(200).end("Successfully written Route to Database.");
        }
    });
});


module.exports = router;
