/**
 * Geosoftware I, SoSe 2017, Abschlussabgabe
 * @author Eric Thieme-Garmann(429 603)
 */


'use strict';

var map, layercontrol, editableLayers, visualizationLayers, drawControl, routeControl, routeSwitch, currentRoute;


/** Defining my own Markers in order to properly display
 * parking lots and the stands
 */

var ParkplatzIcon = L.icon({
    iconUrl: '/Icons/Parkplatz.jpg',

    iconSize:     [35, 35], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [-4, -76] // point from which the popup should open relative to the iconAnchor

});

var ZuschauerIcon = L.icon({
    iconUrl: '/Icons/zuschauer.png',

    iconSize:     [35, 35], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [-4, -76] // point from which the popup should open relative to the iconAnchor

});

function initMap() {

    var extras = L.layerGroup([]);

    var Topographic = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {id: 'MapID', attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'}),
        streets   = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {id: 'MapID', attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});

    routeSwitch = true;
    map = L.map('map', {
        center: [40.416775, -3.703790], // Centre of Spain
        zoom: 6,
        layers: [Topographic, extras],
        zoomControl: false
    });
    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    var baseMaps = {
        "<span style='color: brown'>Topographic Map</span>": Topographic,
        "Open-Street Map": streets
    };

    var overlayMaps = {
        "Extras": extras
    };

    // add layer control to map
    layercontrol = L.control.layers(baseMaps, overlayMaps).addTo(map);

    // Setup Routing Plugin
    routeControl = L.Routing.control({
        waypoints: [
            null
        ],
        routeWhileDragging: true,
        show:true,
        position: 'topleft',
        geocoder: L.Control.Geocoder.nominatim()
    });
    routeControl.addTo(map);

    // Code taken from http://www.liedman.net/leaflet-routing-machine/tutorials/interaction/
    map.on('click', function(e) {
        if (routeSwitch){
            var container = L.DomUtil.create('div'),
                startBtn = createButton('Start from this location', container),
                destBtn = createButton('Go to this location', container);
            L.popup()
                .setContent(container)
                .setLatLng(e.latlng)
                .openOn(map);
            L.DomEvent.on(startBtn, 'click', function() {
                routeControl.spliceWaypoints(0, 1, e.latlng);
                map.closePopup();
            });
            L.DomEvent.on(destBtn, 'click', function() {
                routeControl.spliceWaypoints(routeControl.getWaypoints().length - 1, 1, e.latlng);
                map.closePopup();
            });

        }


    });

    routeControl.on('routeselected', function(e) {
        currentRoute = {};
        currentRoute.waypoints = routeControl.getWaypoints();
        currentRoute.route = e.route;

    });

    // setup Leaflet.draw plugin
    // layer to draw on
    editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);
    // Leaflet.draw options
    var options = {
        position: 'bottomright',
        edit: {
            featureGroup: editableLayers, //REQUIRED!!
            remove: false
        }
    };
    // setup Leaflet.draw plugin
    // layer to draw on
    visualizationLayers = new L.FeatureGroup();
    map.addLayer(visualizationLayers);

    // add controls to map
    drawControl = new L.Control.Draw(options);

    map.addControl(drawControl);


    // when drawing is done, save drawn objects to the drawing layer
    map.on(L.Draw.Event.CREATED, function (e) {
        var type = e.layerType,
            layer = e.layer;
        editableLayers.addLayer(layer);
    });

    map.on(L.Draw.Event.DRAWSTART, function (e) {
        map.closePopup();
        routeSwitch = false;
    });
    map.on(L.Draw.Event.DRAWSTOP, function (e) {
        routeSwitch = true;
    });

}


// Setting up my custom toolbar with the usual draw options and different markers for an object , a parking lot and Zuschauerplätze
//https://github.com/Leaflet/Leaflet.draw/issues/265
L.DrawToolbar.include({
    getModeHandlers: function(map) {
        return [
            {
                enabled: this.options.polyline,
                handler: new L.Draw.Polyline(map, this.options.polyline),
                title: L.drawLocal.draw.toolbar.buttons.polyline
            },
            {
                enabled: this.options.polygon,
                handler: new L.Draw.Polygon(map, this.options.polygon),
                title: L.drawLocal.draw.toolbar.buttons.polygon
            },
            {
                enabled: this.options.rectangle,
                handler: new L.Draw.Rectangle(map, this.options.rectangle),
                title: L.drawLocal.draw.toolbar.buttons.rectangle
            },
            {
                enabled: this.options.circle,
                handler: new L.Draw.Circle(map, this.options.circle),
                title: L.drawLocal.draw.toolbar.buttons.circle
            },
            {
                enabled: this.options.marker,
                handler: new L.Draw.Marker(map, this.options.marker),
                title: L.drawLocal.draw.toolbar.buttons.marker
            },
            {
                enabled: true,
                handler: new L.Draw.Marker(map, {icon: ParkplatzIcon}),
                title: 'Parkplatz erstellen'
            },
            {
                enabled: true,
                handler: new L.Draw.Marker(map, {icon: ZuschauerIcon}),
                title: 'Zuschauerplatz erstellen'
            },

        ];
    }
});

/**
 * add resizing capability (curtesy of several StackExchange users)
 */
function initUI() {
    var resize= $("#content");
    var containerWidth = $("body").width();

    $(resize).resizable({
        handles: 'e',
        /*maxWidth: 450,
         minWidth: 120,*/
        classes: { "ui-resizable-handle": "hidden-xs hidden-sm" },
        resize: function(event, ui){
            var currentWidth = ui.size.width;

            // this accounts for padding in the panels +
            // borders, you could calculate this using jQuery
            var padding = 12;

            // this accounts for some lag in the ui.size value, if you take this away
            // you'll get some instable behaviour
            $(this).width(containerWidth - currentWidth - padding);

            // set the content panel width
            $("#content").width(currentWidth);
        }
    });
}


document.addEventListener("DOMContentLoaded", function(event) {
    initMap();
    initUI();
});
