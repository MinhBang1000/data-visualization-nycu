// Container Group 0 - Male
const g = svg.append('g')
.attr('transform', `translate(${margin.left}, ${margin.top})`)
// Build the axis and scale axis - X axis
const xScale = scaleBand()
.domain(keys.filter(k => k !== 'Sex'))
.range([0, innerWidth])
.padding(0)
const xAxis = axisBottom(xScale)
.tickPadding(-10)
const xAxisG = g.append('g')
.attr('class', 'x-axis')
.attr('transform', `translate(${0},${innerHeight})`)
.call(xAxis)
// Config the tick x-axis
xAxisG.selectAll('.x-axis .tick text')
.attr('x', -10)
// Y - axis
const yScale = scaleBand()
.domain(inversedKeys.filter(k => k !== 'Sex'))
.range([innerHeight, 0])
.padding(0)
const yAxis = axisLeft(yScale)
const yAxisG = g.append('g')
.attr('class', 'y-axis')
.attr('transform', `translate(${0},${0})`)
.call(yAxis)

// Remove all domain and tick line
g.selectAll('.tick line').remove()
g.selectAll('.domain').remove()

const colorScale = scaleLinear()
.domain([-1, -0.5, 0, 0.5, 1])
.range(
  ["#000814", "#001d3d", "#001d3d", "#003566", "#90e0ef"]
);

// Fill the rect inside the group container
const rects = g.selectAll('rect')
.data(all, d => d)
.enter()
.append('rect')
.attr('class', 'data-rect')
// .attr("rx", 4)
// .attr("ry", 4)
.attr('x', (d) => xScale(d.keyX))
.attr('y', (d) => yScale(d.keyY))
.attr('width', xScale.bandwidth())
.attr('height', yScale.bandwidth())
.attr('fill', (d) => colorScale(d.r))

// Append text inside each rectangle
rects.each(function (d) {
const rect = select(this); // Select the current rect
const x = parseFloat(rect.attr('x')) + xScale.bandwidth() / 2; // Center x
const y = parseFloat(rect.attr('y')) + yScale.bandwidth() / 2; // Center y

const color = d.r < 0.85 ? 'white' : 'black'

// Append text
g.append('text')
  .attr('x', x)
  .attr('y', y)
  .attr('dy', '.35em') // Vertically align text
  .attr('text-anchor', 'middle') // Center text
  .style('fill', `${color}`) // Set text color to black
  .style('font-size', '10px') // Set the font size to a smaller value
  .text(d.r % 1 === 0 ? Math.round(d.r) : d3.format('.2f')(d.r)); // Display whole number or rounded value
});
// Title
g.append('text')
.attr('class', 'h2-title')
.attr('y', -10)
.text(names[0]);