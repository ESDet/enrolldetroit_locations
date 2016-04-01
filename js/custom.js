mapboxgl.accessToken = 'pk.eyJ1IjoiZXNkIiwiYSI6InBab1ZlUWsifQ.Gwmbd8beRpVIc2kw3xs_QA';

// Add filter variarble from this example: https://www.mapbox.com/mapbox-gl-js/example/filter-markers/

// var filterGroup = document.getElementById('filter-group');

// Mapbox map load


var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/esd/cih7r65ka002h97maxkalppbt', //stylesheet location custom Scorecard style
    center: [-83.08, 42.35], // starting position
    zoom: 10.5 // starting zoom
});

// Try to add my GeoJSON from var makers in earlyPrograms.js

map.on('style.load', function () {
    map.addSource("markers", {
        "type": "geojson",
        "data": markers
    });

    // New addLayer with toggle

   

    // Original addLayer

    map.addLayer({
        "id": "markers",
        "interactive": true,
        "type": "symbol",
        "source": "markers",
        "layout": {
            "icon-image": "orange-18",
            "icon-allow-overlap": true,
            "text-field": "{Name}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-size": 12,
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        }
    });
});

// Add pop up based on example https://www.mapbox.com/mapbox-gl-js/example/popup-on-click/

var popup = new mapboxgl.Popup();

// When a click event occurs near a marker icon, open a popup at the location of
// the feature, with description HTML from its properties.
map.on('click', function (e) {
    map.featuresAt(e.point, {
        radius: 12, // Half the marker size (24px).
        includeGeometry: true,
        layer: 'markers'
    }, function (err, features) {

        if (err || !features.length) {
            popup.remove();
            return;
        }

        var feature = features[0];

        // Popuplate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(feature.geometry.coordinates)
            .setHTML("<h3>" + feature.properties["Name"] + "</h3>" + "<b>Address: </b>" + feature.properties.address)
            .addTo(map);
    });
});

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
map.on('mousemove', function (e) {
    map.featuresAt(e.point, {
        radius: 12, // Half the marker size (24px).
        layer: 'markers'
    }, function (err, features) {
        map.getCanvas().style.cursor = (!err && features.length) ? 'pointer' : '';
    });
});