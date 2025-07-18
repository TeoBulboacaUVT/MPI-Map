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

// Store references to all nodes for later management
const allNodes = {
    root: null,
    domains: [],
    subfields: [],
    subsubfields: []
};

// Colors for clusters
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
    '#FFB86B', // Peach
    '#00B8A9', // Aqua
    '#B8B8FF', // Lavender
    '#B22222'  // Dark Red
];

// Utility to load all JSON files for clusters
async function loadClusterData() {
    const jsonFiles = [
        'Data/algorithms_and_data_structures.json',
        'Data/artificial_intelligence.json',
        'Data/bioinformatics.json',
        'Data/computational_science.json',
        'Data/computer_architecture.json',
        'Data/databases_and_information_systems.json',
        'Data/graphics.json',
        'Data/human_computer_interaction.json',
        'Data/operating_systems_and_networks.json',
        'Data/organizational_informatics.json',
        'Data/programming_languages.json',
        'Data/robotics.json',
        'Data/software_engineering.json'
    ];
    
    const clusterData = [];
    for (const file of jsonFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) continue;
            const data = await response.json();
            clusterData.push(data);
        } catch (e) {
            console.error('Failed to load', file, e);
        }
    }
    return clusterData;
}

// Render detailed information in the side panel
function renderInfoPanel(data, isDefault = false) {
    const sidePanel = document.getElementById('side-panel');
    if (!sidePanel) return;
    if (isDefault) {
        sidePanel.innerHTML = `
            <div class="info-default">
                <h1>The Map of Computer Science</h1>
                <h2>Team Digital Pioneers</h2>
                <h3>June 2025 MPI</h3>
            </div>
        `;
        return;
    }
    let html = '';
    if (data.name) html += `<h2>${data.name}</h2>`;
    if (data.description) html += `<p class="description">${data.description}</p>`;
    // Only display first-level (non-object, non-array-of-object) properties
    let listItems = '';
    Object.keys(data).forEach(key => {
        if (["name", "description", "parentDomain", "parentSubfield"].includes(key)) return;
        const value = data[key];
        // If value is a string or number, display as a list item
        if (typeof value === 'string' || typeof value === 'number') {
            // If it's a URL, make it a link (improved regex)
            if (typeof value === 'string' && value.match(/^(https?:\/\/|www\.)/i)) {
                const url = value.startsWith('http') ? value : 'http://' + value;
                listItems += `<li><strong>${key}:</strong> <a href="${url}" target="_blank" rel="noopener noreferrer">${value}</a></li>`;
            } else {
                listItems += `<li><strong>${key}:</strong> ${value}</li>`;
            }
        }
        // If value is an array of strings or numbers, show as a sub-list
        else if (Array.isArray(value) && value.length && (typeof value[0] === 'string' || typeof value[0] === 'number')) {
            listItems += `<li><strong>${key}:</strong><ul>`;
            value.forEach(item => {
                if (typeof item === 'string' && item.match(/^(https?:\/\/|www\.)/i)) {
                    const url = item.startsWith('http') ? item : 'http://' + item;
                    listItems += `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${item}</a></li>`;
                } else {
                    listItems += `<li>${item}</li>`;
                }
            });
            listItems += `</ul></li>`;
        }
    });
    if (listItems) html += `<ul>${listItems}</ul>`;
    sidePanel.innerHTML = html;
}

// Create a visual node with attached data
function createNode(position, data, options) {
    const node = L.circleMarker(position, {
        radius: options.radius,
        color: options.color,
        fillColor: options.color,
        fillOpacity: options.fillOpacity || 0.9,
        weight: options.weight || 1
    }).addTo(map);
    
    // Attach the data reference to the node
    node.dataRef = data;
    
    // Add tooltip if label is provided
    if (options.label) {
        node.bindTooltip(options.label, {
            permanent: options.permanent || false,
            direction: options.direction || 'top',
            className: options.className || 'child-label'
        });
    }
    
    return node;
}

// Main rendering function
async function renderCSMap() {
    // Clear existing nodes
    allNodes.domains = [];
    allNodes.subfields = [];
    allNodes.subsubfields = [];
    
    // Load data
    const clusterData = await loadClusterData();
    const clusterCount = clusterData.length;
    const mapCenter = [500, 500];
    
    // Create central node
    allNodes.root = createNode(mapCenter, { 
        name: 'COMPUTER SCIENCE',
        description: 'The study of computers and computational systems.'
    }, {
        radius: 10,
        color: 'white',
        fillOpacity: 1,
        weight: 2,
        label: 'COMPUTER SCIENCE',
        permanent: true,
        direction: 'right',
        className: 'center-label'
    });
    
    // Add click handler for root node
    allNodes.root.on('click', function() {
        renderInfoPanel(null, true);
    });
    
    // Calculate cluster positions in a circle
    const clusterRadius = 350;
    const clusterCenters = [];
    for (let i = 0; i < clusterCount; i++) {
        const angle = (2 * Math.PI / clusterCount) * i - Math.PI / 2;
        const x = mapCenter[0] + clusterRadius * Math.cos(angle);
        const y = mapCenter[1] + clusterRadius * Math.sin(angle);
        clusterCenters.push([x, y]);
    }
    
    // Create domain clusters
    for (let i = 0; i < clusterCount; i++) {
        const domain = clusterData[i];
        const color = clusterColors[i % clusterColors.length];
        const domainCenter = clusterCenters[i];
        
        // Draw connection line from center to domain
        L.polyline([mapCenter, domainCenter], {
            color: color,
            weight: 1.5,
            opacity: 0.7,
            dashArray: '4,6'
        }).addTo(map);
        
        // Create domain node
        const domainNode = createNode(domainCenter, domain, {
            radius: 8,
            color: color,
            fillOpacity: 1,
            weight: 2,
            label: domain.name,
            permanent: true,
            direction: 'top',
            className: 'center-label'
        });
        allNodes.domains.push(domainNode);
        
        // Add click handler for domain node
        domainNode.on('click', function(e) {
            renderInfoPanel(this.dataRef, false);
        });
        
        // Create subfields if they exist
        if (domain.subfields && domain.subfields.length) {
            const subfieldCount = domain.subfields.length;
            
            for (let j = 0; j < subfieldCount; j++) {
                const subfield = domain.subfields[j];
                const subfieldName = typeof subfield === 'string' ? subfield : subfield.name;
                const angle = (2 * Math.PI / subfieldCount) * j;
                const x = domainCenter[0] + 110 * Math.cos(angle);
                const y = domainCenter[1] + 110 * Math.sin(angle);
                
                // Create subfield data object
                const subfieldData = typeof subfield === 'string' ? 
                    { name: subfield, parentDomain: domain.name } : 
                    { ...subfield, parentDomain: domain.name };
                
                // Create subfield node
                const subfieldNode = createNode([x, y], subfieldData, {
                    radius: 5,
                    color: color,
                    label: subfieldName,
                    permanent: false
                });
                
                // Draw connection line from domain to subfield
                L.polyline([domainCenter, [x, y]], {
                    color: color,
                    weight: 1.2,
                    opacity: 0.7
                }).addTo(map);
                
                allNodes.subfields.push(subfieldNode);
                
                // Add click handler for subfield node
                subfieldNode.on('click', function(e) {
                    e.originalEvent.stopPropagation();
                    renderInfoPanel(this.dataRef, false);
                    
                    // Toggle subsubfield visibility
                    if (subfield.subsubfields && subfield.subsubfields.length) {
                        const subsubfieldNodes = allNodes.subsubfields.filter(n => 
                            n.dataRef.parentSubfield === subfieldName
                        );
                        subsubfieldNodes.forEach(node => {
                            const tooltip = node.getTooltip();
                            if (tooltip && tooltip.options.permanent) {
                                node.unbindTooltip();
                            } else {
                                node.bindTooltip(node.dataRef.name || node.dataRef, {
                                    permanent: true,
                                    direction: 'top',
                                    className: 'child-label'
                                }).openTooltip();
                            }
                        });
                    }
                });
                
                // Create subsubfields if they exist
                if (subfield.subsubfields && subfield.subsubfields.length) {
                    const subsubfieldCount = subfield.subsubfields.length;
                    
                    for (let k = 0; k < subsubfieldCount; k++) {
                        const subsubfield = subfield.subsubfields[k];
                        const subsubfieldName = typeof subsubfield === 'string' ? subsubfield : subsubfield.name;
                        const angle = (2 * Math.PI / subsubfieldCount) * k;
                        const x2 = x + 32 * Math.cos(angle);
                        const y2 = y + 32 * Math.sin(angle);
                        
                        // Create subsubfield data object
                        const subsubfieldData = typeof subsubfield === 'string' ? 
                            { name: subsubfield, parentSubfield: subfieldName } : 
                            { ...subsubfield, parentSubfield: subfieldName };
                        
                        // Create subsubfield node
                        const subsubfieldNode = createNode([x2, y2], subsubfieldData, {
                            radius: 3,
                            color: color,
                            label: subsubfieldName,
                            permanent: false
                        });
                        
                        // Draw connection line from subfield to subsubfield
                        L.polyline([[x, y], [x2, y2]], {
                            color: color,
                            weight: 1,
                            opacity: 0.5,
                            dashArray: '2,4'
                        }).addTo(map);
                        
                        allNodes.subsubfields.push(subsubfieldNode);
                        
                        // Add click handler for subsubfield node
                        subsubfieldNode.on('click', function(e) {
                            e.originalEvent.stopPropagation();
                            renderInfoPanel(this.dataRef, false);
                        });
                    }
                }
            }
        }
    }
    
    // Initially show the default info
    renderInfoPanel(null, true);
}

// Start the rendering process
renderCSMap();
