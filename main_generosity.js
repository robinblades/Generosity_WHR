const csvUrl = "https://raw.githubusercontent.com/robinblades/Generosity_WHR/main/Gen_Data_reorganized_sorted.csv"
//data is sorted by population

// we use .then because d3.csv is "asynchronous"
d3.csv(csvUrl).then(function(csv) {
    const margin = {top: 20, left: 20, bottom: 40, right: 20}
    const width = window.innerWidth * 0.85 - margin.left - margin.right;
    const height = window.innerHeight * 0.85 - margin.top - margin.bottom;
    
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const gdpExtent = d3.extent(csv, function(d) {
        return +d.Log_GDP
    })

    const generosityExtent = d3.extent(csv, function(d) {
        return +d.Generosity
    })

    const yearExtent = d3.extent(csv, function(d) {
        return +d.Year
    })

    const populationExtent = d3.extent(csv, function(d) {
        return +d.Population
    })

    const xScale = d3.scaleLog().domain(gdpExtent).range([0, width])
    const yScale = d3.scaleLinear().domain(generosityExtent).range([height, 0])
    const rScale = d3.scaleSqrt()
        .domain(populationExtent)
        .range([2, 40])



    const regionColors = {
        "North America and ANZ": "Thistle",
        "Latin America and Caribbean": "Orchid",
        "Western Europe": "DarkGoldenRod",
        "Central and Eastern Europe": "Gold",
        "Commonwealth of Independent States": "GoldenRod",
        "Middle East and North Africa": "SeaGreen",
        "Sub-Saharan Africa": "IndianRed",
        "Southeast Asia": "CornflowerBlue",
        "East Asia": "LightSteelBlue",
        "South Asia": 'SteelBlue'
    }

    let year = yearExtent[0]
    const earliestYearData = csv.filter(function(d) {
        if (+d.Year === year) {
            return true
        } else {
            return false
        }
    })

    svg.selectAll('circle').data(earliestYearData)
        .enter()
        .append('circle')
        .attr('cy', function(d) {
            const generosity = +d.Generosity
            return yScale(generosity)
        })
        .attr('cx', function(d) {
            const gdp = +d.Log_GDP
            return xScale(gdp)
        })
        .attr('r', function(d) {
            const population = +d.Population
            return rScale(population)
        })
        .attr('fill', function(d) {
            const region = d.Region
            const fill = regionColors[region]
            return fill
        })
        .attr('stroke', '#f3f3f3')


    const line = d3.line()
        .x(d => xScale(d.Log_GDP))
        .y(d => yScale(d.Generosity))
        .curve(d3.curveBasis) // https://github.com/d3/d3-shape#curveLinear

    svg.append('text')
        .attr('id', 'year')
        .attr('dy', height * .8)
        .attr('dx', 20)
        .attr('font-size', '100px')
        .attr('opacity', .3)
        .text(year)



    const xAxis = d3.axisBottom().scale(xScale).ticks(5, d3.format('.2s'))
    const yAxis = d3.axisLeft().scale(yScale)

    svg.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0 ' + height + ')').call(xAxis)
    svg.append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

    // set everything to invisible at beginning
    svg.select('.x-axis').attr('opacity', 0)
    svg.select('.y-axis').attr('opacity', 0)
    svg.select('#year').attr('opacity', 0)
    svg.selectAll('circle').attr('opacity', 0)

    const scroller = scrollama()

    function hide(selector) {
        svg.selectAll(selector).transition(200).attr('opacity', 0)
    }

    function show(selector, opacity = 1) {
        svg.selectAll(selector).transition(200).attr('opacity', opacity)
    }

    let interval = null

    scroller.setup({
        step: '.step',
        offset: .75,
        debug: true
    }).onStepEnter(function(response) {
        const index = response.index

        if (index === 0) { //nothing
            hide('.x-axis')
            hide('.y-axis')
            hide('#year')
            hide('circle')
        } else if (index === 1) { 
            show('.x-axis') //show x axis
            hide('.y-axis')
            hide('#year')
            hide('circle')
        } else if (index === 2) {
            show('.x-axis') //show y axis
            show('.y-axis')
            hide('#year')
            hide('circle')
        } else if (index === 3) {
            show('.x-axis')
            show('.y-axis')
            hide('#year')
            show('circle') 
            
            d3.selectAll('circle') 
            .attr('fill', function(d) {
                const region = d.Region
                const fill = regionColors[region]
                return fill
            })//show circles and allow hovering function???
            //MAKES COLOR RETURN WHEN REVERSING DIRECTION

        } else if (index === 4) {
            show('.x-axis')
            show('.y-axis')
            show('circle')
            hide('#year')

            //color highlight countries with region tag: Sub-Saharan Africa
            d3.selectAll('circle') 
            .attr('fill', function(d) {
                const region = d.Region
                if(region==='Sub-Saharan Africa') {
                    const fill = "LightCoral"
                    return fill
                } else {
                    const fill = "#E8E8E8"
                    return fill
                }
            })

        } else if (index === 5) {
            show('.x-axis')
            show('.y-axis')
            show('circle')
            hide('#year')

            //color highlight countries with region tag: Middle East and North Africa
            d3.selectAll('circle') 
            .attr('fill', function(d) {
                const region = d.Region
                if(region==='Middle East and North Africa') {
                    const fill = "SeaGreen"
                    return fill
                } else {
                    const fill = "#E8E8E8"
                    return fill
                }
            })

        } else if (index === 6) {
            show('.x-axis')
            show('.y-axis')
            show('circle')
            hide('#year')

            //color highlight countries with region tag: South Asia, East Asia, or Southeast Asia
            d3.selectAll('circle') 
            .attr('fill', function(d) {
                const region = d.Region
                if(region==='East Asia') {
                    const fill = "LightSteelBlue"
                    return fill
                } else if (region==='South Asia') {
                    const fill = "SteelBlue"
                    return fill
                } else if (region==='Southeast Asia') {
                    const fill = "CornflowerBlue"
                    return fill
                } else {
                    const fill = "#E8E8E8"
                    return fill
                }
            })

        } else if (index === 7) {
            show('.x-axis')
            show('.y-axis')
            show('circle')
            hide('#year')

            //color highlight countries with region tag: Americas
            d3.selectAll('circle') 
            .attr('fill', function(d) {
                const region = d.Region
                if(region==='North America and ANZ') {
                    const fill = "Thistle"
                    return fill
                } else if (region==='Latin America and Caribbean') {
                    const fill = "Orchid"
                    return fill
                } else {
                    const fill = "#E8E8E8"
                    return fill
                }
            })

        } else if (index === 8) {
            show('.x-axis')
            show('.y-axis')
            show('circle')
            hide('#year')

            //color highlight countries with region tag: Europe
            d3.selectAll('circle') 
            .attr('fill', function(d) {
                const region = d.Region
                if(region==='Western Europe') {
                    const fill = "DarkGoldenRod"
                    return fill
                } else if (region==='Central and Eastern Europe') {
                    const fill = "Gold"
                    return fill
                } else if (region==='Commonwealth of Independent States') {
                    const fill = "GoldenRod"
                    return fill
                } else {
                    const fill = "#E8E8E8"
                    return fill
                }
            })

        } else if (index === 9) {
            show('.x-axis')
            show('.y-axis')
            show('circle')
            show('#year', .5) //show year 2019

            d3.selectAll('circle') //return colors
            .attr('fill', function(d) {
                const region = d.Region
                const fill = regionColors[region]
                return fill
            })

            if (interval) clearInterval(interval)
            console.log({ year })
        } else if (index === 11) { //calculate if generosity went down. Show those bubbles animation.
            show('.x-axis')
            show('.y-axis')
            show('circle')
            show('#year', .5)

            console.log({ year })
            interval = setInterval(function() { //how to update animation? to play again?
                if (year === 2021) {
                    return
                } else {
                    year = year + 1
                }

                const yearData = csv.filter(function(d) {
                    if (+d.Year === year) {
                        return true
                    } else {
                        return false
                    }
                })

                d3.select('#year').text(year)

                d3.selectAll('circle')
                    .data(yearData)
                    .transition(150)
                    .attr('cy', function(d) {
                        const generosity = +d.Generosity
                        return yScale(generosity)
                    })
                    .attr('cx', function(d) {
                        const gdp = +d.Log_GDP
                        return xScale(gdp)
                    })
                    .attr('r', function(d) {
                        const population = +d.Population
                        return rScale(population)
                    })
            }, 100)
        } else if (index === 12) { //highlight Greece, Botswana, and Japan
            show('.x-axis')
            show('.y-axis')
            //show('circle')
            show('#year', .5)


            d3.selectAll('circle')
            .transition(200)
            .attr('opacity', function(d) {
                const country = d.Country                    
                if(country==='Greece') {
                    const opacity = 1
                    return opacity
                } else if (country==='Botswana') {
                    const opacity = 1
                    return opacity
                } else if (country==='Japan') {
                    const opacity = 1
                    return opacity
                } else {
                    const opacity = 0
                    return opacity
                }
            })
        } else if (index === 14) { //highlight Indonesia, Myanmar, and Haiti
            show('.x-axis')
            show('.y-axis')
            //show('circle')
            show('#year', .5)


            d3.selectAll('circle')
            .transition(200)
            .attr('opacity', function(d) {
                const country = d.Country                    
                if(country==='Indonesia') {
                    const opacity = 1
                    return opacity
                } else if (country==='Myanmar') {
                    const opacity = 1
                    return opacity
                } else if (country==='Hait') {
                    const opacity = 1
                    return opacity
                } else {
                    const opacity = 0
                    return opacity
                }
            })
        }

    })

})