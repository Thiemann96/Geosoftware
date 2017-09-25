var logger = JL();
var consoleAppender = JL.createConsoleAppender('consoleAppender');
logger.setOptions({"appenders": [consoleAppender]});


/**
 * @desc main function;
 *      reads txt input into a string (filecontent) and extracts the coordinates
 * @see Learnweb
 * @param event OpenFile event
 */
var ReadFile = function(event) {

    var input = event.target;
    var reader = new FileReader();
    const output = [];
    var array;

    // Empty List after new fileupload to avoid very long lists without refresh


    reader.onload = function () {
        console.log("Hallo2");
        var fileContent = reader.result;

        //Call Geojson build function
        var gLayer = L.geoJson(JSON.parse(fileContent));
        console.dir(gLayer);
        gLayer.addTo(visualizationLayers);


        JL("full_check").warn("works completely!"); //logs whether the whole script runs
    };


    reader.readAsText(input.files[0]);
};



/**
 * Geosoftware I, SoSe 2017, Abschlussabgabe
 * @author Eric Thieme-Garmann(429 603)
 */

'use strict';
/**
 *@desc Reads the geojson
 */
function readGeoJSONFromTA() {
    return JSON.parse($('textarea#geojson-area')[0].value);
}

/**
 *@desc add and load the read GeoJSON on the map
 */
function loadGeoJSON() {
    var feat = readGeoJSONFromTA();
    console.dir(feat);
    var gLayer = L.geoJson(feat);
    console.dir(gLayer);
    gLayer.addTo(visualizationLayers);

}


