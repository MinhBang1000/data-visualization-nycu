const {
  select,
  csv,
  scaleOrdinal,
  schemeCategory10,
  scaleTime,
  scaleLinear,
  extent,
  min,
  max,
  axisTop,
  axisBottom,
  axisLeft,
  area,
  drag,
  selectAll
} = d3;

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

let data;
let types;
let savedTypes;
let statusTypes;
const colors = {
  "house_2": "#1F77B4",
  "house_3": "#FF7F0E",
  "house_4": "#2CA02C",
  "house_5": "#D62728",
  "unit_1": "#9467BD",
  "unit_2": "#8C564B",
  "unit_3": "#E377C2"
}

const colorLegend = (
  selection,
  { colorScale, colorLegendLabel }
) => {
  const colorLegendG = selection
    .selectAll('g.color-legend')
    .data([null])
    .join('g')
    .attr('class', 'color-legend')
    .attr('transform', `translate(850 50)`);

  colorLegendG
    .selectAll('text.color-legend-label')
    .data([null])
    .join('text')
    .attr('x', -10)
    .attr('y', -20)
    .attr('class', 'color-legend-label')
    .attr('font-family', 'sans-serif')
    .text(colorLegendLabel);

  console.log(colorScale.domain());

  const ticks = colorLegendG
    .selectAll('g.tick')
    .data(savedTypes)
    .join((enter) =>
      enter
        .append('g')
        .attr('class', d => d + ' tick legend')
        .call((selection) => {
          const d = selection.datum()
          selection.append('circle');
          selection.append('text');
          selection.append("foreignObject")
          .attr("x", 80)  // Positioning the checkbox inside the group
          .attr("y", -10)
          .attr("width", 100)
          .attr("height", 30)
          .append('xhtml:div')  // XHTML to embed HTML elements inside SVG
          .html(`<input type="checkbox" id="myCheckbox" class="${d}" />`);
        })
    )
    .attr(
      'transform',
      (d, i) => `translate(0, ${i * 30})`
    )
    .attr('font-size', 10)
    .attr('font-family', 'sans-serif')
    .call((selection) => {
      selection
        .select('circle')
        .attr('r', 10)
        .attr('fill', d => colors[d]);
      selection
        .select('text')
        .attr('dy', '0.32em')
        .attr('x', 15)
        .text((d) => d);
    })
  
  function removeTick(str) {
    return str.split(' ')[0]; // Split by space and return the first part
  }

  function removeValue(data, value) {
    return data.filter(d => d !== value)
  }

  function haveType(data, type) {
    return data.filter(d => d === type).length === 1
  }

  // Mouse event
  // ticks.on("click", function () {
  //   const thisTick = select(this)
  //   const type = removeTick(thisTick.attr('class'))
  //   if (haveType(types, type)) {
  //     types = removeValue(types, type)
  //     thisTick.select("text").classed("deactive", true)
  //   } else {
  //     types.push(type)
  //     types = savedTypes.filter(value => types.includes(value))
  //     thisTick.select("text").classed("deactive", false)
  //   }
  //   clearChart()
  //   render()
  // })

  // Tick mouse event adding and deleting
  ticks.selectAll('input').on('click', function() {
    const thisTick = select(this)
    const type = thisTick.attr('class')
    console.log(type);
  })
};

const clearChart = () => {
  svg.selectAll('.container').remove()
}

const themeRiver = (selection, props) => {
  const {
    margin,
    width,
    height,
    data,
    colorLegendLabel,
    types,
  } = props;

  const innerWidth =
    width - margin.right - margin.left;
  const innerHeight =
    height - margin.top - margin.bottom;

  // Install the group 
  const g = selection
    .selectAll('.container')
    .data([null]);

  // Fill the group
  const gEnter = g
    .enter()
    .append('g')
    .attr('class', 'container');
  gEnter
    .merge(g)
    .attr(
      'transform',
      `translate(${margin.left},${margin.top})`
    );

  const xScale = scaleTime()
    .domain(extent(data, (d) => d.saledate))
    .range([0, innerWidth]);

  console.log(types);
  

  const stackedData = d3
    .stack()
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetWiggle)
    .keys(types.slice().reverse())(data);

  console.log(stackedData);

  stackedData.forEach((group) => {
    group.forEach((d) => {
      d['saledate'] = d.data.saledate;
    });
  });
  console.log(stackedData);

  const yScale = scaleLinear()
    .domain([
      min(stackedData, (d) =>
        min(d, (d) => d[0])
      ),
      max(stackedData, (d) =>
        max(d, (d) => d[1])
      ),
    ])
    .range([innerHeight, 0]);

  console.log(yScale.domain());

  const colorScale = scaleOrdinal()
    .domain(types)
    .range(schemeCategory10);

  // selection.call(colorLegend, {
  //   colorScale,
  //   colorLegendLabel,
  // });

  const xAxisG = g.select('.x-axis');
  const xAxisGEnterT = gEnter
    .append('g')
    .attr('class', 'x-axis');
  xAxisG
    .merge(xAxisGEnterT)
    .call(
      axisTop(xScale)
        .tickPadding(10)
        .tickSizeOuter(0)
    );
  const xAxisGEnterB = gEnter
    .append('g')
    .attr('class', 'x-axis');
  xAxisG
    .merge(xAxisGEnterB)
    .attr(
      'transform',
      `translate(0,${innerHeight})`
    )
    .call(
      axisBottom(xScale)
        .tickPadding(10)
        .tickSizeOuter(0)
    );

  const areaGenerator = area()
    .x((d) => xScale(d.data.saledate))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1] || d[0]));

  const tooltip = select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  const paths = g
    .merge(gEnter)
    .selectAll('path')
    .data(stackedData);
  gEnter
    //.enter()
    .append('g')
    .selectAll('path')
    .data(stackedData)
    .enter()
    .append('path')
    .attr('class', 'area')
    .attr('d', areaGenerator)
    .attr('fill', (d) => colors[d.key])
    .on('mouseover', function (d) {
      console.log(d.key);

      // Show the tooltip
      tooltip
        .transition()
        .duration(200)
        .style('opacity', 0.9);

      // Define the content of the tooltip
      tooltip.html(
        `<strong>Type:</strong> ${d.key}<br>` /*+
          `<strong>Total Score:</strong>` +
          d.data[d.key]
          ? `${d.data[d.key]}<br>`
          : `NaN<br>`*/
      );
    })
    .on('mousemove', function (d) {
      tooltip
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY - 30 + 'px');
    })
    .on('mouseout', function () {
      // Hide the tooltip
      tooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
    });
};

const render = () => {
  svg.call(themeRiver, {
    margin: {
      top: 30,
      right: 20,
      bottom: 70,
      left: 20,
    },
    width,
    height,
    data,
    colorLegendLabel: 'Type',
    types,
  });

  const inputs = selectAll(".legend-body input")
  inputs.each(function(d, i) {
    const input = select(this)
    const classname = input.attr('class')
    input.property("checked", statusTypes[classname])
  })

  inputs.on('click', function() {
    const input = select(this)
    const classname = input.attr('class')
    statusTypes[classname] = !statusTypes[classname]
    types = savedTypes.filter(type => statusTypes[type]) 
    clearChart()
    render()
  })
};

csv('ma_lga_12345.csv').then((loadedData) => {
  // Get distinct combination values of each pair type and bedrooms
  types = loadedData
    .map(function (d) {
      return d.type + '_' + d.bedrooms;
    })
    .filter(function (value, index, self) {
      return self.indexOf(value) === index;
    });
  savedTypes = types
  statusTypes = {}
  savedTypes.forEach(t => {
    statusTypes[t] = true
  })
  // Create funciton with format
  const parseDate = d3.timeParse('%d/%m/%Y');

  loadedData.forEach((d) => {
    d['MA'] = +d['MA'];
    d.saledate = parseDate(d.saledate);
  });

  data = loadedData.reduce(function (result, d) {
    var date = d.saledate;
    var key = d.type + '_' + d.bedrooms;
    var existingEntry = result.find(function (entry) {
      return (entry.saledate.getTime() === date.getTime());
    });
    if (!existingEntry) {
      existingEntry = { saledate: date };
      result.push(existingEntry);
    }
    existingEntry[key] = d.MA;

    return result;
  }, []);
  data.sort((a, b) => a.saledate - b.saledate);

  console.log(data);
  render();
});
