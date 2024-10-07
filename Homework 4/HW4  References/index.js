const {
    select,
    selectAll,
    csv,
    scaleLinear,
    scaleOrdinal,
    histogram,
    schemeCategory10,
    extent,
    max,
    axisLeft,
    axisBottom,
    cross,
    range,
} = d3;

const colorLegend = (
    selection,
    { colorScale }
) => {
    const colorLegendG = selection
        .selectAll('g.color-legend')
        .data([null])
        .join('g')
        .attr('class', 'color-legend')
        .attr('transform', `translate(830 50)`);

    colorLegendG
        .selectAll('text.color-legend-label')
        .data([null])
        .join('text')
        .attr('x', -10)
        .attr('y', -20)
        .attr('class', 'color-legend-label')
        .attr('font-family', 'sans-serif')
        .text('Classes');

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

const svg = select('svg');

const margin = 50;

const width = +svg.attr('width');
const height = +svg.attr('height');
const padding = 30;

csv('iris.csv').then(function (data) {
    // Parse the Data
    data.pop();
    let dimensions = {};
    dimensions = Object.keys(data[0]).filter(
        function (d) {
            return d != 'class';
        }
    );

    // Color Legend
    const colorScale = scaleOrdinal()
        .domain(
            data.map(function (d) {
                return d.class;
            })
        )
        .range(schemeCategory10);

    svg.call(colorLegend, {
        colorScale,
    });

    const plot_size =
        (width -
            (dimensions.length - 1) * padding -
            3 * margin) /
        dimensions.length;

    const xScale = dimensions.map((c) =>
        scaleLinear()
            .domain(d3.extent(data, (d) => d[c]))
            .rangeRound([0, plot_size])
    );

    const yScale = xScale.map((x) =>
        x.copy().range([plot_size, 0])
    );

    const createXAxis = (xScale, plot_size) => (
        g
    ) => {
        g.call(
            axisBottom(xScale)
                .ticks(4)
                .tickSize(plot_size)
        );
        g.call((g) => g.select('.domain').remove());
        g.call((g) =>
            g
                .selectAll('.tick line')
                .attr('stroke', '#D3D3D3')
        );
    };
    const createYAxis = (yScale, plot_size) => (
        g
    ) => {
        g.call(
            axisLeft(yScale)
                .ticks(4)
                .tickSize(-plot_size)
        );
        g.call((g) => g.select('.domain').remove());
        g.call((g) =>
            g
                .selectAll('.tick line')
                .attr('stroke', '#D3D3D3')
        );
    };

    svg.attr('viewBox', [
        -margin,
        -margin,
        width,
        height,
    ]);

    const cell = svg
        .append('g')
        .selectAll('g')
        .data(
            cross(
                range(dimensions.length),
                range(dimensions.length)
            )
        )
        .join('g')
        .attr(
            'transform',
            ([i, j]) =>
                `translate(${i * (plot_size + padding)},${j * (plot_size + padding)
                })`
        );

    cell.each(function ([i, j]) {
        select(this)
            .append('g')
            .call(createXAxis(xScale[i], plot_size));
        if (i != j)
            select(this)
                .append('g')
                .call(createYAxis(yScale[j], plot_size));
    });

    // Draw Plot Boxes
    cell
        .append('rect')
        .attr('fill', 'none')
        .attr('stroke', '#A9A9A9')
        .attr('width', plot_size)
        .attr('height', plot_size);

    // Plot Data
    cell.each(function ([i, j]) {
        if (i != j)
            select(this)
                .selectAll('circle')
                .data(data)
                .join('circle')
                .attr('fill', (d) => colorScale(d.class))
                .attr('fill-opacity', 0.7)
                .attr('r', 3.5)
                .attr('cx', (d) =>
                    xScale[i](d[dimensions[i]])
                )
                .attr('cy', (d) =>
                    yScale[j](d[dimensions[j]])
                );
    });

    // Histogram
    cell.each(function ([i, j]) {
        if (i == j) {
            const dimension = dimensions[i];
            const histogramxScale = scaleLinear()
                .domain(extent(data, (d) => d[dimension]))
                .range([0, plot_size]);

            const histo = histogram()
                .value(function (d) {
                    return d[dimension];
                })
                .domain(histogramxScale.domain())
                .thresholds(histogramxScale.ticks(15));

            const bins = histo(data);
            const histogramyScale = scaleLinear()
                .domain([0, max(bins, (d) => d.length)])
                .range([plot_size, 0]);
            select(this)
                .selectAll('bar')
                .data(bins)
                .join('rect')
                .attr('fill', '#B0C4DE')
                .attr('transform', function (d) {
                    return `translate(${histogramxScale(
                        d.x0
                    )},${histogramyScale(d.length)})`;
                })
                .attr(
                    'width',
                    (d) =>
                        histogramxScale(d.x1) -
                        histogramxScale(d.x0)
                )
                .attr(
                    'height',
                    (d) =>
                        plot_size - histogramyScale(d.length)
                );
            select(this)
                .append('g')
                .call(
                    createYAxis(histogramyScale, plot_size)
                );
        }
    });

    // X Axis
    svg
        .append('g')
        .selectAll('text')
        .data(dimensions)
        .join('text')
        .attr(
            'transform',
            (d, i) =>
                `translate(${i * (plot_size + padding)},${height - 2 * margin
                })`
        )
        .attr('x', plot_size / 2)
        .style('text-anchor', 'middle')
        .text((d) => d);

    // Y Axis
    svg
        .append('g')
        .selectAll('text')
        .data(dimensions)
        .join('text')
        .attr(
            'transform',
            (d, i) =>
                `translate(0,${i * (plot_size + padding)
                }) rotate(-90)`
        )
        .attr('x', -plot_size / 2)
        .attr('y', -padding)
        .style('text-anchor', 'middle')
        .text((d) => d);

    const circle = cell.selectAll('circle');
    cell.each(function ([i, j]) {
        if (i != j) {
            select(this)
                .call(brush, circle, svg, {
                    padding,
                    plot_size,
                    xScale,
                    yScale,
                    dimensions,
                    i,
                    j,
                });
        }
    });

    //Brush
    function brush(
        cell,
        circle,
        svg,
        {
            padding,
            plot_size,
            xScale,
            yScale,
            dimensions,
            i,
            j,
        }
    ) {
        const brush = d3
            .brush()
            .extent([
                [0, 0],
                [plot_size, plot_size],
            ])
            .on('start', brushstarted)
            .on('brush', brushed(i, j))
            .on('end', brushended);

        cell.call(brush);

        let brushCell;

        // Clear the previously-active brush, if any.
        function brushstarted() {
            if (brushCell !== this) {
                d3.select(brushCell).call(
                    brush.move,
                    null
                );
                brushCell = this;
            }
        }

        // Highlight the selected circles.
        function brushed(i, j) {
            return function () {
                const selection = d3.brushSelection(this);
                let selected = [];
                if (selection) {
                    const [[x0, y0], [x1, y1]] = selection;
                    circle.classed(
                        'hidden',
                        (d) =>
                            x0 > xScale[i](d[dimensions[i]]) ||
                            x1 < xScale[i](d[dimensions[i]]) ||
                            y0 > yScale[j](d[dimensions[j]]) ||
                            y1 < yScale[j](d[dimensions[j]])
                    );
                    selected = data.filter(
                        (d) =>
                            x0 < xScale[i](d[dimensions[i]]) &&
                            x1 > xScale[i](d[dimensions[i]]) &&
                            y0 < yScale[j](d[dimensions[j]]) &&
                            y1 > yScale[j](d[dimensions[j]])
                    );
                }
                svg
                    .property('value', selected)
                    .dispatch('input');
            };
        }

        // If the brush is empty, select all circles.
        function brushended() {
            //**
            const selection = d3.brushSelection(this);
            //**
            if (selection) return;
            svg.property('value', []).dispatch('input');
            circle.classed('hidden', false);
        }
    }
    svg
        .append('style')
        .text(
            `circle.hidden { fill: #000;fill-opacity: 1; r: 1.5; }`
        );
});
