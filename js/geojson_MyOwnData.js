/* Map of GeoJSON data from MegaCities.geojson */

//function to instantiate the Leaflet map
function createMap(){
    //create the map using the L.map method
    var map = L.map('mapid', {
        center: [20, 110],
        zoom: 4
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};

function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties) {
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

//function to retrieve the data and place it on the map
function getData(map){
    /* load the data using the ajax call method */
    /* The data for this geojson file is scraped from an article from wikipedia at
        https://en.wikipedia.org/wiki/List_of_Chinese_administrative_divisions_by_GDP_per_capita
        The data comes from one of the tables in this article - the table on historical GDP(purchasing power parity) of 31 of 34 administrative
        divisions in China. */
    // The unit is in US dollar. 
    // The position of each administrative division marker is the geometric center of each province/direct-controlled municipality
    $.ajax("data/China_admin_gdp(ppp)_growth.geojson", {
        /* specify the file format the ajax method is to call*/
        dataType: "json",
        /* upon a successful call, a function with the parameter of response is called to add the formatted data into the map layer */
        success: function(response){
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {
                /* onEachFeature method calls the function with the same name to add popup to each feature on the layer */
                onEachFeature: onEachFeature,
                /* an inline function is called to pass the new marker value (as a replacement of the default) to pointToLayer method */
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
                
            }).addTo(map);
        }
    });
};

$(document).ready(createMap);