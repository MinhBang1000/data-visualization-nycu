const {
    select,
    selectAll,
    csv,
    scaleLinear, 
    scaleBand,
    max,
    axisLeft,
    axisBottom,
    format
} = d3

const svg = select('svg')
const width = +svg.attr('width')
const height = +svg.attr('height')

const render = (data) => {
    const xValue = (d) => d.population
    const yValue = (d) => d.country
    
    const margin = {
        top: 60,
        bottom: 100,
        left: 100,
        right: 50
    }

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const xScale = scaleLinear()
        .domain([0, max(data, d => d.population)])
        .range([0, innerWidth])
        .nice()

    console.log(xScale.domain());
    

    const yScale = scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.3)

    const xAxisTickFormat = number => 
        format('.3s')(number)
        .replace('G','B')

    const xAxis = axisBottom(xScale)
        .tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight)
        
    const yAxis = axisLeft(yScale)
        .tickSize(-innerWidth)

    const leftAxis = g.append('g').call(yAxis)
    const bottomAxis = g.append('g').call(xAxis)
    bottomAxis.attr('transform', `translate(0, ${innerHeight})`)

    // delete lines
    bottomAxis.selectAll('.domain')
        .remove()
    leftAxis.selectAll('.domain')
        .remove()
    // add label of axis
    bottomAxis.append('text')
        .text('Population')
        .attr('x', innerWidth/2)
        .attr('y', 50)
        .attr('class', 'axis-label')
        .attr('fill','black')

    // add the title of chart
    g.append('text')
        .attr('class', 'title')
        .text('Top 10 Most Populous Countries')

    g.selectAll('circle')
        .data(data).enter()
            .append('circle')
                .attr('class', 'scatter-plot')
                .attr('cy', d => yScale(yValue(d)) + yScale.bandwidth() / 2)
                .attr('cx', d => xScale(xValue(d)))
                .attr('r', yScale.bandwidth() / 2)

    // Doing a transition
}

csv('data.csv')
    .then(data => {
        data.forEach(element => {
            element.population = +element?.population*1000  
        })
        render(data)
    })
