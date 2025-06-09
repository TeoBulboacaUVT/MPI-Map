async function loadAllDomains() {
    const domainNames = [
        'algorithms_and_data_structures',
        'programming_languages',
        'computer_architecture',
        'operating_systems_and_networks',
        'software_engineering',
        'databases_and_information_systems',
        'artificial_intelligence',
        'robotics',
        'graphics',
        'human_computer_interaction',
        'computational_science',
        'organizational_informatics',
        'bioinformatics'
    ];
    const domainFiles = domainNames.map(name => `${name}.json`);
    const domainDataArr = await Promise.all(domainFiles.map(f => fetch(f).then(r => r.json())));
    renderSpiderMap(domainDataArr);
    renderInfoPanel({ name: 'Computer Science', coreConcepts: [], keyProblems: [], applications: [], tools: [], pioneers: [], timeline: [], subfields: [], relatedFields: [], advancements: [], literature: [] });
}

let activeDomainIndex = null;
let activeSubfieldIndex = null;
let _spiderNodePositions = null;

function getSeededRandom(seed) {
    // Mulberry32 PRNG
    let t = seed + 0x6D2B79F5;
    return function() {
        t += 0x6D2B79F5;
        let r = Math.imul(t ^ t >>> 15, 1 | t);
        r ^= r + Math.imul(r ^ r >>> 7, 61 | r);
        return ((r ^ r >>> 14) >>> 0) / 4294967296;
    };
}

function getSpiderNodePositions(domains) {
    if (_spiderNodePositions) return _spiderNodePositions;
    // Use a fixed seed for stable layout
    const rand = getSeededRandom(42);
    const n = domains.length;
    const radiusX = 60; // wide ellipse
    const radiusY = 28; // wide ellipse
    const nodeRadius = 7;
    const angleStep = 2 * Math.PI / n;
    const positions = [];
    for (let i = 0; i < n; i++) {
        const angleJitter = (rand() - 0.5) * 0.22;
        const distJitter = 1 + (rand() - 0.5) * 0.18;
        const angle = i * angleStep - Math.PI / 2 + angleJitter;
        const pos = [
            radiusX * Math.cos(angle) * distJitter,
            radiusY * Math.sin(angle) * distJitter
        ];
        positions.push({ pos, angle });
    }
    _spiderNodePositions = positions;
    return positions;
}

function renderSpiderMap(domains) {
    // Only create the map once, just clear layers on redraw
    let map = window._leaflet_map;
    let firstRender = false;
    if (!map) {
        map = L.map('map', {
            center: [0, 0],
            zoom: 3,
            minZoom: 2,
            maxZoom: 8,
            zoomControl: false
        });
        window._leaflet_map = map;
        firstRender = true;
    } else {
        map.eachLayer(layer => {
            if (layer instanceof L.TileLayer) return;
            map.removeLayer(layer);
        });
    }

    // Central node: Computer Science
    const center = [0, 0];
    const mainRadius = 4;
    const mainPoly = L.circle(center, { radius: mainRadius, color: '#4fc3f7', fillOpacity: 0.7, weight: 2 }).addTo(map);
    mainPoly.bindTooltip('Computer Science', { permanent: true, direction: 'center', className: 'domain-label', opacity: 0.95 });
    mainPoly.on('click', () => {
        renderInfoPanel({ name: 'Computer Science', coreConcepts: [], keyProblems: [], applications: [], tools: [], pioneers: [], timeline: [], subfields: [], relatedFields: [], advancements: [], literature: [] });
        activeDomainIndex = null;
        activeSubfieldIndex = null;
        renderSpiderMap(domains);
    });

    // Arrange domains in a randomized ellipse
    const n = domains.length;
    const nodeRadius = 7;
    const positions = getSpiderNodePositions(domains);
    positions.forEach(({ pos, angle }, i) => {
        const domain = domains[i];
        // Rotate domain positions 90deg right: swap X and Y, flip new X
        const domainPos = [pos[1], -pos[0]];
        // Draw a polygon for each domain
        const sides = 12;
        const polyPoints = [];
        for (let j = 0; j < sides; j++) {
            const theta = angle + 2 * Math.PI * j / sides;
            polyPoints.push([
                domainPos[0] + nodeRadius * Math.sin(theta),
                domainPos[1] + nodeRadius * Math.cos(theta)
            ]);
        }
        const color = '#4fc3f7';
        const poly = L.polygon(polyPoints, {
            color,
            weight: 2,
            fillOpacity: 0.5
        }).addTo(map);
        poly.bindTooltip(domain.name, { permanent: true, direction: 'center', className: 'domain-label', opacity: 0.95 });
        poly.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            renderInfoPanel(domain);
            activeDomainIndex = i;
            activeSubfieldIndex = null;
            renderSpiderMap(domains);
        });
        // Draw a line from center to node
        L.polyline([[0,0], domainPos], { color: '#4fc3f7', weight: 1, opacity: 0.5, dashArray: '4, 8' }).addTo(map);

        // --- Render subfields as polygons (60% of parent domain size) ---
        if (Array.isArray(domain.subfields) && domain.subfields.length > 0) {
            const subfieldCount = domain.subfields.length;
            const subfieldBaseDist = 18;
            const subfieldSpread = 5;
            const subfieldPolyRadius = nodeRadius * 0.6;
            const subfieldSides = 8;
            const dx = domainPos[0] - center[0];
            const dy = domainPos[1] - center[1];
            const outwardAngle = Math.atan2(dy, dx);
            const perpAngle = outwardAngle + Math.PI / 2;
            for (let k = 0; k < subfieldCount; k++) {
                const rand = getSeededRandom(i * 100 + k);
                const offset = (k - (subfieldCount - 1) / 2);
                const spreadJitter = (rand() - 0.5) * 0.7;
                const dist = subfieldBaseDist;
                const subPos = [
                    domainPos[0] + dist * Math.cos(outwardAngle) + (offset * subfieldSpread + spreadJitter) * Math.cos(perpAngle),
                    domainPos[1] + dist * Math.sin(outwardAngle) + (offset * subfieldSpread + spreadJitter) * Math.sin(perpAngle)
                ];
                const subColor = getSubColor(color, k, subfieldCount);
                // Draw polygon for subfield
                const subPolyPoints = [];
                for (let m = 0; m < subfieldSides; m++) {
                    const t = outwardAngle + 2 * Math.PI * m / subfieldSides;
                    subPolyPoints.push([
                        subPos[0] + subfieldPolyRadius * Math.sin(t),
                        subPos[1] + subfieldPolyRadius * Math.cos(t)
                    ]);
                }
                // Label logic for subfields
                let showSubLabel = false;
                if (activeDomainIndex === i && activeSubfieldIndex === null) showSubLabel = true; // show all subfield labels on domain click
                if (activeDomainIndex === i && activeSubfieldIndex === k) showSubLabel = true; // show only this subfield label on subfield click
                const subPoly = L.polygon(subPolyPoints, {
                    color: subColor,
                    weight: 2,
                    fillOpacity: 0.7
                }).addTo(map);
                subPoly.bindTooltip(domain.subfields[k].name, { permanent: showSubLabel, direction: 'top', className: 'subfield-label', opacity: 0.95 });
                subPoly.on('click', (e) => {
                    L.DomEvent.stopPropagation(e);
                    renderInfoPanel(domain.subfields[k]);
                    activeDomainIndex = i;
                    activeSubfieldIndex = k;
                    renderSpiderMap(domains);
                });
                // Draw a line from domain node to subfield
                L.polyline([domainPos, subPos], { color: subColor, weight: 1, opacity: 0.5, dashArray: '2, 6' }).addTo(map);

                // --- Render subsubfields as polygons (50% of subfield size) ---
                if (Array.isArray(domain.subfields[k].subsubfields) && domain.subfields[k].subsubfields.length > 0) {
                    const subsubCount = domain.subfields[k].subsubfields.length;
                    const subsubBaseDist = 7;
                    const subsubSpread = 2.2;
                    const subsubPolyRadius = subfieldPolyRadius * 0.5;
                    const subsubSides = 6;
                    for (let s = 0; s < subsubCount; s++) {
                        const rand2 = getSeededRandom(i * 10000 + k * 100 + s);
                        const subsubOffset = (s - (subsubCount - 1) / 2);
                        const subsubJitter = (rand2() - 0.5) * 0.7;
                        const subsubDist = subsubBaseDist;
                        const subsubPos = [
                            subPos[0] + subsubDist * Math.cos(outwardAngle) + (subsubOffset * subsubSpread + subsubJitter) * Math.cos(perpAngle),
                            subPos[1] + subsubDist * Math.sin(outwardAngle) + (subsubOffset * subsubSpread + subsubJitter) * Math.sin(perpAngle)
                        ];
                        // Label logic for subsubfields
                        let showSubsubLabel = false;
                        if (activeDomainIndex === i && activeSubfieldIndex === k) showSubsubLabel = true; // show only for selected subfield
                        // Draw polygon for subsubfield
                        const subsubPolyPoints = [];
                        for (let n = 0; n < subsubSides; n++) {
                            const t2 = outwardAngle + 2 * Math.PI * n / subsubSides;
                            subsubPolyPoints.push([
                                subsubPos[0] + subsubPolyRadius * Math.sin(t2),
                                subsubPos[1] + subsubPolyRadius * Math.cos(t2)
                            ]);
                        }
                        const subsubPoly = L.polygon(subsubPolyPoints, {
                            color: subColor,
                            weight: 2,
                            fillOpacity: 0.85
                        }).addTo(map);
                        subsubPoly.bindTooltip(domain.subfields[k].subsubfields[s].name, { permanent: showSubsubLabel, direction: 'top', className: 'subsubfield-label', opacity: 0.95 });
                        subsubPoly.on('click', (e) => {
                            L.DomEvent.stopPropagation(e);
                            renderInfoPanel(domain.subfields[k].subsubfields[s]);
                            activeDomainIndex = i;
                            activeSubfieldIndex = k;
                            renderSpiderMap(domains);
                        });
                        // Draw a line from subfield to subsubfield
                        L.polyline([subPos, subsubPos], { color: subColor, weight: 1, opacity: 0.4, dashArray: '1, 4' }).addTo(map);
                    }
                }
            }
        }
    });
    if (firstRender) {
        map.fitBounds([[-80, -40], [80, 40]]);
    }
    // Hide all subfield/subsubfield labels when clicking off (background or central node)
    map.off('click');
    map.on('click', () => {
        activeDomainIndex = null;
        activeSubfieldIndex = null;
        renderInfoPanel({ name: 'Computer Science', coreConcepts: [], keyProblems: [], applications: [], tools: [], pioneers: [], timeline: [], subfields: [], relatedFields: [], advancements: [], literature: [] });
        renderSpiderMap(domains);
    });
}

// Utility: Convert hex color to HSL
function hexToHSL(hex) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0,2),16)/255;
    let g = parseInt(hex.substring(2,4),16)/255;
    let b = parseInt(hex.substring(4,6),16)/255;
    let max = Math.max(r,g,b), min = Math.min(r,g,b);
    let h, s, l = (max + min) / 2;
    if(max === min){
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return {h: h*360, s: s*100, l: l*100};
}

// Utility: Convert HSL to hex
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c/2;
    let r=0, g=0, b=0;
    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Get a color close to base, but with different brightness/saturation
function getSubColor(base, offset, total) {
    let hsl = hexToHSL(base);
    // Vary lightness and saturation a bit, but keep hue
    let l = Math.max(25, Math.min(85, hsl.l + (offset - total/2) * 7));
    let s = Math.max(40, Math.min(90, hsl.s + (offset - total/2) * 4));
    return hslToHex(hsl.h, s, l);
}

function renderInfoPanel(field) {
    const panel = document.getElementById('infoPanel');
    // Render array of {name, link} as hyperlinks in a bulleted list
    function renderLinks(arr) {
        if (!arr) return '';
        return `<ul>` + arr.map(obj => `<li>${obj.link ? `<a href="${obj.link}" target="_blank" rel="noopener">${obj.name || obj.link}</a>` : (obj.name || obj.link)}</li>`).join('') + `</ul>`;
    }
    // Render a simple array as a bulleted list
    function renderList(arr) {
        if (!arr || arr.length === 0) return '';
        // Split items by comma if they are long strings with commas
        let items = [];
        arr.forEach(item => {
            if (typeof item === 'string' && item.includes(',')) {
                // Split by comma, but keep phrases together
                items.push(...item.split(/,(?![^()]*\))/).map(s => s.trim()).filter(Boolean));
            } else {
                items.push(item);
            }
        });
        return `<ul>` + items.map(item => `<li>${item}</li>`).join('') + `</ul>`;
    }
    // Helper to check if a field is non-empty array
    function hasContent(arr) {
        return Array.isArray(arr) && arr.length > 0;
    }
    let html = `
        <h2>${field.name}</h2>
        <div class="info-section"><h3>Core Concepts</h3><div>${renderList(field.coreConcepts)}</div></div>
        <div class="info-section"><h3>Key Problems or Challenges</h3><div>${renderList(field.keyProblems)}</div></div>
        <div class="info-section"><h3>Applications</h3><div>${renderList(field.applications)}</div></div>
        <div class="info-section"><h3>Notable Tools / Libraries / Languages</h3><div>${renderList(field.tools)}</div></div>
    `;
    if (hasContent(field.pioneers)) {
        html += `<div class="info-section"><h3>Pioneers / Institutions</h3><div>${renderLinks(field.pioneers)}</div></div>`;
    }
    if (hasContent(field.timeline)) {
        html += `<div class="info-section"><h3>Timeline / Historical Milestones</h3><div>${renderList(field.timeline)}</div></div>`;
    }
    if (hasContent(field.relatedFields)) {
        html += `<div class="info-section"><h3>Related Fields</h3><div>${renderLinks(field.relatedFields)}</div></div>`;
    }
    if (hasContent(field.advancements)) {
        html += `<div class="info-section"><h3>Advancements</h3><div>${renderList(field.advancements)}</div></div>`;
    }
    if (hasContent(field.literature)) {
        html += `<div class="info-section"><h3>Literature</h3><div>${renderLinks(field.literature)}</div></div>`;
    }
    panel.innerHTML = html;
}

window.addEventListener('DOMContentLoaded', loadAllDomains);