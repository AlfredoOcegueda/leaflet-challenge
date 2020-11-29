// Creating map object
var myMap = L.map("map", {
    center: [39.02, -97.82],
    zoom: 3
  });

// Earthquakes URL Variable
var earthquakes_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Retrieve earthquakesURL with D3
d3.json(earthquakes_url, function(earthquakeData) {

// Initialize and create a LayerGroup "earthquakes"
var earthquakes = new L.LayerGroup()

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

    // Function to Determine Size of Marker
    function markerSize(magnitude) {
        if (magnitude === 0) {
          return 2;
        }
        return magnitude * 6;
    }

    // Function to Determine Style of Marker
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.properties.mag),
          color: "#000000",
          radius: markerSize(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
    }
    // Function to Determine Color of Marker
    function getColor(d) {
        return d > 5  ? '#f16b6b' :
               d > 4  ? '#f0a76b' :
               d > 3  ? '#f3ba4e' :
               d > 2  ? '#f3db4c' :
               d > 1  ? '#e1f24c' :
                        '#b7f34d';
    }

    // Create a Layer Containing the Features
    L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,

        // Function to Run Once For Each feature and give for each
        // feature a popup describing the place and time of the Earthquake
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place + 
            "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
            "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }

    // Add earthquakeData to earthquakes LayerGroup
    }).addTo(earthquakes);

    // Add earthquakes Layer to the Map
    earthquakes.addTo(myMap);

    //Set Up Legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend"), 
        magnitudeLevels = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h3>Magnitude</h3>"

        for (var i = 0; i < magnitudeLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + getColor(magnitudeLevels[i] + 1) + '"></i> ' +
                magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };

    // Add Legend to the Map
    legend.addTo(myMap);
});