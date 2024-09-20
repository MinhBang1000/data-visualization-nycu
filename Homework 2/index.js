const {
  select,
  csv,
  scaleLinear,
  extent,
  axisLeft,
  axisBottom,
  format,
  line
} = d3

import { extractKeys, findMinMax, findValues, replaceHyphenWithSpace } from "./tools"

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = (data) => {
  const colors = {
    'Iris-setosa': '#3CB371',
    'Iris-versicolor': '#FF6347',
    'Iris-virginica': '#4B0082',
  };
  const title = `Parallel Coordinates Visualization of Sepal and Petal Dimensions Across Iris Species`;
  const yAxisLabel = `Value`
  const xAxisLabel = `Variable`
  const margin = {
    top: 100,
    right: 80,
    bottom: 100,
    left: 100,
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const dimensions = extractKeys(data)
  const coordinate = findMinMax(data)
  const yCoordinate = findValues(coordinate.min, coordinate.max, 1)
  const xCoordinate = findValues(0, dimensions.length - 1, 1)

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const xScale = scaleLinear()
    .domain([0, dimensions.length - 1]) // The number of element in dimensions array
    .range([50, innerWidth - 150])

  const yScale = {} // Should be a dictionary of scaleLinear objects
  dimensions?.forEach((dim) => {
    yScale[dim] = scaleLinear()
      .domain([coordinate.min, coordinate.max])
      .range([innerHeight, 0])
      .nice()
  })

  // Draw one y-axis + multiple x-axis
  const firstDimension = dimensions[0]
  const axisLeftConfig = axisLeft(yScale[firstDimension])
    .tickPadding(10)
    .tickSize(-innerWidth + 100)
    .tickValues(yCoordinate)

  const yAxisG = g.append('g')
    .attr('transform', `translate(0, 0)`)
    .call(axisLeftConfig)

  yAxisG
    .append('text')
    .attr('class', 'axis-label')
    .attr('y', -40)
    .attr('x', 10)
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
    .text(yAxisLabel);

  const axisBottomConfig = axisBottom(xScale)
    .tickPadding(20)
    .tickSize(-innerHeight)
    .tickValues(xCoordinate)
    .tickFormat((d, i) => dimensions[i])

  // At the bottom
  const xAxisG = g.append('g')
    .attr('transform', `translate(0, ${yScale[firstDimension](coordinate.min)})`)
    .call(axisBottomConfig)

  xAxisG
    .append('text')
    .attr('class', 'axis-label')
    .attr('y', 60)
    .attr('x', innerWidth - 100)
    .text(xAxisLabel);

  // Remove domain
  xAxisG.selectAll('.domain').remove()
  yAxisG.selectAll('.domain').remove()

  // Create a legend
  const species = Object.keys(colors)
  const legendG = g.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${innerWidth - 50}, ${innerHeight / 2})`)

  legendG.append('text')
    .attr('class', 'legend-label')
    .attr('y', -20)
    .attr('x', 0)
    .text("Species");
  species.forEach((sp, i) => {
    const legendRowG = legendG.append('g')
      .attr('transform',`translate(0, ${i * 20})`)
    
    legendRowG.append('rect')
      .attr('width', 10)
      .attr('height', 3)
      .attr('fill', colors[sp])
    
    legendRowG.append('text')
      .attr('x', 15)
      .attr('y', 5)
      .text(replaceHyphenWithSpace(sp))
  })


  // Draw some lines
  const lineGenerator = line()
    .x((d, i) => xScale(i))
    .y((d, i) => yScale[dimensions[i]](d))

  g.selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('class', 'data-line')
    .attr('stroke', d => colors[d['class']])
    .attr('stroke-width', 2)
    .attr('opcity', 0)
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 0.3)
    .attr('d', d => lineGenerator(dimensions.map(dim => d[dim])))

  // Title
  g.append('text')
    .attr('class', 'title')
    .attr('y', -40)
    .text(title);
};

const updateFields = (data) => {
  render(data);
};



csv('data.csv').then((data) => {
  data.forEach((d) => {
    d['sepal length'] = +d['sepal length'];
    d['sepal width'] = +d['sepal width'];
    d['petal length'] = +d['petal length'];
    d['petal width'] = +d['petal width'];
  });
  const validData = data.filter(
    (d) =>
      !isNaN(d['sepal length']) &&
      !isNaN(d['sepal width']) &&
      !isNaN(d['petal length']) &&
      !isNaN(d['sepal width']),
  );
  updateFields(validData);
});
