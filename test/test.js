/**
 * Geosoftware I, SoSe 2017, Abschlussaufgabe
 * @author Jens Seifert (408076)
 */

var assert;
var requireFromUrl;
var Leaflet;
var ajax;
var log;
var Geoc;
var turf;
var Leafletroute;
var etappe;
var marks;
var route;
var mylog;
var request;
var expect;
describe('The test', function() {
    //loads modules
    before(function () {
        this.jsdom = require('jsdom-global')();
        requireFromUrl = require('require-from-url/sync');
        L = requireFromUrl('https://unpkg.com/leaflet@1.0.3/dist/leaflet.js');
        global.L = L;
        $ = requireFromUrl('https://code.jquery.com/jquery-3.2.1.min.js');
        global.$ = $;
        assert = require('assert');
        Leaflet = requireFromUrl('https://unpkg.com/leaflet@1.0.3/dist/leaflet.js');
        ajax = requireFromUrl('https://code.jquery.com/jquery-3.2.1.min.js');
        log = require('../public/javascripts/jsnlog.min.js');
        Geoc = require('../public/javascripts/Control.Geocoder.js');
        turf = require('../public/javascripts/turfnearest.min.js');
        Leafletroute = require('../public/javascripts/leaflet-routing-machine.js');
        //mylog = require('../public/javascripts/jsnlog.js');
        etappe = require('../public/javascripts/etappe.js');
        route = require('../public/javascripts/route.js');
        marks = require('../public/javascripts/marks.js');
        request = require("request");
        expect = require("chai").expect;
    });
    after(function () {
        this.jsdom();
    });
    describe("Test Startseite", function() {
        var url = "http://localhost:3000/";
        it("returns status 200", function(done) {
            request(url, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });

    describe("DB Test", function() {
        var name = "dasdarfjawohlnichtwarsein";
        var loadurl = "http://localhost:3000/api/load/object/"+name+"/";
        var saveurl = "http://localhost:3000/api/save/object/"+name+"/";
        var findurl = "http://localhost:3000/api/find/object/"+name+"/";
        var delurl = "http://localhost:3000/api/del/object/"+name+"/";

        it("returns status 200, save to DB", function(done) {
            request(saveurl, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it("returns status 200, load from DB", function(done) {
            request(loadurl, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it("returns status 200, find in DB", function(done) {
            request(findurl, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it("returns status 404, no entry in DB", function(done) {
            request(delurl, function(error, response, body) {
                done();
                request(loadurl, function(error, response, body) {
                    expect(response.statusCode).to.equal(404);
                    done();
                });
            });
        });
    });
});