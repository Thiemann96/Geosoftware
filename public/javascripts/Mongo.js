/**
 * Geosoftware I, SoSe 2017, Abschlussabgabe
 * @author Eric Thieme-Garmann(429 603)
 */

'use strict';



// Overwrite HTML Form handlers once document is created.
$(document).ready(function() {
    var loadedMarkerlat;
    var loadedMarkerlng;
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
            async:false,
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
                var loadedMarker=JSON.parse(res[0].geometry);
                console.dir(loadedMarker);
                loadedMarkerlat =loadedMarker.features[0].geometry.coordinates[0];
                loadedMarkerlng = loadedMarker.features[0].geometry.coordinates[1];
                L.geoJSON(loadedMarker).addTo(visualizationLayers).bindPopup((popupcontent)).openPopup();
                console.log("The marker:" + loadedMarkerlng);

                console.log("Geometry '" + that.elements.name.value + "' successfully loaded.");
            }
        });
        console.log(loadedMarkerlat);
        getWiki(reverseGeocoding(loadedMarkerlng,loadedMarkerlat));
        return false;

    }

);



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


    /** Implementierung der Permalinks
     * soll eine Etappe geladen werden muss nach folgender Form eingeben werden:
     * localhost:3000/Etappe/[Name der Etappe]
     * soll ein Marker(e.g. Parkplatz oder Zuschauerplatz) geladen werden :
     * localhost:3000/Marker/[Name des Markers]
     * loadSEtappe
     *//*
  if ((document.getElementById('names')).value !== ""){
    document.getElementById('loadSEtappe').click();
  }

    if ((document.getElementById('name')).value !== ""){
        document.getElementById('loadMarkers').click();
    }*/
});


/*function loadMarker(){

    var loadedMarkerlat;
    var loadedMarkerlng;

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
        async:false,
        error: function(xhr, status, err) {
        },
        success: function(res) {

            /!** The popup will show the attributes which got pulled from the database
             *
             * @type {string}
             *!/
            var popupcontent='<div class="form-group">' +'<label class="control-label col-sm-12 "><strong>Name: </strong></label>' +
                '<label>'+ res[0].name + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Art:</strong></label>'
                + '<label>'+ res[0].art +'</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Kapazität:</strong></label>'
                + '<label>'+ res[0].cap +'</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Weitere Informationen:</strong></label>'
                + '<label>'+ res[0].info +'</label>' + '</div>';
            console.log("success");
            // Add Geometry to Map & permanently bind the popup to the GeoJSON object
            var loadedMarker=JSON.parse(res[0].geometry);
            console.dir(loadedMarker);
            loadedMarkerlat =loadedMarker.features[0].geometry.coordinates[0];
            loadedMarkerlng = loadedMarker.features[0].geometry.coordinates[1];
            L.geoJSON(loadedMarker).addTo(visualizationLayers).bindPopup((popupcontent)).openPopup();
            console.log("The marker:" + loadedMarkerlng);

            console.log("Geometry '" + that.elements.name.value + "' successfully loaded.");
        }
    });



}*/

/** Funktion die an die Wikipedia API eine Get anfrage sendet und die Einleitung des eingegebenen Ortes anzeigt
 *  Code teilweise benutzt von : http://www.9bitstudios.com/2014/03/getting-data-from-the-wikipedia-api-using-jquery/
 */

function getWiki(city) {

    var errorMessage1="Zu diesem Ort gibt es leider keinen Wikipedia Eintrag";
    var url = "http://de.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="+city+"&callback=?";

    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {


            //Falls es keinen Wikipedia Eintrag zu dieser Stadt gibt
/*            if(data.error.code=='missingtitle'){

                document.getElementsByClassName("wikipedia")[0].innerHTML = errorMessage1;
            }*/
            var markup = data.parse.text["*"];
            var wikieintrag = $('<div></div>').html(markup);

            // remove links as they will not work
            wikieintrag.find('a').each(function () {
                $(this).replaceWith($(this).html());
            });

            // remove any references
            wikieintrag.find('sup').remove();

            // remove cite error
            wikieintrag.find('.mw-ext-cite-error').remove();
            $('#wiki').html($(wikieintrag).find('p'));
        },
        error: function (errorMessage) {
        }
    })
};


/** Funktion die bei Marker laden benutzt wird und im BackEnd die Koordinaten entegegn nimmt
 * und die Stadt zurück gibt
 * @param lat - Breitengrad des Punktes/Marker
 * @param lon - Längengrad des Punktes/Marker
 * @returns die Stadt wo die Koordinaten sind
 */

function reverseGeocoding(lat,lon){

    var city;

    $.ajax({
        url:"http://nominatim.openstreetmap.org/reverse",
        data:{
            lon:lon,
            lat:lat,
            format:"json"
        },
        async:false,
        success:function(result){

            // Hier ist die Ausgabe

            console.log(result.address.city);
            console.dir(result);
            $("#result_country").html(result.address.country);
            city = result.address.city;

        },
        error:function(result){
            // Was passiert wenn ein Fehler auftritt
            document.write("Please only give floating point numbers and actual GPS-Coordinates!");
            console.log(result);
        }
    });

    return city
}

