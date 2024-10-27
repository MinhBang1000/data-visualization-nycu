const fullTimeParse = d3.timeParse("%Y-%m-%d %H:%M") // From String to Date
const timeParse = d3.timeParse("%Y-%m-%d") // From String to Date
const dateFormat = d3.timeFormat("%Y-%m-%d") // To be String

function convertDate(str) {
    const date = fullTimeParse(str)
    date.setHours(0, 0, 0, 0)
    return date
}
function convertDistrictName(str) {
    const match = str.match(/\b\w+-gu\b/)
    if (match) {
        return match[0]
    }
    return "N/A"
}
function dataProcessing(data, year = 2017) {
    const districtSet = new Set();
    const pollutants = ["CO", "NO2", "O3", "PM2.5", "PM10", "SO2"];
    const processedData = {};

    // Initialize processedData for each pollutant
    pollutants.forEach(pollutant => {
        processedData[pollutant] = new Map();
    });

    data.forEach(d => {
        const date = fullTimeParse(d["Measurement date"]);

        if (!date || date.getFullYear() !== year) return; // Filter by year in one pass

        const district = convertDistrictName(d["Address"]);
        if (district === "N/A") return; // Skip invalid addresses

        districtSet.add(district);

        const dayDate = dateFormat(date); // Format date to day-only

        pollutants.forEach(pollutant => {
            const pollutantValue = parseFloat(d[pollutant]);

            if (!isNaN(pollutantValue)) {
                // Initialize district map if needed
                if (!processedData[pollutant].has(district)) {
                    processedData[pollutant].set(district, new Map());
                }

                const districtMap = processedData[pollutant].get(district);

                // Initialize date entry if not present, then accumulate for mean calculation
                if (!districtMap.has(dayDate)) {
                    districtMap.set(dayDate, { sum: 0, count: 0 });
                }

                const dateEntry = districtMap.get(dayDate);
                dateEntry.sum += pollutantValue;
                dateEntry.count += 1;
            }
        });
    });

    // Finalize mean calculations
    pollutants.forEach(pollutant => {
        processedData[pollutant].forEach((datesMap, district) => {
            datesMap.forEach((entry, date) => {
                datesMap.set(date, entry.sum / entry.count); // Replace with average value
            });
        });
    });

    return [Array.from(districtSet), pollutants, processedData];
}

function getChartData(data, district, pollutant) {
    return Array.from(new Map(data[pollutant].get(district)))
}
// Preprocessing
d3.csv("air-pollution.csv").then(data => {
    const [districts, pollutants, processedData] = dataProcessing(data, year)
    currentData = [districts, pollutants, processedData]
    // Add the selection of years
    createYearSelection([2017, 2018, 2019], data)
    createBandSelection(3, 10, 1)
    createGridToggle();
    createPollutantLegend()
    if (currentData) {
        render(currentData[0], currentData[1], currentData[2])
    }
})

const margin = {
    top: 70,
    right: 80,
    bottom: 50,
    left: 80
}

const colorSchema = {
    "CO": d3.interpolateBlues,
    "NO2": d3.interpolateGreens,
    "O3": d3.interpolateOranges,
    "PM2.5": d3.interpolatePurples,
    "PM10": d3.interpolateReds,
    "SO2": d3.interpolateGreys
}

// Current status
let numBands = 3
let year = 2017
let currentData = null
let grid = false


const width = 1600 - margin["left"] - margin["right"]
const height = 800 - margin["top"] - margin["bottom"]

function createHorizonChart(
    svg,
    data,
    width,
    height,
    colorSchema
) {

    const x = d3.scaleTime()
        .range([0, width])
    const y = d3.scaleLinear()
        .range([height, 0])

    // Define bandwidth
    const max = d3.quantile(data.map(d => d[1]).sort(d3.ascending), 0.98)
    const bandwidth = max / numBands

    const colorScale = d3.scaleSequential()
        .domain([0, numBands])  // `numBands` should be 3 in your case
        .interpolator(colorSchema);  // Choose your color scheme

    x.domain(d3.extent(data, (d) => timeParse(d[0])))
    y.domain([0, bandwidth])

    // Add the x-axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(${0}, ${height})`)
        .style("font-size", "14px")
        .call(d3.axisBottom(x)
            .tickValues(x.ticks(d3.timeMonth.every(grid ? 5 : 1)))
            .tickFormat(d3.timeFormat("%b")))

    // Add the y-axis
    svg.append("g")
        .attr("transform", `translate(${width}, ${0})`)
        .call(d3.axisRight(y)
            .ticks(3)
            .tickFormat(d => {
                if (isNaN(d)) {
                    return ""
                }
                return `${d.toFixed(5)}`
            }))

    for (let k = 0; k <= numBands; k++) {
        svg.append('path')
            .attr('class', 'path')
            .datum(data)
            .attr('d', d3.area()
                .x(d => x(timeParse(d[0])))
                .y0(y(0))
                .y1(d => y(Math.min(Math.max(d[1] - bandwidth * k, 0), bandwidth)))
            )
            .attr('fill', colorScale(k))
            .attr('transform', `translate(${0}, ${0})`)
    }
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
    const tooltipLineX = svg.append('line')
        .attr('class', 'tooltip-line')
        .attr('id', 'tooltip-line-x')
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '2.2')
    // add listerning rectangle
    const listeningRect = svg.append('rect')
        .attr('height', height)
        .attr('width', width)

    listeningRect.on('mousemove', function (event) {
        const [xCoord] = d3.pointer(event, this)
        const x0 = x.invert(xCoord)
        x0.setHours(0, 0, 0, 0)
        const bisectDate = d3.bisector(d => timeParse(d[0])).left
        const i = bisectDate(data, x0, 1)
        const d0 = i > 0 ? data[i - 1] : data[0]
        const d1 = i < data.length ? data[i] : data[data.length - 1]

        const d = x0 - timeParse(d0[0]) > timeParse(d1[0]) - x0 ? d1 : d0
        const xPos = x(timeParse(d[0]))
        const yPos = 0

        // Update the position of the red lines
        tooltipLineX.style("display", "block")
            .attr("x1", xPos)
            .attr("x2", xPos)
            .attr("y1", 0)
            .attr("y2", height)

        // Construct the HTML for tooltip
        const date = d3.timeFormat("%Y-%m-%d")(timeParse(d[0]));
        const value = d[1].toFixed(2);

        let bandInfo = "";
        for (let k = 0; k < numBands; k++) {
            const lowerBound = (k * bandwidth).toFixed(5);
            const upperBound = ((k + 1) * bandwidth).toFixed(5);
            bandInfo += `<div>Band ${k + 1}: ${lowerBound} - ${upperBound}</div>`;
        }

        tooltip.style("display", "block")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`)
            .html(`
                <div><strong>Date:</strong> ${date}</div>
                <div><strong>Value:</strong> ${value}</div>
                <div><strong>Number of Bands:</strong> ${numBands}</div>
                <div><strong>Band Ranges:</strong></div>
                ${bandInfo}
            `);
    })

    listeningRect.on("mouseout", function () {
        tooltip.style("display", "none");
        tooltipLineX.attr("x1", 0).attr("x2", 0);
        tooltipLineX.style("display", "none");
    })
}

function createPollutantLegend() {
    // Select the 'pollutant-legend' div
    const legendDiv = d3.select('#pollutant-legend')

    // Clear any existing content
    legendDiv.selectAll('*').remove();

    // Define labels and corresponding colors based on colorSchema
    Object.keys(colorSchema).forEach(pollutant => {
        const legendItem = legendDiv.append('div')
            .attr('class', 'legend-item')
            .style('display', 'flex')
            .style('align-items', 'center')

        // Add color box
        legendItem.append('div')
            .style('width', '20px')
            .style('height', '20px')
            .style('background', colorSchema[pollutant](0.7)) // Apply an intermediate shade of the color
            .style('margin-right', '5px');

        // Add pollutant label
        legendItem.append('span')
            .text(pollutant)
            .style('color', '#333'); // Optional: change text color if needed
    });
}

function clearAllCharts() {
    // Select the container and remove all SVG elements within it
    d3.select('#horizon-chart-container').selectAll('svg').remove();
}

function createBandSelection(min, max, step) {
    const select = d3.select("#band-selection")
    select.append('label')
        .attr('for', 'band-selection')
        .text('Number of Bands')
    const input = select.append('input')
        .attr('type', 'number')
        .attr('min', min)
        .attr('max', max)
        .attr('step', step)
        .attr('value', min)
        .attr('class', 'band-selection')

    input.on('change', function () {
        const selectedValue = Number(d3.select(this).property('value'))
        // Update the number of bands
        numBands = selectedValue
        clearAllCharts()
        if (currentData) {
            render(currentData[0], currentData[1], currentData[2])
        }
    })
}

function createGridToggle() {
    const toggleDiv = d3.select("#toggle-range");

    // Add label for the toggle switch
    toggleDiv.append("label")
        .attr("for", "grid-toggle")
        .style("margin-right", "10px")
        .text("Toggle Grid View");

    // Add the checkbox input for toggling grid
    toggleDiv.append("input")
        .attr("type", "checkbox")
        .attr("id", "grid-toggle")
        .style("transform", "scale(1.2)")
        .property("checked", grid) // Initial state based on current grid variable
        .on("change", function () {
            // Update grid variable based on checkbox state
            grid = this.checked;

            // Clear all charts and re-render based on the new grid setting
            clearAllCharts();
            if (currentData) {
                render(currentData[0], currentData[1], currentData[2]);
            }
        });
}

function createYearSelection(years, data) {
    const group = d3.select("#year-selection")
    group.append('label')
        .attr('for', 'year-selection')
        .text('Year')
    const select = group.append('select')
        .attr('class', 'year-selection')

    select.selectAll('option')
        .data(years)
        .enter()
        .append('option')
        .attr('value', d => d)
        .text(d => d)

    select.on('change', function () {
        const selectedValue = Number(d3.select(this).property('value'))
        // Save the selected year
        year = selectedValue
        // Re-render
        const [districts, pollutants, processedData] = dataProcessing(data, year)
        clearAllCharts()
        render(districts, pollutants, processedData)
    })
}

function render(
    districts,
    pollutants,
    processedData
) {
    if (grid) {
        renderGrid(districts, pollutants , processedData)
    }else {
        renderStack(districts, pollutants, processedData)
    }
}

function renderGrid(
    districts,
    pollutants,
    processedData
) {
    const gap = 60;
    const chartWidth = (width - margin.left - margin.right - (pollutants.length - 1) * gap) / pollutants.length;
    const chartHeight = 100;
    const totalHeight = (chartHeight + gap) * districts.length + margin.top + margin.bottom;
    const totalWidth = (chartWidth + gap) * pollutants.length + margin.left + margin.right;

    // Adjust SVG to accommodate the grid layout
    const svg = d3.select('#horizon-chart-container')
        .style('display', 'flex')
        .style('justify-content', 'center')
        .append('svg')
        .attr('width', totalWidth)
        .attr('height', totalHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    districts.forEach((dis, rowIndex) => {
        pollutants.forEach((p, colIndex) => {
            const data = getChartData(processedData, dis, p);
            const xPos = colIndex * (chartWidth + gap);
            const yPos = rowIndex * (chartHeight + gap);

            const chartGroup = svg.append('g')
                .attr('transform', `translate(${xPos}, ${yPos})`);

            // Append title text for each chart at the top left corner of each chart
            chartGroup.append('text')
                .attr('x', 0)
                .attr('y', -10)
                .attr('class', 'chart-title')
                .text(`${dis} - ${p}`)
                .style('font-size', '12px')
                .style('font-weight', 'bold');

            // Create the horizon chart for each district-pollutant combination
            createHorizonChart(
                chartGroup,
                data,
                chartWidth,
                chartHeight,
                colorSchema[p]
            );
        });
    });
}


// function renderStack(
//     districts,
//     pollutants,
//     processedData
// ) {
//     const gap = 60
//     const chartHeight = 100
//     const totalHeight = (chartHeight + gap) * 150 + margin.top + margin.bottom;

//     const svg = d3.select('#horizon-chart-container')
//         .style('display', 'flex')
//         .style('justify-content', 'center')
//         .append('svg')
//         .attr('width', width + margin.left + margin.right)
//         .attr('height', totalHeight)
//         .append('g')
//         .attr('transform', `translate(${margin["left"]}, ${margin["top"]})`)

//     let index = 0

//     districts.forEach(dis => {
//         pollutants.forEach(p => {
//             const data = getChartData(processedData, dis, p)
//             const yPos = index * (chartHeight + gap)
//             const chartGroup = svg.append('g')
//                 .attr('transform', `translate(${0}, ${yPos})`)
//             // Append title text for each chart
//             chartGroup.append('text')
//                 .attr('x', 0) // Position at the start of each chart
//                 .attr('y', -10) // Position above the chart
//                 .attr('class', 'chart-title')
//                 .text(`${dis} - ${p}`) // Title text showing district and pollutant
//                 .style('font-size', '20px')
//                 .style('font-weight', 'bold');
//             createHorizonChart(
//                 chartGroup,
//                 data,
//                 width,
//                 chartHeight,
//                 colorSchema[p]
//             )
//             index++
//         })
//     })
// }

function renderStack(
    districts,
    pollutants,
    processedData
) {
    const gap = 60;
    const chartHeight = 100;

    // Dynamically calculate the width based on screen size
    const screenWidth = window.innerWidth;
    const availableWidth = screenWidth - margin.left - margin.right - 20; // Adding some padding

    const totalHeight = (chartHeight + gap) * 150 + margin.top + margin.bottom;

    const svg = d3.select('#horizon-chart-container')
        .style('display', 'flex')
        .style('justify-content', 'center')
        .append('svg')
        .attr('width', screenWidth) // Set to screen width
        .attr('height', totalHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    let index = 0;

    districts.forEach(dis => {
        pollutants.forEach(p => {
            const data = getChartData(processedData, dis, p);
            const yPos = index * (chartHeight + gap);
            const chartGroup = svg.append('g')
                .attr('transform', `translate(${0}, ${yPos})`);

            // Append title text for each chart
            chartGroup.append('text')
                .attr('x', 0) // Position at the start of each chart
                .attr('y', -10) // Position above the chart
                .attr('class', 'chart-title')
                .text(`${dis} - ${p}`) // Title text showing district and pollutant
                .style('font-size', '14px')
                .style('font-weight', 'bold');

            // Use the calculated available width for the chart
            createHorizonChart(
                chartGroup,
                data,
                availableWidth,
                chartHeight,
                colorSchema[p]
            );

            index++;
        });
    });
}
