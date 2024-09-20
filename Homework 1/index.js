const {
  select,
  csv,
  scaleLinear,
  extent,
  axisLeft,
  axisBottom,
  format,
} = d3

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = (data, xAttr, yAttr) => {
  const colors = {
    'Iris-setosa': '#3CB371',
    'Iris-versicolor': '#FF6347',
    'Iris-virginica': '#4B0082',
  };
  const title = `Visualizing Sepal and Petal Dimensions Across Iris Species`;

  const cValue = (d) => d['class'];

  const xValue = (d) => d[xAttr];
  const xAxisLabel = xAttr;

  const yValue = (d) => d[yAttr];
  const circleRadius = 8;
  const yAxisLabel = yAttr;

  const margin = {
    top: 100,
    right: 80,
    bottom: 100,
    left: 100,
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  const g = svg
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left},${margin.top})`,
    );

  const xAxis = axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);

  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);

  const yAxisG = g.append('g').call(yAxis);
  yAxisG.selectAll('.domain').remove();

  yAxisG
    .append('text')
    .attr('class', 'axis-label')
    .attr('y', -50)
    .attr('x', -innerHeight / 2)
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
    .text(yAxisLabel);

  const xAxisG = g
    .append('g')
    .call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);

  xAxisG.select('.domain').remove();

  xAxisG
    .append('text')
    .attr('class', 'axis-label')
    .attr('y', 50)
    .attr('x', innerWidth / 2)
    .text(xAxisLabel);

  g.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cy', (d) => yScale(yValue(d)))
    .attr('cx', (d) => xScale(xValue(d)))
    .attr('fill', (d) => colors[cValue(d)])
    .attr('class', (d) => cValue(d))
    .attr('r', circleRadius)
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 0.5);

  g.append('text')
    .attr('class', 'title')
    .attr('y', -25)
    .text(title);
};

const updateFields = (data) => {
  svg.selectAll('g').remove();
  const xAttr = document.getElementById('x-select').value;
  const yAttr = document.getElementById('y-select').value;
  render(data, xAttr, yAttr);
};

const hoverToMoreClarify = (className) => {
  svg
    .selectAll(`.${className}`)
    .transition()
    .duration(500)
    .style('opacity', 1);
};

const unhoverToLessClarify = (className) => {
  svg
    .selectAll(`.${className}`)
    .transition()
    .duration(500)
    .style('opacity', 0.5);
};

csv('http://vis.lab.djosix.com:2024/data/iris.csv').then((data) => {
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
  document
    .getElementById('x-select')
    .addEventListener('change', () =>
      updateFields(validData),
    );
  document
    .getElementById('y-select')
    .addEventListener('change', () =>
      updateFields(validData),
    );
  // Hover to clarify circles
  document
    .getElementById('setosa')
    .addEventListener('mouseenter', () =>
      hoverToMoreClarify('Iris-setosa'),
    );
  document
    .getElementById('versicolor')
    .addEventListener('mouseenter', () =>
      hoverToMoreClarify('Iris-versicolor'),
    );
  document
    .getElementById('virginica')
    .addEventListener('mouseenter', () =>
      hoverToMoreClarify('Iris-virginica'),
    );
  // Un-Hover to less clarify circles
  document
    .getElementById('setosa')
    .addEventListener('mouseleave', () =>
      unhoverToLessClarify('Iris-setosa'),
    );
  document
    .getElementById('versicolor')
    .addEventListener('mouseleave', () =>
      unhoverToLessClarify('Iris-versicolor'),
    );
  document
    .getElementById('virginica')
    .addEventListener('mouseleave', () =>
      unhoverToLessClarify('Iris-virginica'),
    );
});
