/**
 * Geosoftware I, SoSe 2017, Abschlussabgabe
 * @author Eric Thieme-Garmann(429 603)
 */

'use strict';

/**
 * get user's location via geolocation web api and display it on the map
 */

function showLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // marker of current position
            L.marker([position.coords.latitude, position.coords.longitude], {title: 'Ihre Position'}).bindPopup('Ihre Position').addTo(map);
            // accuracy radius (95% confidence)
            L.circle([position.coords.latitude, position.coords.longitude], position.coords.accuracy, {fill: 'lightblue', color: 'blue'}).addTo(map);
        });
    } else {
        alert("Ihr Gerät oder Browser unterstützt die Standortbestimmung leider nicht :(");
    }
}