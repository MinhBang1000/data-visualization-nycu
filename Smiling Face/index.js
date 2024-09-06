const {select, arc} = d3

const svg = select('svg')

const width = +svg.attr('width')
const height = +svg.attr('height')

const eyeSize = 30
const eyeOffSet = -70
const eyeSpacing = 100
const eyeBrowOffSet = eyeOffSet - 10
const eyeBrowTransition = 50

const g = svg
    .append('g')
        .attr("transform", `translate(${width / 2}, ${height / 2})`)

const faceCircle = g
    .append('circle')
        .attr('r', height / 2)
        .attr('fill','yellow')
        .attr('stroke', 'black')

const eyesGroup = g
    .append('g')
        .attr('transform',`translate(0, ${eyeOffSet})`)

const eyeBrowG = eyesGroup
    .append('g')
        .attr('transform', `translate(0, ${eyeBrowOffSet})`)

eyeBrowG
    .transition().duration(2000)
        .attr('transform',`translate(0, ${eyeBrowOffSet - eyeBrowTransition})`)
    .transition().duration(2000)
        .attr('transform',`translate(0, ${eyeBrowOffSet})`)

        const leftEyeCircle = eyesGroup
    .append('circle')
        .attr('r', eyeSize)
        .attr('cx', -eyeSpacing)
        .attr('fill','black')

const rightEyeCircle = eyesGroup
    .append('circle')
        .attr('r', eyeSize)
        .attr('cx', + eyeSpacing)
        .attr('fill','black')

const leftEyeBrow = eyeBrowG
    .append('rect')
        .attr('height', 20)
        .attr('width', 100)
        .attr('x', -150)
        .attr('fill','black')

const rightEyeBrow = eyeBrowG
    .append('rect')
        .attr('height', 20)
        .attr('width', 100)
        .attr('x', 50)
        .attr('fill','black')

const mouth = g
    .append('path')
        .attr("d", arc() ({
            innerRadius: 150,
            outerRadius: 170,
            startAngle: Math.PI / 2,
            endAngle: Math.PI * 3 / 2
        }))



