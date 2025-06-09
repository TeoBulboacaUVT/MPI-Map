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
    renderLeafletConstellation(domainDataArr);
    renderInfoPanel({ name: 'Computer Science', coreConcepts: [], keyProblems: [], applications: [], tools: [], pioneers: [], timeline: [], subfields: [], relatedFields: [], advancements: [], literature: [] });
}

// --- LEAFLET CONSTELLATION RENDERER ---
function renderLeafletConstellation(domains) {
    // Only create the map once, just clear layers on redraw
    let map = window._leaflet_map;
    let firstRender = false;
    if (!map) {
        map = L.map('map', {
            center: [0, 0],
            zoom: 3,
            minZoom: 2,
            maxZoom: 8,
            zoomControl: false,
            attributionControl: false
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
    const mainCircle = L.circle(center, {
        radius: mainRadius,
        color: '#fff',
        fillColor: '#fff',
        fillOpacity: 0.95,
        weight: 3,
        className: 'glow-center'
    }).addTo(map);
    mainCircle.bindTooltip('Computer Science', { permanent: true, direction: 'center', className: 'domain-label', opacity: 0.98 });
    mainCircle.on('click', () => {
        renderInfoPanel({ name: 'Computer Science', coreConcepts: [], keyProblems: [], applications: [], tools: [], pioneers: [], timeline: [], subfields: [], relatedFields: [], advancements: [], literature: [] });
        activeDomainIndex = null;
        activeSubfieldIndex = null;
        renderLeafletConstellation(domains);
    });

    // Arrange domains in a randomized ellipse
    const n = domains.length;
    const nodeRadius = 7;
    const positions = getSpiderNodePositions(domains);
    positions.forEach(({ pos, angle }, i) => {
        const domain = domains[i];
        // Rotate domain positions 90deg right: swap X and Y, flip new X
        const domainPos = [pos[1], -pos[0]];
        const color = getDomainColor(i);
        // Draw domain node as a glowing circle
        const domainCircle = L.circle(domainPos, {
            radius: nodeRadius,
            color: color,
            fillColor: color,
            fillOpacity: 0.85,
            weight: 3,
            className: 'glow-domain'
        }).addTo(map);
        domainCircle.bindTooltip(domain.name, { permanent: true, direction: 'center', className: 'domain-label', opacity: 0.98 });
        domainCircle.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            renderInfoPanel(domain);
            activeDomainIndex = i;
            activeSubfieldIndex = null;
            renderLeafletConstellation(domains);
        });
        // Draw a glowing line from center to domain
        L.polyline([center, domainPos], { color: color, weight: 2, opacity: 0.5, dashArray: '4, 8', className: 'glow-line' }).addTo(map);

        // --- Render subfields as circles (60% of parent domain size) ---
        if (Array.isArray(domain.subfields) && domain.subfields.length > 0) {
            const subfieldCount = domain.subfields.length;
            const subfieldBaseDist = 18;
            const subfieldSpread = 5;
            const subfieldRadius = nodeRadius * 0.6;
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
                // Draw subfield node as a glowing circle
                const subCircle = L.circle(subPos, {
                    radius: subfieldRadius,
                    color: subColor,
                    fillColor: subColor,
                    fillOpacity: 0.85,
                    weight: 2,
                    className: 'glow-subfield'
                }).addTo(map);
                let showSubLabel = false;
                if (activeDomainIndex === i && activeSubfieldIndex === null) showSubLabel = true;
                if (activeDomainIndex === i && activeSubfieldIndex === k) showSubLabel = true;
                subCircle.bindTooltip(domain.subfields[k].name, { permanent: showSubLabel, direction: 'top', className: 'subfield-label', opacity: 0.98 });
                subCircle.on('click', (e) => {
                    L.DomEvent.stopPropagation(e);
                    renderInfoPanel(domain.subfields[k]);
                    activeDomainIndex = i;
                    activeSubfieldIndex = k;
                    renderLeafletConstellation(domains);
                });
                // Draw a glowing line from domain to subfield
                L.polyline([domainPos, subPos], { color: subColor, weight: 2, opacity: 0.5, dashArray: '2, 6', className: 'glow-line' }).addTo(map);

                // --- Render subsubfields as circles (50% of subfield size) ---
                if (Array.isArray(domain.subfields[k].subsubfields) && domain.subfields[k].subsubfields.length > 0) {
                    const subsubCount = domain.subfields[k].subsubfields.length;
                    const subsubBaseDist = 7;
                    const subsubSpread = 2.2;
                    const subsubRadius = subfieldRadius * 0.5;
                    for (let s = 0; s < subsubCount; s++) {
                        const rand2 = getSeededRandom(i * 10000 + k * 100 + s);
                        const subsubOffset = (s - (subsubCount - 1) / 2);
                        const subsubJitter = (rand2() - 0.5) * 0.7;
                        const subsubDist = subsubBaseDist;
                        const subsubPos = [
                            subPos[0] + subsubDist * Math.cos(outwardAngle) + (subsubOffset * subsubSpread + subsubJitter) * Math.cos(perpAngle),
                            subPos[1] + subsubDist * Math.sin(outwardAngle) + (subsubOffset * subsubSpread + subsubJitter) * Math.sin(perpAngle)
                        ];
                        let showSubsubLabel = false;
                        if (activeDomainIndex === i && activeSubfieldIndex === k) showSubsubLabel = true;
                        // Draw subsubfield node as a glowing circle
                        const subsubCircle = L.circle(subsubPos, {
                            radius: subsubRadius,
                            color: subColor,
                            fillColor: subColor,
                            fillOpacity: 0.95,
                            weight: 2,
                            className: 'glow-subsubfield'
                        }).addTo(map);
                        subsubCircle.bindTooltip(domain.subfields[k].subsubfields[s].name, { permanent: showSubsubLabel, direction: 'top', className: 'subsubfield-label', opacity: 0.98 });
                        subsubCircle.on('click', (e) => {
                            L.DomEvent.stopPropagation(e);
                            renderInfoPanel(domain.subfields[k].subsubfields[s]);
                            activeDomainIndex = i;
                            activeSubfieldIndex = k;
                            renderLeafletConstellation(domains);
                        });
                        // Draw a glowing line from subfield to subsubfield
                        L.polyline([subPos, subsubPos], { color: subColor, weight: 2, opacity: 0.4, dashArray: '1, 4', className: 'glow-line' }).addTo(map);
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
        renderLeafletConstellation(domains);
    });
}

// 4. Color utility for lighter shades
function lightenColor(hex, lum) {
  // Convert hex to RGB
  hex = hex.replace('#', '');
  let r = parseInt(hex.substring(0,2),16);
  let g = parseInt(hex.substring(2,4),16);
  let b = parseInt(hex.substring(4,6),16);
  // Apply luminance
  r = Math.round(Math.min(255, r + (255 - r) * lum));
  g = Math.round(Math.min(255, g + (255 - g) * lum));
  b = Math.round(Math.min(255, b + (255 - b) * lum));
  // Convert back to hex
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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

// Utility: evenly distribute nodes in a circle/ellipse
function getSpiderNodePositions(domains) {
    const n = domains.length;
    const radiusX = 35;
    const radiusY = 22;
    const positions = [];
    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        const x = radiusX * Math.cos(angle);
        const y = radiusY * Math.sin(angle);
        positions.push({ pos: [x, y], angle });
    }
    return positions;
}

// Utility: get a distinct color for each domain
function getDomainColor(i) {
    // 12 visually distinct hues
    const hues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
    const h = hues[i % hues.length];
    return `hsl(${h}, 80%, 55%)`;
}

// Utility: seeded random for reproducible jitter
function getSeededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function() {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
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

window.addEventListener('DOMContentLoaded', () => {
    loadAllDomains();
});