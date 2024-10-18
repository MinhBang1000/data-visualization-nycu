// D3
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
    brush,
    zoom
} = d3;

// Constraints
const svg = select('svg')
const width = +svg.attr('width')
const height = +svg.attr('height')

// Layout
const margin = 50
const padding = 35
const gap = 10
const innerWidth = width - margin * 2
const innerHeight = height - margin * 2

const main = svg.append('g')
    .attr('class', 'main')
    .attr('transform', `translate(${margin},${margin})`)


const render = (data) => {
    // Create a stacked bar chart
    const createStackedBar = (data, subgroups, groups, width, height) => g => {
        const padding = 0.2

        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding(padding)
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#e41a1c', '#377eb8', '#4daf4a'])

        //stack the data? --> stack per subgroup
        var stackedData = d3.stack()
            .keys(subgroups)
            (data)

        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function (d) { return color(d.key); })
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function (d) { return d; })
            .enter().append("rect")
            .attr("x", function (d) { return x(d.data.group); })
            .attr("y", function (d) { return y(d[1]); })
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())
    }

    const subgroups = Object.keys(data[0]).filter(k => k!=="Name" && k!=="Overall")
    const groups = data.map(d => d["Name"])
    
}

csv('TIMES_WorldUniversityRankings_2024.csv').then(loadedData => {
    data = loadedData.filter((d) => {
        return d.rank !== 'Reporter';
    });
    data.forEach((d) => {
        d['Teaching'] = +d['scores_teaching'] * 0.295;
        d['Research'] = +d['scores_research'] * 0.29;
        d['Citations'] = +d['scores_citations'] * 0.3;
        d['Industry Income'] =
            +d['scores_industry_income'] * 0.04;
        d['International Outlook'] =
            +d['scores_international_outlook'] * 0.075;
        d['Overall'] =
            d['Teaching'] +
            d['Research'] +
            d['Citations'] +
            d['Industry Income'] +
            d['International Outlook'];
    });

    const mappedData = data.map((d) => {
        return {
            "Name": d.name, 
            "Teaching": d['Teaching'],
            "Research": d['Research'],
            "Citations": d['Citations'],
            "Industry Income": d['Industry Income'],
            "International Outlook": d['International Outlook'],
            "Overall": d['Overall']
        };
    });
        
    render(mappedData)
})