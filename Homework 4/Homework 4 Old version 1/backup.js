// Import package
const {
    scaleLinear,
    scaleBand,
    select,
    selectAll,
    csv,
    axisBottom,
    axisLeft,
    extent
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
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom

const mainGroup = svg.append('g')
    .attr('class', 'main-group')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('transform', `translate(${margin.left}, ${margin.right})`)


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

const createSignificantAxisScaleConfig = (domain, range, padding = 0.2) => {
    const scaleConfig = scaleBand()
        .domain(domain)
        .range(range)
        .padding(padding)
    return scaleConfig
}

const createScatterPlotOrHistogram = (data, key1, key2, subWidth, subHeight, radius = 5) => {
    // Provide g element
    const g = select('.main-group').append('g')
        .classed('chart-group', true)
    // Design chart
    const data1 = data.map(d => d[key1])
    const data2 = data.map(d => d[key2])
    const xScaleConfig = scaleLinear()
        .domain(extent(data1))
        .range([0, subWidth])
        .nice()
    const yScaleConfig = scaleLinear()
        .domain(extent(data2))
        .range([subHeight, 0])
        .nice()
    const xAxisConfig = axisBottom(xScaleConfig)
        // .ticks(7)
    const yAxisConfig = axisLeft(yScaleConfig)
        // .ticks(7)
    // Edit axis types later
    if (key1 === key2) {
        // Histogram
        g.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', d => {
                return d["Class"]
            })
            .attr('cx', d => xScaleConfig(d[key1]))
            .attr('cy', d => yScaleConfig(d[key2]))
            .attr('r', radius)
            .attr('stroke', 'white')
            .attr('stroke-width', 0.25)
            .attr('fill', d => colors[d["Class"]])
    } else {
        // Scatter Plot
        g.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', d => {
                return d["Class"]
            })
            .attr('cx', d => xScaleConfig(d[key1]))
            .attr('cy', d => yScaleConfig(d[key2]))
            .attr('r', radius)
            .attr('stroke', 'white')
            .attr('stroke-width', 0.25)
            .attr('fill', d => colors[d["Class"]])
    }
    // Add the axis into right charts
    // if (key2 === 'Petal Width') {
    //     g.append('g')
    //         .call(xAxisConfig)
    //         .attr('transform', `translate(${0}, ${subHeight})`)
    // }
    // if (key1 === 'Sepal Length') {
    //     g.append('g')
    //         .call(yAxisConfig)
    //         .attr('transform', `translate(${0}, ${0})`)
    // }
    const xAxisG = g.append('g')
        .call(xAxisConfig)
        .attr('transform', `translate(${0}, ${subHeight})`)
    const yAxisG = g.append('g')
        .call(yAxisConfig)
        .attr('transform', `translate(${0}, ${0})`)
    g.selectAll('.domain').remove()
    xAxisG.selectAll('.tick line')
        .attr('class', 'tick-line x-axis-tick')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', -subHeight)
    yAxisG.selectAll('.tick line')
        .attr('class', 'tick-line y-axis-tick')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', subWidth)
        .attr('y2', 0)
    return g
}

// Core function to render the entire project
const render = (data) => {
    // Draw two significant axis(s)
    const keys = Object.keys(data[0])
    const attributes = keys.filter(k => k !== 'Class')
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
    // Remove domains and ticks
    xSAxisG.selectAll('.domain').remove()
    xSAxisG.selectAll('.tick line').remove()
    ySAxisG.selectAll('.domain').remove()
    ySAxisG.selectAll('.tick line').remove()

    // Draw all charts
    for (let i = 0; i < attributes.length; i++) {
        for (let j = 0; j < attributes.length; j++) {
            const chartG = createScatterPlotOrHistogram(
                data,
                attributes[i],
                attributes[j],
                xSAxisConfig.bandwidth(),
                ySAxisConfig.bandwidth(),
                radius = 4
            )

            chartG.attr('transform', `translate(${xSAxisConfig(attributes[i])}, ${ySAxisConfig(attributes[j])})`)
            // Remove domain and tick
            // chartG.selectAll('.domain').remove()
            // chartG.selectAll('.tick line').remove()

            // // X Axis line
            // chartG.append('line')
            //     .attr('x1', 0)         // Starting point x coordinate
            //     .attr('y1', ySAxisConfig.bandwidth())         // Starting point y coordinate
            //     .attr('x2', xSAxisConfig.bandwidth())       // Ending point x coordinate
            //     .attr('y2', ySAxisConfig.bandwidth())       // Ending point y coordinate
            //     .attr('stroke', 'black')   // Line color
            //     .attr('stroke-width', 1); // Line width

            // // Y Axis line
            // chartG.append('line')
            //     .attr('x1', 0)         // Starting point x coordinate
            //     .attr('y1', 0)         // Starting point y coordinate
            //     .attr('x2', 0)       // Ending point x coordinate
            //     .attr('y2', ySAxisConfig.bandwidth())       // Ending point y coordinate
            //     .attr('stroke', 'black')   // Line color
            //     .attr('stroke-width', 1); // Line width
        }
    }
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
    console.log(data);
    render(validData)
})