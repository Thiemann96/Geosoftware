/**
 * Geosoftware I, SoSe 2017, Abschlussabgabe
 * @author Eric Thieme-Garmann(429 603)
 */

'use strict';

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
          console.log("Geometry with the name '" + that.elements.loadname.value + "' is not present in the Database.");
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
         console.log("Geometry '" + that.elements.loadname.value + "' successfully loaded.");
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

    $('#saveFormRoutes2').submit(function(e) {
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
        //routeControl.setWaypoints(route.waypoints).addTo(map);
          L.geoJSON(RouteToGeoJSON(route.route)).addTo(visualizationLayers);

          console.log("Route '" + that.elements.loadname.value + "' successfully loaded.");
      }
    });
    return false;
  });
  
/*  // submit handler for forms used to load from Database
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
  });*/
  
  if ((document.getElementById('loadname')).value != ""){
    document.getElementById('loadRoutes').click(); 
  }
});





