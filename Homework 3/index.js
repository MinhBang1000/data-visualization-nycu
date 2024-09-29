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

import { extractKeys, percentOf, findR } from "./tools"

// Get started by setting up
const title = `Exploring Abalone Attributes: Correlation Matrices for Males, Females, and Infants`;
const names = ["Male Abalone", "Female Abalone", "Infant Abalone"]

// Layout
const margin = {
  top: 64,
  right: 64,
  bottom: 64,
  left: 40,
};
const gap = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
}

const svg = select('svg')

const width = 900;
const height = 600;
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom


const heatmapCreate = (keys, data, edgeLength, title) => {
  const inversedKeys = new Array()
  for (let i = keys.length - 1; i >= 0; i--) {
    inversedKeys.push(keys[i])
  }
  const g = select('svg').append('g')

  // Build the axis and scale axis - X axis
  const xScale = scaleBand()
    .domain(keys.filter(k => k !== 'Sex'))
    .range([0, edgeLength])
    .padding(0.05)
  const xAxis = axisBottom(xScale)
    .tickPadding(-10)
  const xAxisG = g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(${0},${edgeLength})`)
    .call(xAxis)
  // Config the tick x-axis

  xAxisG.selectAll('.x-axis .tick text')
    .attr('x', -10)

  // Y - axis
  const yScale = scaleBand()
    .domain(inversedKeys.filter(k => k !== 'Sex'))
    .range([edgeLength, 0])
    .padding(0.05)
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
    .data(data, d => d)
    .enter()
    .append('rect')
    .attr('class', `data-rect`)
    .attr('x', (d) => xScale(d.keyX))
    .attr('y', (d) => yScale(d.keyY))
    .attr('rx', 5)
    .attr('ry', 5)
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
    const rectText = g.append('text')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', '.35em') // Vertically align text
      .attr('class', 'data-rect-text')
      .attr('text-anchor', 'middle') // Center text
      .style('fill', `${color}`) // Set text color to black
      .style('font-size', '10px') // Set the font size to a smaller value
      .text(d.r % 1 === 0 ? Math.round(d.r) : d3.format('.2f')(d.r)); // Display whole number or rounded value

    // Adding mouseenter and mouseleave function
    rect.on('mouseenter', function () {
      rectText.classed('data-rect-text-active', true)
      rect.classed('data-rect-active', true)
    })

    rect.on('mouseleave', function () {
      rectText.classed('data-rect-text-active', false)
      rect.classed('data-rect-active', false)
    })

    rectText.on('mouseenter', function () {
      rectText.classed('data-rect-text-active', true)
      rect.classed('data-rect-active', true)
    })

    rectText.on('mouseleave', function () {
      rectText.classed('data-rect-text-active', false)
      rect.classed('data-rect-active', false)
    })

    // Adding mouseclick
    rect.on('click', function () {
      const flag = rectText.classed('data-rect-text-clicked')
      rectText.classed('data-rect-text-clicked', !flag)
    })

    rectText.on('click', function () {
      const flag = rectText.classed('data-rect-text-clicked')
      rectText.classed('data-rect-text-clicked', !flag)
    })
  });
  // Title
  g.append('text')
    .attr('class', 'h2-title')
    .attr('y', -10)
    .text(title);

  g.style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 1)

  return g
}

const colorNoticeCreate = (colors, size) => {
  const g = select('svg').append('g');

  // Create the gradient definition
  const defs = g.append('defs');
  const linearGradient = defs.append('linearGradient')
    .attr('id', 'colorGradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '0%'); // Horizontal gradient

  // Define the color stops based on the provided colors
  const stops = [-1, -0.5, 0, 0.5, 1];
  stops.forEach((stopValue, index) => {
    linearGradient.append('stop')
      .attr('offset', `${((index) / (stops.length - 1)) * 100}%`) // Calculate percentage offset
      .style('stop-color', colors[index])
      .style('stop-opacity', 1);
  });

  const xScale = scaleLinear()
    .domain([-1, 1])
    .range([0, size]);

  const axisConfig = axisBottom(xScale)
    .tickValues([-1, -0.5, 0, 0.5, 1])  // Specify the tick values
    .tickFormat(d3.format(".1f"));       // Format to display one decimal place

  const axisG = g.append('g')
    .attr('class', 'color-axis')
    .call(axisConfig);

  axisG.selectAll('.tick line').remove();
  axisG.selectAll('.domain').remove();

  // Use the gradient for the rectangle fill
  const rect = g.append('rect')
    .attr('class', 'color-rect')
    .attr('x', 0)
    .attr('y', -12)
    .attr('width', size)
    .attr('height', 15)
    .attr('fill', 'url(#colorGradient)'); // Use the gradient

  // Title
  const title = g.append('text')
    .attr('class', 'h2-title-color')
    .attr('x', 0)
    .attr('y', -25)
    .text("Value Scale")


  g.style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 1)

  return g;
}

const noteCreate = (notes) => {
  const noteG = select('svg').append('g')
  noteG.append('text')
    .attr('class', 'note-label')
    .attr('x', 0)
    .attr('y', 0)
    .text('Notices')

  notes.forEach((note, i) => {
    const index = i + 1
    noteG.append('text')
      .attr('class', 'note-label-item')
      .attr('x', 0)
      .attr('y', 20 * index)
      .text(note)
  })
  return noteG
}


const render = (processData, keys) => {
  // Prepare the data
  const inversedKeys = new Array()
  for (let i = keys.length - 1; i >= 0; i--) {
    inversedKeys.push(keys[i])
  }
  const edgeLength = 220

  // Location of group containers + title + colorband
  const spaceBetween = percentOf(innerWidth, 8.5 / 100)
  const matrixSpace = percentOf(innerWidth, 24 / 100)
  const axisSpace = percentOf(innerWidth, 11 / 100)
  const g0X = margin.left + axisSpace
  const g1X = spaceBetween + matrixSpace + g0X
  const g2X = spaceBetween + matrixSpace + g1X
  const verticalSpace = 80
  const containerVerticalSpace = margin.top + verticalSpace - 10
  const colorBandX = margin.left + percentOf(innerWidth, 50 / 100) + spaceBetween - 36
  const colorBandY = margin.top + 12 + verticalSpace + 20 + percentOf(innerHeight, 11 / 100) + matrixSpace + verticalSpace + 20
  const noteX = margin.left
  const noteY = colorBandY - 24

  // Title
  svg.append('text')
    .attr('class', 'title')
    .attr('y', margin.top)
    .attr('x', margin.left)
    .text(title)
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 1);

  // Male heatmap
  const g0 = heatmapCreate(keys, processData[0], edgeLength, names[0])
  g0.attr('transform', `translate(${g0X}, ${containerVerticalSpace})`)

  // Female heatmap
  const g1 = heatmapCreate(keys, processData[1], edgeLength, names[1])
  g1.attr('transform', `translate(${g1X}, ${containerVerticalSpace})`)
  g1.selectAll(".y-axis .tick text").remove()

  // Infant heatmap
  const g2 = heatmapCreate(keys, processData[2], edgeLength, names[2])
  g2.attr('transform', `translate(${g2X}, ${containerVerticalSpace})`)
  g2.selectAll(".y-axis .tick text").remove()

  // Notes
  const notes = [
    '- Click on a cell to toggle the visibility of its value (show/hide).',
    '- Hover over a cell to display its value and highlight the cell.'
  ];
  const noteG = noteCreate(notes)
  noteG.attr('transform', `translate(${noteX}, ${noteY})`)

  // Color band
  const cG = colorNoticeCreate(["#000814", "#001d3d", "#001d3d", "#003566", "#90e0ef"], percentOf(innerWidth, 50 / 100))
  cG.attr('transform', `translate(${colorBandX}, ${colorBandY})`)
};

const updateFields = (processData, keys) => {
  svg.selectAll('*').remove()
  render(processData, keys)
};


text('http://vis.lab.djosix.com:2024/data/abalone.data').then((data) => {
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

  // Assuming the data
  const maleData = []
  const femaleData = []
  const infantData = []
  const keys = extractKeys(parsedData)
  const allData = parsedData.filter(d => isNaN(d?.Sex))
  allData.forEach((d) => {
    if (d?.Sex === 'M') {
      maleData.push(d)
    } else if (d?.Sex === 'F') {
      femaleData.push(d)
    } else if (d?.Sex === 'I') {
      infantData.push(d)
    }
  })
  const male = findR(maleData, keys)
  const female = findR(femaleData, keys)
  const infant = findR(infantData, keys)
  const processData = [
    [...male], [...female], [...infant]
  ]
  updateFields(processData, keys)
})