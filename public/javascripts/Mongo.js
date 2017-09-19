/**
 * Geosoftware I, SoSe 2017, Abschlussabgabe
 * @author Eric Thieme-Garmann(429 603)
 */

'use strict';

// Overwrite HTML Form handlers once document is created.
$(document).ready(function() {



    $('#loadMarker').submit(function(e) {
        // Prevent default html form handling
        e.preventDefault();

        var that = this;
        // submit via ajax
        $.ajax({
            // catch custom response code.
            statusCode: {
                404: function() {
                    console.log("Geometry with the name '" + that.elements.name.value + "' is not present in the Database.");
                }
            },
            data: '',
            type: $(that).attr('method'),
            // Dynamically create Request URL by appending requested name to /api prefix
            url:  $(that).attr('action') + that.elements.name.value,
            error: function(xhr, status, err) {
            },
            success: function(res) {

                /** The popup will show the attributes which got pulled from the database
                 *
                 * @type {string}
                 */
                var popupcontent='<div class="form-group">' +'<label class="control-label col-sm-12 "><strong>Name: </strong></label>' +
                    '<label>'+ res[0].name + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Art:</strong></label>'
                    + '<label>'+ res[0].art +'</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Kapazität:</strong></label>'
                    + '<label>'+ res[0].cap +'</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Weitere Informationen:</strong></label>'
                    + '<label>'+ res[0].info +'</label>' + '</div>';
                    console.log("success");
                // Add Geometry to Map & permanently bind the popup to the GeoJSON object
                L.geoJSON(JSON.parse(res[0].geometry)).addTo(visualizationLayers).bindPopup((popupcontent)).openPopup();


                console.log("Geometry '" + that.elements.name.value + "' successfully loaded.");
            }
        });
        return false;
    });



  // submit handler for forms used to load from Database
  $('#loadEtappe').submit(function(e) {
    // Prevent default html form handling
    e.preventDefault();
    var that = this;

    // submit via ajax
    $.ajax({

      // catch custom response code.
      statusCode: {
        404: function() {
        alert("Route with the name '" + that.elements.names.value + "' is not present in the Database.");
        }
      },
      data: '',
      type: $(that).attr('method'),
      // Dynamically create Request URL by appending requested name to /api prefix
      url:  $(that).attr('action') + that.elements.names.value,
      error: function(xhr, status, err) {
      },
      success: function(res) {
        var route = JSON.parse(res[0].route);
          console.dir(route);

          var marker = L.marker([route.waypoints[0].latLng.lat, route.waypoints[0].latLng.lng]).addTo(visualizationLayers);
        var popupcontent = '<div class="form-group">' +'<label class="control-label col-sm-12 "><strong>Etappenname: </strong></label>' +
            '<label>'+ res[0].Etappenname + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong>Start: </strong></label>'
            + '<label>'+ res[0].Start +'</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Ende: </strong></label>'
            + '<label>'+ res[0].Ende +'</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Website: </strong></label>'
            + '<label>'+ res[0].Website +'</label>' + '</div>'+'</div>';

        //routeControl.setWaypoints(route.waypoints).addTo(map);
          L.geoJSON(RouteToGeoJSON(route.route)).addTo(visualizationLayers);
          console.dir(L.geoJSON(RouteToGeoJSON(route.route)));
          marker.bindPopup(popupcontent).openPopup();
          $("#pic").attr("src", res[0].StartBild);

          //console.log("Route '" + that.elements.names.value + "' successfully loaded.");
      }
    });
    return false;

  });




/*  if ((document.getElementById('names')).value != ""){
    document.getElementById('loadRoutes').click();
  }*/
});





