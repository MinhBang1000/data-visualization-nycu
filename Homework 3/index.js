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


const heatmapCreate = (keys, data, edgeLength, title) => {
  const inversedKeys = new Array()
  for (let i = keys.length - 1; i >= 0; i--) {
    inversedKeys.push(keys[i])
  }
  // Container Group 0 - Male
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

    // Adding class to hover color band
    rect.classed('')
    
    // Adding mouseenter and mouseleave function
    rect.on('mouseenter', function() {
      rectText.classed('data-rect-text-active', true)
      rect.classed('data-rect-active', true)
    })

    rect.on('mouseleave', function() {
      rectText.classed('data-rect-text-active', false)
      rect.classed('data-rect-active', false)
    })

    rectText.on('mouseenter', function() {
      rectText.classed('data-rect-text-active', true)
      rect.classed('data-rect-active', true)
    })

    rectText.on('mouseleave', function() {
      rectText.classed('data-rect-text-active', false)
      rect.classed('data-rect-active', false)
    })

    // Adding mouseclick
    rect.on('click', function() {
      const flag = rectText.classed('data-rect-text-clicked')
      rectText.classed('data-rect-text-clicked', !flag)
    })

    rectText.on('click', function() {
      const flag = rectText.classed('data-rect-text-clicked')
      rectText.classed('data-rect-text-clicked', !flag)
    })
  });
  // Title
  g.append('text')
    .attr('class', 'h2-title')
    .attr('y', -10)
    .text(title);
  return g
}

const colorNoticeCreate = (colors, size) => {  
  const g = select('svg').append('g')
  const xScale = scaleLinear()
    .domain([-1, 1])
    .range([0, size])
  const axisConfig = axisBottom(xScale)
    .tickValues([-1, -0.5, 0, 0.5, 1])  // Specify the tick values
    .tickFormat(d3.format(".1f"));       // Format to display one decimal place
  const axisG = g.append('g')
    .attr('class', 'color-axis')
    .call(axisConfig);

  let i = -1.5
  const parsedColors = colors.map(c => {
    i+=0.5;
    return {
      color: c,
      key: i
    }
  })
  
  axisG.selectAll('.tick line').remove()
  axisG.selectAll('.domain').remove()
  
  const rects = g.selectAll('rect')
    .data(parsedColors)
    .enter()
    .append('rect')
    .attr('class', 'color-rect')
    .attr('x', c => xScale(c.key))
    .attr('y', -10)
    .attr('width', size / 4)
    .attr('height', 15)
    .attr('fill', (c) => c.color)

  
  return g
}


const render = (data) => {
  
  // Introduction
  const title = `Correlation Matrices of Abalone Attributes: A Comparative Analysis of Male, Female, and Infant Categories`;
  const names = ["Male Abalone", "Female Abalone", "Infant Abalone"]
  
  // Layout
  const margin = {
    top: 80,
    right: 100,
    bottom: 80,
    left: 100,
  };
  const gap = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  }

  // Prepare the data
  const edgeLength = 300
  const maleData = []
  const femaleData = []
  const infantData = []
  const keys = extractKeys(data)
  const inversedKeys = new Array()
  for (let i = keys.length - 1; i >= 0; i--) {
    inversedKeys.push(keys[i])
  }
  const allData = data.filter(d => isNaN(d?.Sex))
  allData.forEach((d) => {
    if (d?.Sex === 'M') {
      maleData.push(d)
    } else if (d?.Sex === 'F') {
      femaleData.push(d)
    } else if (d?.Sex === 'I') {
      infantData.push(d)
    }
  })
  const all = findR(allData, keys)
  const male = findR(maleData, keys)
  const female = findR(femaleData, keys)
  const infant = findR(infantData, keys)


  // Male heatmap
  const g0 = heatmapCreate(keys, male, edgeLength, names[0])
  g0.attr('transform', `translate(${margin.left}, ${margin.top + 2*gap.top})`)


  // Female heatmap
  const g1 = heatmapCreate(keys, female, edgeLength, names[1])
  g1.attr('transform', `translate(${margin.left + 400}, ${margin.top + 2*gap.top})`)

  // Infant heatmap
  const g2 = heatmapCreate(keys, infant, edgeLength, names[2])
  g2.attr('transform', `translate(${margin.left + 800}, ${margin.top + 2*gap.top})`)

  svg.selectAll('.h2-title')
    .attr('x', 5*gap.left)

  svg.append('text')
    .attr('class', 'title')
    .attr('y', margin.top - 10)
    .attr('x', margin.left)
    .text(title)
  
  // Color band
  const cG = colorNoticeCreate(["#000814", "#001d3d", "#001d3d", "#003566", "#90e0ef"], 800)
  cG.attr('transform', `translate(${margin.left + 1*gap.left}, ${height - 70})`)
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