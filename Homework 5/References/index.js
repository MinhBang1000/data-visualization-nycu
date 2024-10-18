import {dropdownMenu} from "./dropdownMenu.js"
import {stackedBarChart} from "./stackedBarChart.js"

const {
  select,
  csv,
  scaleLinear,
  scalePoint,
  extent,
  axisBottom,
  axisLeft,
} = d3;

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

let data;
let sortBy;
let order;

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

  const itemsPerPage = 28;
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

    let subgroups = [
      'teaching',
      'research',
      'citations',
      'industry income',
      'international outlook',
    ];

    //remove before update
    svg.selectAll('*').remove();
    console.log(pageData)
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
