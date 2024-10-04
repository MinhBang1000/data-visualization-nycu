// Tools
const findMax = (values) => {
    let max = values[0]
    values.forEach(m => {
        if (max < m) {
            max = m
        }
    })
    return max
}

const findMin = (values) => {
    let min = values[0]
    values.forEach(m => {
        if (min > m) {
            min = m
        }
    })
    return min
}

// D3
const {
    select,
    selectAll,
    csv,
    scaleLinear,
    scaleOrdinal,
    histogram,
    schemeCategory10,
    extent,
    max,
    axisLeft,
    axisBottom,
    cross,
    range,
} = d3;

// Constraints
const svg = select('svg')
const width = +svg.attr('width')
const height = +svg.attr('height')

// Layout
const margin = 50
const padding = 35
const gap = 10

csv('data.csv').then(data => {
    const processedData = data.map(d => {
        return {
            "Sepal Length": +d["sepal length"],
            "Sepal Width": +d["sepal width"],
            "Petal Length": +d["petal length"],
            "Petal Width": +d["petal width"],
            "Class": d["class"]
        };
    });

    // Ensure the data is valid
    const validData = processedData.filter(d =>
        !isNaN(d["Sepal Length"]) &&
        !isNaN(d["Sepal Width"]) &&
        !isNaN(d["Petal Length"]) &&
        !isNaN(d["Petal Width"])
    );

    render(validData)
})

const render = (data) => {
    // Extract essential data
    const dimensions = Object.keys(data[0]).filter(d => d !== "Class")
    const keys = ["Iris-setosa", "Iris-virginica", "Iris-versicolor"]
    // Color scale
    const colorScale = scaleOrdinal()
        .domain(data.map(d => d["Class"]))
        .range(schemeCategory10)

    // Edge size
    const innerWidth = width - 2 * margin // Left and right margin
    const innerHeight = height - 2 * margin // Top and bottom
    const plotSize = (innerWidth
        - (dimensions.length - 1) * padding
        - 5 * margin)
        / dimensions.length // Spaces between each plot

    // Create scales
    const xScales = dimensions.map(dim => {
        return scaleLinear()
            .domain(extent(data, d => d[dim]))
            .rangeRound([0, plotSize])  // Edit to try
    })

    const yScales = xScales.map(x => {
        return x.copy().range([plotSize, 0])
    })

    // Create axis(s)
    const ticks = 4
    const tickPadding = 8
    const createXAxis = (xScale, plotSize) => (g) => {
        g.call(axisBottom(xScale).ticks(ticks).tickSize(plotSize).tickPadding(tickPadding)) // Make the grid
        g.call(g => g.selectAll('.domain').remove())
        g.call(g => g.selectAll('.tick line').attr('stroke', '#D3D3D3'))
    }

    const createYAxis = (yScale, plotSize) => (g) => {
        g.call(axisLeft(yScale).ticks(ticks).tickSize(plotSize).tickPadding(tickPadding))
        g.call(g => g.selectAll('.domain').remove())
        g.call(g => g.selectAll('.tick line').attr('stroke', '#D3D3D3'))
    }

    // Assign locations for all plots
    const matrix = cross(range(dimensions.length), range(dimensions.length))
    const main = svg.append('g')
        .attr('transform', `translate(${margin + 2 * padding}, ${margin + padding})`)
    const cells = main
        .append('g')
        .selectAll('g')
        .data(matrix)
        .join('g')
        .attr('transform', ([i, j]) => `translate(${(plotSize + padding) * i}, ${(plotSize + padding) * j})`)

    // Add axis(s) to every plots
    cells.each(function ([i, j]) {
        select(this)
            .append('g')
            .call(createXAxis(xScales[i], plotSize));
        if (i !== j) {
            select(this)
                .append('g')
                .call(createYAxis(yScales[j], plotSize))
                .attr('transform', `translate(${plotSize}, 0)`)
        }
    });

    // Plot boxes
    cells.append('rect')
        .attr('fill', 'none')
        .attr('stroke', '#A9A9A9')
        .attr('width', plotSize)
        .attr('height', plotSize)

    // Plot data
    const startOpacity = 0
    const opacity = 0.8
    const radius = 3
    cells.each(function ([i, j]) {
        if (i !== j) {
            const circles = select(this)
                .selectAll('circle')
                .data(data)
                .join('circle')
                .attr("class", d => "data " + d["Class"])
                .attr('fill', d => colorScale(d["Class"]))
                .attr('opacity', startOpacity)
                .attr('r', radius)
                .attr('cx', d => xScales[i](d[dimensions[i]]))
                .attr('cy', d => yScales[j](d[dimensions[j]]))

            // Add effect
            circles.transition()
                .duration(1500)
                .attr('opacity', opacity)
        }
    })

    // Histogram
    const createHistogram = (data, key, subHeight, xScale) => (g) => {
        const setosa = data.filter(d => d["Class"] === "Iris-setosa")
        const virginica = data.filter(d => d["Class"] === "Iris-virginica")
        const versicolor = data.filter(d => d["Class"] === "Iris-versicolor")

        // Modify domain
        const numberOfTicks = 16
        const histogramGenerator = histogram()
            .value(function (d) {
                return d[key]
            })
            .domain(xScale.domain())
            .thresholds(xScale.ticks(numberOfTicks))

        // Fill line on chart
        const bins1 = histogramGenerator(setosa)
        const bins2 = histogramGenerator(virginica)
        const bins3 = histogramGenerator(versicolor)

        // Find bins max
        const maxOfBins = findMax([
            ...bins1.map(d => d.length),
            ...bins2.map(d => d.length),
            ...bins3.map(d => d.length)
        ])

        // Create the y-scale
        const yScale = scaleLinear()
            .domain([0, maxOfBins])
            .range([subHeight, 0])
            .nice()

        // Create a y-axis
        const yAxis = g.append('g')
            .call(axisLeft(yScale).ticks(ticks).tickPadding(tickPadding))
            .attr('transform', `translate(0, -1)`)
        yAxis.selectAll('.domain').remove()
        yAxis.selectAll('.tick line')
            .attr('stroke', '#D3D3D3')
            .attr('x2', plotSize)

        const rectOpacity = 0.8
        const rectOpacityEx = 0
        const rects1 = g.selectAll('.rect-setsosa')
            .data(bins1)
            .enter()
            .append('rect')
            .attr('class', "data Iris-setosa")
            .attr("x", d => xScale(d.x0))
            .attr("transform", function (d) { return "translate(0," + yScale(d.length) + ")"; })
            .attr("width", d => xScale(d.x1) - xScale(d.x0))
            .attr("height", function (d) { return subHeight - yScale(d.length); })
            .style("fill", colorScale("Iris-setosa"))
            .attr('opacity', rectOpacityEx)

        const rects2 = g.selectAll('rect-virginica')
            .data(bins2)
            .enter()
            .append('rect')
            .attr("x", 0)
            .attr('class', "data Iris-virginica")
            .attr("transform", function (d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
            .attr("width", d => xScale(d.x1) - xScale(d.x0))
            .attr("height", function (d) { return subHeight - yScale(d.length); })
            .style("fill", colorScale("Iris-virginica"))
            .attr('opacity', rectOpacityEx)

        const rects3 = g.selectAll('rect-versicolor')
            .data(bins3)
            .enter()
            .append('rect')
            .attr("x", 0)
            .attr('class', "data Iris-versicolor")
            .attr("transform", function (d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
            .attr("width", d => xScale(d.x1) - xScale(d.x0))
            .attr("height", function (d) { return subHeight - yScale(d.length); })
            .style("fill", colorScale("Iris-versicolor"))
            .attr('opacity', rectOpacityEx)

        // Add transitions
        const duration = 1500
        rects1.transition() // Start the transition
            .duration(duration) // Set the duration for the transition (in milliseconds)
            .attr("opacity", rectOpacity) // Animate opacity if needed
        rects2.transition() // Start the transition
            .duration(duration) // Set the duration for the transition (in milliseconds)
            .attr("opacity", rectOpacity) // Animate opacity if needed
        rects3.transition() // Start the transition
            .duration(duration) // Set the duration for the transition (in milliseconds)
            .attr("opacity", rectOpacity) // Animate opacity if needed
    }

    // Add histograms
    cells.each(function ([i, j]) {
        if (i == j) {
            select(this)
                .call(createHistogram(data, dimensions[i], plotSize, xScales[i]))
        }
    })

    // Add the legend
    const createLegend = (keys, edge, gap) => (g) => {
        const mainGroup = main
        g.append('text')
            .attr('class', 'legend-title')
            .text('Species')
            .attr('x', 0)
            .attr('y', 0)
        keys.forEach((c, i) => {
            const legendRowG = g.append('g')
                .attr('class', 'legend-group')
                .attr('transform', `translate(${edge}, ${gap * (i + 1)})`)
            legendRowG.on('mouseenter', function (e) {
                select(this).classed('legend-group-active', true)
                mainGroup.selectAll(`.${c}`)
                    .classed(`${c}-active`, true)
                keys.forEach((k) => {
                    if (k !== c) {
                        mainGroup.selectAll(`.${k}`)
                            .classed(`disable`, true)
                    }
                })
            })
            legendRowG.on('mouseleave', function (e) {
                select(this).classed('legend-group-active', false)
                mainGroup.selectAll(`.${c}`)
                    .classed(`${c}-active`, false)
                keys.forEach((k) => {
                    if (k !== c) {
                        mainGroup.selectAll(`.${k}`)
                            .classed(`disable`, false)
                    }
                })
            })
            legendRowG.append('circle')
                .attr('r', edge)
                .attr('fill', colorScale(c))
            legendRowG.append('text')
                .attr('x', 15)
                .attr('y', 5)
                .text(keys[i])
        })
    }

    const legend = main.append('g')
        .attr('class', 'legend')
    legend.call(createLegend(keys, 8, 25))
        .attr('transform', `translate(${(plotSize + padding) * 4}, ${padding})`)

    function convertClassNameToLabel(className) {
        // Define a mapping of class names to their labels
        const labels = {
            'Sepal Length': 'Sepal Length (cm)',
            'Sepal Width': 'Sepal Width (cm)',
            'Petal Length': 'Petal Length (cm)',
            'Petal Width': 'Petal Width (cm)',
            // Add other class names if needed
        };

        // Return the corresponding label or the original class name if not found
        return labels[className] || className;
    }
    
    // Add the dimensions for x and y
    const yAxisG = main.append('g')
        .attr('transform', `translate(${-padding}, ${(plotSize + padding) * 4 - 35})`)
    dimensions.forEach((dim, i) => {
        main.append('text')
            .text(convertClassNameToLabel(dim))
            .attr('fill', 'black')
            .attr('class', 'axis-label axis-label-x')
            .attr('x', (plotSize + padding) * i)
            .attr('y', (plotSize + padding) * 4)
            .attr('font-size', 12)
            .attr('font-weight', 'bold')

        yAxisG.append('text')
            .text(convertClassNameToLabel(dimensions[dimensions.length - i - 1]))
            .attr('fill', 'black')
            .attr('class', 'axis-label axis-label-y')
            .attr('x', (plotSize + padding) * i)
            .attr('y', 0)
            .attr('font-size', 12)
            .attr('font-weight', 'bold')
    })

    // Add the title
    main.append('text')
        .attr('class', 'title')
        .attr('font-size', '18')
        .attr('font-weight', 'bold')
        .text('Exploring Relationships in the Iris Dataset: A Brushable Scatter Plot Matrix')
        .attr('x', -padding - 10)
        .attr('y', -padding)

}