import { dropdownMenu } from "./dropdownMenu.js"
import { stackedBarChart } from "./stackedBarChart.js"

const {
  select,
  selectAll,
  csv
} = d3;

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

    // let subgroups = [
    //   'teaching',
    //   'research',
    //   'citations',
    //   'industry income',
    //   'international outlook',
    // ];

    //remove before update
    svg.selectAll('*').remove();
    // console.log(pageData)
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
  'TIMES_WorldUniversityRankings_2024.csv'
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
