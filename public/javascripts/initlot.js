/**
 * Geosoftware I, SoSe 2017, Abschlussabgabe
 * @author Eric Thieme-Garmann(429 603)
 */


'use strict';

var map, layercontrol, editableLayers, visualizationLayers, drawControl, routeControl, routeSwitch, currentRoute;


/** Defining my own Markers in order to properly display
 * parking lots and the stands
 */


function initMap() {

    var extras = L.layerGroup([]);

    var Normal = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}\'', {id: 'MapID', attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'}),
        streets   = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {id: 'MapID', attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});

    routeSwitch = true;
    map = L.map('map', {
        center: [40.416775, -3.703790], // Centre of Spain
        zoom: 12,
        layers: [Normal, extras],
        zoomControl: false
    });
    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    var baseMaps = {
        "<span style='color: brown'>Normal</span>": Normal,
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

    $(document).ready(function(){
            $("#rcShow").hide();
    });

    /** Function in order for the hide & show Button for the routeControl
     * to be properly displayed
     */
    $(document).ready(function(){
        $("#rcHide").click(function(){
            $("#rcHide").hide();
            routeControl.remove();
            $("#rcShow").show();


        });
    });
    /** Function in order for the hide & show Button for the routeControl
     * to be properly displayed
     */
    $(document).ready(function(){
        $("#rcShow").click(function(){
            $("#rcShow").hide();
            routeControl.addTo(map);
            $("#rcHide").show();
        });
    });


    // Code taken from http://www.liedman.net/leaflet-routing-machine/tutorials/interaction/
    // slightly changed in order to only show up when a double click is performed
    map.on('dblclick', function(e) {
        if (routeSwitch){
            var container = L.DomUtil.create('div'),
                startBtn = createButton('Start from this location', container),
                destBtn = createButton('Go to this location', container);
            console.log(e.latlng);
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


    /** When an object ( e.g. marker ) is moved onto the map this event will trigger
     *  Popup with our own content will show up and the user can fill in the information
     *  that wants to be stored
     */
    map.on(L.Draw.Event.CREATED, function (e) {

        var popupContent = '<form class="meineForm" id="saveMarker" action="/api/save/marker/" method="POST">'+
            '<div class="form-group">'+
            '<label class="control-label col-sm-5"><strong>Name: </strong></label>'+
            '<input type="text" placeholder="Required" id="name" name="name" class="form-control"/>'+
            '</div>'+
            '<div class="form-group">'+
            '<label class="control-label col-sm-5"><strong>Art: </strong></label>'+
            '<select class="form-control" id="art" name="art">'+
            '<option value="Parkplatz">Parkplatz</option>'+
            '<option value="Zuschauer">Zuschauerplatz</option>'+
            '</select>'+
            '</div>'+
            '<div class="form-group">'+
            '<label class="control-label col-sm-5"><strong>Kapazität: </strong></label>'+
            '<input type="number" min="0" class="form-control" id="cap" name="cap">'+
            '</div>'+
            //...
            '<div class="form-group">'+
            '<label class="control-label col-sm-5"><strong>Description: </strong></label>'+
            '<textarea class="form-control" rows="6" id="info" name="info">...</textarea>'+
            '</div>'+
            '<div class="form-group">'+
            '<div style="text-align:center;" class="col-xs-4"><button type="submit" value="speichern" class="btn btn-primary trigger-submit">Marker speichern</button></div>'+              '</div>'+
            '</form>';


        var type = e.layerType,
            layer = e.layer;
        //add the marker to a layer
        editableLayers.addLayer(layer);
        L.popup({maxWidth:1000})
            .setContent(popupContent)
            .setLatLng(layer.getLatLng())
            .openOn(map);
        //Override the default handler for the saveMarker form previously defined
        $('#saveMarker').submit(function(e) {
            e.preventDefault();
            if (true){

                // Append hidden field with actual GeoJSON structure
                var inputGeo = $('<input type="hidden" name="geometry" value=' + JSON.stringify(editableLayers.toGeoJSON())+ '>');
                $(this).append(inputGeo);
                var that = this;

                // submit via ajax
                $.ajax({
                    data: $(that).serialize(),
                    type: $(that).attr('method'),
                    url:  $(that).attr('action'),
                    error: function(xhr, status, err) {
                        console.log("Error while saving Route to Database");
                    },
                    success: function(res) {
                        console.log("Route with the name '" + that.elements.name.value+"' saved to Database.");
                    }
                });
                inputGeo.remove();
                return false;
            }
        });


    });

    map.on(L.Draw.Event.DRAWSTART, function (e) {
        map.closePopup();
        routeSwitch = false;

    });
    map.on(L.Draw.Event.DRAWSTOP, function (e) {
        routeSwitch = true;
    });



}

/** Modify the toolbar in order to show only one handle
 *
 */
L.DrawToolbar.include({
    getModeHandlers: function(map) {
        return [
            {
                enabled: true,
                handler: new L.Draw.Marker(map),
                title: 'Objekt erstellen'
            }
        ];
    }
});

// Setting up my custom toolbar with the usual draw options and different markers for an object , a parking lot and Zuschauerplätze
//https://github.com/Leaflet/Leaflet.draw/issues/265


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
function clearVisualizationLayer() {

    visualizationLayers.clearLayers();

}

function createForm() {

    var btn = document.createElement("BUTTON");        // Create a <button> element
    var t = document.createTextNode("CLICK ME");       // Create a text node
    //document.body.appendChild(btn);                    // Append <button> to <body>

}