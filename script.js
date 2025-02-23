// Initialize the map
const map = L.map('map').setView([54.5, -4], 6); // Centered on the UK

// Add a tile layer (base map)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to get color based on obesity rate
function getColor(rate) {
    return rate > 30 ? '#800026' :
           rate > 25 ? '#BD0026' :
           rate > 20 ? '#E31A1C' :
           rate > 15 ? '#FC4E2A' :
           rate > 10 ? '#FD8D3C' :
                       '#FFEDA0';
}

// Function to style each region
function style(feature) {
    return {
        fillColor: getColor(feature.properties.obesityRate || 0), // Use the obesityRate property
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}

// Load the UK Regions GeoJSON data
fetch('eer.json')
    .then(response => response.json())
    .then(data => {
        // Add the GeoJSON layer to the map
        L.geoJSON(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

        // Add a legend
        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (map) {
            const div = L.DomUtil.create('div', 'legend');
            const grades = [0, 10, 15, 20, 25, 30];
            const labels = [];

            // Loop through grades and generate a label with a colored square for each interval
            for (let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '–' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };
        legend.addTo(map);
    })
    .catch(error => {
        console.error('Error fetching GeoJSON data:', error);
    });

// Function to add interactivity to each feature
function onEachFeature(feature, layer) {
    // Add a tooltip with the region name and obesity rate
    const rate = feature.properties.obesityRate || 'No data';
    layer.bindTooltip(`${feature.properties.EER13NM}: ${rate}%`);

    // Add a click event
    layer.on('click', function (e) {
        alert(`Region: ${feature.properties.EER13NM}\nObesity Rate: ${rate}%`);
    });

    // Add hover effects
    layer.on('mouseover', function (e) {
        layer.setStyle({
            weight: 2,
            color: '#666',
            fillOpacity: 0.9
        });
    });

    layer.on('mouseout', function (e) {
        layer.setStyle({
            weight: 1,
            color: 'white',
            fillOpacity: 0.7
        });
    });
}