// Domain data with detailed information
const domains = {
    "Algorithms and Data Structures": {
        color: "#ff6b6b",
        coreConcepts: ["Time complexity", "Space complexity", "Sorting algorithms", "Search algorithms", "Graph algorithms", "Tree structures", "Hash tables"],
        keyChallenges: ["Optimizing performance", "Memory efficiency", "Parallel algorithms", "Approximation algorithms", "Quantum algorithms"],
        applications: ["Search engines", "Database systems", "Network routing", "Compression", "Cryptography"],
        tools: ["Python", "Java", "C++", "MATLAB", "R", "Julia"],
        pioneers: ["Donald Knuth", "Edsger Dijkstra", "Robert Tarjan", "Leslie Valiant", "Manuel Blum"],
        institutions: ["MIT CSAIL", "Stanford Theory Group", "Berkeley Algorithms Group", "Princeton CS Theory"],
        subdomains: [
            {name: "Sorting & Searching", color: "#ff8a8a"},
            {name: "Graph Theory", color: "#ff6b6b"},
            {name: "Dynamic Programming", color: "#ff4d4d"},
            {name: "Data Structures", color: "#ff2e2e"}
        ]
    },
    "Programming Languages": {
        color: "#4ecdc4",
        coreConcepts: ["Syntax and semantics", "Type systems", "Compilation vs interpretation", "Memory management", "Concurrency models"],
        keyChallenges: ["Verifying program correctness", "Balancing performance with safety", "Parallel programming models", "Domain-specific language design", "Security vulnerabilities"],
        applications: ["Software development", "System programming", "Web development", "Scientific computing", "Embedded systems"],
        tools: ["Python", "Java", "C++", "TypeScript", "LLVM", "GCC", "Roslyn"],
        pioneers: ["John Backus (FORTRAN)", "Grace Hopper (COBOL)", "Guido van Rossum (Python)", "Bjarne Stroustrup (C++)", "Martin Odersky (Scala)"],
        institutions: ["MIT CSAIL", "Stanford PL Group", "Microsoft Research", "Mozilla Research"],
        subdomains: [
            {name: "Functional Programming", color: "#6ed7cf"},
            {name: "Object-Oriented", color: "#4ecdc4"},
            {name: "Compilers", color: "#2ec3b9"},
            {name: "Language Design", color: "#0eb9ae"}
        ]
    },
    "Computer Architecture": {
        color: "#ffd166",
        coreConcepts: ["Instruction set architecture", "Pipelining", "Memory hierarchy", "Parallel processing", "Power efficiency"],
        keyChallenges: ["Memory wall problem", "Power density limits", "Hardware security", "Heterogeneous computing", "Quantum computing impact"],
        applications: ["CPU design", "Embedded systems", "High-performance computing", "Mobile processors", "IoT devices"],
        tools: ["Verilog", "VHDL", "QEMU", "Gem5", "LLVM", "Cadence", "Synopsys"],
        pioneers: ["John von Neumann", "Gordon Moore", "Seymour Cray", "Lynn Conway", "David Patterson"],
        institutions: ["Intel Labs", "ARM Research", "MIT Computer Architecture Group", "Stanford Pervasive Parallelism Lab"],
        subdomains: [
            {name: "CPU Design", color: "#ffe186"},
            {name: "Memory Systems", color: "#ffd166"},
            {name: "Parallel Processing", color: "#ffc146"},
            {name: "Embedded Systems", color: "#ffb126"}
        ]
    },
    "OS and Networks": {
        color: "#6a0572",
        coreConcepts: ["Process scheduling", "Memory management", "TCP/IP stack", "Network protocols", "Distributed systems"],
        keyChallenges: ["Kernel security", "Network congestion", "5G/6G deployment", "IoT scalability", "Edge computing"],
        applications: ["Operating systems", "Cloud infrastructure", "Network routers", "Distributed databases", "Real-time systems"],
        tools: ["Linux Kernel", "Docker", "Kubernetes", "Wireshark", "Cisco IOS", "FreeBSD"],
        pioneers: ["Ken Thompson (Unix)", "Dennis Ritchie (Unix)", "Vint Cerf (TCP/IP)", "Robert Kahn (TCP/IP)", "Linus Torvalds (Linux)"],
        institutions: ["Bell Labs", "Google", "Cisco Systems", "Stanford Networking Group"],
        subdomains: [
            {name: "Operating Systems", color: "#8a2582"},
            {name: "Network Protocols", color: "#6a0572"},
            {name: "Distributed Systems", color: "#4a0362"},
            {name: "Cloud Computing", color: "#2a0152"}
        ]
    },
    "Software Engineering": {
        color: "#118ab2",
        coreConcepts: ["Design patterns", "Agile methodologies", "DevOps", "Version control", "Testing frameworks"],
        keyChallenges: ["Technical debt", "Requirements volatility", "Legacy systems", "Scalability", "Security in SDLC"],
        applications: ["Enterprise applications", "Web services", "Mobile apps", "Cloud-native development", "Microservices"],
        tools: ["Git", "Jenkins", "Docker", "Jira", "Selenium", "Kubernetes", "Postman"],
        pioneers: ["Fred Brooks", "Grady Booch", "Kent Beck", "Martin Fowler", "Margaret Hamilton"],
        institutions: ["Microsoft Research", "Google Engineering", "IEEE Computer Society", "SEI Carnegie Mellon"],
        subdomains: [
            {name: "DevOps", color: "#31a2d2"},
            {name: "Agile Development", color: "#118ab2"},
            {name: "Testing & QA", color: "#017292"},
            {name: "Architecture", color: "#005a72"}
        ]
    },
    "DB And Information": {
        color: "#06d6a0",
        coreConcepts: ["Relational model", "ACID properties", "NoSQL databases", "Data warehousing", "Query optimization"],
        keyChallenges: ["Big data management", "Real-time analytics", "Data privacy", "Distributed transactions", "Unstructured data"],
        applications: ["Database systems", "Business intelligence", "E-commerce backends", "CRM systems", "Data lakes"],
        tools: ["SQL", "MongoDB", "PostgreSQL", "Apache Hadoop", "Redis", "Cassandra", "Elasticsearch"],
        pioneers: ["Edgar Codd", "Michael Stonebraker", "Charles Bachman", "Jim Gray", "Diane Greene"],
        institutions: ["Oracle Labs", "Google Bigtable Team", "MIT Database Group", "UC Berkeley RISELab"],
        subdomains: [
            {name: "Relational DB", color: "#26e6b0"},
            {name: "NoSQL", color: "#06d6a0"},
            {name: "Data Warehousing", color: "#06b680"},
            {name: "Big Data", color: "#069660"}
        ]
    },
    "AI": {
        color: "#ff6b6b",
        coreConcepts: ["Machine learning", "Neural networks", "Natural language processing", "Computer vision", "Reinforcement learning"],
        keyChallenges: ["Explainable AI", "Algorithmic bias", "Data privacy", "Computational requirements", "AGI safety"],
        applications: ["Recommendation systems", "Autonomous vehicles", "Medical diagnosis", "Fraud detection", "Chatbots"],
        tools: ["TensorFlow", "PyTorch", "scikit-learn", "OpenCV", "Keras", "SpaCy"],
        pioneers: ["Alan Turing", "John McCarthy", "Geoffrey Hinton", "Yann LeCun", "Fei-Fei Li"],
        institutions: ["OpenAI", "DeepMind", "MIT CSAIL", "Stanford AI Lab", "Carnegie Mellon AI"],
        subdomains: [
            {name: "Machine Learning", color: "#ff8a8a"},
            {name: "Neural Networks", color: "#ff6b6b"},
            {name: "Computer Vision", color: "#ff4d4d"},
            {name: "NLP", color: "#ff2e2e"}
        ]
    },
    "Robotics": {
        color: "#4ecdc4",
        coreConcepts: ["Kinematics", "Motion planning", "Sensor fusion", "Control systems", "Human-robot interaction"],
        keyChallenges: ["Environment perception", "Real-time control", "Safety guarantees", "Energy efficiency", "Swarm coordination"],
        applications: ["Industrial automation", "Surgical robots", "Autonomous drones", "Warehouse logistics", "Space exploration"],
        tools: ["ROS", "Gazebo", "MATLAB Robotics", "PCL", "OpenCV", "MoveIt"],
        pioneers: ["Joseph Engelberger", "Takeo Kanade", "Rodney Brooks", "Cynthia Breazeal", "Marc Raibert"],
        institutions: ["Boston Dynamics", "MIT CSAIL Robotics", "Stanford Robotics Lab", "ETH Zurich Robotics"],
        subdomains: [
            {name: "Motion Control", color: "#6ed7cf"},
            {name: "Computer Vision", color: "#4ecdc4"},
            {name: "Autonomous Systems", color: "#2ec3b9"},
            {name: "Human-Robot Interaction", color: "#0eb9ae"}
        ]
    },
    "Graphics": {
        color: "#ffd166",
        coreConcepts: ["Rendering pipelines", "Ray tracing", "Shading models", "Animation techniques", "GPU programming"],
        keyChallenges: ["Real-time photorealistic rendering", "Physics simulation", "VR/AR latency", "Light transport simulation", "GPU memory management"],
        applications: ["Video games", "Film VFX", "Medical imaging", "Architectural visualization", "Scientific visualization"],
        tools: ["OpenGL", "Vulkan", "Unity", "Unreal Engine", "Blender", "Maya"],
        pioneers: ["Ivan Sutherland", "Ed Catmull", "Pat Hanrahan", "Jim Blinn", "Ken Perlin"],
        institutions: ["Pixar", "NVIDIA Research", "MIT Media Lab", "Stanford Graphics Lab"],
        subdomains: [
            {name: "3D Graphics", color: "#ffe186"},
            {name: "Animation", color: "#ffd166"},
            {name: "Game Development", color: "#ffc146"},
            {name: "Visualization", color: "#ffb126"}
        ]
    },
    "Human Computer Interaction": {
        color: "#6a0572",
        coreConcepts: ["Usability principles", "User-centered design", "Cognitive models", "Accessibility standards", "Evaluation methodologies"],
        keyChallenges: ["Cross-cultural design", "Adaptive interfaces", "VR/AR interaction", "Ethical design", "Aging population needs"],
        applications: ["Web design", "Mobile apps", "VR/AR interfaces", "Accessibility tools", "Ubiquitous computing"],
        tools: ["Figma", "Adobe XD", "UserTesting", "Hotjar", "Google Analytics", "Axure"],
        pioneers: ["Douglas Engelbart", "Don Norman", "Ben Shneiderman", "Terry Winograd", "Brenda Laurel"],
        institutions: ["Nielsen Norman Group", "MIT Media Lab", "Stanford HCI Group", "Carnegie Mellon HCII"],
        subdomains: [
            {name: "UX Design", color: "#8a2582"},
            {name: "Accessibility", color: "#6a0572"},
            {name: "VR/AR", color: "#4a0362"},
            {name: "Mobile Interfaces", color: "#2a0152"}
        ]
    },
    "Computational Science": {
        color: "#118ab2",
        coreConcepts: ["Numerical methods", "Computational modeling", "High-performance computing", "Simulation techniques", "Algorithm complexity"],
        keyChallenges: ["Exascale computing", "Model validation", "Multiscale modeling", "Uncertainty quantification", "Massive data processing"],
        applications: ["Climate modeling", "Drug discovery", "Financial modeling", "Aerodynamics", "Quantum chemistry"],
        tools: ["MATLAB", "Python SciPy", "COMSOL", "ANSYS", "GROMACS", "LAMMPS"],
        pioneers: ["John von Neumann", "Klaus Schulten", "Cleve Moler", "Jack Dongarra", "Grace Hopper"],
        institutions: ["NASA Advanced Supercomputing", "Argonne National Lab", "ETH Zurich Computational Science", "MIT Computational Science"],
        subdomains: [
            {name: "Numerical Methods", color: "#31a2d2"},
            {name: "Scientific Computing", color: "#118ab2"},
            {name: "Simulation", color: "#017292"},
            {name: "High Performance", color: "#005a72"}
        ]
    },
    "Organizational Informatics": {
        color: "#06d6a0",
        coreConcepts: ["Business process modeling", "ERP systems", "Knowledge management", "Decision support systems", "Digital transformation"],
        keyChallenges: ["Legacy system integration", "Change management", "Data governance", "Cybersecurity risks", "AI adoption"],
        applications: ["Enterprise resource planning", "Supply chain management", "Customer relationship management", "Business intelligence", "E-government"],
        tools: ["SAP ERP", "Salesforce", "ServiceNow", "Microsoft Dynamics", "Tableau", "Power BI"],
        pioneers: ["Thomas Davenport", "Wanda Orlikowski", "Ikujiro Nonaka", "Michael Hammer", "Peter Drucker"],
        institutions: ["MIT Center for Information Systems", "Harvard Business School", "London School of Economics", "INSEAD"],
        subdomains: [
            {name: "Business Process", color: "#26e6b0"},
            {name: "Knowledge Management", color: "#06d6a0"},
            {name: "Decision Support", color: "#06b680"},
            {name: "Digital Transformation", color: "#069660"}
        ]
    },
    "Bioinformatics": {
        color: "#ff6b6b",
        coreConcepts: ["Genomic sequencing", "Protein structure prediction", "Phylogenetics", "Computational genomics", "Systems biology"],
        keyChallenges: ["Big biological data", "Multi-omics integration", "Personalized medicine", "Algorithm accuracy", "Ethical considerations"],
        applications: ["Drug discovery", "Personalized medicine", "Disease diagnosis", "Agricultural genomics", "Evolutionary studies"],
        tools: ["BLAST", "Bioconductor", "PyMOL", "Cytoscape", "GATK", "Rosetta"],
        pioneers: ["Margaret Dayhoff", "David Lipman", "Ewan Birney", "Steven Brenner", "Michael Waterman"],
        institutions: ["EMBL-EBI", "Broad Institute", "Sanger Institute", "Stanford Bioinformatics"],
        subdomains: [
            {name: "Genomics", color: "#ff8a8a"},
            {name: "Protein Structure", color: "#ff6b6b"},
            {name: "Systems Biology", color: "#ff4d4d"},
            {name: "Medical Informatics", color: "#ff2e2e"}
        ]
    }
};

// Add connection definitions
const connections = {
    "Compilers": {
        "Computer Architecture": ["CPU Design", "Memory Systems", "Parallel Processing", "Embedded Systems"],
        "Software Engineering": ["DevOps", "Testing & QA"],
        "OS and Networks": ["Operating Systems", "Network Protocols", "Distributed Systems", "Cloud Computing"]
    }
};

// Initialize the map with custom CRS
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 2,
    zoomControl: false
});

// Define the bounds of our custom coordinate system
const southWest = map.unproject([0, 1000], 0);
const northEast = map.unproject([1000, 0], 0);
const bounds = new L.LatLngBounds(southWest, northEast);

// Set the view to center on the Computer Science node
map.setView([500, 500], 0);

// Create a custom tile layer (grid background)
L.rectangle(bounds, {
    color: '#111',
    fillColor: '#111',
    fillOpacity: 1,
    weight: 1
}).addTo(map);

// Add central Computer Science node
const centralNode = {
    name: "Computer Science",
    position: [500, 500],
    color: "#ffffff",
    bounds: [[425, 425], [575, 575]],
    coreConcepts: ["Computational Theory", "Algorithms", "Data Structures", "Computing Systems", "Software Development"],
    keyChallenges: ["Quantum Computing", "AI Ethics", "Cybersecurity", "Scalability", "Energy Efficiency"],
    applications: ["Scientific Computing", "Business Systems", "Entertainment", "Healthcare", "Education"],
    tools: ["Programming Languages", "Development Environments", "Version Control", "Cloud Platforms", "AI Frameworks"],
    pioneers: ["Alan Turing", "John von Neumann", "Ada Lovelace", "Grace Hopper", "Tim Berners-Lee"],
    institutions: ["MIT", "Stanford", "Berkeley", "CMU", "ETH Zurich"]
};

// Function to calculate oval positions
function calculateOvalPositions(center, radiusX, radiusY, count) {
    const positions = [];
    const baseAngle = (2 * Math.PI) / count;
    
    for (let i = 0; i < count; i++) {
        // Add some randomness to the radius
        const randomRadiusX = radiusX * (0.8 + Math.random() * 0.4);
        const randomRadiusY = radiusY * (0.8 + Math.random() * 0.4);
        const angle = baseAngle * i;
        const x = center[0] + randomRadiusX * Math.cos(angle);
        const y = center[1] + randomRadiusY * Math.sin(angle);
        positions.push([x, y]);
    }
    
    return positions;
}

// Calculate positions for all domains with oval distribution
const domainPositions = calculateOvalPositions([500, 500], 540, 300, Object.keys(domains).length);

// Create domain rectangles and labels
const domainLabels = [];
const subdomainLabels = [];

// Add central node first
const centralRect = L.rectangle([
    map.unproject([centralNode.bounds[0][0], centralNode.bounds[0][1]], 0),
    map.unproject([centralNode.bounds[1][0], centralNode.bounds[1][1]], 0)
], {
    color: centralNode.color,
    fillColor: centralNode.color,
    fillOpacity: 0.7,
    weight: 2
}).addTo(map);

centralRect.on('click', function() {
    updateInfoPanel(centralNode.name, centralNode);
});

// Add central node label
const centralLabel = L.marker(map.unproject([500, 500], 0), {
    icon: L.divIcon({
        className: 'domain-label',
        html: `<div style="
            color: white;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            text-shadow: 1px 1px 2px black;
            background: rgba(0, 0, 0, 0.5);
            padding: 4px 8px;
            border-radius: 4px;
            white-space: nowrap;
        ">${centralNode.name}</div>`,
        iconSize: [200, 30],
        iconAnchor: [100, 15]
    }),
    zIndexOffset: 1000
}).addTo(map);

// Add domains in oval pattern
Object.entries(domains).forEach(([domainName, domainData], index) => {
    const position = domainPositions[index];
    const size = 150; // Size for main domain
    
    // Update domain bounds based on oval position
    domainData.bounds = [
        [position[0] - size/2, position[1] - size/2],
        [position[0] + size/2, position[1] + size/2]
    ];
    
    // Create main domain rectangle
    const rect = L.rectangle([
        map.unproject([domainData.bounds[0][0], domainData.bounds[0][1]], 0),
        map.unproject([domainData.bounds[1][0], domainData.bounds[1][1]], 0)
    ], {
        color: domainData.color,
        fillColor: domainData.color,
        fillOpacity: 0.7,
        weight: 2
    }).addTo(map);
    
    // Add click event to show domain info
    rect.on('click', function() {
        updateInfoPanel(domainName, domainData);
    });
    
    // Add hover effect
    rect.on('mouseover', function() {
        this.setStyle({fillOpacity: 0.9, weight: 3});
    });
    
    rect.on('mouseout', function() {
        this.setStyle({fillOpacity: 0.7, weight: 2});
    });
    
    // Create main domain label
    const domainLabel = L.marker(map.unproject(position, 0), {
        icon: L.divIcon({
            className: 'domain-label',
            html: `<div style="
                color: white;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                text-shadow: 1px 1px 2px black;
                background: rgba(0, 0, 0, 0.5);
                padding: 3px 6px;
                border-radius: 3px;
                white-space: nowrap;
            ">${domainName}</div>`,
            iconSize: [180, 25],
            iconAnchor: [90, 12]
        }),
        zIndexOffset: 1000
    }).addTo(map);
    
    domainLabels.push(domainLabel);
    
    // Add subdomains
    const subdomainSize = 50; // Size for subdomain boxes
    const subdomainPositions = [
        [position[0] - size/4, position[1] - size/4],
        [position[0] + size/4, position[1] - size/4],
        [position[0] - size/4, position[1] + size/4],
        [position[0] + size/4, position[1] + size/4]
    ];
    
    domainData.subdomains.forEach((subdomain, subIndex) => {
        const subPos = subdomainPositions[subIndex];
        
        // Create subdomain rectangle
        const subRect = L.rectangle([
            map.unproject([subPos[0] - subdomainSize/2, subPos[1] - subdomainSize/2], 0),
            map.unproject([subPos[0] + subdomainSize/2, subPos[1] + subdomainSize/2], 0)
        ], {
            color: subdomain.color,
            fillColor: subdomain.color,
            fillOpacity: 0.7,
            weight: 1
        }).addTo(map);
        
        // Add click event to show subdomain info
        subRect.on('click', function(e) {
            e.originalEvent.stopPropagation(); // Prevent event from bubbling to parent
            updateInfoPanel(subdomain.name, {
                ...domainData,
                name: subdomain.name,
                color: subdomain.color
            });
        });
        
        // Add hover effect
        subRect.on('mouseover', function() {
            this.setStyle({fillOpacity: 0.9, weight: 2});
        });
        
        subRect.on('mouseout', function() {
            this.setStyle({fillOpacity: 0.7, weight: 1});
        });
        
        // Create subdomain label
        const subLabel = L.marker(map.unproject(subPos, 0), {
            icon: L.divIcon({
                className: 'subdomain-label',
                html: `<div style="
                    color: white;
                    font-size: 12px;
                    text-align: center;
                    text-shadow: 1px 1px 2px black;
                    background: rgba(0, 0, 0, 0.5);
                    padding: 2px 4px;
                    border-radius: 2px;
                    white-space: nowrap;
                ">${subdomain.name}</div>`,
                iconSize: [140, 20],
                iconAnchor: [70, 10]
            }),
            zIndexOffset: 2000
        }).addTo(map);
        
        subdomainLabels.push({
            domainLabel: domainLabel,
            subLabel: subLabel,
            subRect: subRect
        });
    });
    
    // Add connection to central node
    L.polyline([
        map.unproject([500, 500], 0),
        map.unproject(position, 0)
    ], {
        color: '#ffffff',
        weight: 3,
        opacity: 0.5,
        dashArray: '8, 15'
    }).addTo(map);
});

// Add zoom control
L.control.zoom({position: 'bottomright'}).addTo(map);

// Store active connection lines
let activeConnections = [];

// Function to update the information panel
function updateInfoPanel(domainName, domainData) {
    const infoPanel = document.querySelector('.info-panel');
    
    // Update header
    infoPanel.querySelector('h2').textContent = domainName;
    infoPanel.querySelector('.date').style.display = 'none';
    
    // Remove any existing toggle
    const existingToggle = infoPanel.querySelector('.connection-toggle');
    if (existingToggle) {
        existingToggle.remove();
    }
    
    // Add toggle button for connections if it's a subdomain with connections
    if (connections[domainName]) {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'connection-toggle';
        toggleContainer.innerHTML = `
            <label class="switch">
                <input type="checkbox" id="showConnections">
                <span class="slider round"></span>
            </label>
            <span>Show Related Fields</span>
        `;
        
        // Insert the toggle before the info content
        const infoContent = infoPanel.querySelector('.info-content');
        if (infoContent) {
            infoPanel.insertBefore(toggleContainer, infoContent);
        } else {
            infoPanel.appendChild(toggleContainer);
        }
        
        // Add event listener for toggle
        const toggle = toggleContainer.querySelector('#showConnections');
        toggle.addEventListener('change', function() {
            if (this.checked) {
                showConnections(domainName);
            } else {
                hideConnections();
            }
        });
    }
    
    // Update core concepts
    updateInfoSection('Core Concepts', domainData.coreConcepts);
    
    // Update key challenges
    updateInfoSection('Key Challenges', domainData.keyChallenges);
    
    // Update applications
    updateInfoSection('Applications', domainData.applications);
    
    // Update tools
    updateInfoSection('Tools & Technologies', domainData.tools, true);
    
    // Update pioneers
    updateInfoSection('Pioneers & Institutions', [
        ...domainData.pioneers, 
        ...domainData.institutions
    ]);
}

function updateInfoSection(title, items, isPills = false) {
    const sections = document.querySelectorAll('.info-section');
    
    for (const section of sections) {
        if (section.querySelector('h3').textContent.includes(title)) {
            const contentDiv = section.querySelector('.info-content');
            
            if (isPills) {
                contentDiv.innerHTML = items.map(item => 
                    `<span class="pill">${item}</span>`
                ).join('');
            } else {
                contentDiv.innerHTML = `<ul>${
                    items.map(item => `<li>${item}</li>`).join('')
                }</ul>`;
            }
            break;
        }
    }
}

// Function to reset info panel to default view
function resetInfoPanel() {
    const infoPanel = document.querySelector('.info-panel');
    infoPanel.querySelector('h2').textContent = 'Map of Computer Science';
    infoPanel.querySelector('.date').style.display = 'block';
    
    // Clear all sections
    const sections = infoPanel.querySelectorAll('.info-section');
    sections.forEach(section => {
        section.querySelector('.info-content').innerHTML = '';
    });
    
    // Remove any existing toggle
    const existingToggle = infoPanel.querySelector('.connection-toggle');
    if (existingToggle) {
        existingToggle.remove();
    }
    
    // Hide any active connections
    hideConnections();
}

// Call resetInfoPanel when the page loads
document.addEventListener('DOMContentLoaded', resetInfoPanel);

// Function to show connections
function showConnections(domainName) {
    // Clear any existing connections
    hideConnections();
    
    if (!connections[domainName]) return;
    
    // Get the source domain position
    const sourceDomain = Object.entries(domains).find(([name, data]) => 
        data.subdomains.some(sub => sub.name === domainName)
    );
    
    if (!sourceDomain) return;
    
    const [sourceName, sourceData] = sourceDomain;
    const sourcePosition = domainPositions[Object.keys(domains).indexOf(sourceName)];
    
    // Create connections to each related domain
    Object.entries(connections[domainName]).forEach(([targetDomain, subdomains]) => {
        const targetIndex = Object.keys(domains).indexOf(targetDomain);
        if (targetIndex === -1) return;
        
        const targetPosition = domainPositions[targetIndex];
        
        // Create a bright blue connection line
        const connection = L.polyline([
            map.unproject(sourcePosition, 0),
            map.unproject(targetPosition, 0)
        ], {
            color: '#00ffff',
            weight: 3,
            opacity: 0.8,
            dashArray: '5, 10'
        }).addTo(map);
        
        activeConnections.push(connection);
    });
}

// Function to hide connections
function hideConnections() {
    activeConnections.forEach(connection => {
        connection.remove();
    });
    activeConnections = [];
} 