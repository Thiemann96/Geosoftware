/**
 * Geosoftware I, SoSe 2017, Abschlussabgabe
 * @author Eric Thieme-Garmann(429 603)
 */

'use strict';

/**
 * provide the objects drawn using the Leaflet.draw plugin as a GeoJSON to download
 */

function exportDrawing() {
    // fake a link
    var anchor = document.createElement('a');
    // encode geojson as the link's contents
    anchor.href = 'data:application/vnd.geo+json,' + encodeURIComponent(JSON.stringify(editableLayers.toGeoJSON()));
    anchor.target = '_blank';
    // give it a nice file name
    anchor.download = "your-drawing.geojson";
    // add to document (Firefox needs that)
    document.body.appendChild(anchor);
    // fake a click on the link -> file will be offered for download
    anchor.click();
    // remove that element again as if nothing happened
    document.body.removeChild(anchor);
}