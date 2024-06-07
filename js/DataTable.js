function setupDataTable(data) {
    const colors = {
        "alfa-romero": '#0a72ff', "audi": '#fcac5c', "bmw": '#7ec47e',
        "chevrolet": '#e47474', "dodge": '#ccb4e4', "honda": '#b48e87',
        "isuzu": '#f4bfe3', "jaguar": '#bcbcbc', "mazda": '#d4d570',
        "mercedes-benz": '#97e4eb', "mercury": '#8ebcdc', "mitsubishi": '#fc8d2a',
        "nissan": '#56b256', "peugot": '#d83536', "plymouth": '#b48cd0',
        "porsche": '#97675b', "renault": '#f1b4dc', "saab": '#848484',
        "subaru": '#c4c434', "toyota": '#4eccdc', "volkswagen": '#3180bb',
        "volvo": "#f68000"
    };

    const tableContainer = d3.select("#data-table");
    tableContainer.html('');

    const table = tableContainer.append("table").attr("class", "data-table");
    const thead = table.append("thead");
    const tbody = table.append("tbody");

    const columns = [
        { name: "Make", field: "make", id: "make", sortable: true, width: 120 },
        { name: "Fuel-type", field: "fuel-type", id: "fuel-type", sortable: true, width: 75 },
        { name: "Compression", field: "compression-ratio", id: "compression-ratio", sortable: true, width: 95 },
        { name: "City-Mpg (mi)", field: "city-mpg", id: "city-mpg", sortable: true, width: 90 },
        { name: "Peak-rpm", field: "peak-rpm", id: "peak-rpm", sortable: true, width: 90},
        { name: "Normalized-losses", field: "normalized-losses", id: "normalized-losses", sortable: true, width: 120},
	    { name: "Highway-mpg", field: "highway-mpg", id: "highway-mpg", sortable: true, width: 90},
	    { name: "Stroke", field: "stroke", id: "stroke", sortable: true, width: 90},
	    { name: "Cylinders", field: "num-of-cylinders", id: "num-of-cylinders", sortable: true, width: 75},
	    { name: "Weight (lbs)", field: "curb-weight", id: "curb-weight", sortable: true, width: 85 },
	    { name: "Engine-size (cm3)", field: "engine-size", id: "engine-size", sortable: true, width: 115},
	    { name: "Length (cm)", field: "length", id: "length", sortable: true, width: 80 },
        { name: "Height (cm)", field: "height", id: "height", sortable: true, width: 80 },
	    { name: "Horsepower", field: "horsepower", id: "horsepower", sortable: true, width: 90},
	    { name: "Width (cm)", field: "width", id: "width", sortable: true, width: 80},
	    { name: "Price ($)", field: "price", id: "price", sortable: true, width: 100}

    ];
    thead.append("tr")
         .selectAll("th")
         .data(columns)
         .enter()
         .append("th")
         .text(d => d.name)
         .attr("style", d => `width: ${d.width}px`);

    window.updateDataTable = function(visibleData) {
        const rows = tbody.selectAll("tr")
                          .data(visibleData, d => d.id);

        rows.enter()
            .append("tr")
            .attr("onmouseover", d => `highlightLine(${d.id})`)
            .attr("onmouseout", "resetLines()")
            .selectAll("td")
            .data(row => columns.map(col => {
                return { value: row[col.field], field: col.field, color: col.field === "make" ? colors[row[col.field].toLowerCase()] : null };
            }))
            .enter()
            .append("td")
            .html(d => {
                if (d.field === "make" && d.color) {
                    return `<svg width="30" height="20"><circle cx="10" cy="10" r="7" fill="${d.color}"></circle></svg>${d.value}`;
                } else {
                    return d.value;
                }
            });

        rows.exit().remove();

        rows.attr("onmouseover", d => `highlightLine(${d.id})`)
            .attr("onmouseout", "resetLines()")
            .selectAll("td")
            .data(row => columns.map(col => {
                return { value: row[col.field], field: col.field, color: col.field === "make" ? colors[row[col.field].toLowerCase()] : null };
            }))
            .html(d => {
                if (d.field === "make" && d.color) {
                    return `<svg width="30" height="20"><circle cx="10" cy="10" r="7" fill="${d.color}"></circle></svg>${d.value}`;
                } else {
                    return d.value;
                }
            });
    };

    updateDataTable(data);
}

d3.csv("https://raw.githubusercontent.com/itsmetrunqhieu/D3-Car-Visualization/main/data/imports-85.csv").then(data => {
    data.forEach((d, index) => {
        d.id = index;  
        Object.keys(d).forEach(key => {
            if (!isNaN(parseFloat(d[key]))) {
                d[key] = parseFloat(d[key]);
            }
        });
    })
    setupDataTable(data);
});

