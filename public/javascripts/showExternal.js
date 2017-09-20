var logger = JL();
var consoleAppender = JL.createConsoleAppender('consoleAppender');
logger.setOptions({"appenders": [consoleAppender]});


/**
 * @desc main function;
 *      reads txt input into a string (filecontent) and extracts the coordinates
 * @see Learnweb
 * @param event OpenFile event
 */
var ReadFile = function(event) {

    var input = event.target;
    var reader = new FileReader();
    const output = [];
    var array;

    // Empty List after new fileupload to avoid very long lists without refresh


    reader.onload = function () {
        console.log("Hallo2");
        var fileContent = reader.result;

        //Call Geojson build function
        var gLayer = L.geoJson(JSON.parse(fileContent));
        console.dir(gLayer);
        gLayer.addTo(visualizationLayers);


        JL("full_check").warn("works completely!"); //logs whether the whole script runs
    };


    reader.readAsText(input.files[0]);
};

