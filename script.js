const DATA_URL =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const w = 900;
const h = 460;
const padding = 60;

const tooltip = d3.select('#tooltip');

fetch(DATA_URL)
  .then((res) => res.json())
  .then((json) => {
    const dataset = json.data; // [dateString, gdp]

    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    const xScale = d3
      .scaleTime()
      .domain([new Date(d3.min(dataset, (d) => d[0])), new Date(d3.max(dataset, (d) => d[0]))])
      .range([padding, w - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[1])])
      .range([h - padding, padding]);

    const barWidth = (w - 2 * padding) / dataset.length;

    svg
      .selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('data-date', (d) => d[0])
      .attr('data-gdp', (d) => d[1])
      .attr('x', (d) => xScale(new Date(d[0])))
      .attr('y', (d) => yScale(d[1]))
      .attr('width', barWidth)
      .attr('height', (d) => h - padding - yScale(d[1]))
      .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 0.9)
          .attr('data-date', d[0])
          .html(d[0] + '<br>$' + d[1].toLocaleString() + ' Billion')
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

    const xAxis = d3.axisBottom(xScale);
    svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0,' + (h - padding) + ')')
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    svg
      .append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + padding + ',0)')
      .call(yAxis);
  })
  .catch((err) => console.error('Failed to load GDP data:', err));
