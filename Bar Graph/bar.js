const sample = [
    {
        language: '10 - 19',
        value: 0,
        color: '#000000'
    },
    {
        language: '20 - 29',
        value: 0.1,
        color: '#00a2ee'
    },
    {
        language: '30 - 39',
        value: 0.5,
        color: '#fbcb39'
    },
    {
        language: '40 - 49',
        value: 0.8,
        color: '#007bc8'
    },
    {
        language: '50 - 59',
        value: 2.9,
        color: '#65cedb'
    },
    {
        language: '60 - 69',
        value: 8.4,
        color: '#ff6e52'
    },
    {
        language: '70 - 79',
        value: 20.9,
        color: '#f9de3f'
    },
    {
        language: '80+',
        value: 69.5,
        color: '#5d2f8e'
    },
];
const sample2 = [
    {
        language: '10 - 19',
        value: 1.5,
        color: '#000000'
    },
    {
        language: '20 - 29',
        value: 1.5,
        color: '#00a2ee'
    },
    {
        language: '30 - 39',
        value: 0,
        color: '#fbcb39'
    },
    {
        language: '40 - 49',
        value: 2.9,
        color: '#007bc8'
    },
    {
        language: '50 - 59',
        value: 2.9,
        color: '#65cedb'
    },
    {
        language: '60 - 69',
        value: 23.5,
        color: '#ff6e52'
    },
    {
        language: '70 - 79',
        value: 20.6,
        color: '#f9de3f'
    },
    {
        language: '80+',
        value: 52.9,
        color: '#5d2f8e'
    },
];

const sample3 = [
    {
        language: '10 - 19',
        value: 0,
        color: '#000000'
    },
    {
        language: '20 - 29',
        value: 0.2,
        color: '#00a2ee'
    },
    {
        language: '30 - 39',
        value: 2.9,
        color: '#fbcb39'
    },
    {
        language: '40 - 49',
        value: 3.7,
        color: '#007bc8'
    },
    {
        language: '50 - 59',
        value: 4.3,
        color: '#65cedb'
    },
    {
        language: '60 - 69',
        value: 13.8,
        color: '#ff6e52'
    },
    {
        language: '70 - 79',
        value: 21.5,
        color: '#f9de3f'
    },
    {
        language: '80+',
        value: 72.1,
        color: '#5d2f8e'
    },
];

const svg = d3.select('svg');
const svgContainer = d3.select('#container');

const margin = 80;
const width = 1000 - 2 * margin;
const height = 600 - 2 * margin;

const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

const xScale = d3.scaleBand()
    .range([0, width])
    .domain(sample.map((s) => s.language))
    .padding(0.4)

const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 100]);

// vertical grid lines
// const makeXLines = () => d3.axisBottom()
//   .scale(xScale)

const makeYLines = () => d3.axisLeft()
    .scale(yScale)

chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

chart.append('g')
    .call(d3.axisLeft(yScale));

// vertical grid lines
// chart.append('g')
//   .attr('class', 'grid')
//   .attr('transform', `translate(0, ${height})`)
//   .call(makeXLines()
//     .tickSize(-height, 0, 0)
//     .tickFormat('')
//   )

chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat('')
    )

const barGroups = chart.selectAll()
    .data(sample)
    .enter()
    .append('g')

barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.language))
    .attr('y', (g) => yScale(g.value))
    .attr('height', (g) => height - yScale(g.value))
    .attr('width', xScale.bandwidth())
    .on('mouseenter', function (actual, i) {
        d3.selectAll('.value')
            .attr('opacity', 0)

        d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 0.6)
            .attr('x', (a) => xScale(a.language) - 5)
            .attr('width', xScale.bandwidth() + 10)

        const y = yScale(actual.value)

        line = chart.append('line')
            .attr('id', 'limit')
            .attr('x1', 0)
            .attr('y1', y)
            .attr('x2', width)
            .attr('y2', y)

        barGroups.append('text')
            .attr('class', 'divergence')
            .attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
            .attr('y', (a) => yScale(a.value) + (-10))
            .attr('fill', 'white')
            .attr('text-anchor', 'middle')
            .text((a, idx) => {
                const divergence = (a.value - actual.value).toFixed(1)

                let text = ''
                if (divergence > 0) text += '+'
                text += `${divergence}%`

                return idx !== i ? text : '';
            })

    })
    .on('mouseleave', function () {
        d3.selectAll('.value')
            .attr('opacity', 1)

        d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 1)
            .attr('x', (a) => xScale(a.language))
            .attr('width', xScale.bandwidth())

        chart.selectAll('#limit').remove()
        chart.selectAll('.divergence').remove()
    })

barGroups
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.value) + (-10))
    .attr('text-anchor', 'middle')
    .text((a) => `${a.value}%`)

svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Deaths (%)')

svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'middle')
    .text('Age Categories')

svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Calgary Zone')

svg.append('text')
    .attr('class', 'source')
    .attr('x', width - margin / 2)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'start')
    .text('')
