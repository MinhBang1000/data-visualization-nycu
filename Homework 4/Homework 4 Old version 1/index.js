// Import package
const {
    scaleLinear,
    scaleBand,
    select,
    selectAll,
    csv,
    axisBottom,
    axisLeft,
    extent,
    histogram,
    cross,
    range
} = d3


// Gloabal constraint
const colors = {
    "Iris-virginica": "#C24D51",
    "Iris-setosa": "#4C72B0",
    "Iris-versicolor": "#4F9C61"
}
const margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50
}
const gap = 10
const svg = select('svg')
const width = +svg.attr('width')
const height = +svg.attr('height')
const innerWidth = width - 100 - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom

// Data preparing
let results = {}
const IRIS_DATA = {
    "Iris-virginica": [],
    "Iris-setosa": [],
    "Iris-versicolor": []
}

const mainGroup = svg.append('g')
    .attr('class', 'main-group')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('transform', `translate(${margin.left}, ${margin.right})`)

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

// To draw histogram
const divideRangeIntoParts = (min, max, parts = 10) => {
    const step = (max - min) / parts;  // Calculate the step size for each part
    const boundaries = [];

    // Create boundaries by adding step to min
    for (let i = 0; i <= parts; i++) {
        boundaries.push(min + i * step);
    }

    return boundaries;
}

// Create container to save 10 parts of each species
const createContainer = (parts = 10) => {
    const data = []
    for (let i = 0; i < parts; i++) {
        data.push(0)
    }
    return data
}

// To draw histogram
const findPart = (value, boundaries) => {
    for (let i = 0; i < boundaries.length - 1; i++) {
        if (value >= boundaries[i] && value <= boundaries[i + 1]) {
            return i;  // Return the part number (1-indexed)
        }
    }
    return null;  // If value is out of range
}

const createLogValueRange = (data) => {
    const keys = Object.keys(data[0])
    const setosa = IRIS_DATA["Iris-setosa"]
    const versicolor = IRIS_DATA["Iris-versicolor"]
    const virginica = IRIS_DATA["Iris-virginica"]
    const results = {}
    keys.filter(k => k !== "Class").forEach(k => {
        const setosaValues = setosa.map(s => s[k])
        const versicolorValues = versicolor.map(v => v[k])
        const virginicaValues = virginica.map(v => v[k])
        // Divide to 10 parts
        const max = extent(data.map(d => d[k]))[1]
        const min = extent(data.map(d => d[k]))[0]
        const boundaries = divideRangeIntoParts(min, max, 20)
        const setosaHisData = createContainer(20)
        const versicolorHisData = createContainer(20)
        const virginicaHisData = createContainer(20)
        // Part increasing
        setosaValues.forEach(v => {
            const indexOfPart = findPart(v, boundaries)
            setosaHisData[indexOfPart]++
        })
        versicolorValues.forEach(v => {
            const indexOfPart = findPart(v, boundaries)
            versicolorHisData[indexOfPart]++
        })
        virginicaValues.forEach(v => {
            const indexOfPart = findPart(v, boundaries)
            virginicaHisData[indexOfPart]++
        })
        results[k] = {
            key: k,
            domain: [
                findMin([...setosaHisData, ...versicolorHisData, ...virginicaHisData]),
                findMax([...setosaHisData, ...versicolorHisData, ...virginicaHisData])
            ],
            data: {
                "Iris-setosa": setosaHisData,
                "Iris-virginica": virginicaHisData,
                "Iris-versicolor": versicolorHisData,
            }
        }
    })
    return results
}

const generalLog = () => {
    console.log({
        width: width,
        height: height,
        innerWidth: innerWidth,
        innerHeight: innerHeight,
        margin: margin,
        xAxis: xSAxisConfig.range(),
        yAxis: ySAxisConfig.range(),
        bandX: xSAxisConfig.bandwidth(),
        bandY: ySAxisConfig.bandwidth()
    });
}

const getOrderedObjects = (arr) => {
    if (arr.length !== 3) {
        throw new Error("Input array must contain exactly three objects.");
    }

    let first, second, third;

    // Using if-else statements to sort the objects by their values
    if (arr[0].value <= arr[1].value && arr[0].value <= arr[2].value) {
        first = arr[0];
        if (arr[1].value <= arr[2].value) {
            second = arr[1];
            third = arr[2];
        } else {
            second = arr[2];
            third = arr[1];
        }
    } else if (arr[1].value <= arr[0].value && arr[1].value <= arr[2].value) {
        first = arr[1];
        if (arr[0].value <= arr[2].value) {
            second = arr[0];
            third = arr[2];
        } else {
            second = arr[2];
            third = arr[0];
        }
    } else {
        first = arr[2];
        if (arr[0].value <= arr[1].value) {
            second = arr[0];
            third = arr[1];
        } else {
            second = arr[1];
            third = arr[0];
        }
    }

    return [first, second, third];
}

const createSignificantAxisScaleConfig = (domain, range, padding = 0.3) => {
    const scaleConfig = scaleBand()
        .domain(domain)
        .range(range)
        .padding(padding)
    return scaleConfig
}

const createLegend = () => {
    const g = mainGroup.append('g')
        .attr('class', 'legend')
    const title = g.append('text')
        .attr('class', 'legend-title')
        .text('Species')
        .attr('x', 0)
        .attr('y', 0)
    const gap = 25
    const edge = 8
    const keys = Object.keys(colors)
    keys.forEach((c, i) => {
        const legendRowG = g.append('g')
            .attr('class', 'legend-group')
            .attr('transform', `translate(${edge}, ${gap * (i + 1)})`)
        legendRowG.on('mouseenter', function (e) {
            select(this).classed('legend-group-active', true)
            mainGroup.selectAll(`.${c}`)
                .classed(`${c}-active`, true)
        })
        legendRowG.on('mouseleave', function (e) {
            select(this).classed('legend-group-active', false)
            mainGroup.selectAll(`.${c}`)
                .classed(`${c}-active`, false)
        })
        const circle = legendRowG.append('circle')
            .attr('r', edge)
            .attr('fill', colors[c])
        const text = legendRowG.append('text')
            .attr('x', 15)
            .attr('y', 5)
            .text(keys[i])
    })
    return g
}

const createScatterPlotOrHistogram = (data, key1, key2, subWidth, subHeight, radius = 5, coordinates = { x0: 0, y0: 0 }) => {
    // Design chart
    const data1 = data.map(d => d[key1])
    const data2 = data.map(d => d[key2])
    const domain1 = extent(data1)
    const domain2 = extent(data2)

    // Add the axis into right charts
    if (key1 !== key2) {
        // Draw all axis for a chart
        const xScaleConfig = scaleLinear()
            .domain(domain1)
            .range([0, subWidth])
            .nice()
        const yScaleConfig = scaleLinear()
            .domain(domain2)
            .range([subHeight, 0])
            .nice()

        // Choose ticks
        const numberOfTicksX = {
            "Sepal Length": 4,
            "Sepal Width": 3,
            "Petal Length": 3,
            "Petal Width": 3
        }
        const numberOfTicksY = {
            "Sepal Length": 4,
            "Sepal Width": 6,
            "Petal Length": 3,
            "Petal Width": 3
        }

        // Create axis 
        const xAxisConfig = axisBottom(xScaleConfig)
            .ticks(numberOfTicksX[key1])
        const yAxisConfig = axisLeft(yScaleConfig)
            .ticks(numberOfTicksY[key2])

        // Add to group
        // mainGroup.append('g')
        //     .call(yAxisConfig)
        //     .attr('transform', `translate(${coordinates["x0"]}, ${coordinates["y0"]})`)
        // mainGroup.append('g')
        //     .call(xAxisConfig)
        //     .attr('transform', `translate(${coordinates["x0"]}, ${coordinates["y0"] + subHeight})`)

        // Scatter Plot
        // const circles = mainGroup.selectAll(`.circle-${key1}-${key2}`)
        //     .data(data)

        // circles.enter()
        //     .append('circle')
        //     .attr('class', d => {
        //         return `${d["Class"]} data data-circle`
        //     })
        //     .attr('cx', d => coordinates["x0"] + xScaleConfig(d[key1]))
        //     .attr('cy', d => coordinates["y0"] + yScaleConfig(d[key2]))
        //     .attr('r', radius)
        //     .attr('stroke', '#f2f2f2')
        //     .attr('stroke-width', 0.25)
        //     .attr('opacity', 0.75)
        //     .attr('fill', d => colors[d["Class"]])

        // // Remove old circles if any
        // circles.exit().remove();
        const circles = mainGroup.selectAll(`.circle-${key1}-${key2}`)
            .data(data);

        // Enter selection
        const circlesEnter = circles.enter()
            .append('circle')
            .attr('class', d => `${d["Class"]} data data-circle`)
            .attr('r', radius)
            .attr('stroke', '#f2f2f2')
            .attr('stroke-width', 0.25)
            .attr('opacity', 0.75)
            .attr('fill', d => colors[d["Class"]]);

        // Update selection
        circles.merge(circlesEnter)
            .attr('cx', d => coordinates["x0"] + xScaleConfig(d[key1]))
            .attr('cy', d => coordinates["y0"] + yScaleConfig(d[key2]));

        // Exit selection
        circles.exit().remove();

    }
}

const createHistogram = (data, key, subWidth, subHeight) => {
    const g = mainGroup.append('g')
    const setosa = IRIS_DATA["Iris-setosa"]
    const virginica = IRIS_DATA["Iris-virginica"]
    const versicolor = IRIS_DATA["Iris-versicolor"]
    const maxNums = findMax(data.map(d => d[key]))
    const minNums = findMin(data.map(d => d[key]))

    // Create the x-scale
    const xScale = scaleLinear()
        .domain([minNums, maxNums])
        .range([0, subWidth])
        .nice()

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

    // Create axises
    g.append('g')
        .call(axisLeft(yScale).ticks(5))
        .attr('transform', `translate(0, 0)`)
    g.append('g')
        .call(axisBottom(xScale).ticks(5))
        .attr('transform', `translate(0, ${subHeight})`)

    const rects1 = g.selectAll('.rect-setsosa')
        .data(bins1)
        .enter()
        .append('rect')
        .attr("x", d => xScale(d.x0))
        .attr("transform", function (d) { return "translate(0," + yScale(d.length) + ")"; })
        .attr("width", d => xScale(d.x1) - xScale(d.x0))
        .attr("height", function (d) { return subHeight - yScale(d.length); })
        .style("fill", colors["Iris-setosa"])
        .style("opacity", 0.8)

    const rects2 = g.selectAll('rect-virginica')
        .data(bins2)
        .enter()
        .append('rect')
        .attr("x", 0)
        .attr("transform", function (d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
        .attr("width", d => xScale(d.x1) - xScale(d.x0))
        .attr("height", function (d) { return subHeight - yScale(d.length); })
        .style("fill", colors["Iris-virginica"])
        .style("opacity", 0.8)

    const rects3 = g.selectAll('rect-versicolor')
        .data(bins3)
        .enter()
        .append('rect')
        .attr("x", 0)
        .attr("transform", function (d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
        .attr("width", d => xScale(d.x1) - xScale(d.x0))
        .attr("height", function (d) { return subHeight - yScale(d.length); })
        .style("fill", colors["Iris-versicolor"])
        .style("opacity", 0.8)
    return g
}


// Core function to render the entire project
const render = (data) => {
    // Extract data 
    const keys = Object.keys(data[0])
    const attributes = keys.filter(k => k !== 'Class')

    // Draw two significant axis(s)
    const xSAxisConfig = createSignificantAxisScaleConfig(attributes, [0, innerWidth])
    const xSAxis = axisBottom(xSAxisConfig)
    const xSAxisG = mainGroup.append('g')
        .attr('class', 's-axis-bottom')
        .attr('transform', `translate(${0}, ${innerHeight})`)
        .call(xSAxis)

    const ySAxisConfig = createSignificantAxisScaleConfig(attributes, [0, innerHeight])
    const ySAxis = axisLeft(ySAxisConfig)
    const ySAxisG = mainGroup.append('g')
        .attr('class', 's-axis-left')
        .attr('transform', `translate(${0}, ${0})`)
        .call(ySAxis)

    // Extract data from big scales
    const subWidth = xSAxisConfig.bandwidth()
    const subHeight = ySAxisConfig.bandwidth()

    // Remove domains and ticks
    xSAxisG.selectAll('.domain').remove()
    xSAxisG.selectAll('.tick line').remove()
    ySAxisG.selectAll('.domain').remove()
    ySAxisG.selectAll('.tick line').remove()

    // Check values ranges
    // Draw all scatterplots

    const uniquePairs = [
        ["Sepal Length", "Sepal Width"],
        ["Sepal Length", "Petal Length"],
        ["Sepal Length", "Petal Width"],
        ["Sepal Width", "Petal Length"],
        ["Sepal Width", "Petal Width"],
        ["Petal Length", "Petal Width"],
        ["Petal Length", "Sepal Length"], // Reverse pair for added variation
        ["Petal Width", "Sepal Length"], // Reverse pair for added variation
        ["Sepal Width", "Sepal Length"], // Reverse pair for added variation
        ["Petal Width", "Sepal Width"], // Reverse pair for added variation
        ["Petal Length", "Sepal Width"], // Reverse pair for added variation
        ["Petal Width", "Petal Length"]  // Original pair for added variation
    ];

    uniquePairs.forEach(pair => {
        createScatterPlotOrHistogram(
            data,
            pair[0],
            pair[1],
            xSAxisConfig.bandwidth(),
            ySAxisConfig.bandwidth(),
            3,
            {
                x0: xSAxisConfig(pair[0]),
                y0: ySAxisConfig(pair[1])
            })
    });

    // Create cells
    const cells = mainGroup.append('g')
        .selectAll('g')
        .data(
            cross(
                range(attributes.length),
                range(attributes.length)
            )
        )
        .join('g')
        .attr(
            'transform',
            ([i, j]) =>
                `translate(${xSAxisConfig(attributes[i])},${ySAxisConfig(attributes[j])})`
        );


    // Draw all histograms
    const hist1 = createHistogram(data, "Sepal Length", subWidth, subHeight)
    const hist2 = createHistogram(data, "Sepal Width", subWidth, subHeight)
    const hist3 = createHistogram(data, "Petal Length", subWidth, subHeight)
    const hist4 = createHistogram(data, "Petal Width", subWidth, subHeight)

    hist1.attr("transform", `translate(${xSAxisConfig("Sepal Length")}, ${ySAxisConfig("Sepal Length")})`)
    hist2.attr("transform", `translate(${xSAxisConfig("Sepal Width")}, ${ySAxisConfig("Sepal Width")})`)
    hist3.attr("transform", `translate(${xSAxisConfig("Petal Length")}, ${ySAxisConfig("Petal Length")})`)
    hist4.attr("transform", `translate(${xSAxisConfig("Petal Width")}, ${ySAxisConfig("Petal Width")})`)



    // Add legend
    // const legendG = createLegend()
    // legendG.attr('transform', `translate(${innerWidth}, ${margin.right})`)
}

// Load data from dataset
csv('data.csv').then((data) => {
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
    // Extract species
    IRIS_DATA["Iris-setosa"] = validData.filter(d => d["Class"] === "Iris-setosa")
    IRIS_DATA["Iris-virginica"] = validData.filter(d => d["Class"] === "Iris-virginica")
    IRIS_DATA["Iris-versicolor"] = validData.filter(d => d["Class"] === "Iris-versicolor")
    render(validData)
})