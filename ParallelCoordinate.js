d3.csv("https://raw.githubusercontent.com/DungLai/dunglai.github.io/master/SwinWork/cars-visual/data/imports-85.csv").then(data => {
    data.forEach(d => {
        Object.keys(d).forEach(key => {
            if (!isNaN(parseFloat(d[key]))) {
                d[key] = parseFloat(d[key]);
            }
        });
    });

    // Helper function to update dimensions
    function getDimensions() {
        return ['make', 'compression-ratio', 'city-mpg', 'num-of-cylinders', 'curb-weight', 'engine-size', 'length', 'horsepower', 'width', 'price'].concat(
            Object.keys(data[0]).filter(key => 
                document.getElementById(key) && document.getElementById(key).checked && !['make', 'compression-ratio', 'city-mpg', 'num-of-cylinders', 'curb-weight', 'engine-size', 'length', 'horsepower', 'width', 'price'].includes(key)
            )
        );
    }

    let dimensions = getDimensions();

    const margin = { top: 50, right: 10, bottom: 10, left: 10 },
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const x = d3.scalePoint()
                .range([0, width])
                .padding(1);

    let y = {};
    let brushes = {};

    // Define color scale for car brands
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    function setupAxes() {
        dimensions = getDimensions();
        x.domain(dimensions);

        y = {};
        dimensions.forEach(dim => {
            if (dim === 'make' || typeof data[0][dim] === 'string') {
                y[dim] = d3.scalePoint()
                           .domain(data.map(d => d[dim]).filter((v, i, a) => a.indexOf(v) === i).sort())
                           .range([height, 0]);
            } else {
                y[dim] = d3.scaleLinear()
                           .domain(d3.extent(data, d => d[dim]))
                           .range([height, 0]);
            }
            brushes[dim] = d3.brushY()
                              .extent([[-8, 0], [8, height]])
                              .on("brush", brush);
        });

        svg.selectAll(".dimension").remove(); // Remove old dimensions

        const g = svg.selectAll(".dimension")
                     .data(dimensions)
                     .enter().append("g")
                     .attr("class", "dimension")
                     .attr("transform", d => `translate(${x(d)})`);

        // Add titles for displayed columns
        g.filter(d => dimensions.indexOf(d) > -1) // Filter out the 'make' column
         .append("text")
         .attr("class", "column-title")
         .attr("y", -25)
         .style("text-anchor", "middle")
         .text(d => d.charAt(0).toUpperCase() + d.slice(1).replace(/-/g, ' '));

        // Add axes and brushes for all columns
        dimensions.forEach(dim => {
            g.filter(d => d === dim)
             .append("g")
             .attr("class", "axis")
             .each(function(d) { d3.select(this).call(d3.axisLeft(y[d])); })
             .append("text")
             .style("text-anchor", "middle")
             .attr("y", -9)
             .text(d => d.charAt(0).toUpperCase() + d.slice(1).replace(/-/g, ' '));

            g.filter(d => d === dim)
             .append("g")
             .attr("class", "brush")
             .each(function(d) { d3.select(this).call(brushes[d]); })
             .selectAll("rect")
             .attr("x", -8)
             .attr("width", 16);
        });

        redrawLines();
    }

    const svg = d3.select("#pcp").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    function redrawLines() {
        svg.selectAll(".foreground path").remove(); // Remove old paths
        const foreground = svg.append("g")
                              .attr("class", "foreground")
                              .selectAll("path")
                              .data(data)
                              .enter().append("path")
                              .attr("d", d => d3.line()(dimensions.map(p => [x(p), y[p](d[p])])))
                              .style("stroke", d => color(d.make)); // Use color scale for car brands
    }

    function brush() {
        const actives = [];
        svg.selectAll(".brush")
           .filter(function(d) {
               return d3.brushSelection(this);
           })
           .each(function(d) {
               actives.push({
                   dimension: d,
                   extent: d3.brushSelection(this)
               });
           });
        svg.selectAll(".foreground path").style("display", function(d) {
            return actives.every(active => {
                const dim = active.dimension;
                const extent = active.extent;
                const scale = y[dim];
                const value = scale(dim === 'make' ? d[dim] : d[dim]);
                return extent[0] <= value && value <= extent[1];
            }) ? null : "none";
        });
    }

    // Initial setup
    setupAxes();

    window.on_select_attr = function(attribute) {
        setupAxes();
    };
});
