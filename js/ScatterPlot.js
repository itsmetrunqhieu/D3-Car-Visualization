d3.csv("https://raw.githubusercontent.com/itsmetrunqhieu/D3-Car-Visualization/main/data/imports-85.csv").then(data => {
    data.forEach((d, index) => {
        d.id = index;  
        Object.keys(d).forEach(key => {
            if (!isNaN(parseFloat(d[key]))) {
                d[key] = parseFloat(d[key]);
            }
        });
    });

    const margin = { top: 20, right: 20, bottom: 60, left: 60 },
          width = 650 - margin.left - margin.right,
          height = 650 - margin.top - margin.bottom;

    const svg = d3.select("#scatter").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    let x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);

    const colors = {
        "selected": "#97a4bc",
        "un-selected":  "#e8eefd",
        "alfa-romero" : '#0a72ff',
        "audi" : '#fcac5c',
        "bmw" : '#7ec47e',
        "chevrolet" : '#e47474',
        "dodge" : '#ccb4e4',
        "honda" : '#b48e87',
        "isuzu" : '#f4bfe3',
        "jaguar" : '#bcbcbc',
        "mazda" : '#d4d570',
        "mercedes-benz" : '#97e4eb',
        "mercury" : '#8ebcdc',
        "mitsubishi" : '#fc8d2a',
        "nissan" : '#56b256',
        "peugot" : '#d83536',
        "plymouth" : '#b48cd0',
        "porsche" : '#97675b',
        "renault" : '#f1b4dc',
        "saab" : '#848484',
        "subaru" : '#c4c434',
        "toyota" : '#4eccdc',
        "volkswagen" : '#3180bb',
        "volvo" : "#f68000"
    };

    const xAxis = svg.append("g")
                     .attr("transform", `translate(0,${height})`),
          yAxis = svg.append("g");

    function updateAxes(xVar, yVar) {
        x.domain(d3.extent(data, d => d[xVar])).nice();
        y.domain(d3.extent(data, d => d[yVar])).nice();

        xAxis.call(d3.axisBottom(x));
        yAxis.call(d3.axisLeft(y));
        drawScatter(xVar, yVar);
    }

    function drawScatter(xVar, yVar) {
        const circles = svg.selectAll("circle").data(data);
        circles.enter().append("circle")
            .merge(circles)
            .attr("cx", d => x(d[xVar]))
            .attr("cy", d => y(d[yVar]))
            .attr("r", 5)
            .style("fill", d => colors[d.make.toLowerCase()] || colors['un-selected'])
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .on("mouseover", function(event, d) {
                if (window.highlightLine) {
                    window.highlightLine(d.id); 
                }
            })
            .on("mouseout", function(event, d) {
                if (window.resetLines) {
                    window.resetLines();
                }
            });
            
    
        circles.exit().remove();
    }
    
    updateAxes("length", "width");

    document.getElementById("var1").addEventListener("change", function() {
        updateAxes(this.value, document.getElementById("var2").value);
    });

    document.getElementById("var2").addEventListener("change", function() {
        updateAxes(document.getElementById("var1").value, this.value);
    });

    // Function to update scatter plot from brushing in parallel coordinates
    window.updateScatterFromBrush = function(filteredData) {
        const circles = svg.selectAll("circle").data(filteredData);
        circles.enter().append("circle")
            .merge(circles)
            .attr("cx", d => x(d[document.getElementById("var1").value]))
            .attr("cy", d => y(d[document.getElementById("var2").value]))
            .attr("r", 5)
            .style("fill", d => colors[d.make.toLowerCase()] || colors['un-selected'])  // Use original color mapping
            .style("stroke", "black")  // Maintain the black border color on update
            .style("stroke-width", "1px");  // Maintain the stroke width on update
            
        circles.exit().remove();
    };

});
