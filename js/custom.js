mapboxgl.accessToken = 'pk.eyJ1IjoiZXNkIiwiYSI6InBab1ZlUWsifQ.Gwmbd8beRpVIc2kw3xs_QA';

// Add filter variarble from this example: https://www.mapbox.com/mapbox-gl-js/example/filter-markers/

// var filterGroup = document.getElementById('filter-group');

// Mapbox map load

var filterGroup = document.getElementById('filter-group');
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/esd/cih7r65ka002h97maxkalppbt', //stylesheet location custom Scorecard style
    center: [-83.08, 42.35], // starting position
    zoom: 10.5 // starting zoom
});

// Add my GeoJSON from var makers in enrollDetroit.js

map.on('load', function () {
    map.addSource("markers", {
        "type": "geojson",
        "data": markers
    });

    // New addLayer with toggle

    markers.features.forEach(function(feature) {
        var symbol = feature.properties['marker-symbol'];
        var layerID = 'loc-' + symbol;

        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
            if (layerID.length == 12) {
            map.addLayer({
                "id": layerID,
                "interactive": true,
                "type": "symbol",
                "source": "markers",
                "layout": {
                    "icon-image": symbol,
                    "icon-allow-overlap": true,
                },
                "filter": ["==", "marker-symbol", symbol]
            });} else {
            map.addLayer({
                "id": layerID,
                "interactive": true,
                "type": "symbol",
                "source": "markers",
                "layout": {
                    "icon-image": symbol,
                    "icon-allow-overlap": true,
                    "text-field": "{Name}",
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-size": 12,
                    "text-offset": [0, 2.0],
                },
                "filter": ["==", "marker-symbol", symbol]
            });    
            }

            // Add checkbox and label elements for the layer.
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = layerID;
            input.checked = true;
            filterGroup.appendChild(input);

            var label = document.createElement('label');
            label.setAttribute('for', layerID);
            label.textContent = symbol;
            filterGroup.appendChild(label);

            // When the checkbox changes, update the visibility of the layer.
            input.addEventListener('change', function(e) {
                map.setLayoutProperty(layerID, 'visibility',
                    e.target.checked ? 'visible' : 'none');
            });

            // Add pop up based on example https://www.mapbox.com/mapbox-gl-js/example/popup-on-click/
            var popup = new mapboxgl.Popup();

            // When a click event occurs near a marker icon, open a popup at the location of
            // the feature, with description HTML from its properties.
            map.on('click', function (e) {
                map.featuresAt(e.point, {
                    radius: 18, // Half the marker size (36px).
                    includeGeometry: true,
                    layer: layerID
                }, function (err, features) {

                    if (err || !features.length) {
                        popup.remove();
                        return;
                    }

                    var feature = features[0];

                    // Popuplate the popup and set its coordinates
                    // based on the feature found.
                    popup.setLngLat(feature.geometry.coordinates)
                        .setHTML("<h3>" + feature.properties["Name"] + "</h3>"
                            + feature.properties.address + "<br/>"
                            + feature.properties.city + ", " + feature.properties.state + " " + feature.properties.zip + "<br/>"
                            + "<b>Grades: </b>" + feature.properties.grades + "<br/>"
                            + "Opens: " + feature.properties.open + "<br/>"
                            + "Closes: " + feature.properties.close + "<br/>"
                            )
                        .addTo(map);
                });
            });

            // Use the same approach as above to indicate that the symbols are clickable
            // by changing the cursor style to 'pointer'.
            map.on('mousemove', function (e) {
                map.featuresAt(e.point, {
                    radius: 18, // Half the marker size (36px).
                    layer: layerID
                }, function (err, features) {
                    map.getCanvas().style.cursor = (!err && features.length) ? 'pointer' : '';
                });
            });
        }
    });
});