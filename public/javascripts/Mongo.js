/**
 * Geosoftware I, SoSe 2017, Abschlussabgabe
 * @author Eric Thieme-Garmann(429 603)
 */

'use strict';


var starlat,startlng,endlat,endlng,loadedMarkerlng,loadedMarkerlat;
// Overwrite HTML Form handlers once document is created.
$(document).ready(function() {


    /** jQuery in order to overwrite the default html form for handling submits
     *  data gets send via ajax to the mongo db
     *
     */

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

                var loadedMarker=JSON.parse(res[0].geometry);
                loadedMarkerlat =loadedMarker.features[0].geometry.coordinates[1];
                loadedMarkerlng = loadedMarker.features[0].geometry.coordinates[0];

                if(res[0].art == "Parkplatz") {

                    var popupcontent = '<div class="form-group">' + '<label class="control-label col-sm-12 "><strong>Name: </strong></label>' +
                        '<label>' + res[0].name + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Art:</strong></label>'
                        + '<label>' + res[0].art + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Kapazität:</strong></label>'
                        + '<label>' + res[0].cap + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Weitere Informationen:</strong></label>'
                        + '<label>' + res[0].info + '</label>' + '</div>';

                    parklots.push(new L.LatLng(loadedMarkerlat,loadedMarkerlng));

                }
                else{
                    var popupcontent = '<div class="form-group">' + '<label class="control-label col-sm-12 "><strong>Name: </strong></label>' +
                        '<label>' + res[0].name + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Art:</strong></label>'
                        + '<label>' + res[0].art + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Kapazität:</strong></label>'
                        + '<label>' + res[0].cap + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Weitere Informationen:</strong></label>'
                        + '<label>' + res[0].info + '</label>' + '</div>' + '<div style="text-align:center;" class="col-xs-4"><button id="nextlot" type="submit" value="nextlot" onclick="nextlotfromloaded()" class="btn btn-success trigger-submit">Nächster Parkplatz </button></div>'


                }
                // Add Geometry to Map & permanently bind the popup to the GeoJSON object


                /**
                 * Saving the coordinates for further use in the reverse geocoding function
                 *
                 */


                L.geoJSON(loadedMarker).addTo(loadedMarkers).bindPopup((popupcontent)).openPopup();


                console.log("Geometry '" + that.elements.name.value + "' successfully loaded.");
                JL().info("The wikipedia Entry has succesfuyll been loaded,congrats");

                getWiki(reverseGeocoding(loadedMarkerlng,loadedMarkerlat));

            }
        });
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
            JL().error("There seems to be no Stage with that Name please give a name which surely is in the databse");

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
        var tmp = new L.featureGroup;

          var marker = L.marker([route.waypoints[0].latLng.lat, route.waypoints[0].latLng.lng]).addTo(tmp).addTo(loadedEtappe);
          var marker2 = L.marker([route.waypoints[1].latLng.lat, route.waypoints[1].latLng.lng]).addTo(tmp).addTo(loadedEtappe);

          startlng = route.waypoints[0].latLng.lng;
          starlat = route.waypoints[0].latLng.lat;

          endlng = route.waypoints[1].latLng.lng;
          endlat = route.waypoints[1].latLng.lat;
          var popupcontent = '<div class="form-group">' +'<label class="control-label col-sm-12 "><strong>Etappenname: </strong></label>' +
            '<label>'+ res[0].Etappenname + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong>Start: </strong></label>'
            + '<label>'+ res[0].Start +'</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Ende: </strong></label>'
            + '<label>'+ res[0].Ende +'</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Website: </strong></label>'
            + '<label>'+ res[0].Website +'</label>' + '</div>'+'</div>'+'\'<div style="text-align:center;" class="col-xs-4"><button id="nextlot" type="submit" value="nextlot" onclick="nextlotstart()" class="btn btn-success trigger-submit">Nächster Parkplatz </button></div>\'';

          var popup2content = '<div class="form-group">' +'<label class="control-label col-sm-12 "><strong>Etappenname: </strong></label>' +
              '<label>'+ res[0].Etappenname + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong>Start: </strong></label>'
              + '<label>'+ res[0].Start +'</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Ende: </strong></label>'
              + '<label>'+ res[0].Ende +'</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Website: </strong></label>'
              + '<label>'+ res[0].Website +'</label>' + '</div>'+'</div>'+'\'<div style="text-align:center;" class="col-xs-4"><button id="nextlot" type="submit" value="nextlot" onclick="nextlotend()" class="btn btn-success trigger-submit">Nächster Parkplatz </button></div>\'';


          /** The stage with the given name will get displayed on the map , on the layer 'loadedEtappe'
           * addtionally a new layer is created with a custom name and is pushed in the layer control
           *
           *
           */
          L.geoJSON(RouteToGeoJSON(route.route));

          L.geoJSON(RouteToGeoJSON(route.route)).addTo(tmp).addTo(loadedEtappe);
          var name = res[0].Etappenname ;

          layercontrol.addOverlay(tmp,"Die Etappe namens :" + name);


          //Marker which represent Start and End of the Stage
          marker.bindPopup(popupcontent).openPopup();
          marker2.bindPopup(popup2content);

          var picture_array = res[0].Bilder.split(",");
          /** Call reverseGeocoding to get the Town name , call getWiki to get the Wikipedia entry , depending
           * on the given 'ID' the Start or End wikipedia entry is show
           */
          getWiki(reverseGeocoding(route.waypoints[0].latLng.lat,route.waypoints[0].latLng.lng),'#wiki');

          getWiki(reverseGeocoding(route.waypoints[1].latLng.lat,route.waypoints[1].latLng.lng),'#wikie');


          $("#pic1").attr("src", picture_array[0]);
          $("#pic2").attr("src", picture_array[1]);
          $("#pic3").attr("src", picture_array[2]);
          $("#pic4").attr("src", picture_array[3]);



          JL().info("Route ' " + that.elements.names.value +"' is displayed on your map ! Congrats");

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
     */
 if ((document.getElementById('names')).value !== ""){
    document.getElementById('loadSEtappe').click();
  }

    if ((document.getElementById('name')).value !== ""){
        document.getElementById('loadMarkers').click();
    }
});

/** Funktion die an die Wikipedia API eine Get anfrage sendet und die Einleitung des eingegebenen Ortes anzeigt.
 * URL wird dynamisch basierend auf dem übergebenen Stadtnamen kreiert.
 *  Code teilweise benutzt von : http://www.9bitstudios.com/2014/03/getting-data-from-the-wikipedia-api-using-jquery/
 */

function getWiki(city,location) {

    var errorMessage1="Zu diesem Ort gibt es leider keinen Wikipedia Eintrag";
    var url = "http://de.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="+city+"&callback=?";

    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var markup = data.parse.text["*"];

            /** Catches an error if no entry is found
             *
             */
            if (data.parse === undefined ){$(location).html($("There seems to be no Wikipedia entry for this town").find('p'));
                JL().warn("There seems to be no Wikipedia entry for this town ");}

            else{


                var wikieintrag = $('<div></div>').html(markup);

                // remove links as they will not work
                wikieintrag.find('a').each(function () {
                    $(this).replaceWith($(this).html());
                });

                // remove any references
                wikieintrag.find('sup').remove();

                // remove cite error
                wikieintrag.find('.mw-ext-cite-error').remove();

                $(location).html($(wikieintrag).find('p'));

                JL().info("The wikipedia Entry has succesfully been loaded,congrats");
            }


        },
        error: function (errorMessage) {

            JL().warn("Something went wrong with your request , please try again or contact the administrator");
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

            $("#result_country").html(result.address.country);
            city = result.address.city;

        },
        error:function(result){
            // Was passiert wenn ein Fehler auftritt
            JL().warn("Something went wrong with your reverse Geocoding request , maybe the OpenstreetMap Server is down ? Check here : http://nominatim.openstreetmap.org/reverse ");        }
    });

    return city
}


function nextlotstart(){


    var start = new L.LatLng(starlat,startlng);
    var nextlot;

    var i;
    var shortest = 1000000000000000000000;


    for(i = 0 ; i < parklots.length ;i++){

        console.log(parklots.length);

        if(getDistance([start.lat,start.lng],[parklots[i].lat,parklots[i].lng]) < shortest){

            shortest = getDistance([start.lat,start.lng],[parklots[i].lat,parklots[i].lng]);

            nextlot = parklots[i];
            console.log(parklots[i]);
            console.log("Currently the nearest lot is at:   " + [parklots[i].lat,parklots[i].lng]);
        }
        console.log("skip");
    }



    routeControl.addTo(map).setWaypoints([start,nextlot]);
    console.log("The next parking lot is at:     " + nextlot );

}


function nextlotend(){


    var end = new L.LatLng(endlat,endlng);
    var nextlot;

    var i;
    var shortest = 1000000000000000000000;


    for(i = 0 ; i < parklots.length ;i++){

        console.log(parklots.length);

        if(getDistance([end.lat,end.lng],[parklots[i].lat,parklots[i].lng]) < shortest){

            shortest = getDistance([end.lat,end.lng],[parklots[i].lat,parklots[i].lng]);

            nextlot = parklots[i];
            console.log(parklots[i]);
            console.log("Currently the nearest lot is at:   " + [parklots[i].lat,parklots[i].lng]);
        }
        console.log("skip");
    }



    routeControl.addTo(map).setWaypoints([end,nextlot]);
    console.log("The next parking lot is at:     " + nextlot );

}

function nextlotfromloaded(){


    var crowd = new L.LatLng(loadedMarkerlat,loadedMarkerlng);
    var nextlot;

    var i;
    var shortest = 1000000000000000000000;


    for(i = 0 ; i < parklots.length ;i++){

        console.log(parklots.length);

        if(getDistance([crowd.lat,crowd.lng],[parklots[i].lat,parklots[i].lng]) < shortest){

            shortest = getDistance([crowd.lat,crowd.lng],[parklots[i].lat,parklots[i].lng]);

            nextlot = parklots[i];
            console.log(parklots[i]);
            console.log("Currently the nearest lot is at:   " + [parklots[i].lat,parklots[i].lng]);
        }
        console.log("skip");
    }



    routeControl.addTo(map).setWaypoints([crowd,nextlot]);
    console.log("The next parking lot is at:     " + nextlot );

}

