async function loadDomainData() {
    const response = await fetch('robotics.json');
    const data = await response.json();
    renderLeafletMap(data);
    renderInfoPanel(data); // Show main field info by default
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

function renderLeafletMap(domain) {
    if (window._leaflet_map) window._leaflet_map.remove();

    const map = L.map('map', {
        center: [0, 0],
        zoom: 3,
        minZoom: 2,
        maxZoom: 8
    });
    window._leaflet_map = map;

    // Main field as a 12-sided polygon (dodecagon)
    const mainSides = 12;
    const mainRadius = 13; // Reduce radius to bring subfields closer
    const mainCenter = [0, 0];
    const mainPolyPoints = [];
    for (let i = 0; i < mainSides; i++) {
        const theta = -Math.PI / 2 + 2 * Math.PI * i / mainSides;
        mainPolyPoints.push([
            mainCenter[0] + mainRadius * Math.sin(theta),
            mainCenter[1] + mainRadius * Math.cos(theta)
        ]);
    }
    const mainColor = "#4fc3f7";
    const mainPoly = L.polygon(mainPolyPoints, {
        color: mainColor,
        weight: 2,
        fillOpacity: 0.3
    }).addTo(map).bindTooltip(domain.name, {permanent: true, direction: 'center'});
    mainPoly.on('click', () => {
        renderInfoPanel(domain);
        showSubsubfieldLabels(null); // Hide all subsubfield labels
    });

    // Store subsubfield tooltips for show/hide
    let subsubfieldTooltips = [];
    // Store subfield tooltips for show/hide
    let subfieldTooltips = [];

    // Subfields as 12-sided polygons evenly spread in the main field
    const subfields = domain.subfields || [];
    const center = [0, 0];
    const radius = 9.2; // Bring subfields closer to the center
    const subfieldPolygonRadius = 3.5; // Size of each subfield polygon
    const subfieldSides = 12; // dodecagons
    const angleStep = 2 * Math.PI / subfields.length;

    subfields.forEach((sub, i) => {
        // Center of this subfield
        const angle = i * angleStep - Math.PI / 2;
        const subCenter = [center[0] + radius * Math.sin(angle), center[1] + radius * Math.cos(angle)];
        // Create dodecagon points
        const polyPoints = [];
        for (let j = 0; j < subfieldSides; j++) {
            const theta = angle + 2 * Math.PI * j / subfieldSides;
            polyPoints.push([
                subCenter[0] + subfieldPolygonRadius * Math.sin(theta),
                subCenter[1] + subfieldPolygonRadius * Math.cos(theta)
            ]);
        }
        const subColor = getSubColor(mainColor, i, subfields.length);
        const subPoly = L.polygon(polyPoints, {
            color: subColor,
            weight: 2,
            fillOpacity: 0.5
        }).addTo(map);

        // Subfield label at center, always visible
        const subTooltip = L.tooltip({
            permanent: true,
            direction: 'center',
            className: 'leaflet-tooltip-own',
            opacity: 0.9 // always visible
        })
        .setContent(sub.name)
        .setLatLng(subCenter);
        subTooltip.addTo(map);
        subfieldTooltips.push({tooltip: subTooltip, idx: i});

        subPoly.on('click', (e) => {
            L.DomEvent.stopPropagation(e); // Prevent click bubbling to parent
            renderInfoPanel(sub);
            showSubsubfieldLabels(i); // Show only this subfield's subsubfield labels
            showSubfieldLabels(i); // Show only this subfield's label
        });

        // Subsubfields as triangles inside each subfield polygon
        const subsubfields = sub.subsubfields || [];
        const subsubfieldRadius = 2.2; // Distance from subfield center
        const subsubfieldSides = 3; // triangles
        const subsubAngleStep = 2 * Math.PI / subsubfields.length;
        subsubfields.forEach((ssf, j) => {
            const ssAngle = angle + j * subsubAngleStep;
            const ssCenter = [
                subCenter[0] + subsubfieldRadius * Math.sin(ssAngle),
                subCenter[1] + subsubfieldRadius * Math.cos(ssAngle)
            ];
            // Triangle points
            const ssPolyPoints = [];
            for (let k = 0; k < subsubfieldSides; k++) {
                const phi = ssAngle + 2 * Math.PI * k / subsubfieldSides;
                ssPolyPoints.push([
                    ssCenter[0] + 0.8 * Math.sin(phi),
                    ssCenter[1] + 0.8 * Math.cos(phi)
                ]);
            }
            const ssColor = getSubColor(subColor, j, subsubfields.length);
            const ssPoly = L.polygon(ssPolyPoints, {
                color: ssColor,
                weight: 1,
                fillOpacity: 0.7
            }).addTo(map);

            // Create tooltip but don't show by default
            const ssTooltip = L.tooltip({
                permanent: true,
                direction: 'center',
                className: 'leaflet-tooltip-own',
                opacity: 0 // hidden initially
            })
            .setContent(ssf.name)
            .setLatLng(ssCenter);
            ssTooltip.addTo(map);

            // Store for show/hide
            subsubfieldTooltips.push({subfieldIdx: i, tooltip: ssTooltip});

            ssPoly.on('click', (e) => {
                L.DomEvent.stopPropagation(e);
                renderInfoPanel(ssf);
            });
        });
    });

    // Show/hide subfield labels
    function showSubfieldLabels(subfieldIdx) {
        // No-op: subfield labels are always visible
    }

    // Show/hide subsubfield labels
    function showSubsubfieldLabels(subfieldIdx) {
        subsubfieldTooltips.forEach(obj => {
            obj.tooltip.setOpacity(obj.subfieldIdx === subfieldIdx ? 0.9 : 0);
        });
    }

    // On map click, show main field info and hide all subfield and subsubfield labels
    map.on('click', () => {
        renderInfoPanel(domain);
        showSubsubfieldLabels(null);
        showSubfieldLabels(null);
    });

    // Show all subfield labels when main is clicked
    mainPoly.on('click', () => {
        renderInfoPanel(domain);
        showSubsubfieldLabels(null); // Hide all subsubfield labels
        showSubfieldLabels(true); // Show all subfield labels
    });

    map.fitBounds(mainPoly.getBounds());
}

loadDomainData();