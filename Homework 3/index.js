const {
  select,
  csv,
  text,
  scaleLinear,
  extent,
  axisLeft,
  axisBottom,
  format,
  line,
  mouse,
  transition,
  scaleBand
} = d3

import { extractKeys, findMinMax, findR, findValues, replaceHyphenWithSpace } from "./tools"

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');


const render = (data) => {
  const title = `Correlation Matrices of Abalone Attributes: A Comparative Analysis of Male, Female, and Infant Categories`;
  const margin = {
    top: 50,
    right: 100,
    bottom: 50,
    left: 100,
  };
  // const innerWidth = width - margin.left - margin.right
  // const innerHeight = height - margin.top - margin.bottom
  const distance = 350
  const innerWidth = distance
  const innerHeight = distance
  const maleData = []
  const femaleData = []
  const infantData = []
  // Seperate the data
  data.forEach((d) => {
    if (d?.Sex === 'M') {
      maleData.push(d)
    } else if (d?.Sex === 'F') {
      femaleData.push(d)
    } else {
      infantData.push(d)
    }
  })
  const keys = extractKeys(data)
  const inversedKeys = new Array()
  for (let i = keys.length - 1; i >= 0; i--) {
    inversedKeys.push(keys[i])
  }

  // Container Group
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
  // Build the axis and scale axis - X axis
  const xScale = scaleBand()
    .domain(keys.filter(k => k !== 'Sex'))
    .range([0, innerWidth])
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
  const yAxis = axisLeft(yScale)
  const yAxisG = g.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${0},${0})`)
    .call(yAxis)

  // Remove all domain and tick line
  g.selectAll('.tick line').remove()
  g.selectAll('.domain').remove()

  // Prepare the dataset
  const male = findR(maleData, keys)
  const female = findR(femaleData, keys)
  const infant = findR(infantData, keys)


  // Build the color scale with darker colors outside and lighter colors inside
  const colorScale = scaleLinear()
    .range(["rgb(30, 32, 50)", "rgb(180, 22, 88)", "rgb(255, 230, 220)"]) // Darker outside, lighter inside
    .domain([-1, 0, 1]); // Corresponding to the correlation values



  // Fill the rect inside the group container
  const rects = g.selectAll('rect')
    .data(male, d => d)
    .enter()
    .append('rect')
    .attr('class', 'data-rect')
    .attr('x', (d) => xScale(d.keyX))
    .attr('y', (d) => yScale(d.keyY))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('fill', (d) => colorScale(d.r));

  // Append text inside each rectangle
  rects.each(function (d) {
    const rect = select(this); // Select the current rect
    const x = parseFloat(rect.attr('x')) + xScale.bandwidth() / 2; // Center x
    const y = parseFloat(rect.attr('y')) + yScale.bandwidth() / 2; // Center y

    // Append text
    g.append('text')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', '.35em') // Vertically align text
      .attr('text-anchor', 'middle') // Center text
      .style('fill', 'black') // Set text color to black
      .style('font-size', '10px') // Set the font size to a smaller value
      .text(d.r % 1 === 0 ? Math.round(d.r) : d3.format('.2f')(d.r)); // Display whole number or rounded value
  });



};

const updateFields = (data) => {
  svg.selectAll('*').remove()
  render(data)
};


text('abalone.data').then((data) => {
  const parsedData = data.split('\n').map(row => {
    const columns = row.split(',');
    return {
      'Sex': columns[0],                      // Column 1: Sex
      'Length': +columns[1],                  // Column 2: Length
      'Diameter': +columns[2],                // Column 3: Diameter
      'Height': +columns[3],                  // Column 4: Height
      'Whole Weight': +columns[4],             // Column 5: Whole Weight
      'Shucked Weight': +columns[5],           // Column 6: Shucked Weight
      'Viscera Weight': +columns[6],           // Column 7: Viscera Weight
      'Shell Weight': +columns[7],             // Column 8: Shell Weight
      'Rings': +columns[8]                    // Column 9: Rings
    };
  })
  updateFields(parsedData)
})