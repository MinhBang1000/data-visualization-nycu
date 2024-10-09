const {
    select,
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
import {colorLegend} from "./colorLegend.js"
  
  export const stackedBarChart = (
    selection,
    props
  ) => {
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
      height - margin.top - margin.bottom;
  
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
  
    let groups = map(data, function (d) {
        return d.name;
      })
      .keys();
    console.log(groups)
  
    const xScale = scaleBand()
      .domain(groups)
      .range([0, innerWidth])
      .padding([0.2]);
  
    const yScale = scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);
  
    const colorScale = scaleOrdinal()
      .domain(subgroups)
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
  
    const yAxisG = g.select('.y-axis');
    const yAxisGEnter = gEnter
      .append('g')
      .attr('class', 'y-axis');
    yAxisG
      .merge(yAxisGEnter)
      .call(axisLeft(yScale).tickPadding(10));
  
    //show color legend
    selection.call(colorLegend, {
      colorScale,
      colorLegendLabel,
    });
  
    const filteredData = data.map((d) => {
      const filteredEntry = {};
      subgroups.forEach((col) => {
        filteredEntry[col] = d[col];
      });
      return filteredEntry;
    });
    
    console.log(subgroups)
    console.log(data)
  
    let stackedData = stack().keys(subgroups)(
      data
    );
    console.log(stackedData)
  
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
          `<strong>Name:</strong> ${d.data.name}<br>` +
            `<strong>Total Score:</strong> ${d.data['scores_overall']}<br>` +
            `<br>` +
            `<strong>Teaching:</strong> ${d.data['scores_teaching']}<br>` +
            `<strong>Research:</strong> ${d.data['scores_research']}<br>` +
            `<strong>Citations:</strong> ${d.data['scores_citations']}<br>` +
            `<strong>Industry Income:</strong> ${d.data['scores_industry_income']}<br>` +
            `<strong>International Outlook:</strong> ${d.data['scores_international_outlook']}`
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
  