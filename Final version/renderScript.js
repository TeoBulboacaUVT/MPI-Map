// Use CRS.Simple for a non-geographical map
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2
});

// Set the map bounds (arbitrary units, e.g., 0-1000)
var bounds = [[0,0], [1000,1000]];
map.fitBounds(bounds);

// Set black background
var mapElement = document.getElementById('map');
mapElement.style.background = 'black';

// Remove the default marker and use a custom white circle
var centerLatLng = [500, 500];
var centerCircle = L.circleMarker(centerLatLng, {
    radius: 8,
    color: 'white',
    fillColor: 'white',
    fillOpacity: 1,
    weight: 2
}).addTo(map);
centerCircle.bindTooltip('CENTER', {permanent: true, direction: 'right', className: 'center-label'}).openTooltip();

// You can add more logic here to update the info panel as needed

// Helper function to check if a new cluster center is in a safe zone
function isInSafeZone(newCenter, existingCenters, safeRadius) {
    for (let i = 0; i < existingCenters.length; i++) {
        const dx = newCenter[0] - existingCenters[i][0];
        const dy = newCenter[1] - existingCenters[i][1];
        if (Math.sqrt(dx * dx + dy * dy) < safeRadius * 2) {
            return false;
        }
    }
    return true;
}

// Helper function to check if a point is inside any safe zone
function isInsideAnySafeZone(point, safeZones, safeRadius) {
    for (let i = 0; i < safeZones.length; i++) {
        const dx = point[0] - safeZones[i][0];
        const dy = point[1] - safeZones[i][1];
        if (Math.sqrt(dx * dx + dy * dy) < safeRadius) {
            return true;
        }
    }
    return false;
}

// Define 12 distinct colors for clusters
const clusterColors = [
    '#FF6B6B', // Red
    '#FFD93D', // Yellow
    '#6BCB77', // Green
    '#4D96FF', // Blue
    '#A66CFF', // Purple
    '#FF922B', // Orange
    '#43C6AC', // Teal
    '#FF5EAE', // Pink
    '#6B6BFF', // Indigo
    '#FFB86L', // Peach
    '#00B8A9', // Aqua
    '#B8B8FF', // Lavender
    '#B22222'  // Dark Red
];

// Generate 12 clusters, spread to fill the viewport, with much more vertical and horizontal spread, and safe zones
const clusterCount = 12;
const mapWidth = bounds[1][0] - bounds[0][0];
const mapHeight = bounds[1][1] - bounds[0][1];
const clusterRadiusX = mapWidth * 0.7; // much more horizontal spread
const clusterRadiusY = mapHeight * 1.1; // much more vertical spread
const mapCenter = [500, 500];
const clusterCenters = [];
const safeZoneRadius = 230; // even larger safe zone radius for more separation
let attempts = 0;
const safeZones = [];
for (let i = 0; i < clusterCount; i++) {
    let found = false;
    let x, y;
    let maxTries = 2000;
    while (!found && maxTries-- > 0) {
        const baseAngle = (2 * Math.PI / clusterCount) * i;
        const angle = baseAngle + (Math.random() - 0.5) * 2.5;
        const rx = clusterRadiusX * (0.45 + Math.random() * 0.55);
        const ry = clusterRadiusY * (0.45 + Math.random() * 0.55);
        let tempX = mapCenter[0] + rx * Math.cos(angle);
        let tempY = mapCenter[1] + ry * Math.sin(angle);
        // Check if root is in any existing safe zone
        if (isInsideAnySafeZone([tempX, tempY], safeZones, safeZoneRadius)) continue;
        // Simulate first and second level nodes and check if any are in a safe zone
        let overlap = false;
        // First level
        for (let j = 0; j < 5; j++) {
            let firstAngle = (2 * Math.PI / 5) * j + (Math.random() - 0.5) * 0.2;
            let firstDist = 110 * (1 + (Math.random() - 0.5) * 0.1);
            let fx = tempX + firstDist * Math.cos(firstAngle);
            let fy = tempY + firstDist * Math.sin(firstAngle);
            if (isInsideAnySafeZone([fx, fy], safeZones, safeZoneRadius)) {
                overlap = true;
                break;
            }
            // Second level
            for (let k = 0; k < 6; k++) {
                let secondAngle = (2 * Math.PI / 6) * k + (Math.random() - 0.5) * 0.2;
                let secondDist = 32 * (1 + (Math.random() - 0.5) * 0.1);
                let sx = fx + secondDist * Math.cos(secondAngle);
                let sy = fy + secondDist * Math.sin(secondAngle);
                if (isInsideAnySafeZone([sx, sy], safeZones, safeZoneRadius)) {
                    overlap = true;
                    break;
                }
            }
            if (overlap) break;
        }
        if (overlap) continue;
        // If all checks pass, accept this cluster
        x = tempX;
        y = tempY;
        found = true;
    }
    if (!found) {
        // fallback: just place it, but this should be rare
        x = mapCenter[0] + clusterRadiusX * Math.cos((2 * Math.PI / clusterCount) * i);
        y = mapCenter[1] + clusterRadiusY * Math.sin((2 * Math.PI / clusterCount) * i);
    }
    clusterCenters.push([x, y]);
    safeZones.push([x, y]); // Add root to safe zones
    generateConstellationCluster([x, y], `Cluster ${i+1}`, { color: clusterColors[i % clusterColors.length], lineColor: clusterColors[i % clusterColors.length] });
}
// Connect all cluster parent nodes to the center
for (let i = 0; i < clusterCenters.length; i++) {
    L.polyline([mapCenter, clusterCenters[i]], {color: '#fff', weight: 1.5, opacity: 0.6, dashArray: '4,6'}).addTo(map);
}

// Function to generate a constellation cluster with randomness
function generateConstellationCluster(center, rootLabel, options = {}) {
    const {
        rootRadius = 8,
        firstLevelRadius = 5,
        secondLevelRadius = 3,
        firstLevelDistance = 110, // keep 1st level nodes closer to root
        secondLevelDistance = 32, // keep 2nd level as before
        firstLevelCount = 5,
        secondLevelCount = 6,
        color = 'white',
        lineColor = '#6cf',
        lineWeight = 1.5,
        angleJitter = Math.PI / 10, // max angle jitter (radians)
        distanceJitter = 0.25 // max distance jitter as a fraction
    } = options;

    // Draw root
    const root = L.circleMarker(center, {
        radius: rootRadius,
        color: color,
        fillColor: color,
        fillOpacity: 1,
        weight: 2
    }).addTo(map);
    root.bindTooltip(rootLabel, {permanent: true, direction: 'top', className: 'center-label'}).openTooltip();

    // Calculate first level positions with randomness
    let firstLevelPoints = [];
    for (let i = 0; i < firstLevelCount; i++) {
        let baseAngle = (2 * Math.PI / firstLevelCount) * i;
        let angle = baseAngle + (Math.random() - 0.5) * 2 * angleJitter;
        let distance = firstLevelDistance * (1 + (Math.random() - 0.5) * 2 * distanceJitter);
        const x = center[0] + distance * Math.cos(angle);
        const y = center[1] + distance * Math.sin(angle);
        firstLevelPoints.push([x, y]);
        // Draw line from root to first level
        L.polyline([center, [x, y]], {color: lineColor, weight: lineWeight, opacity: 0.7}).addTo(map);
        // Draw first level node
        L.circleMarker([x, y], {
            radius: firstLevelRadius,
            color: color,
            fillColor: color,
            fillOpacity: 0.9,
            weight: 1
        }).addTo(map);
    }

    // Draw second level with randomness
    for (let i = 0; i < firstLevelCount; i++) {
        const parent = firstLevelPoints[i];
        for (let j = 0; j < secondLevelCount; j++) {
            let baseAngle = (2 * Math.PI / secondLevelCount) * j + (Math.PI / firstLevelCount) * i;
            let angle = baseAngle + (Math.random() - 0.5) * 2 * angleJitter;
            let distance = secondLevelDistance * (1 + (Math.random() - 0.5) * 2 * distanceJitter);
            const x = parent[0] + distance * Math.cos(angle);
            const y = parent[1] + distance * Math.sin(angle);
            // Draw line from first level to second level
            L.polyline([parent, [x, y]], {color: lineColor, weight: lineWeight * 0.8, opacity: 0.5, dashArray: '2,4'}).addTo(map);
            // Draw second level node
            L.circleMarker([x, y], {
                radius: secondLevelRadius,
                color: color,
                fillColor: color,
                fillOpacity: 0.7,
                weight: 1
            }).addTo(map);
        }
    }
}

// Utility to load all JSON files for clusters
async function loadClusterData() {
    const dataFolder = 'Final version/Data/';
    const jsonFiles = [
        'algorithms_and_data_structures.json',
        'artificial_intelligence.json',
        'bioinformatics.json',
        'computational_science.json',
        'computer_architecture.json',
        'databases_and_information_systems.json',
        'graphics.json',
        'human_computer_interaction.json',
        'operating_systems_and_networks.json',
        'organizational_informatics.json',
        'programming_languages.json',
        'robotics.json',
        'software_engineering.json'
    ];
    const clusterData = [];
    for (const file of jsonFiles) {
        try {
            const response = await fetch(dataFolder + file);
            if (!response.ok) continue;
            const data = await response.json();
            clusterData.push(data);
        } catch (e) {
            console.error('Failed to load', file, e);
        }
    }
    return clusterData;
}

// Add click event logic for nodes
function addClickEvent(node, data, childNodes) {
    node.on('click', function () {
        // Toggle visibility of child node labels
        childNodes.forEach(child => {
            const tooltip = child.getTooltip();
            if (tooltip.options.permanent) {
                child.unbindTooltip();
            } else {
                child.bindTooltip(tooltip._content, { permanent: true, direction: 'top', className: 'child-label' }).openTooltip();
            }
        });

        // Update side panel with node information
        const sidePanel = document.getElementById('side-panel');
        if (sidePanel) {
            sidePanel.innerHTML = `
                <h2>${data.name}</h2>
                <p>${data.description || 'No description available.'}</p>
                <h3>Subfields:</h3>
                <ul>
                    ${data.subfields ? data.subfields.map(sub => `<li>${sub.name || sub}</li>`).join('') : '<li>No subfields available.</li>'}
                </ul>
            `;
        }
    });
}

// Main rendering logic using loaded data
async function renderCSMap() {
    const clusterData = await loadClusterData();
    // Central node
    var centerLatLng = [500, 500];
    var centerCircle = L.circleMarker(centerLatLng, {
        radius: 10,
        color: 'white',
        fillColor: 'white',
        fillOpacity: 1,
        weight: 2
    }).addTo(map);
    centerCircle.bindTooltip('COMPUTER SCIENCE', {permanent: true, direction: 'right', className: 'center-label'}).openTooltip();

    // Cluster layout (reuse previous deterministic layout)
    const clusterCount = clusterData.length;
    const mapWidth = bounds[1][0] - bounds[0][0];
    const mapHeight = bounds[1][1] - bounds[0][1];
    const clusterRadius = Math.min(mapWidth, mapHeight) * 0.38;
    const mapCenter = [500, 500];
    const clusterCenters = [];
    for (let i = 0; i < clusterCount; i++) {
        const angle = (2 * Math.PI / clusterCount) * i - Math.PI / 2;
        const x = mapCenter[0] + clusterRadius * Math.cos(angle);
        const y = mapCenter[1] + clusterRadius * Math.sin(angle);
        clusterCenters.push([x, y]);
    }
    // Colors for clusters
    const clusterColors = [
        '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#A66CFF', '#FF922B', '#43C6AC', '#FF5EAE', '#6B6BFF', '#FFB86B', '#00B8A9', '#B8B8FF', '#B22222'
    ];
    // Draw clusters and children
    for (let i = 0; i < clusterCount; i++) {
        const domain = clusterData[i];
        const color = clusterColors[i % clusterColors.length];
        // Draw line from center to cluster
        L.polyline([mapCenter, clusterCenters[i]], {color: color, weight: 1.5, opacity: 0.7, dashArray: '4,6'}).addTo(map);
        // Draw cluster root
        const root = L.circleMarker(clusterCenters[i], {
            radius: 8,
            color: color,
            fillColor: color,
            fillOpacity: 1,
            weight: 2
        }).addTo(map);
        // Use the field name from JSON for the cluster label
        root.bindTooltip(domain.name, {permanent: true, direction: 'top', className: 'center-label'}).openTooltip();
        // First-level: subfields
        const subfields = Array.isArray(domain.subfields) ? domain.subfields : [];
        const firstLevelPoints = [];
        const firstLevelNodes = [];
        for (let j = 0; j < subfields.length; j++) {
            const angle = (2 * Math.PI / subfields.length) * j - Math.PI / 2;
            const x = clusterCenters[i][0] + 110 * Math.cos(angle);
            const y = clusterCenters[i][1] + 110 * Math.sin(angle);
            firstLevelPoints.push([x, y]);
            L.polyline([clusterCenters[i], [x, y]], { color: color, weight: 1.2, opacity: 0.7 }).addTo(map);

            const subfieldName = subfields[j] && subfields[j].name ? subfields[j].name : (typeof subfields[j] === 'string' ? subfields[j] : '');
            const subfieldNode = L.circleMarker([x, y], {
                radius: 5,
                color: color,
                fillColor: color,
                fillOpacity: 0.9,
                weight: 1
            }).addTo(map).bindTooltip(subfieldName, { permanent: false, direction: 'top', className: 'child-label' });
            firstLevelNodes.push(subfieldNode);
        }

        addClickEvent(root, domain, firstLevelNodes);

        // Second-level: subsubfields
        for (let j = 0; j < subfields.length; j++) {
            const subfield = subfields[j];
            const subsubfields = (subfield && Array.isArray(subfield.subsubfields)) ? subfield.subsubfields : [];
            const secondLevelNodes = [];
            for (let k = 0; k < subsubfields.length; k++) {
                const angle = (2 * Math.PI / subsubfields.length) * k - Math.PI / 2;
                const x = firstLevelPoints[j][0] + 32 * Math.cos(angle);
                const y = firstLevelPoints[j][1] + 32 * Math.sin(angle);
                L.polyline([firstLevelPoints[j], [x, y]], { color: color, weight: 1, opacity: 0.5, dashArray: '2,4' }).addTo(map);

                const subsubfieldName = subsubfields[k] && subsubfields[k].name ? subsubfields[k].name : (typeof subsubfields[k] === 'string' ? subsubfields[k] : '');
                const subsubfieldNode = L.circleMarker([x, y], {
                    radius: 3,
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.7,
                    weight: 1
                }).addTo(map).bindTooltip(subsubfieldName, { permanent: false, direction: 'top', className: 'child-label' });
                secondLevelNodes.push(subsubfieldNode);
            }

            addClickEvent(firstLevelNodes[j], subfield, secondLevelNodes);
        }
    }
}

renderCSMap();
