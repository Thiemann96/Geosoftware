/**
 * Geosoftware I, SoSe 2017, Abschlussabgabe
 * @author Eric Thieme-Garmann(429 603)
 */


'use strict';
/**Global variables which are used throughout the app
 */
var   city, markerlat,markerlng , zwischenspeicher, map, layercontrol,loadedEtappe,loadedMarkers, editableLayers, visualizationLayers, drawControl, routeControl, routeSwitch, currentRoute;
var  parklots=[];


function initMap() {

    var extras = L.layerGroup([]);
    var alleMarker = L.layerGroup([]);
    loadedEtappe = new L.FeatureGroup();
    loadedMarkers = new L.FeatureGroup();
    var tmp1 = new L.FeatureGroup();
    var streets = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}\'', {id: 'MapID', attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'}),
        Normal   = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {id: 'MapID', attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});

    routeSwitch = true;
    map = L.map('map', {
        center: [40.416775, -3.703790], // Centre of Spain 40.416775, -3.703790
        zoom: 12,
        layers: [Normal, extras,alleMarker],
        zoomControl: false
    });


    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    var baseMaps = {
        "<span style='color: brown'>OpenStreetMap</span>": Normal,
    };

    var overlayMaps = {
        "Geladene Routen": extras,
        "Parkplätze & Zuschauerplätze":alleMarker
    };

    // add layer control to map
    layercontrol = L.control.layers(baseMaps, overlayMaps).addTo(map);

    // Setup Routing Plugin
    routeControl = L.Routing.control({
        serviceUrl: "http://10.67.60.199:5000/route/v1"   ,
        waypoints: [
            null
        ],
        routeWhileDragging: false,
        show:true,
        position: 'topleft',
        geocoder: L.Control.Geocoder.nominatim()
    });


    routeControl.addTo(map);


    /** Function in order for the hide & show Button for the routeControl
     * to be properly displayed,shown by default
     */
    $(document).ready(function(){
        $("#rcShow").hide();
    });

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


    $(document).ready(function(){
        $("#loadSEtappe").click(function(){
            $("#pictures").show();
        });
    });


    // Code taken from http://www.liedman.net/leaflet-routing-machine/tutorials/interaction/
    // slightly changed in order to only show up when a double click is performed
    map.on('click', function(e) {


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
                zwischenspeicher = e.latlng;
                map.closePopup();

            });
            L.DomEvent.on(destBtn, 'click', function() {


                //Abfrage die erkennt ob vorherige Ziel Marker vorhanden ist

                var popupEnde;
                var popupStart;

                map.removeLayer(tmp1);


                var popupStartcontent = '<form  id="saveEtappe" action="/api/save/etappe/" method="POST">'+
                    '<div class="form-group">'+
                    '<label class="control-label col-sm-5"><strong>Etappenname: </strong></label>'+
                    '<input type="text" placeholder="Required" id="name" name="name" class="form-control"/>'+
                    '</div>'+
                    '<div class="form-group">'+
                    '<label id="starttermin" class="control-label col-sm-2"><strong>Starttermin: </strong></label>'+
                    '<input type="date"  class="form-control" id="start" name="start">'+

                    '</div>'+
                    '<div class="form-group">'+
                    '<label id="endtermin" class="control-label col-sm-5"><strong>Ende </strong></label>'+
                    '<input type="date"  class="form-control" id="end" name="end">' +
                    '</div>'+
                    //...
                    '<div class="form-group">'+
                    '<label class="control-label col-sm-5"><strong>Website </strong></label>'+
                    '<input type="text" placeholder="https://www......" id="website" name="website" class="form-control"/>'+
                    '</div>'+
                    '<div class="form-group">'+
                    '<label class="control-label col-sm-7"><strong>Bild zu Start: </strong></label>'+
                    '<input type="text" placeholder="https://www......" id="picstart" name="picstart" class="form-control"/>'+
                    '</div>'+                    '<div class="form-group">'+
                    '<label class="control-label col-sm-7"><strong>Bild zu Ende: </strong></label>'+
                    '<input type="text" placeholder="https://www......" id="picende" name="picende" class="form-control"/>'+
                    '</div>'+
                    '<div class="form-group">'+
                    '<div style="text-align:center;" class="col-xs-4"><button type="submit" value="speichern" class="btn btn-success trigger-submit">Etappe speichern</button></div>'+              '</div>'+
                    '</form>';

                routeControl.spliceWaypoints(routeControl.getWaypoints().length - 1, 1, e.latlng);
                var waypoints =  routeControl.getWaypoints();
                map.closePopup();

                var koordinatenStart = new L.LatLng(waypoints[0].latLng.lat,waypoints[0].latLng.lng);
                var koordinatenEnde = new L.LatLng(waypoints[1].latLng.lat,waypoints[1].latLng.lng);


                // Variables used to load the Wikipedia Entries for start and finish
                var loadedEtappelat = waypoints[0].latLng.lat;
                var loadedEtappelng = waypoints[0].latLng.lng;

                 popupStart = L.marker(koordinatenStart).addTo(map);
                 popupEnde = L.marker(koordinatenEnde).addTo(map);

               // extras.addLayer(loadedEtappe);

                popupStart.bindPopup(popupStartcontent).openPopup()

                $('#saveEtappe').submit(function(e) {
                    e.preventDefault();
                    if (currentRoute){
                        console.log(currentRoute);
                        // Append hidden field with actual GeoJSON structure
                        var inputRoute = $("<input type='hidden' name='route' value='" + JSON.stringify(currentRoute) + "'>");
                        $(this).append(inputRoute);
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
                                console.log("Route with the name '" + that.elements.name.value + "' saved to Database.");
                            }
                        });
                        inputRoute.remove();
                        map.closePopup();
                        var popup2Content='<div class="form-group">' +'<label class="control-label col-sm-12 "><strong>Etappenname: </strong></label>' +
                            '<label>'+ that.elements.name.value + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong>Start: </strong></label>'
                            + '<label>'+ that.elements.start.value +'</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Ende: </strong></label>'
                            + '<label>'+ that.elements.end.value + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Website: </strong></label>'
                            + '<label>'+ that.elements.website.value +'</label>' + '</div>'+'</div>';

                        popupStart.bindPopup(popup2Content);
                        popupEnde.bindPopup(popup2Content);


                        return false;
                    }

                });

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
   // map.addLayer(editableLayers);
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
    loadedEtappe = new L.FeatureGroup();
    //map.addLayer(visualizationLayers);

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
            '<div style="text-align:center;" class="col-xs-4"><button type="submit" value="speichern" class="btn btn-success trigger-submit">Marker speichern</button></div>'+              '</div>'+
            '</form>';


        var type = e.layerType,
            layer = e.layer;
        //add the marker to a layer
        editableLayers.addLayer(layer);
        var marker = L.marker(layer.getLatLng()).addTo(loadedMarkers);


        var popup = marker.bindPopup(popupContent).openPopup();

        //Override the default handler for the saveMarker form previously defined
        $('#saveMarker').submit(function(e) {
            e.preventDefault();
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
                map.closePopup();

            /**Popup wurde nach dem speichern geschlossen und ein neuer popup wird dem marker
             * zugewiesen der den eben gespeicherten Inhalt repräsentiert.
             * @type {string}
             */

            markerlat = marker.getLatLng().lat;
            markerlng = marker.getLatLng().lng;

            var popup2Content;
            if(that.elements.art.value =="Zuschauer") {

                popup2Content = '<div class="form-group">' + '<label class="control-label col-sm-12 "><strong>Name: </strong></label>' +
                    '<label>' + marker.getLatLng().lat + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Art:</strong></label>'
                    + '<label>' + that.elements.art.value + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Kapazität:</strong></label>'
                    + '<label>' + that.elements.cap.value + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Weitere Informationen:</strong></label>'
                    + '<label>' + that.elements.info.value + '</label>' + '</div>' + '<div style="text-align:center;" class="col-xs-4"><button id="nextlot" type="submit" value="nextlot" onclick="nextlot()" class="btn btn-success trigger-submit">Nächster Parkplatz </button></div>'
            }
            else{
                 popup2Content = '<div class="form-group">' + '<label class="control-label col-sm-12 "><strong>Name: </strong></label>' +
                    '<label>' + marker.getLatLng().lat + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Art:</strong></label>'
                    + '<label>' + that.elements.art.value + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Kapazität:</strong></label>'
                    + '<label>' + that.elements.cap.value + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Weitere Informationen:</strong></label>'
                    + '<label>' + that.elements.info.value + '</label>' + '</div>'

                parklots.push(new L.LatLng(markerlat,markerlng));
                console.log(parklots);
            }
            var popup2 = marker.bindPopup(popup2Content);


            return false;

        });


    });

    map.on(L.Draw.Event.DRAWSTART, function (e) {
        map.closePopup();
        routeSwitch = false;

    });
    map.on(L.Draw.Event.DRAWSTOP, function (e) {
        routeSwitch = true;

    });

    alleMarker.addLayer(loadedMarkers);
    extras.addLayer(loadedEtappe);

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

/** Function that takes the marker coordinates
 *
 */


function getDistance(point1,point2){

    var distance = turf.distance(point1,point2,"kilometers");

    return distance;
}

function nextlot(){


    var zuschauer = new L.LatLng(markerlat,markerlng);
    var nextlot;


    var i;
    var shortest = 1000000000000000000000;


    for(i = 0 ; i < parklots.length ;i++){

        console.log(parklots.length);

        if(getDistance([zuschauer.lat,zuschauer.lng],[parklots[i].lat,parklots[i].lng]) < shortest){

            shortest = getDistance([zuschauer.lat,zuschauer.lng],[parklots[i].lat,parklots[i].lng]);

            nextlot = parklots[i];
            console.log(parklots[i]);
            console.log("Currently the nearest lot is at:   " + [parklots[i].lat,parklots[i].lng]);
        }
        console.log("skip");
    }



    console.log("The next parking lot is at:     " + nextlot );
    console.log(nextlot);
    console.log(zuschauer);
}


