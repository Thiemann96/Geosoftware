/**
 * Geosoftware I, SoSe 2017, Abschlussabgabe
 * @author Eric Thieme-Garmann(429 603)
 */

'use strict';
/**
 * load external GeoJSON file via Ajax (Caution! Server to load from has to allow cross origin requests!)
 */
function showExternalFile() {
    $.get(document.getElementById('externalfile').value, function(response) {
        L.geoJSON(JSON.parse(response)).addTo(map);
    });
}

