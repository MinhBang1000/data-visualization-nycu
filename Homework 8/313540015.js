// 1. SVG and Layout Configuration
const width = 1024;
const height = 600;
const margin = { top: 0, right: 0, bottom: 0, left: 0 };

const chartContainer = d3.select('#sankey-chart-container')
const svg = chartContainer.append('svg')

svg.attr('width', width)
    .attr('height', height)

const diagramWidth = width - margin.left - margin.right;
const diagramHeight = 500 - margin.top - margin.bottom;

// Sankey Diagram Properties
const sankey = d3.sankey()
    .nodeWidth(20)
    .nodePadding(40)
    .size([diagramWidth + margin.left, diagramHeight + margin.top]);
const path = sankey.link();

function createControl() {
    const legendContainer = d3.select('#control')

}

// 2. Color Scales and Mappings


const colorScales = {
    buying: d3.scaleSequential(d3.interpolateBlues).domain([0, 0.5]), // Darkest shades only
    maintenance: d3.scaleSequential(d3.interpolateGreens).domain([0, 0.5]),
    doors: d3.scaleSequential(d3.interpolateGreys).domain([0, 0.5]),
    persons: d3.scaleSequential(d3.interpolateOranges).domain([0, 0.5]),
    'luggage boot': d3.scaleSequential(d3.interpolatePurples).domain([0, 0.5]),
    safety: d3.scaleSequential(d3.interpolateReds).domain([0, 0.5]),
};

const colorScalesIndex = {
    buying: { vhigh: 0.1, high: 0.2, med: 0.3, low: 0.4 }, // Focused on the darkest end of the domain
    maintenance: { vhigh: 0.1, high: 0.2, med: 0.3, low: 0.4 },
    doors: { '2': 0.1, '3': 0.2, '4': 0.3, '5more': 0.4 },
    persons: { '2': 0.1, '4': 0.3, more: 0.5 }, // Emphasizes the darkest shades
    'luggage boot': { small: 0.1, med: 0.3, big: 0.5 },
    safety: { low: 0.1, med: 0.3, high: 0.5 },
};




// 3. Data Transformation Function
const transformData = (data) => {
    const nodesById = {};
    const linksMap = {};
    const columns = data.columns;
    const n = columns.length;

    data.forEach((row) => {
        for (let i = 0; i < n - 1; i++) {
            const source = `${columns[i]}-${row[columns[i]]}`;
            const target = `${columns[i + 1]}-${row[columns[i + 1]]}`;

            if (!target || target === '-') break;

            const linkKey = `${source}->${target}`;
            linksMap[linkKey] = linksMap[linkKey] || { source, target, value: 0 };
            linksMap[linkKey].value += 1;

            nodesById[source] = true;
            nodesById[target] = true;
        }
    });

    const nodes = Object.keys(nodesById).map(id => ({ name: id, label: id.substr(0, 20) }));
    const links = Object.values(linksMap);

    return { nodes, links };
};

// 4. Render Function
const render = (graph) => {
    svg.attr('transform', `translate(${margin.left},${margin.top})`);

    // Map nodes to graph.links
    const nodeMap = graph.nodes.reduce((acc, node) => {
        acc[node.name] = node;
        return acc;
    }, {});

    graph.links = graph.links.map(link => ({
        source: nodeMap[link.source],
        target: nodeMap[link.target],
        value: link.value,
    }));

    sankey.nodes(graph.nodes).links(graph.links).layout(32);

    // Group and Render Links
    const linkGroups = groupLinks(graph.links);
    renderLinks(linkGroups);

    // Render Nodes
    renderNodes(graph.nodes);
};

// Helper function to group links by source-target pairs
const groupLinks = (links) => {
    return links.reduce((acc, link) => {
        const key = `${link.source.name}-${link.target.name}`;
        acc[key] = acc[key] || [];
        acc[key].push(link);
        return acc;
    }, {});
};

// Create tooltip
const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')

// Change this value to control the coloring mode
let linkColorMode = "source-target";
let parsedData = null

// Function to render link paths
const renderLinks = (linkGroups) => {
    const band = svg.append('g').selectAll('.band')
        .data(Object.values(linkGroups))
        .enter().append('g')
        .attr('class', 'band');
    function sanitizeId(id) {
        return id.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');
    }
    const link = band.selectAll('.link')
        .data(d => d)
        .enter().append('path')
        .attr('class', d => `link ${d.source.name} ${d.target.name}`)
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr('d', path)
        .style('stroke-width', d => Math.max(1, d.dy))
        .sort((a, b) => b.dy - a.dy)
        .on('mousemove', function (d) {
            tooltip.style("display", "block")
                .style("left", `${d3.event.pageX + 10}px`)
                .style("top", `${d3.event.pageY - 20}px`)
                .html(`
                    <div><strong>Source: </strong>${d.source.name}</div>
                    <div><strong>Target: </strong>${d.target.name}</div>
                    <div><strong>Count: </strong>${d.value}</div>
                `);
        })
        .on('mouseout', function () {
            tooltip.style("display", "none");
        });

    // Set link color based on the chosen linkColorMode
    link.style("stroke", (d) => {
        if (linkColorMode === "source") {
            return colorScales[d.source.name.split('-')[0]](colorScalesIndex[d.source.name.split('-')[0]][d.source.name.split('-')[1]]);
        } else if (linkColorMode === "target") {
            return colorScales[d.target.name.split('-')[0]](colorScalesIndex[d.target.name.split('-')[0]][d.target.name.split('-')[1]]);
        } else if (linkColorMode === "source-target") {
            // Use a gradient for source-target color blending
            const gradientId = `gradient-${sanitizeId(d.source.name)}-${sanitizeId(d.target.name)}`;
            return `url(#${gradientId})`;
        } else {
            return linkColorMode; // Use a static color if provided
        }
    });

    // Add gradients for source-target color blending
    if (linkColorMode === "source-target") {
        const defs = svg.append("defs");
        link.each(function (d) {
            const gradientId = `gradient-${sanitizeId(d.source.name)}-${sanitizeId(d.target.name)}`;
            const gradient = defs.append("linearGradient")
                .attr("id", gradientId)
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", d.source.x1)
                .attr("x2", d.target.x0);

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", colorScales[d.source.name.split('-')[0]](colorScalesIndex[d.source.name.split('-')[0]][d.source.name.split('-')[1]]));

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", colorScales[d.target.name.split('-')[0]](colorScalesIndex[d.target.name.split('-')[0]][d.target.name.split('-')[1]]));
        });
    }
};

// Function to render nodes and node titles
const renderNodes = (nodes) => {
    
    const nodeGroup = svg.append('g').selectAll('.node')
        .data(nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${margin.left + d.x},${margin.top + d.y})`)
        .call(d3.drag()
            .subject(function (d) {
                return d
            }).on('start', dragStart).on('drag', dragMove));

    // Add rectangles for each node
    nodeGroup.append('rect')
        .attr('height', d => d.dy)
        .attr('width', sankey.nodeWidth())
        .style('fill', d => {
            const [name, value] = d.name.split('-');
            d.color = colorScales[name](colorScalesIndex[name][value]);
            return d.color;
        })
        .style('stroke', "black")
        .append('title')
        .text(d => d.name);

    // Add labels for each node
    nodeGroup.append('text')
        .attr('x', -6)
        .attr('y', d => d.dy / 2)
        .attr('dy', '.35em')
        .attr('font-size', 22)
        .attr('text-anchor', 'end')
        .text(d => d.label.split('-')[1])
        .filter(d => d.x < width / 2)
        .attr('x', 6 + sankey.nodeWidth())
        .attr('text-anchor', 'start');

    
    const legendGroup = svg.append('g').attr('class', 'legend-group')

    const attributeLabels = ['buying', 'maintenance', 'doors', 'persons', 'luggage boot', 'safety'];

    for (let i = 0; i < 6; i++) {
        legendGroup.append('text')
            .attr('x', i <= 0 ? nodes[i].x : nodes[i].x - 34)
            .attr('y', diagramHeight + 50)
            .attr('dy', '.35em')
            .attr('font-size', 22)
            .attr('font-weight', 'bold')
            .attr('fill', 'black') // Set the text color explicitly
            .text(attributeLabels[i]);
    }
};

// Drag event handlers
function dragStart() {
    this.parentNode.appendChild(this)
};


function dragMove(d) {
    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
    d3.select(this).attr(
        'transform',
        `translate(${margin.left + d.x},
        ${margin.top + Math.max(0, Math.min(height - d.dy, d3.event.y))})`
    );
    sankey.relayout();
    svg.selectAll('.link').attr('d', path);
};

function createColorSelection() {
    const selectionOptions = ['source-target', 'source', 'target']; // Define the options

    // Add a label for the dropdown
    const dropdownContainer = d3.select("#color-selection")
        .append('div')
        .attr('class', 'dropdown-container');

    dropdownContainer.append('label')
        .attr('for', 'color-mode-select')
        .text('Select Link Color Mode: ')
        .style('margin-right', '10px');

    // Append dropdown and set up options
    const dropdown = dropdownContainer.append('select')
        .attr('class', 'color-selection')
        .attr('id', 'color-mode-select');
    
    dropdown.selectAll('option')
        .data(selectionOptions)
        .enter()
        .append('option')
        .text(d => d)
        .attr('value', d => d);

    // Handle dropdown change event
    dropdown.on('change', function() {
        const value = d3.select(this).property('value');
        if (linkColorMode !== value) {
            linkColorMode = value;
            clearAllCharts();
            if (parsedData) { // Ensure parsedData is available before attempting to render
                render(transformData(parsedData));
            }
        }
    });
}


function clearAllCharts() {
    // Select the container and remove all SVG elements within it
    svg.selectAll("*").remove();
}

// 5. Load Data and Render the Diagram
d3.text('car.data').then((rawData) => {
    const csvData = 'buying,maintenance,doors,persons,luggage boot,safety\n' + rawData;
    parsedData = d3.csvParse(csvData);
    const transformedData = transformData(parsedData);
    createColorSelection()
    render(transformedData);
});
