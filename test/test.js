/**
 * Geosoftware I, SoSe 2017, Abschlussaufgabe
 * @author Eric Thieme-Garmann(429 603)
 */

var assert;
var requireFromUrl;
var Leaflet;
var bootstrap;
var ajax;
var log;
var Geoc;
var turf;
var Leafletroute;
var Mongo;
var routing;
var init;
var showExternal;
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
        // bootstrap = require('../public/javascripts/imported/bootstrap-filestyle.min.js');
        Leaflet = requireFromUrl('https://unpkg.com/leaflet@1.0.3/dist/leaflet.js');
        ajax = requireFromUrl('https://code.jquery.com/jquery-3.2.1.min.js');
        log = require('../public/javascripts/imported/jsnlog.min.js');
        Geoc = require('../public/javascripts/imported/Control.Geocoder.js');
        turf = require('../public/javascripts/imported/turf.min.js');
        Leafletroute = require('../public/javascripts/imported/leaflet-routing-machine.js');
        Mongo = require('../public/javascripts/Mongo.js');
        init = require('../public/javascripts/init.js');
        showExternal=require('../public/javascripts/showExternal.js');
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

    describe("Datenbank Test", function() {
        var name = "testtesttest";
        var loadurl = "http://localhost:3000/api/load/etappe/"+name+"/";
        var saveurl = "http://localhost:3000/api/save/etappe/"+name+"/";


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