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
const innerWidth = width - 100  - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom
let results = {}

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
    const setosa = data.filter(d => d["Class"] === 'Iris-setosa')
    const versicolor = data.filter(d => d["Class"] === 'Iris-versicolor')
    const virginica = data.filter(d => d["Class"] === 'Iris-virginica')
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

const createSignificantAxisScaleConfig = (domain, range, padding = 0.2) => {
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
    keys.forEach((c,i) => {
        const legendRowG = g.append('g')
            .attr('class','legend-group')
            .attr('transform', `translate(${edge}, ${gap*(i+1)})`)
        legendRowG.on('mouseenter', function(e){
            select(this).classed('legend-group-active', true)
            mainGroup.selectAll(`.${c}`)
                .classed(`${c}-active`, true)
        })    
        legendRowG.on('mouseleave', function(e){
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

const createScatterPlotOrHistogram = (data, key1, key2, subWidth, subHeight, radius = 5) => {
    // Provide g element
    const g = select('.main-group').append('g')
        .classed('chart-group', true)
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
        const xAxisConfig = axisBottom(xScaleConfig)
            .ticks(numberOfTicksX[key1])
        const yAxisConfig = axisLeft(yScaleConfig)
            .ticks(numberOfTicksY[key2])
        const yAxisG = g.append('g')
            .call(yAxisConfig)
            .attr('transform', `translate(${0}, ${0})`)
        const xAxisG = g.append('g')
            .call(xAxisConfig)
            .attr('transform', `translate(${0}, ${subHeight})`)
        g.selectAll('.domain').remove()
        // Edit ticks and create grid
        yAxisG.selectAll(".tick line")
            .attr('x2', subWidth)
            .attr('stroke', '#D7D7D7')
        xAxisG.selectAll(".tick line")
            .attr('y2', -subHeight)
            .attr('stroke', '#D7D7D7')
        // Add four lines
        // X Axis line
        g.append('line')
            .attr('x1', 0)         // Starting point x coordinate
            .attr('y1', subHeight)         // Starting point y coordinate
            .attr('x2', subWidth)       // Ending point x coordinate
            .attr('y2', subHeight)       // Ending point y coordinate
            .attr('stroke', '#C1C1C1')   // Line color
            .attr('stroke-width', 1); // Line width

        g.append('line')
            .attr('x1', 0)         // Starting point x coordinate
            .attr('y1', 0)         // Starting point y coordinate
            .attr('x2', subWidth)       // Ending point x coordinate
            .attr('y2', 0)       // Ending point y coordinate
            .attr('stroke', '#C1C1C1')   // Line color
            .attr('stroke-width', 1); // Line width

        // Y Axis line
        g.append('line')
            .attr('x1', 0)         // Starting point x coordinate
            .attr('y1', 0)         // Starting point y coordinate
            .attr('x2', 0)       // Ending point x coordinate
            .attr('y2', subHeight)       // Ending point y coordinate
            .attr('stroke', '#C1C1C1')   // Line color
            .attr('stroke-width', 1); // Line width

        g.append('line')
            .attr('x1', subWidth)         // Starting point x coordinate
            .attr('y1', 0)         // Starting point y coordinate
            .attr('x2', subWidth)       // Ending point x coordinate
            .attr('y2', subHeight)       // Ending point y coordinate
            .attr('stroke', '#C1C1C1')   // Line color
            .attr('stroke-width', 1); // Line width

        // Scatter Plot
        const circles = g.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', d => {
                return `${d["Class"]} data data-circle`
            })
            .attr('cx', d => xScaleConfig(d[key1]))
            .attr('cy', d => yScaleConfig(d[key2]))
            .attr('r', radius)
            .attr('stroke', '#f2f2f2')
            .attr('stroke-width', 0.25)
            .attr('opacity', 0.75)
            .attr('fill', d => colors[d["Class"]])
        
        // Add effects
        
    } else {
        // Histogram
        // Get data key1 === key2
        const histogramData = results[key1]
        // Draw all axis for a chart
        const xScaleConfig = scaleBand()
            .domain(Array.from({ length: 20 }, (_, i) => i.toString()))
            .range([0, subWidth])
        const yScaleConfig = scaleLinear()
            .domain(histogramData.domain)
            .range([subHeight, 0])
            .nice()
        const xScaleConfigAppear = scaleLinear()
            .domain(domain1)
            .range([0, subWidth])
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
        const xAxisConfig = axisBottom(xScaleConfigAppear)
            .ticks(numberOfTicksX[key1])
        const yAxisConfig = axisLeft(yScaleConfig)
            .ticks(numberOfTicksY[key2])
        const yAxisG = g.append('g')
            .call(yAxisConfig)
            .attr('transform', `translate(${0}, ${0})`)
        const xAxisG = g.append('g')
            .call(xAxisConfig)
            .attr('transform', `translate(${0}, ${subHeight})`)
        // Edit ticks and create grid
        yAxisG.selectAll(".tick line")
            .attr('x2', subWidth)
            .attr('stroke', '#D7D7D7')
        xAxisG.selectAll(".tick line")
            .attr('y2', -subHeight)
            .attr('stroke', '#D7D7D7')

        // Remove all domain
        yAxisG.selectAll('.domain').remove()
        xAxisG.selectAll('.domain').remove()

        // Add data
        const setosaData = histogramData.data["Iris-setosa"]
        const virginicaData = histogramData.data["Iris-virginica"]
        const versicolorData = histogramData.data["Iris-versicolor"]

        for (let i = 0; i < setosaData.length; i++) {
            const input = [
                { value: setosaData[i], class: 'Iris-setosa' },
                { value: virginicaData[i], class: 'Iris-virginica' },
                { value: versicolorData[i], class: 'Iris-versicolor' }
            ]
            const output = getOrderedObjects(input)
            const column3 = g.append('line')
                .attr('class', `data data-bar ${output[2].class}`)
                .attr('x1', xScaleConfig(i) + xScaleConfig.bandwidth() / 2)
                .attr('y1', yScaleConfig(output[2].value))
                .attr('x2', xScaleConfig(i) + xScaleConfig.bandwidth() / 2)
                .attr('y2', subHeight)
                .attr('stroke', colors[output[2].class])
                .attr('stroke-width', xScaleConfig.bandwidth())
            const column2 = g.append('line')
                .attr('class', `data data-bar ${output[1].class}`)
                .attr('x1', xScaleConfig(i) + xScaleConfig.bandwidth() / 2)
                .attr('y1', yScaleConfig(output[1].value))
                .attr('x2', xScaleConfig(i) + xScaleConfig.bandwidth() / 2)
                .attr('y2', subHeight)
                .attr('stroke', colors[output[1].class])
                .attr('stroke-width', xScaleConfig.bandwidth())
            const column1 = g.append('line')
                .attr('class', `data data-bar ${output[0].class}`)
                .attr('x1', xScaleConfig(i) + xScaleConfig.bandwidth() / 2)
                .attr('y1', yScaleConfig(output[0].value))
                .attr('x2', xScaleConfig(i) + xScaleConfig.bandwidth() / 2)
                .attr('y2', subHeight)
                .attr('stroke', colors[output[0].class])
                .attr('stroke-width', xScaleConfig.bandwidth())
        }

        // X Axis line
        g.append('line')
            .attr('x1', 0)         // Starting point x coordinate
            .attr('y1', subHeight)         // Starting point y coordinate
            .attr('x2', subWidth)       // Ending point x coordinate
            .attr('y2', subHeight)       // Ending point y coordinate
            .attr('stroke', '#C1C1C1')   // Line color
            .attr('stroke-width', 1); // Line width

        g.append('line')
            .attr('x1', 0)         // Starting point x coordinate
            .attr('y1', 0)         // Starting point y coordinate
            .attr('x2', subWidth)       // Ending point x coordinate
            .attr('y2', 0)       // Ending point y coordinate
            .attr('stroke', '#C1C1C1')   // Line color
            .attr('stroke-width', 1); // Line width

        // Y Axis line
        g.append('line')
            .attr('x1', 0)         // Starting point x coordinate
            .attr('y1', 0)         // Starting point y coordinate
            .attr('x2', 0)       // Ending point x coordinate
            .attr('y2', subHeight)       // Ending point y coordinate
            .attr('stroke', '#C1C1C1')   // Line color
            .attr('stroke-width', 1); // Line width

        g.append('line')
            .attr('x1', subWidth)         // Starting point x coordinate
            .attr('y1', 0)         // Starting point y coordinate
            .attr('x2', subWidth)       // Ending point x coordinate
            .attr('y2', subHeight)       // Ending point y coordinate
            .attr('stroke', '#C1C1C1')   // Line color
            .attr('stroke-width', 1); // Line width
    }
    return g
}



// Core function to render the entire project
const render = (data) => {
    // Get histogram results
    results = createLogValueRange(data)
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
    // Check values ranges
    createLogValueRange(data, keys)
    // Draw all charts
    for (let i = 0; i < attributes.length; i++) {
        for (let j = 0; j < attributes.length; j++) {
            const chartG = createScatterPlotOrHistogram(
                data,
                attributes[i],
                attributes[j],
                xSAxisConfig.bandwidth(),
                ySAxisConfig.bandwidth(),
                radius = 3
            )
            chartG.attr('transform', `translate(${xSAxisConfig(attributes[i])}, ${ySAxisConfig(attributes[j])})`)
        }
    }
    // Add legend
    const legendG = createLegend()
    legendG.attr('transform', `translate(${innerWidth}, ${margin.right})`)
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
    render(validData)
})