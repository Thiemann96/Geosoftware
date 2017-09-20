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


