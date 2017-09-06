/**
 * Geosoftware I, SoSe 2017, Aufgabe 
 * @author Jens Seifert (408076), Jan Speckamp (428367)
 */
 
'use strict';

// global variables for Leaflet stuff, very handy
var map, layercontrol, editableLayers, visualizationLayers, drawControl, routeControl, routeSwitch, currentRoute;

/**
 * initialises map (add basemaps, show Münster, setup draw plugin, show GEO1 marker)
 */ 
function initMap() {
  routeSwitch = true;
  map = L.map('map', {
      center: [51.962, 7.628], // Münster
      zoom: 14,
      zoomControl: false
  });
  L.control.zoom({
    position: 'bottomleft'
  }).addTo(map);
  
  // add layer control to map 
  layercontrol = L.control.layers().addTo(map).expand();

  // add standard OSM tiles as basemap
  layercontrol.addBaseLayer(L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map), 'OpenStreetMap (Tiles)');  // set as default
  
  // add an alternative basemap, fetched via WMS
  layercontrol.addBaseLayer(L.tileLayer.wms('http://sg.geodatenzentrum.de/wms_webatlasde.light?', {
      layers:'webatlasde.light',
      attribution: '&copy; GeoBasis-DE / <a href="http://www.bkg.bund.de">BKG</a> 2017'
  }), 'BKG GeoBasis-DE (WMS)');
  
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
      
  })
  
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

  
  // make icon with photo of GEO1 as the marker image
  var geo1icon = L.icon({iconUrl: 'https://www.uni-muenster.de/imperia/md/images/geowissenschaften/geo1.jpg', iconSize: [50, 41]});
  // compose popup with a bit of text and another photo
  var geo1text = 'Das wundervolle GEO1-Gebäude an der Heisenbergstraße 2 in Münster <img src="http://www.eternit.de/referenzen/media/catalog/product/cache/2/image/890x520/9df78eab33525d08d6e5fb8d27136e95/g/e/geo1_institut_muenster_02.jpg" width="300">';
  // add marker to map and bind popup
  L.marker([51.969031, 7.595772], {title: 'GEO1', icon: geo1icon}).bindPopup(geo1text).addTo(map);
}

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

/**
 * load external GeoJSON file via Ajax (Caution! Server to load from has to allow cross origin requests!)
 */
function showExternalFile() {
  $.get(document.getElementById('externalfile').value, function(response) {
    L.geoJSON(JSON.parse(response)).addTo(map);
  });
}

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

// Overwrite HTML Form handlers once document is created.
$(document).ready(function() {

  // overwrite submit handler for form used to save to Database
  $('#saveFormGeo').submit(function(e) {
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
        console.log("Error while saving Geometry to Database");
        alert("Error while saving Geometry to Database");
      },
      success: function(res) {
         console.log("Geometry with the name '" + that.elements.name.value + "' saved to Database.");
      }
    });
    inputGeo.remove();
    return false;
  });
  // submit handler for forms used to load from Database
  $('#loadFormGeo').submit(function(e) {
    // Prevent default html form handling
    e.preventDefault();
    
    var that = this;
    
    // submit via ajax
    $.ajax({
      // catch custom response code.
      statusCode: {
        404: function() {
          alert("Geometry with the name '" + that.elements.loadname.value + "' is not present in the Database.");
        }
      },
      data: '',
      type: $(that).attr('method'),
      // Dynamically create Request URL by appending requested name to /api prefix
      url:  $(that).attr('action') + that.elements.loadname.value,
      error: function(xhr, status, err) {
      },
      success: function(res) {
        console.log("success");
         // Add Geometry to Map
         L.geoJSON(JSON.parse(res[0].geometry)).addTo(map);    
         alert("Geometry '" + that.elements.loadname.value + "' successfully loaded.");
      }
    });
    return false;
  });
    // overwrite submit handler for form used to save to Database
  $('#saveFormRoutes').submit(function(e) {
    e.preventDefault();
    if (currentRoute){
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
      return false;
    }
  });
  // submit handler for forms used to load from Database
  $('#loadFormRoutes').submit(function(e) {
    // Prevent default html form handling
    e.preventDefault();
    var that = this;
    
    // submit via ajax
    $.ajax({
      // catch custom response code.
      statusCode: {
        404: function() {
        alert("Route with the name '" + that.elements.loadname.value + "' is not present in the Database.");
        }
      },
      data: '',
      type: $(that).attr('method'),
      // Dynamically create Request URL by appending requested name to /api prefix
      url:  $(that).attr('action') + that.elements.loadname.value,
      error: function(xhr, status, err) {
      },
      success: function(res) {
        var route = JSON.parse(res[0].route);
        routeControl.setWaypoints(route.waypoints).addTo(map); 
        console.log("Route '" + that.elements.loadname.value + "' successfully loaded.");
      }
    });
    return false;
  });
  
  // submit handler for forms used to load from Database
  $('#loadFormRoutesVisualization').submit(function(e) {
    // Prevent default html form handling
    e.preventDefault();
    var that = this;
    
    // submit via ajax
    $.ajax({
      // catch custom response code.
      statusCode: {
        404: function() {
        alert("Route with the name '" + that.elements.loadname.value + "' is not present in the Database.");
        }
      },
      data: '',
      type: $(that).attr('method'),
      // Dynamically create Request URL by appending requested name to /api prefix
      url:  $(that).attr('action') + that.elements.loadname.value,
      error: function(xhr, status, err) {
      },
      success: function(res) {
        var route = JSON.parse(res[0].route);
        console.log(res[0].route);
        L.geoJSON(RouteToGeoJSON(route.route)).addTo(visualizationLayers);
        console.log("Route '" + that.elements.loadname.value + "' successfully visualized.");
      }
    });
    return false;
  });
  
  if ((document.getElementById('loadname')).value != ""){
    document.getElementById('loadRoutes').click(); 
  }
});


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
function clearVisualizationLayer() {
  visualizationLayers.clearLayers();
}

document.addEventListener("DOMContentLoaded", function(event) { 
  initMap();
  initUI();
});