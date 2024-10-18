const {
  select,
  selectAll,
  csv,
  stack,
  scaleLinear,
  scaleBand,
  scaleOrdinal,
  axisBottom,
  axisLeft,
  schemeCategory10,
  map
} = d3;

// Dropdown Component
const dropdownMenu = (
  selection,
  props
) => {
  const {
    options,
    onOptionClicked,
    selectedOption,
  } = props;

  let select = selection
    .selectAll('select')
    .data([null]);
  select = select
    .enter()
    .append('select')
    .merge(select)
    .on('change', function () {
      onOptionClicked(this.value);
    });

  const option = select
    .selectAll('option')
    .data(options);

  // Remove any options that are no longer needed
  option.exit().remove();
  option
    .enter()
    .append('option')
    .merge(option)
    .attr('value', (d) => d)
    .property(
      'selected',
      (d) => d === selectedOption
    )
    .text((d) => d);
};

// Stack Bar Charts Creation
const stackedBarChart = (selection,props) => {
  const {
    margin,
    width,
    height,
    data,
    subgroups,
    colorLegendLabel,
  } = props;

  const innerWidth =
    width - margin.right - margin.left - 50;
  const innerHeight =
    height - margin.top - margin.bottom - 200;

  const g = selection
    .selectAll('.container')
    .data([null]);
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

  let groups = map(data, function (d) { // Name of university
      return d.name;
    })
    .keys();

  const xScale = scaleBand()
    .domain(groups)
    .range([0, innerWidth])
    .padding([0.2]);

  const yScale = scaleLinear()
    .domain([0, 100])
    .range([innerHeight, 0]);

  const colorScale = scaleOrdinal()
    .domain([
      'teaching',
      'research',
      'citations',
      'industry income',
      'international outlook'
    ])
    .range(schemeCategory10);

  const xAxisG = g.select('.x-axis');
  const xAxisGEnter = gEnter
    .append('g')
    .attr('class', 'x-axis');
  xAxisG
    .merge(xAxisGEnter)
    .attr(
      'transform',
      `translate(0,${innerHeight})`
    )
    .call(
      axisBottom(xScale)
        .tickPadding(10)
        .tickSizeOuter(0)
    )
    .selectAll('text')
    .style('text-anchor', 'start')
    .attr('transform', 'rotate(45)');

  xAxisG.merge(xAxisGEnter).selectAll('.tick text')
    .style('font-size', '14px')

  const yAxisG = g.select('.y-axis');
  const yAxisGEnter = gEnter
    .append('g')
    .attr('class', 'y-axis');
  yAxisG
    .merge(yAxisGEnter)
    .call(axisLeft(yScale).tickPadding(10));
  
  yAxisG.merge(yAxisGEnter).style('font-size', '14px')

  let stackedData = stack().keys(subgroups)(
    data
  );

  const tooltip = select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0); // Initially hidden

  //add bars
  const bars = g
    .merge(gEnter)
    .selectAll('rect')
    .data(stackedData);
  bars
    .enter()
    .append('g')
    .attr('fill', (d) => colorScale(d.key))
    .selectAll('rect')
    .data((d) => d)
    .enter()
    .append('rect')
    .attr('class', d => d)
    .attr('x', function (d) {
      return xScale(d.data.name);
    })
    .attr('y', function (d) {
      return yScale(d[1]);
    })
    .attr('height', function (d) {
      return yScale(d[0]) - yScale(d[1]);
    })
    .attr('width', xScale.bandwidth())
    .on('mouseover', function (d) {
      // Show the tooltip
      tooltip
        .transition()
        .duration(200)
        .style('opacity', 0.9);

      // Define the content of the tooltip
      tooltip.html(
        `<div><strong>Name:</strong> ${d.data.name}</div>` +
          `<div><strong>Overall:</strong> ${d.data['scores_overall']}</div>` +
          `<div><strong>Teaching:</strong> ${d.data['scores_teaching']}</div>` +
          `<div><strong>Research:</strong> ${d.data['scores_research']}</div>` +
          `<div><strong>Citations:</strong> ${d.data['scores_citations']}</div>` +
          `<div><strong>Industry Income:</strong> ${d.data['scores_industry_income']}</div>` +
          `<div><strong>International Outlook:</strong> ${d.data['scores_international_outlook']}</div>`
      );
    })
    .on('mousemove', function (d) {
      select(this).classed('hovered', true)
      tooltip
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY - 30 + 'px');
    })
    .on('mouseout', function () {
      select(this).classed('hovered', false)
      // Hide the tooltip
      tooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
    });
};












const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

let data;
let sortBy = 'overall';
let order = 'descending';
let subgroupsStates = {
  'teaching': true,
  'research': true,
  'citations': true,
  'industry income': true,
  'international outlook': true,
};
let subgroups = [
  'teaching',
  'research',
  'citations',
  'industry income',
  'international outlook',
]

const render = () => {
  //enable sorting
  const onSortByClicked = (column) => {
    sortBy = column;
    resetToFirstPage();
  };
  const onOrderClicked = (column) => {
    order = column;
    resetToFirstPage();
  };
  select('#sortBy').call(dropdownMenu, {
    options: [
      'overall',
      'teaching',
      'research',
      'citations',
      'industry income',
      'international outlook',
    ],
    onOptionClicked: onSortByClicked,
    selectedOption: sortBy,
  });

  select('#order').call(dropdownMenu, {
    options: ['descending', 'ascending'],
    onOptionClicked: onOrderClicked,
    selectedOption: order,
  });

  const itemsPerPage = 30;
  let currentPage = 1;

  select('#next-button').on('click', () => {
    currentPage++;
    if (currentPage > data.length / itemsPerPage)
      currentPage = 1;
    updateChart();
  });

  select('#prev-button').on('click', () => {
    currentPage--;
    if (currentPage < 1)
      currentPage = data.length / itemsPerPage;
    updateChart();
  });

  // Filter subgroups
  function excludeLegendItem(str) {
    // Replace all occurrences of "legend-item" with an empty string
    return str.replace(/legend-item/g, '').trim();
  }
  function getActiveSubgroups(states) {
    const activeSubgroups = [];

    // Loop through each key in the object
    for (let key in states) {
      if (states[key]) {
        activeSubgroups.push(key); // Add the key to the result list if its state is true
      }
    }

    return activeSubgroups;
  }
  const legends = selectAll('.legend-item')
  legends.each(function (d, i) {
    const legend = select(this)
    const className = excludeLegendItem(legend.attr('class'))
    // Add event listerner
    legend.on('click', function () {
      subgroupsStates[className] = !subgroupsStates[className]
      select(this).select('p').classed('non-selected', !select(this).select('p').classed('non-selected'))
      subgroups = getActiveSubgroups(subgroupsStates)

      // Change sort select elements
      const sortGroups = subgroups.slice()
      sortGroups.unshift('overall')
      select('#sortBy').call(dropdownMenu, {
        options: sortGroups,
        onOptionClicked: onSortByClicked,
        selectedOption: sortBy,
      });
      updateChart()
    })
  })

  // Add the guide
  const tooltip = select('body')
    .append('div')
    .attr('class', 'tooltipGuide')
    .style('opacity', 0); // Initially hidden

  select("#guides").on('mouseover', function () {
    // Show the tooltip
    select("body").select('.tooltipGuide')
      .transition()
      .duration(200)
      .style('opacity', 0.9);

    // Define the content of the tooltip
    select("body").select('.tooltipGuide').html(
      `<div><strong>Click the legend:</strong> Toggle the visibility of this attribute in the chart.</div>` +
      `<div><strong>Hover over a bar:</strong> View the exact value for that data point.</div>` +
      `<div><strong>Adjust selections:</strong> Change the values in the two dropdowns to see the corresponding updates in the chart.</div>`
    );
  })
  .on('mousemove', function (d) {
    select("body").select('.tooltipGuide')
      .style('left', d3.event.pageX + 10 + 'px')
      .style('top', d3.event.pageY - 30 + 'px');
  })
  .on('mouseout', function () {
    // Hide the tooltip
    select("body").select('.tooltipGuide')
      .transition()
      .duration(500)
      .style('opacity', 0);
  });

  // Initial chart render
  updateChart();

  function updateChart() {
    const sortedData = sortData(
      data,
      sortBy,
      order
    );
    const start =
      (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = sortedData.slice(start, end);

    // Update stacked bar chart with the pageData
    //remove before update
    svg.selectAll('*').remove();
    svg.call(stackedBarChart, {
      margin: {
        top: 30,
        right: 120,
        bottom: 150,
        left: 50,
      },
      width,
      height,
      data: pageData,
      subgroups,
      colorLegendLabel: 'Indicators',
    });
  }

  function resetToFirstPage() {
    currentPage = 1;
    updateChart();
  }

  function sortData(data, sortBy, order) {

    const changedData = data.slice()
    changedData.forEach(d => {
      const international_outlook = subgroupsStates["international outlook"] ? d["international outlook"] : 0
      const teaching = subgroupsStates["teaching"] ? d["teaching"] : 0
      const research = subgroupsStates["research"] ? d["research"] : 0
      const industry_income = subgroupsStates["industry income"] ? d["industry income"] : 0
      const citations = subgroupsStates["citations"] ? d["citations"] : 0
      d["overall"] = international_outlook + teaching + research + industry_income + citations
    })

    return data.slice().sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (order === 'ascending') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }
};

csv(
  'http://vis.lab.djosix.com:2024/data/TIMES_WorldUniversityRankings_2024.csv'
).then((loadedData) => {
  data = loadedData.filter((d) => {
    return d.rank !== 'Reporter';
  });
  data.forEach((d) => {
    d['teaching'] = +d['scores_teaching'] * 0.295;
    d['research'] = +d['scores_research'] * 0.29;
    d['citations'] = +d['scores_citations'] * 0.3;
    d['industry income'] =
      +d['scores_industry_income'] * 0.04;
    d['international outlook'] =
      +d['scores_international_outlook'] * 0.075;
    d['overall'] =
      d['teaching'] +
      d['research'] +
      d['citations'] +
      d['industry income'] +
      d['international outlook'];
  });
  render();
});
