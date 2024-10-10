function capitalizeFirstLetters(inputString) {
  // Split the string into words, capitalize the first letter of each word, and join them back together
  return inputString
    .split(' ') // Split the string into an array of words
    .map(word => {
      // Capitalize the first letter of each word and combine it with the rest of the word
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' '); // Join the array back into a string
}


export const colorLegend = (
    selection,
    { colorScale, colorLegendLabel }, 
    props
  ) => {
    const {margin} = props
    const colorLegendG = selection
      .selectAll('g.color-legend')
      .data([null])
      .join('g')
      .attr('class', 'color-legend')
      .attr('transform', `translate(${margin.left}, ${margin.top + 15})`);
  
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
        (d, i) => `translate(${i * 200}, 0)`
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
          .text((d) => capitalizeFirstLetters(d));
      });
  };
  