// frontend/src/features/sounding/skewt/SkewTCanvas.js

import * as d3 from 'd3';


// ============================================================
// SKEW-T CANVAS
// ============================================================

export class SkewTCanvas {

    constructor({

        container,
        width = container.clientWidth || 700,
        height = container.clientHeight || 700
    }) {

        this.container = container;

        this.width = width;

        this.height = height;

        // ----------------------------------------------------
        // MARGINS
        // ----------------------------------------------------

        this.margin = {

            top: 40,

            right: 70,

            bottom: 50,

            left: 75
        };

        // ----------------------------------------------------
        // INNER SIZE
        // ----------------------------------------------------

        this.innerWidth = (

            width

            - this.margin.left

            - this.margin.right
        );

        this.innerHeight = (

            height

            - this.margin.top

            - this.margin.bottom
        );

        // ----------------------------------------------------
        // SKEW FACTOR
        // ----------------------------------------------------

        this.skewFactor = 45;

        // ----------------------------------------------------
        // SVG
        // ----------------------------------------------------

        this.svg = d3

            .select(container)

            .append('svg')

            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('width', '100%')
            .style('height', '100%')

            .style('background', '#050505')

            .style('width', '100%')

            .style('height', '100%');

        // ----------------------------------------------------
        // MAIN GROUP
        // ----------------------------------------------------

        this.g = this.svg

            .append('g')

            .attr(

                'transform',

                `translate(${this.margin.left}, ${this.margin.top})`
            );

        // ----------------------------------------------------
        // DEFINITIONS
        // ----------------------------------------------------

        this.createDefinitions();

        // ----------------------------------------------------
        // SCALES
        // ----------------------------------------------------

        this.createScales();

        // ----------------------------------------------------
        // BACKGROUND
        // ----------------------------------------------------

        this.drawBackground();
    }


    // ========================================================
    // DEFINITIONS
    // ========================================================

    createDefinitions() {

        const defs = this.svg.append('defs');

        // ----------------------------------------------------
        // GLOW FILTER
        // ----------------------------------------------------

        const filter = defs

            .append('filter')

            .attr('id', 'glow');

        filter

            .append('feGaussianBlur')

            .attr('stdDeviation', '2')

            .attr('result', 'coloredBlur');

        const feMerge = filter

            .append('feMerge');

        feMerge.append('feMergeNode')
            .attr('in', 'coloredBlur');

        feMerge.append('feMergeNode')
            .attr('in', 'SourceGraphic');
    }


    // ========================================================
    // SCALES
    // ========================================================

    createScales() {

        // ----------------------------------------------------
        // PRESSURE
        // ----------------------------------------------------

        this.yScale = d3

            .scaleLog()

            .domain([

                1050,
                100
            ])

            .range([

                this.innerHeight,
                0
            ]);

        // ----------------------------------------------------
        // TEMPERATURE
        // ----------------------------------------------------

        this.xScale = d3

            .scaleLinear()

            .domain([

                -50,
                50
            ])

            .range([

                0,
                this.innerWidth
            ]);
    }


    // ========================================================
    // BACKGROUND
    // ========================================================

    drawBackground() {

        this.drawBackgroundRect();

        this.drawPressureGrid();

        this.drawIsotherms();

        this.drawDryAdiabats();

        this.drawAxes();

        this.drawTitles();
    }


    // ========================================================
    // BACKGROUND RECT
    // ========================================================

    drawBackgroundRect() {

        this.g

            .append('rect')

            .attr('width', this.innerWidth)

            .attr('height', this.innerHeight)

            .attr('fill', '#0a0a0a')

            .attr('stroke', '#333')

            .attr('stroke-width', 1.5);
    }


    // ========================================================
    // TITLES
    // ========================================================

    drawTitles() {

        // ----------------------------------------------------
        // TITLE
        // ----------------------------------------------------

        this.svg

            .append('text')

            .attr(

                'x',

                this.width / 2
            )

            .attr('y', 28)

            .attr('text-anchor', 'middle')

            .attr('fill', '#ffffff')

            .attr('font-size', 18)

            .attr('font-weight', 700)

            .text('Skew-T Log-P Diagram');

        // ----------------------------------------------------
        // PRESSURE LABEL
        // ----------------------------------------------------

        this.svg

            .append('text')

            .attr(

                'transform',

                'rotate(-90)'
            )

            .attr(

                'x',

                -this.height / 2
            )

            .attr('y', 20)

            .attr('text-anchor', 'middle')

            .attr('fill', '#cccccc')

            .attr('font-size', 13)

            .text('Pressure (hPa)');

        // ----------------------------------------------------
        // TEMPERATURE LABEL
        // ----------------------------------------------------

        this.svg

            .append('text')

            .attr(

                'x',

                this.width / 2
            )

            .attr(

                'y',

                this.height - 8
            )

            .attr('text-anchor', 'middle')

            .attr('fill', '#cccccc')

            .attr('font-size', 13)

            .text('Temperature (°C)');
    }


    // ========================================================
    // AXES
    // ========================================================

    drawAxes() {

        // ----------------------------------------------------
        // PRESSURE AXIS
        // ----------------------------------------------------

        const pressureAxis = d3

            .axisLeft(this.yScale)

            .tickValues([

                1000,
                925,
                850,
                700,
                500,
                300,
                200,
                100
            ])

            .tickFormat(d3.format('d'));

        const yAxis = this.g

            .append('g')

            .call(pressureAxis);

        yAxis

            .selectAll('text')

            .attr('fill', '#dddddd')

            .attr('font-size', 12);

        yAxis

            .selectAll('line')

            .attr('stroke', '#888');

        yAxis

            .selectAll('path')

            .attr('stroke', '#888');

        // ----------------------------------------------------
        // TEMPERATURE AXIS
        // ----------------------------------------------------

        const tempAxis = d3

            .axisBottom(this.xScale)

            .ticks(10);

        const xAxis = this.g

            .append('g')

            .attr(

                'transform',

                `translate(0, ${this.innerHeight})`
            )

            .call(tempAxis);

        xAxis

            .selectAll('text')

            .attr('fill', '#dddddd')

            .attr('font-size', 12);

        xAxis

            .selectAll('line')

            .attr('stroke', '#888');

        xAxis

            .selectAll('path')

            .attr('stroke', '#888');
    }


    // ========================================================
    // PRESSURE GRID
    // ========================================================

    drawPressureGrid() {

        const pressures = [

            1000,
            925,
            850,
            700,
            500,
            300,
            200,
            100
        ];

        pressures.forEach((p) => {

            const y = this.yScale(p);

            this.g

                .append('line')

                .attr('x1', 0)

                .attr('x2', this.innerWidth)

                .attr('y1', y)

                .attr('y2', y)

                .attr('stroke', '#444')

                .attr('stroke-width', 1)

                .attr('opacity', 0.35);
        });
    }


    // ========================================================
    // ISOTHERMS
    // ========================================================

    drawIsotherms() {

        const temperatures = d3.range(

            -80,
            61,
            10
        );

        temperatures.forEach((t) => {

            const xBottom = this.skewX(

                t,
                1000
            );

            const xTop = this.skewX(

                t,
                100
            );

            this.g

                .append('line')

                .attr('x1', xBottom)

                .attr(

                    'y1',

                    this.yScale(1000)
                )

                .attr('x2', xTop)

                .attr(

                    'y2',

                    this.yScale(100)
                )

                .attr('stroke', '#00aaff')

                .attr('stroke-width', 1)

                .attr('opacity', 0.12);

            // ------------------------------------------------
            // LABELS
            // ------------------------------------------------

            this.g

                .append('text')

                .attr(

                    'x',

                    xBottom + 4
                )

                .attr(

                    'y',

                    this.yScale(1000) - 4
                )

                .attr('fill', '#666')

                .attr('font-size', 10)

                .text(`${t}`);
        });
    }


    // ========================================================
    // DRY ADIABATS
    // ========================================================

    drawDryAdiabats() {

        const thetas = d3.range(

            250,
            460,
            10
        );

        const pressures = d3.range(

            1050,
            99,
            -10
        );

        thetas.forEach(theta => {

            const points = [];

            pressures.forEach(p => {

                // --------------------------------------------
                // POISSON EQUATION
                // --------------------------------------------

                const temperatureK = (

                    theta

                    *

                    Math.pow(

                        p / 1000,

                        0.286
                    )
                );

                const temperatureC =
                    temperatureK - 273.15;

                points.push({

                    pressure: p,

                    temperature: temperatureC
                });
            });

            const line = d3

                .line()

                .x(d => {

                    return this.skewX(

                        d.temperature,

                        d.pressure
                    );
                })

                .y(d => {

                    return this.yScale(
                        d.pressure
                    );
                });

            this.g

                .append('path')

                .datum(points)

                .attr('fill', 'none')

                .attr('stroke', '#ff8800')

                .attr('stroke-width', 1)

                .attr('opacity', 0.18)

                .attr('d', line);
        });
    }


    // ========================================================
    // SKEW TRANSFORM
    // ========================================================

    skewX(

        temperature,

        pressure
    ) {

        const y = this.yScale(
            pressure
        );

        return (

            this.xScale(
                temperature
            )

            +

            (

                this.innerHeight
                -
                y

            ) * 0.48
        );
    }


    // ========================================================
    // DRAW PROFILE
    // ========================================================

    drawProfile({

        pressure,

        temperature,

        color = 'red',

        width = 2.5
    }) {

        const line = d3

            .line()

            .x((d, i) => {

                return this.skewX(

                    temperature[i],

                    pressure[i]
                );
            })

            .y((d, i) => {

                return this.yScale(
                    pressure[i]
                );
            })

            .curve(
                d3.curveLinear
            );

        const points = pressure.map((p, i) => ({

            pressure: p,

            temperature: temperature[i]
        }));

        this.g

            .append('path')

            .attr('class', 'profile')

            .datum(points)

            .attr('fill', 'none')

            .attr('stroke', color)

            .attr('stroke-width', width)

            .attr('filter', 'url(#glow)')

            .attr('d', line);
    }


    // ========================================================
    // LEGEND
    // ========================================================

    drawLegend() {

        const legend = this.svg

            .append('g')

            .attr(

                'transform',

                `translate(${this.width - 160}, 40)`
            );

        // ----------------------------------------------------
        // TEMP
        // ----------------------------------------------------

        legend

            .append('line')

            .attr('x1', 0)

            .attr('x2', 30)

            .attr('y1', 0)

            .attr('y2', 0)

            .attr('stroke', '#ff4444')

            .attr('stroke-width', 3);

        legend

            .append('text')

            .attr('x', 40)

            .attr('y', 5)

            .attr('fill', '#ddd')

            .attr('font-size', 12)

            .text('Temperature');

        // ----------------------------------------------------
        // DEWPOINT
        // ----------------------------------------------------

        legend

            .append('line')

            .attr('x1', 0)

            .attr('x2', 30)

            .attr('y1', 22)

            .attr('y2', 22)

            .attr('stroke', '#00ff88')

            .attr('stroke-width', 3);

        legend

            .append('text')

            .attr('x', 40)

            .attr('y', 27)

            .attr('fill', '#ddd')

            .attr('font-size', 12)

            .text('Dewpoint');
    }


    // ========================================================
    // CLEAR
    // ========================================================

    clearProfiles() {

        this.g

            .selectAll('.profile')

            .remove();

        this.svg

            .selectAll('.legend')

            .remove();
    }


    // ========================================================
    // RENDER
    // ========================================================

    render(data) {
        console.log(data.temperature[0])

        // ----------------------------------------------------
        // CLEAR
        // ----------------------------------------------------

        this.clearProfiles();

        // ----------------------------------------------------
        // TEMPERATURE
        // ----------------------------------------------------

        this.drawProfile({

            pressure:
                data.pressure,

            temperature:
                data.temperature,

            color:
                '#ff4444',

            width: 3
        });

        // ----------------------------------------------------
        // DEWPOINT
        // ----------------------------------------------------

        this.drawProfile({

            pressure:
                data.pressure,

            temperature:
                data.dewpoint,

            color:
                '#00ff88',

            width: 3
        });

        // ----------------------------------------------------
        // LEGEND
        // ----------------------------------------------------

        this.drawLegend();
    }
}