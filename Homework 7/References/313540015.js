// 1. Setup margin, width and height
const margin = {
    top: 70,
    right: 60,
    bottom: 50,
    left: 80
}
const width = 1600 - margin["left"] - margin["right"]
const height = 800 - margin["top"] - margin["bottom"]
// 2. X, Y scales
const x = d3.scaleTime()
    .range([0, width])
const y = d3.scaleLinear()
    .range([height, 0])
// 3. Append SVG to container
const svg = d3.select('#chart-container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr("height", height + margin["top"] + margin["bottom"])
    .append('g')
    .attr('transform', `translate(${margin["left"]},${margin["top"]})`)
// 4. Load and process dataset and define functions
function parseCurrency(currencyString) {
    // Remove the dollar sign and parse the remaining string as a float
    return parseFloat(currencyString.replace('$', ''));
}

// Tooltip customize
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")

const tooltipRawDate = d3.select("body")
    .append('div')
    .attr("class", "tooltip")

// Create our gradient
const gradient = svg.append('defs')
    .append("linearGradient")
    .attr('id', 'gradient')
    .attr('x1', "0%")
    .attr('x2', "0%")
    .attr('y1', "0%")
    .attr('y2', "100%")
    .attr('spreadMethod', "pad")

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#85bb65")
    .attr("stop-opacity", 1)

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#85bb65")
    .attr("stop-opacity", 0)

d3.csv("NTDOY.csv").then(data => {
    const parseDate = d3.timeParse("%m/%d/%Y")
    data.forEach(d => {
        d["Close"] = parseCurrency(d["Close/Last"])
        d["Date"] = parseDate(d["Date"])
    })
    console.log(data);

    // 5. Set the domains for the X and Y scales
    x.domain(d3.extent(data, d => d["Date"]))
    y.domain([0, d3.max(data, d => d["Close"])])

    // 6. Add the x-axis
    const xAxis = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(${0}, ${height})`)
        .style("font-size", "14px")
        .call(d3.axisBottom(x)
            .tickValues(x.ticks(d3.timeYear.every(1)))
            .tickFormat(d3.timeFormat("%Y")))
    // 7. Add the y-axis
    const yAxis = svg.append("g")
        .attr("transform", `translate(${width}, ${0})`)
        .call(d3.axisRight(y)
            .ticks(10)
            .tickFormat(d => {
                if (isNaN(d)) {
                    return ""
                }
                return `$${d.toFixed(2)}`
            }))
    // 8. Line generator
    const line = d3.line()
        .x(d => x(d["Date"]))
        .y(d => y(d["Close"]))
    // 9. Area generator
    const area = d3.area()
        .x(d => x(d["Date"]))
        .y0(height)
        .y1(d => y(d["Close"]))
    // 10. Add the area path
    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .style("fill", "url(#gradient)")
        .style("opacity", .5)
    // 11. Add the line path
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "#85bb65")
        .attr("stroke-width", 1)
        .attr("d", line)

    // 12. Add a circle element which will move over every point on the chart
    const circle = svg.append("circle")
        .attr("r", 0)
        .attr("fill", "red")
        .style("stroke", "white")
        .attr("opacity", 0.7)
        .style("pointer-events", "none")

    // 13. Add the red lines extending from the circle to the data and the values
    const tooltipLineX = svg.append("line")
        .attr("class", "tooltip-line")
        .attr("id", "tooltip-line-x")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2")

    const tooltipLineY = svg.append("line")
        .attr("class", "tooltip-line")
        .attr("id", "tooltip-line-x")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2")

    // Create a listening rectangle
    const listeningRect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)

    // Create the mouse move function
    listeningRect.on("mousemove", function (event) {
        const [xCoord] = d3.pointer(event, this); // OK
        const x0 = x.invert(xCoord); // OK
        // Ensure the index `i` is within bounds
        const sortData = data.sort((a, b) => a.Date - b.Date);
        const bisectDate = d3.bisector(d => d["Date"]).left;
        const i = bisectDate(sortData, x0, 1);
        const d0 = i > 0 ? sortData[i - 1] : sortData[0];
        const d1 = i < sortData.length ? sortData[i] : sortData[sortData.length - 1];

        // Choose the closer of the two data points
        const d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
        const xPos = x(d.Date);
        const yPos = y(d.Close);
    
        circle.attr("cx", xPos).attr("cy", yPos)

        // Add transition for the circle radius
        circle.transition()
            .duration(50)
            .attr("r", 5)

        // Update the position of the red lines
        tooltipLineX.style("display", "block")
            .attr("x1", xPos)
            .attr("x2", xPos)
            .attr("y1", 0)
            .attr("y2", height)

        tooltipLineY.style("display", "block")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yPos)
            .attr("y2", yPos)

        // Add in our tooltip
        tooltip.style("display", "block")
            .style("left", `${width + 90}px`)
            .style("top", `${yPos + 68}px`)
            .html(`$${d["Close"] !== undefined ? d["Close"].toFixed(2) : "N/A"}`)

        tooltipRawDate.style("display", "block")
            .style("left", `${xPos + 60}px`)
            .style("top", `${height + 53}px`)
            .html(`${d.Date !== undefined ? d["Date"].toISOString().slice(0, 10) : "N/A"}`)
    })

    listeningRect.on("mouseout", function () {
        circle.transition()
            .duration(50)
            .attr("r", 0)
        tooltip.style("display", "none");
        tooltipRawDate.style("display", "none");
        tooltipLineX.attr("x1", 0).attr("x2", 0);
        tooltipLineY.attr("y1", 0).attr("y2", 0);
        tooltipLineX.style("display", "none");
        tooltipLineY.style("display", "none");
    })
    // Define the slider
    const sliderRange = d3.sliderBottom()
        .min(d3.min(data, d => d["Date"]))
        .max(d3.max(data, d => d["Date"]))
        .width(300)
        .tickFormat(d3.timeFormat('%Y-%m-%d'))
        .ticks(3)
        .default([d3.min(data, d => d["Date"]), d3.max(data, d => d["Date"])])
        .fill('#85bb65')
    
    sliderRange.on('onchange', val => {
        x.domain(val)
        const filteredData = data.filter(d => d["Date"] >= val[0] && d["Date"] <= val[1])

        svg.select('.line').attr("d", line(filteredData))
        svg.select('.area').attr("d", area(filteredData))
        y.domain([0, d3.max(filteredData, d => d["Close"])])

        // Update the x-axis with new domain
        svg.select(".x-axis")
            .transition()
            .duration(300)
            .call(d3.axisBottom(x)
                .tickValues(x.ticks(d3.timeYear.every(1)))
                .tickFormat(d3.timeFormat("%Y")))

        // Update the y-axis with new domain
        svg.select(".y-axis")
            .transition()
            .duration(300)
            .call(d3.axisRight(y)
                .ticks(10)
                .tickFormat(d => {
                    if (d <= 0) return ""
                    else {
                        return `$${d.toFixed(2)}`
                    }
                }))
    })

    // Add the slider into html element
    const gRange = d3.select("#slider-range")
        .append('svg')
        .attr('width', 500)
        .attr('height', 100)
        .append('g')
        .attr('transform', `translate(90,30)`)

    gRange.call(sliderRange)
})
