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

// Replace the existing renderInfoPanel function in scriptD.js with this:
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

    // Helper function to render arrays with hyperlinks
    function renderLinks(arr) {
        if (!arr) return '';
        return `<ul>` + 
            arr.map(obj => 
                `<li>${obj.link ? 
                    `<a href="${obj.link}" target="_blank" rel="noopener noreferrer">${obj.name || obj.link}</a>` : 
                    (obj.name || obj)}</li>`
            ).join('') + 
        `</ul>`;
    }

    // Helper function to render regular arrays
    function renderList(arr) {
        if (!arr || arr.length === 0) return '';
        // Handle comma-separated strings if needed
        let items = [];
        arr.forEach(item => {
            if (typeof item === 'string' && item.includes(',')) {
                items.push(...item.split(/,(?![^()]*\))/).map(s => s.trim()).filter(Boolean));
            } else {
                items.push(item);
            }
        });
        return `<ul>` + items.map(item => `<li>${item}</li>`).join('') + `</ul>`;
    }

    // Helper to check if a field has content
    function hasContent(field) {
        return Array.isArray(field) && field.length > 0;
    }

    let html = `<h2>${data.name || 'Untitled'}</h2>`;
    
    if (data.description) {
        html += `<p class="description">${data.description}</p>`;
    }

    // Core information sections (adapt these to match your JSON structure)
    if (hasContent(data.coreConcepts)) {
        html += `<div class="info-section"><h3>Core Concepts</h3>${renderList(data.coreConcepts)}</div>`;
    }
    
    if (hasContent(data.tools)) {
        html += `<div class="info-section"><h3>Key Tools/Languages</h3>${renderList(data.tools)}</div>`;
    }
    
    if (hasContent(data.applications)) {
        html += `<div class="info-section"><h3>Applications</h3>${renderList(data.applications)}</div>`;
    }

    // Professors section (UVT)
    if (hasContent(data.professors)) {
        html += `<div class="info-section"><h3>Professors (UVT)</h3>${renderLinks(data.professors)}</div>`;
    }
    
    // Sections that might contain links
    if (hasContent(data.pioneers)) {
        html += `<div class="info-section"><h3>Pioneers</h3>${renderLinks(data.pioneers)}</div>`;
    }
    
    if (hasContent(data.literature)) {
        html += `<div class="info-section"><h3>Literature</h3>${renderLinks(data.literature)}</div>`;
    }
    
    if (hasContent(data.relatedFields)) {
        html += `<div class="info-section"><h3>Related Fields</h3>${renderLinks(data.relatedFields)}</div>`;
    }

    sidePanel.innerHTML = html;
}

// Hide all non-root tooltips and reset label state
function resetAllLabels() {
    // Root label always visible
    if (allNodes.root) {
        allNodes.root.bindTooltip(allNodes.root.dataRef.name, {
            permanent: true,
            direction: 'right',
            className: 'center-label'
        }).openTooltip();
    }
    // Hide all domain, subfield, and subsubfield labels
    allNodes.domains.forEach(node => {
        node.unbindTooltip();
        node.bindTooltip(node.dataRef.name, {
            permanent: true,
            direction: 'top',
            className: 'center-label'
        });
    });
    allNodes.subfields.forEach(node => {
        node.unbindTooltip();
    });
    allNodes.subsubfields.forEach(node => {
        node.unbindTooltip();
    });
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
    // --- ROBUST NON-OVERLAPPING SAFE ZONE SYSTEM ---
    // Try to place all primary nodes so that their safe zones never overlap. If not possible, reduce radius and retry.
    function findNonOverlappingPositions(clusterCount, mapCenter, initialRadius, minRadius, maxAttempts) {
        // Increase initial and minimum radius by 50% for more spread
        let radius = initialRadius * 1.5;
        const minRadiusScaled = minRadius * 1.5;
        let positions = [];
        let safeZones = [];
        let attempt = 0;
        while (radius >= minRadiusScaled) {
            positions = [];
            safeZones = [];
            let failed = false;
            for (let i = 0; i < clusterCount; i++) {
                let x, y, tries = 0, found = false;
                while (tries < maxAttempts) {
                    x = radius + 40 + Math.random() * (1000 - 2 * (radius + 40));
                    y = radius + 40 + Math.random() * (1000 - 2 * (radius + 40));
                    // Keep away from center
                    if (Math.hypot(x - mapCenter[0], y - mapCenter[1]) < radius + 10) {
                        tries++;
                        continue;
                    }
                    // Check overlap with all previous
                    let overlap = false;
                    for (const [ox, oy] of safeZones) {
                        if (Math.hypot(x - ox, y - oy) < 2.1 * radius) {
                            overlap = true;
                            break;
                        }
                    }
                    if (!overlap) {
                        found = true;
                        break;
                    }
                    tries++;
                }
                if (!found) {
                    failed = true;
                    break;
                }
                positions.push([x, y]);
                safeZones.push([x, y]);
            }
            if (!failed) {
                return { positions, radius };
            }
            radius -= 18; // Reduce radius and try again
            attempt++;
        }
        // Fallback: just space them in a circle (should never happen)
        const fallback = [];
        for (let i = 0; i < clusterCount; i++) {
            const angle = (2 * Math.PI * i) / clusterCount;
            fallback.push([
                mapCenter[0] + (initialRadius * 1.2 * 1.5) * Math.cos(angle),
                mapCenter[1] + (initialRadius * 1.2 * 1.5) * Math.sin(angle)
            ]);
        }
        return { positions: fallback, radius: initialRadius * 1.5 };
    }

    // Use robust placement for primary nodes
    const clusterCount = clusterData.length;
    const mapCenter = [500, 500];
    const initialSafeZoneRadius = 210;
    const minSafeZoneRadius = 120;
    const maxTriesPerNode = 700;
    const { positions: domainPositions, radius: safeZoneRadius } = findNonOverlappingPositions(
        clusterCount, mapCenter, initialSafeZoneRadius, minSafeZoneRadius, maxTriesPerNode
    );
    const domainSafeZones = [...domainPositions];
    
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
        hideAllTooltips();
        renderInfoPanel(null, true);
    });
    
    // Add map click handler to reset labels and info panel
    map.on('click', function(e) {
        // Only reset if not clicking a node
        if (!e.originalEvent.target.closest('.leaflet-interactive')) {
            resetAllLabels();
            renderInfoPanel(null, true);
        }
    });
    
    // Create domain clusters
    for (let i = 0; i < clusterCount; i++) {
        const domain = clusterData[i];
        const color = clusterColors[i % clusterColors.length];
        const domainCenter = domainPositions[i];

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
            e.originalEvent.stopPropagation(); // Prevent map click
            resetAllLabels();
            renderInfoPanel(this.dataRef, false);
            // Show subfields of this domain
            if (domain.subfields && domain.subfields.length) {
                const subfieldNodes = allNodes.subfields.filter(n => 
                    n.dataRef.parentDomain === domain.name
                );
                subfieldNodes.forEach(node => {
                    node.bindTooltip(node.dataRef.name || node.dataRef, {
                        permanent: true,
                        direction: 'top',
                        className: 'child-label'
                    }).openTooltip();
                });
                // Show all tertiary (subsubfield) labels for this domain
                const subsubfieldNodes = allNodes.subsubfields.filter(n => {
                    // Find subsubfields whose parentSubfield is a subfield of this domain
                    return domain.subfields.some(sf => {
                        const sfName = typeof sf === 'string' ? sf : sf.name;
                        return n.dataRef.parentSubfield === sfName;
                    });
                });
                subsubfieldNodes.forEach(node => {
                    node.bindTooltip(node.dataRef.name || node.dataRef, {
                        permanent: true,
                        direction: 'top',
                        className: 'child-label'
                    }).openTooltip();
                });
                // Keep parent label visible
                this.bindTooltip(this.dataRef.name, {
                    permanent: true,
                    direction: 'top',
                    className: 'center-label'
                }).openTooltip();
            }
        });
        
        // Create subfields if they exist
        if (domain.subfields && domain.subfields.length) {
            const subfieldCount = domain.subfields.length;
            const subfieldPositions = [];
            // Place subfields closer to primary node, with more randomness (reduce distance)
            for (let j = 0; j < subfieldCount; j++) {
                let angle = Math.random() * 2 * Math.PI;
                // Reduce the multiplier to bring subfields closer to their domain node
                let radius = safeZoneRadius * 0.18 + Math.random() * safeZoneRadius * 0.10;
                let x = domainCenter[0] + radius * Math.cos(angle);
                let y = domainCenter[1] + radius * Math.sin(angle);
                subfieldPositions.push([x, y]);
            }
            for (let j = 0; j < subfieldCount; j++) {
                const subfield = domain.subfields[j];
                const subfieldName = typeof subfield === 'string' ? subfield : subfield.name;
                const [x, y] = subfieldPositions[j];
                
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
                    // Toggle visibility of all subsubfields under this subfield
                    if (subfield.subsubfields && subfield.subsubfields.length) {
                        const subsubfieldNodes = allNodes.subsubfields.filter(n => 
                            n.dataRef.parentSubfield === subfieldName
                        );
                        subsubfieldNodes.forEach(node => {
                            const tooltip = node.getTooltip();
                            if (tooltip && tooltip.options.permanent) {
                                node.unbindTooltip();
                                node.bindTooltip(tooltip._content, { 
                                    permanent: false, 
                                    direction: 'top', 
                                    className: 'child-label' 
                                });
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
                    const subsubfieldPositions = [];
                    // Place subsubfields much closer to subfield, with more randomness
                    for (let k = 0; k < subsubfieldCount; k++) {
                        let angle = Math.random() * 2 * Math.PI;
                        let radius = 22 + Math.random() * 14;
                        let x2 = x + radius * Math.cos(angle);
                        let y2 = y + radius * Math.sin(angle);
                        // Ensure subsubfield stays within the domain's safe zone
                        if (Math.hypot(x2 - domainCenter[0], y2 - domainCenter[1]) > safeZoneRadius - 18) {
                            let scale = (safeZoneRadius - 18) / Math.hypot(x2 - domainCenter[0], y2 - domainCenter[1]);
                            x2 = domainCenter[0] + (x2 - domainCenter[0]) * scale;
                            y2 = domainCenter[1] + (y2 - domainCenter[1]) * scale;
                        }
                        subsubfieldPositions.push([x2, y2]);
                    }
                    for (let k = 0; k < subsubfieldCount; k++) {
                        const subsubfield = subfield.subsubfields[k];
                        const subsubfieldName = typeof subsubfield === 'string' ? subsubfield : subsubfield.name;
                        const [x2, y2] = subsubfieldPositions[k];
                        
                        // Create subsubfield data object
                        const subsubfieldData = typeof subsubfield === 'string' ? 
                            { name: subsubfield, parentSubfield: subfieldName } : 
                            { ...subsubfield, parentSubField: subfieldName };
                        
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
                            resetAllLabels();
                            renderInfoPanel(this.dataRef, false);
                            // Make this subsubfield's label permanent
                            this.bindTooltip(this.dataRef.name || this.dataRef, {
                                permanent: true,
                                direction: 'top',
                                className: 'child-label'
                            }).openTooltip();
                            // Also keep parent subfield and domain labels visible
                            const parentSubfieldNode = allNodes.subfields.find(n => n.dataRef.name === subfieldName && n.dataRef.parentDomain === domain.name);
                            if (parentSubfieldNode) {
                                parentSubfieldNode.bindTooltip(parentSubfieldNode.dataRef.name || parentSubfieldNode.dataRef, {
                                    permanent: true,
                                    direction: 'top',
                                    className: 'child-label'
                                }).openTooltip();
                            }
                            const parentDomainNode = allNodes.domains.find(n => n.dataRef.name === domain.name);
                            if (parentDomainNode) {
                                parentDomainNode.bindTooltip(parentDomainNode.dataRef.name, {
                                    permanent: true,
                                    direction: 'top',
                                    className: 'center-label'
                                }).openTooltip();
                            }
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

/* Add styles for the info panel */
const style = document.createElement('style');
style.innerHTML = `
#side-panel {
    background: #181818;
    color: #f0f0f0;
    padding: 24px 18px 18px 18px;
    font-family: 'Segoe UI', Arial, sans-serif;
    border-radius: 10px;
    min-height: 200px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.25);
    max-width: 350px;
    margin: 18px;
}
#side-panel h1, #side-panel h2, #side-panel h3 {
    color: #FFD93D;
    margin-top: 0.5em;
    margin-bottom: 0.3em;
}
#side-panel .info-default h1 {
    font-size: 2em;
    color: #FFD93D;
    margin-bottom: 0.2em;
}
#side-panel .info-default h2 {
    font-size: 1.2em;
    color: #6BCB77;
    margin-bottom: 0.2em;
}
#side-panel .info-default h3 {
    font-size: 1em;
    color: #4D96FF;
    margin-bottom: 0.2em;
}
#side-panel ul {
    margin: 0 0 0.5em 1.2em;
    padding: 0;
}
#side-panel li {
    margin-bottom: 0.2em;
    line-height: 1.4;
}
#side-panel .description {
    color: #B8B8FF;
    margin-bottom: 0.7em;
    font-style: italic;
}
`;
document.head.appendChild(style);