export const colorLegend = (
    selection,
    { colorScale, colorLegendLabel }
  ) => {
    const colorLegendG = selection
      .selectAll('g.color-legend')
      .data([null])
      .join('g')
      .attr('class', 'color-legend')
      .attr('transform', `translate(810 50)`);
  
    colorLegendG
      .selectAll('text.color-legend-label')
      .data([null])
      .join('text')
      .attr('x', -10)
      .attr('y', -20)
      .attr('class', 'color-legend-label')
      .attr('font-family', 'sans-serif')
      .text(colorLegendLabel);
  
    colorLegendG
      .selectAll('g.tick')
      .data(colorScale.domain())
      .join((enter) =>
        enter
          .append('g')
          .attr('class', 'tick')
          .call((selection) => {
            selection.append('circle');
            selection.append('text');
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
          .attr('fill', colorScale);
        selection
          .select('text')
          .attr('dy', '0.32em')
          .attr('x', 15)
          .text((d) => d);
      });
  };
  