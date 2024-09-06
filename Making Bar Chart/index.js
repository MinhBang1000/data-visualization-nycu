const {
    select,
    selectAll,
    csv,
    scaleLinear, 
    max
} = d3

const svg = select('svg')
const width = +svg.attr('width')
const height = +svg.attr('height')

const render = (data) => {
    const xScale = scaleLinear()
        .domain([0, max(data, d => d.population)])
        .range([0, width])
    console.log(xScale(30000000))
    // Just a function to convert a domain propotion to a range propotion 
    svg.selectAll('rect')
        .data(data).enter()
            .append('rect')
                .attr('width', 300)
                .attr('height', 300)
}

csv('data.csv')
    .then(data => {
        data.forEach(element => {
            element.population = +element?.population*1000  
        })
        render(data)
    })
