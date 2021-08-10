const csvUrl = "https://raw.githubusercontent.com/robinblades/Generosity_WHR/main/Gen_Data_reorganized_sorted.csv"

// we use .then because d3.csv is "asynchronous"
d3.csv(csvUrl).then(function(csv) {

    //set display
    const margin = {top: 20, left: 40, bottom: 20, right: 20}
    const width = window.innerWidth * 0.85 - margin.left - margin.right;
    const height = window.innerHeight * 0.85 - margin.top - margin.bottom;
    
    //create svg
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    //gdp range
    const gdpExtent = d3.extent(csv, function(d) {
        return +d.Log_GDP
    })

    //generosity range
    const generosityExtent = d3.extent(csv, function(d) {
        return +d.Generosity
    })

    //year range
    const yearExtent = d3.extent(csv, function(d) {
        return +d.Year
    })

    //population range
    const populationExtent = d3.extent(csv, function(d) {
        return +d.Population
    })

    //scales
    const xScale = d3.scaleLog().domain(gdpExtent).range([0, width])
    const yScale = d3.scaleLinear().domain(generosityExtent).range([height, 0])
    const rScale = d3.scaleSqrt()
        .domain(populationExtent)
        .range([2, 40])

    // Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#chart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")
        .style("position","absolute")
        .style("fontsize", .5)

    // Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function(e,d) {
        tooltip
        .transition(100)
        .duration(200)
        tooltip
        .style("opacity", 1)
        .html("Country: " + d.Country)
        .style("left", e.clientY + "px")
        .style("top", e.clientY + "px")
        .style("fontSize", 1)
    }
    var moveTooltip = function(d) {
        tooltip
        .style("left", e.clientY + "px")
        .style("top", e.clientY + "px")
    }
    var hideTooltip = function(d) {
        tooltip
        .transition(100)
        .duration(200)
        .style("opacity", 0)
    }

    //region colors
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

    //set earliest year
    let year = yearExtent[0]
    const earliestYearData = csv.filter(function(d) {
        if (+d.Year === year) {
            return true
        } else {
            return false
        }
    })

    //create circles
    circles = svg.selectAll('circle').data(earliestYearData)
        .enter()
        .append("g")  // put the circle and title in an SVG group
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
            .attr('stroke', 'black')
            // -3- Trigger the functions
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )

    
    // const line = d3.line()
    //     .x(d => xScale(d.Log_GDP))
    //     .y(d => yScale(d.Generosity))
    //     .curve(d3.curveBasis) // https://github.com/d3/d3-shape#curveLinear

    //year text
    svg.append('text')
        .attr('id', 'year')
        .attr('dy', height * .8)
        .attr('dx', 20)
        .attr('font-size', '100px')
        .attr('opacity', .3)
        .text(year)

    //create axises
    const xAxis = d3.axisBottom().scale(xScale).ticks(5, d3.format('.2s'))
    const yAxis = d3.axisLeft().scale(yScale)

    //add axises
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

    //set scroller
    const scroller = scrollama()

    //hide function
    function hide(selector) {
        svg.selectAll(selector).transition(200).attr('opacity', 0)
    }

    //show function
    function show(selector, opacity = 1) {
        svg.selectAll(selector).transition(200).attr('opacity', opacity)
    }

    //This function is for transitioning between years.
    function stepTransition(year) {
        const yearData = csv.filter(function(d) {
            if (+d.Year === year) {
                return true
            } else {
                return false                
            }
        })
        d3.selectAll('circle')
        .data(yearData)
        .transition(300).delay(50)
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
    }

    let interval = null

    scroller.setup({
        step: '.step',
        offset: .75,
        debug: false
    }).onStepEnter(function(response) {
        const index = response.index

        if (index === 0) { //nothing
            hide('.x-axis')
            hide('.y-axis')
            hide('#year')
            hide('circle')
            show('line')
        } else if (index === 1) { //show x axis
            show('.x-axis') 
            hide('.y-axis')
            hide('#year')
            hide('circle')
        } else if (index === 2) { //show y axis
            show('.x-axis') 
            show('.y-axis')
            hide('#year')
            hide('circle')
        } else if (index === 3) { //show circles (with hover function)
            show('.x-axis')
            show('.y-axis')
            hide('#year')
            show('circle') 
            
            d3.selectAll('circle') 
            .attr('fill', function(d) {
                const region = d.Region
                const fill = regionColors[region]
                return fill
            })

        } else if (index === 4) { //color highlight countries with region tag: Sub-Saharan Africa
            show('.x-axis')
            show('.y-axis')
            show('circle')
            hide('#year')

            d3.selectAll('circle') 
            .attr('fill', function(d) {
                const region = d.Region
                if(region==='Sub-Saharan Africa') {
                    const fill = "LightCoral"
                    return fill
                } else {
                    const fill = "LightGrey"
                    return fill
                }
            })

        } else if (index === 5) { //color highlight countries with region tag: Middle East and North Africa
            show('.x-axis')
            show('.y-axis')
            show('circle')
            hide('#year')

            d3.selectAll('circle') 
            .attr('fill', function(d) {
                const region = d.Region
                if(region==='Middle East and North Africa') {
                    const fill = "SeaGreen"
                    return fill
                } else {
                    const fill = "LightGrey"
                    return fill
                }
            })

        } else if (index === 6) { //color highlight countries with region tag: South Asia, East Asia, or Southeast Asia
            show('.x-axis')
            show('.y-axis')
            show('circle')
            hide('#year')

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
                    const fill = "LightGrey"
                    return fill
                }
            })

        } else if (index === 7) { //color highlight countries with region tag: Americas
            show('.x-axis')
            show('.y-axis')
            show('circle')
            hide('#year')

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
                    const fill = "LightGrey"
                    return fill
                }
            })

        } else if (index === 8) { //color highlight countries with region tag: Europe
            show('.x-axis')
            show('.y-axis')
            show('circle')
            hide('#year')

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
                    const fill = "LightGrey"
                    return fill
                }
            })

        } else if (index === 9) { //show year 2019
            show('.x-axis')
            show('.y-axis')
            show('circle')

            year = 2019
            show('#year', .5)
            d3.select('#year').text(year)

            d3.selectAll('circle')
            .attr('fill', function(d) {
                const region = d.Region
                const fill = regionColors[region]
                return fill
            })

            stepTransition(year)

        } else if (index === 10) { //show year 2020
            show('.x-axis')
            show('.y-axis')
            show('circle')
            
            year = 2020
            show('#year', .5)
            console.log({ year })
            d3.select('#year').text(year)

            stepTransition(year)

        } else if (index === 11) { //show year 2021
            show('.x-axis')
            show('.y-axis')
            show('circle')
            
            year = 2021
            show('#year', .5)
            console.log({ year })
            d3.select('#year').text(year) 
            
            d3.selectAll('circle')
            .attr('fill', function(d) {
                const region = d.Region
                const fill = regionColors[region]
                return fill
            })

            stepTransition(year)

        } else if (index === 13) { //highlight Singapore, Poland, and Tajikistan
            
            show('.x-axis')
            show('.y-axis')
            show('circle')
            hide('#year')

            d3.selectAll('circle') 
            .attr('fill', function(d) {
                const country = d.Country
                if(country==='Singapore') {
                    const fill = "Red"
                    return fill
                } else if (country==='Poland') {
                    const fill = "Red"
                    return fill
                } else if (country==='Tajikistan') {
                    const fill = "Red"
                    return fill
                } else {
                    const fill = "LightGrey"
                    return fill
                }
            })
            
        } else if (index === 14) { //highlight Gambia
            show('.x-axis')
            show('.y-axis')
            show('circle')
            hide('#year')


            d3.selectAll('circle') 
            .attr('fill', function(d) {
                const country = d.Country
                if(country==='Singapore') {
                    const fill = "Red"
                    return fill
                } else if (country==='Poland') {
                    const fill = "Red"
                    return fill
                } else if (country==='Tajikistan') {
                    const fill = "Red"
                    return fill
                } else if (country==='Gambia') {
                    const fill = "Cyan"
                    return fill
                } else {
                    const fill = "LightGrey"
                    return fill
                }
            })

        } else if (index === 15) { //return colors
            show('.x-axis')
            show('.y-axis')
            show('circle')
            show('#year', .5)

            d3.selectAll('circle')
            .attr('fill', function(d) {
                const region = d.Region
                const fill = regionColors[region]
                return fill
            })
        }

    })

})