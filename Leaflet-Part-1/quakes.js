// Create function to adjust size of dot according to quake magnitude.
function dotSize(magnitude) {
  return magnitude*5;
};

// Create function to adjust color of dot according to quake depth.
// Color palette generated by: https://hihayk.github.io/scale/#10/10/50/50/-51/74/20/25/FF9C00/255/151/0/white.
function dotColor(depth) {
  if (depth >=100) {
    color = "#FF80D2";
  }
  else if (depth >=95 && <100) {
    color = "#FF73B9";
  }
  else if (depth >=90 && <95) {
    color = "#FF669C";
  }
  else if (depth >=85 && <90) {
    color = "#FF597D";
  }
  else if (depth >=80 && <85) {
    color = "#FF4D5B";
  }
  else if (depth >=75 && <80) {
    color = "#FF4040";
  }
  else if (depth >=70 && <75) {
    color = "#FF4533";
  }
  else if (depth >=65 && <70) {
    color = "#FF5726";
  }
  else if (depth >=60 && <65) {
    color = "#FF6C1A";
  }
  else if (depth >=55 && <60) {
    color = "#FF830D";
  }
  else if (depth >=50 && <55) {
    color = "#FF9C00";
  }
  else if (depth >=45 && <50) {
    color = "#F2AA00";
  }
  else if (depth >=40 && <45) {
    color = "#E6B700";
  }
  else if (depth >=35 && <40) {
    color = "#D9C200";
  }
  else if (depth >=30 && <35) {
    color = "#CCCB00";
  }
  else if (depth >=25 && <30) {
    color = "#BFBF00";
  }
  else if (depth >=20 && <25) {
    color = "#A7B300";
  }
  else if (depth >=15 && <20) {
    color = "#8CA600";
  }
  else if (depth >=10 && <15) {
    color = "#739900";
  }
  else if (depth >=5 && <10) {
    color = "#5B8C00";
  }
  else if (depth >=0 && <5) {
    color = "#468000";
  };
  return color;
};

// Store API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(data => {

  // Upon response, send the data.features object to the createFeatures function.
  createFeatures(data.features);

function createFeatures(quakeData) {

  // Define function to run for each feature in the features array.
  // Create a popup for each feature describing data.
  function onEachFeature(feature, layer) {
    layer.bindPopup("Location: " + feature.properties.place + "<br>Time: " + feature.properties.time + "<br> Magnitude: " + feature.properties.mag + "<br> Depth (km): " + feature.geometry.coordinates[2]);
  }

  // Create a GeoJSON layer containing the features array on the quakeData.
  // Run onEachFeature once for each return on quake data.
  var quakes = L.geoJSON(quakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L:circleMarker(latlng, {
        opacity: 1,
        fillOpacity: 1,
        fillColor: dotColor(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: dotSize(feature.properties.mag),
        stroke: true,
        weight: 0.5
      })
    }
  });

  // Send quakes layer to createMap function.
  createMap(quakes);
}

function createMap(quakes) {

  // Create base layer.
  var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create baseMaps object.
  var baseMaps = {
    "Street Map": streetMap,
    "Topographic Map": topoMap
  };

  // Create overlay object.
  var overlayMap = {
    Earthquakes = quakes
  };

  // Create map to load with streetmap and earthquakes layer.
  var loadMap = L.map("map", {
    center: [
      44.58, -103.46
    ],
    zoom: 5,
    layers: [streetMap, Earthquakes]
  });

  // Create a layer control and connect to the base and overlay maps.
  L.control.layers(baseMaps, overlayMap).addTo(loadMap);

  // Create map legend.
  var mapLegend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
      limits = [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100];
    var colors = ["#29451C","#314C20","#3A5223","#435827","#4D5E2A","#57652E","#616B31","#6C7135","#767739","#7C773D","#827741","#89764A","#907653","#96775C","#9D7865","#A47A6E","#AA7C77","#B18182","#B78A91","#BE939F","#C49DAD"];
    var labels = [];
    
    // Define minimum and maximum values.
    var legendLimits = "<h1>Earthquake Depth (km)</br></h1>" +
      "<div class=\"labels\">" +
      "<div class=\"min\">" + limits[0] + "</div>" +
      "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

      div.innerHTML = legendLimits;

      limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
  };

  // Add legend to map.
  legend.addTo(loadMap);
}});