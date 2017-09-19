/**
 * Geosoftware I, SoSe 2017, Abschlussabgabe
 * @author Eric Thieme-Garmann(429 603)
 */

'use strict';


// Credit to https://github.com/perliedman/leaflet-routing-machine/blob/344ff09c8bb94d4e42fa583286d95396d8227c65/src/L.Routing.js
function RouteToGeoJSON(route){
    var wpNames = [],
        wpCoordinates = [],
        i,
        wp,
        latLng;

    for (i = 0; i < route.waypoints.length; i++) {
        wp = route.waypoints[i];
        latLng = L.latLng(wp.latLng);
        wpNames.push(wp.name);
        wpCoordinates.push([latLng.lng, latLng.lat]);
    }
    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {
                    id: 'waypoints',
                    names: wpNames
                },
                geometry: {
                    type: 'MultiPoint',
                    coordinates: wpCoordinates
                }
            },
            {
                type: 'Feature',
                properties: {
                    id: 'line',
                },
                geometry: routeToLineString(route)
            }
        ]
    };
}

// Credits to https://github.com/perliedman/leaflet-routing-machine/blob/344ff09c8bb94d4e42fa583286d95396d8227c65/src/L.Routing.js
function routeToLineString(route) {
    var lineCoordinates = [],
        i,
        latLng;

    for (i = 0; i < route.coordinates.length; i++) {
        latLng = L.latLng(route.coordinates[i]);
        lineCoordinates.push([latLng.lng, latLng.lat]);
    }

    return {
        type: 'LineString',
        coordinates: lineCoordinates
    };
}


// Code taken from http://www.liedman.net/leaflet-routing-machine/tutorials/interaction/
function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}


/*

        input.btn.btn-default(id='rcHide', type='submit', value='Hide route control')

        input.btn.btn-default(id='rcShow', type='submit', value='Show route control')*/
