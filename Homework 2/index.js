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

import { extractKeys } from "./tools"

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = (data) => {
  const colors = {
    'Iris-setosa': '#3CB371',
    'Iris-versicolor': '#FF6347',
    'Iris-virginica': '#4B0082',
  };
  const title = `Visualizing Sepal and Petal Dimensions Across Iris Species`;
  const margin = {
    top: 100,
    right: 80,
    bottom: 100,
    left: 100,
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const dimensions = extractKeys(data)
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const xScale = scaleLinear()
    .domain([0, dimensions.length - 1]) // The number of element in dimensions array
    .range([0, innerWidth])
  
  const yScale = {} // Should be a dictionary of scaleLinear objects
  dimensions?.forEach((dim) => {
    yScale[dim] = scaleLinear()
      .domain(extent(data, (d) => d[dim]))
      .range([innerHeight, 0])
      .nice()
  })

  // Draw some axis
  dimensions?.forEach((dim, i) => {
    const axisGroup = g.append('g')
      .attr('transform', `translate(${xScale(i)}, 0)`)
      .call(axisLeft(yScale[dim]))
    
    axisGroup.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .style('fill','black')
      .attr('text-anchor', 'middle')
      .attr('class','axis-label')
      .text(dim)
  })

  // Draw some lines
  const lineGenerator = line()
    .x((d,i) => xScale(i))
    .y((d,i) => yScale[dimensions[i]](d))

  g.selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', d => colors[d['class']])
    .attr('stroke-width', 2)
    .attr('opcity', 0)
    .style('opacity',0)
    .transition()
    .duration(1000)
    .style('opacity', 0.3)
    .attr('d', d => lineGenerator(dimensions.map(dim => d[dim])))
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
