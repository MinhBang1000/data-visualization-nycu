const {
    select,
    selectAll,
    csv,
    scaleLinear, 
    scaleBand,
    max,
    axisLeft,
    axisBottom
} = d3

const svg = select('svg')
const width = +svg.attr('width')
const height = +svg.attr('height')

const render = (data) => {
    const xValue = (d) => d.population
    const yValue = (d) => d.country
    
    const margin = {
        top: 10,
        bottom: 100,
        left: 100,
        right: 10
    }

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const xScale = scaleLinear()
        .domain([0, max(data, d => d.population)])
        .range([0, innerWidth])

    const yScale = scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1)

    const leftAxis = g.append('g').call(axisLeft(yScale))
    const bottomAxis = g.append('g').call(axisBottom(xScale))
    bottomAxis.attr('transform', `translate(0, ${innerHeight})`)

    g.selectAll('rect')
        .data(data).enter()
            .append('rect')
                .attr('y', d => yScale(yValue(d)))
                .attr('width', d => xScale(xValue(d)))
                .attr('height', yScale.bandwidth())

    // Doing a transition
}

csv('data.csv')
    .then(data => {
        data.forEach(element => {
            element.population = +element?.population*1000  
        })
        render(data)
    })
