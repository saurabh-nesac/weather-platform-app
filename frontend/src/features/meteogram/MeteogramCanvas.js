// src/features/meteogram/MeteogramCanvas.js

import * as d3 from 'd3';

export class MeteogramCanvas {

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    constructor({

        container,

        width = container.clientWidth || 1400,
        height = container.clientHeight || 700
    }) {

        this.width = width;

        this.height = height;

        this.margin = {

            top: 20,

            right: 70,

            bottom: 40,

            left: 60
        };

        this.innerWidth = (

            this.width

            - this.margin.left

            - this.margin.right
        );

        this.innerHeight = (

            this.height

            - this.margin.top

            - this.margin.bottom
        );

        const availableHeight = this.innerHeight;

        this.panelHeights = {

            thermo: availableHeight * 0.48,

            rain: availableHeight * 0.16,

            wind: availableHeight * 0.20,

            humidity: availableHeight * 0.12
        };

        this.panelOffsets = {

            thermo: 0,

            rain:
                this.panelHeights.thermo + 30,

            wind:
                this.panelHeights.thermo
                + this.panelHeights.rain
                + 60,

            humidity:
                this.panelHeights.thermo
                + this.panelHeights.rain
                + this.panelHeights.wind
                + 90
        };

        // =====================================================
        // SVG
        // =====================================================

        this.svg = d3

            .select(container)

            .append('svg')

            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('width', '100%')
            .style('height', '100%')

            .style('background', '#050505');

        this.g = this.svg

            .append('g')

            .attr(

                'transform',

                `translate(${this.margin.left}, ${this.margin.top})`
            );

        // =====================================================
        // GROUPS
        // =====================================================

        this.thermoGroup =
            this.g.append('g');

        this.rainGroup =
            this.g.append('g');

        this.windGroup =
            this.g.append('g');

        this.humidityGroup =
            this.g.append('g');

        this.overlayGroup =
            this.g.append('g');

        // =====================================================
        // TOOLTIP
        // =====================================================

        this.tooltip = d3

            .select('body')

            .append('div')

            .style('position', 'fixed')

            .style('background', '#111')

            .style('border', '1px solid #444')

            .style('padding', '8px 10px')

            .style('border-radius', '6px')

            .style('color', '#fff')

            .style('font-size', '12px')

            .style('pointer-events', 'none')

            .style('opacity', 0)

            .style('z-index', 99999);
    }

    // =========================================================
    // CLEAR
    // =========================================================

    clear() {

        this.g.selectAll('*').remove();

        this.thermoGroup =
            this.g.append('g');

        this.rainGroup =
            this.g.append('g');

        this.windGroup =
            this.g.append('g');

        this.humidityGroup =
            this.g.append('g');

        this.overlayGroup =
            this.g.append('g');
    }

    // =========================================================
    // RENDER
    // =========================================================

    render(data) {

        this.clear();

        this.data = data;

        this.setupScales(data);

        this.renderThermoPanel(data);

        this.renderRainPanel(data);

        this.renderWindPanel(data);

        this.renderHumidityPanel(data);

        this.renderSharedCursor(data);
    }

    // =========================================================
    // SCALES
    // =========================================================

    setupScales(data) {

        this.times = data.times.map(

            t => new Date(t)
        );

        this.xScale = d3

            .scaleTime()

            .domain(

                d3.extent(this.times)
            )

            .range([

                0,

                this.innerWidth
            ]);
    }

    // =========================================================
    // THERMO PANEL
    // =========================================================

    renderThermoPanel(data) {

        const g = this.thermoGroup;

        const offsetY =
            this.panelOffsets.thermo;

        const height =
            this.panelHeights.thermo;

        g.attr(
            'transform',
            `translate(0, ${offsetY})`
        );

        // -----------------------------------------------------
        // SCALES
        // -----------------------------------------------------

        const yMin = d3.min(
            data.dewpoint
        ) - 2;

        const yMax = d3.max(
            data.temperature
        ) + 2;

        const yScale = d3

            .scaleLinear()

            .domain([

                yMin,

                yMax
            ])

            .range([

                height,

                0
            ]);

        // -----------------------------------------------------
        // GRID
        // -----------------------------------------------------

        g.append('g')

            .call(

                d3.axisLeft(yScale)

                    .tickSize(-this.innerWidth)

                    .tickFormat('')
            )

            .selectAll('line')

            .attr('stroke', '#222')

            .attr('opacity', 0.8);

        // -----------------------------------------------------
        // AXES
        // -----------------------------------------------------

        g.append('g')

            .call(

                d3.axisLeft(yScale)
            )

            .selectAll('text')

            .attr('fill', '#ddd');

        g.append('g')

            .attr(

                'transform',

                `translate(0, ${height})`
            )

            .call(

                d3.axisBottom(this.xScale)

                    .ticks(12)

                    .tickFormat(

                        d3.timeFormat('%HZ')
                    )
            )

            .selectAll('text')

            .attr('fill', '#ddd');

        // -----------------------------------------------------
        // TITLE
        // -----------------------------------------------------

        g.append('text')

            .attr('x', this.innerWidth / 2)

            .attr('y', -10)

            .attr('text-anchor', 'middle')

            .attr('fill', '#fff')

            .attr('font-size', 20)

            .attr('font-weight', 700)

            .text(
                '2m Temperature & Dewpoint'
            );

        // -----------------------------------------------------
        // AREA
        // -----------------------------------------------------

        const area = d3

            .area()

            .x((d, i) => {

                return this.xScale(
                    this.times[i]
                );
            })

            .y0(height)

            .y1((d) => {

                return yScale(d);
            });

        g.append('path')

            .datum(data.temperature)

            .attr('fill', 'rgba(255,0,0,0.08)')

            .attr('d', area);

        g.append('path')

            .datum(data.dewpoint)

            .attr('fill', 'rgba(0,255,180,0.08)')

            .attr('d', area);

        // -----------------------------------------------------
        // LINES
        // -----------------------------------------------------

        const line = d3

            .line()

            .x((d, i) => {

                return this.xScale(
                    this.times[i]
                );
            })

            .y((d) => {

                return yScale(d);
            })

            .curve(
                d3.curveMonotoneX
            );

        g.append('path')

            .datum(data.temperature)

            .attr('fill', 'none')

            .attr('stroke', '#ff2d2d')

            .attr('stroke-width', 3)

            .attr('d', line);

        g.append('path')

            .datum(data.dewpoint)

            .attr('fill', 'none')

            .attr('stroke', '#00ffb3')

            .attr('stroke-width', 3)

            .attr('d', line);
    }

    // =========================================================
    // RAIN PANEL
    // =========================================================

    renderRainPanel(data) {

        const g = this.rainGroup;

        const offsetY =
            this.panelOffsets.rain;

        const height =
            this.panelHeights.rain;

        g.attr(
            'transform',
            `translate(0, ${offsetY})`
        );

        const maxRain = d3.max(
            data.rain
        ) || 1;

        const yScale = d3

            .scaleLinear()

            .domain([

                0,

                maxRain
            ])

            .range([

                height,

                0
            ]);

        // -----------------------------------------------------
        // GRID
        // -----------------------------------------------------

        g.append('g')

            .call(

                d3.axisLeft(yScale)

                    .tickSize(-this.innerWidth)

                    .tickFormat('')
            )

            .selectAll('line')

            .attr('stroke', '#1c1c1c');

        // -----------------------------------------------------
        // AXIS
        // -----------------------------------------------------

        g.append('g')

            .call(
                d3.axisLeft(yScale)
            )

            .selectAll('text')

            .attr('fill', '#aaa');

        // -----------------------------------------------------
        // TITLE
        // -----------------------------------------------------

        g.append('text')

            .attr('x', 0)

            .attr('y', -10)

            .attr('fill', '#fff')

            .attr('font-size', 16)

            .attr('font-weight', 700)

            .text('Rainfall');

        // -----------------------------------------------------
        // BARS
        // -----------------------------------------------------

        const barWidth =
            this.innerWidth /
            data.rain.length;

        g.selectAll('.rain-bar')

            .data(data.rain)

            .enter()

            .append('rect')

            .attr('class', 'rain-bar')

            .attr('x', (d, i) => {

                return this.xScale(
                    this.times[i]
                ) - (barWidth * 0.4);
            })

            .attr('y', (d) => {

                return yScale(d);
            })

            .attr('width', barWidth * 0.8)

            .attr('height', (d) => {

                return height - yScale(d);
            })

            .attr('fill', '#2196f3')

            .attr('opacity', 0.85);
    }

    // =========================================================
    // WIND PANEL
    // =========================================================

    renderWindPanel(data) {

        const g = this.windGroup;

        const offsetY =
            this.panelOffsets.wind;

        const height =
            this.panelHeights.wind;

        g.attr(
            'transform',
            `translate(0, ${offsetY})`
        );

        const maxWind = d3.max([
            ...data.wind_speed,
            ...data.wind_gust
        ]) || 1;

        const yScale = d3

            .scaleLinear()

            .domain([

                0,

                maxWind
            ])

            .range([

                height,

                0
            ]);

        // -----------------------------------------------------
        // GRID
        // -----------------------------------------------------

        g.append('g')

            .call(

                d3.axisLeft(yScale)

                    .tickSize(-this.innerWidth)

                    .tickFormat('')
            )

            .selectAll('line')

            .attr('stroke', '#1f1f1f');

        // -----------------------------------------------------
        // AXIS
        // -----------------------------------------------------

        g.append('g')

            .call(
                d3.axisLeft(yScale)
            )

            .selectAll('text')

            .attr('fill', '#bbb');

        // -----------------------------------------------------
        // TITLE
        // -----------------------------------------------------

        g.append('text')

            .attr('x', 0)

            .attr('y', -10)

            .attr('fill', '#fff')

            .attr('font-size', 16)

            .attr('font-weight', 700)

            .text('Wind');

        // -----------------------------------------------------
        // LINES
        // -----------------------------------------------------

        const line = d3

            .line()

            .x((d, i) => {

                return this.xScale(
                    this.times[i]
                );
            })

            .y((d) => {

                return yScale(d);
            })

            .curve(
                d3.curveMonotoneX
            );

        g.append('path')

            .datum(data.wind_speed)

            .attr('fill', 'none')

            .attr('stroke', '#00d4ff')

            .attr('stroke-width', 3)

            .attr('d', line);

        g.append('path')

            .datum(data.wind_gust)

            .attr('fill', 'none')

            .attr('stroke', '#ff9800')

            .attr('stroke-width', 2)

            .attr('stroke-dasharray', '6 3')

            .attr('d', line);
    }

    // =========================================================
    // HUMIDITY PANEL
    // =========================================================

    renderHumidityPanel(data) {

        const g = this.humidityGroup;

        const offsetY =
            this.panelOffsets.humidity;

        const height =
            this.panelHeights.humidity;

        g.attr(
            'transform',
            `translate(0, ${offsetY})`
        );

        const yScale = d3

            .scaleLinear()

            .domain([

                0,

                100
            ])

            .range([

                height,

                0
            ]);

        // -----------------------------------------------------
        // GRID
        // -----------------------------------------------------

        g.append('g')

            .call(

                d3.axisLeft(yScale)

                    .tickSize(-this.innerWidth)

                    .tickFormat('')
            )

            .selectAll('line')

            .attr('stroke', '#222');

        // -----------------------------------------------------
        // AXIS
        // -----------------------------------------------------

        g.append('g')

            .call(
                d3.axisLeft(yScale)
            )

            .selectAll('text')

            .attr('fill', '#bbb');

        // -----------------------------------------------------
        // TITLE
        // -----------------------------------------------------

        g.append('text')

            .attr('x', 0)

            .attr('y', -10)

            .attr('fill', '#fff')

            .attr('font-size', 16)

            .attr('font-weight', 700)

            .text('Relative Humidity');

        // -----------------------------------------------------
        // RH LINE
        // -----------------------------------------------------

        const line = d3

            .line()

            .x((d, i) => {

                return this.xScale(
                    this.times[i]
                );
            })

            .y((d) => {

                return yScale(d);
            })

            .curve(
                d3.curveMonotoneX
            );

        g.append('path')

            .datum(data.rh)

            .attr('fill', 'none')

            .attr('stroke', '#9c27b0')

            .attr('stroke-width', 3)

            .attr('d', line);
    }

    // =========================================================
    // SHARED CURSOR
    // =========================================================

    renderSharedCursor(data) {

        const overlay = this.overlayGroup;

        const totalHeight =
            this.panelOffsets.humidity
            + this.panelHeights.humidity;

        const cursorLine = overlay

            .append('line')

            .attr('y1', 0)

            .attr('y2', totalHeight)

            .attr('stroke', '#ffffff')

            .attr('stroke-width', 1)

            .attr('opacity', 0);

        overlay

            .append('rect')

            .attr('width', this.innerWidth)

            .attr('height', totalHeight)

            .attr('fill', 'transparent')

            .on('mousemove', (event) => {

                const [x] =
                    d3.pointer(event);

                const time =
                    this.xScale.invert(x);

                const bisect =
                    d3.bisector(

                        d => d
                    ).left;

                const idx =
                    bisect(
                        this.times,
                        time
                    );

                if (
                    idx < 0
                    || idx >= this.times.length
                ) {
                    return;
                }

                const px =
                    this.xScale(
                        this.times[idx]
                    );

                cursorLine

                    .attr('x1', px)

                    .attr('x2', px)

                    .attr('opacity', 1);

                this.tooltip

                    .style('opacity', 1)

                    .style(
                        'left',
                        `${event.clientX + 15}px`
                    )

                    .style(
                        'top',
                        `${event.clientY - 10}px`
                    )

                    .html(`

                        <b>${d3.timeFormat('%d %b %HZ')(this.times[idx])}</b>

                        <hr>

                        Temp:
                        ${data.temperature[idx]?.toFixed(1)} °C
                        <br>

                        Dew:
                        ${data.dewpoint[idx]?.toFixed(1)} °C
                        <br>

                        Rain:
                        ${data.rain[idx]?.toFixed(1)} mm
                        <br>

                        Wind:
                        ${data.wind_speed[idx]?.toFixed(1)} m/s
                        <br>

                        Gust:
                        ${data.wind_gust[idx]?.toFixed(1)} m/s
                        <br>

                        RH:
                        ${data.rh[idx]?.toFixed(0)} %
                    `);
            })

            .on('mouseleave', () => {

                cursorLine
                    .attr('opacity', 0);

                this.tooltip
                    .style('opacity', 0);
            });
    }
}