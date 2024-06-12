d3.csv(
  "https://raw.githubusercontent.com/itsmetrunqhieu/D3-Car-Visualization/main/data/imports-85.csv"
).then((data) => {
  data.forEach((d, index) => {
    d.id = index;
    Object.keys(d).forEach((key) => {
      if (!isNaN(parseFloat(d[key]))) {
        d[key] = parseFloat(d[key]);
      }
    });
  });

  function getDimensions() {
    return [
      "make",
      "compression-ratio",
      "city-mpg",
      "num-of-cylinders",
      "curb-weight",
      "engine-size",
      "length",
      "horsepower",
      "width",
      "price",
      "height",
    ]
      .filter(
        (key) =>
          document.getElementById(key) && document.getElementById(key).checked
      )
      .concat(
        Object.keys(data[0]).filter(
          (key) =>
            document.getElementById(key) &&
            document.getElementById(key).checked &&
            ![
              "make",
              "compression-ratio",
              "city-mpg",
              "num-of-cylinders",
              "curb-weight",
              "engine-size",
              "length",
              "horsepower",
              "width",
              "price",
              "height",
            ].includes(key)
        )
      );
  }

  let dimensions = getDimensions();
  const margin = { top: 50, right: 10, bottom: 10, left: 10 },
    width = 1000 - margin.left - margin.right,
    height = 660 - margin.top - margin.bottom;

  const x = d3.scalePoint().range([0, width]).padding(1),
    dragging = {};

  let y = {},
    brushes = {};

  const svg = d3
    .select("#pcp")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  function setupAxes() {
    dimensions = getDimensions();
    x.domain(dimensions);

    dimensions.forEach((dim) => {
      if (dim === "make" || typeof data[0][dim] === "string") {
        y[dim] = d3
          .scalePoint()
          .domain(
            data
              .map((d) => d[dim])
              .filter((v, i, a) => a.indexOf(v) === i)
              .sort()
          )
          .range([height, 0]);
      } else {
        y[dim] = d3
          .scaleLinear()
          .domain(d3.extent(data, (d) => d[dim]))
          .range([height, 0]);
      }
      brushes[dim] = d3
        .brushY()
        .extent([
          [-8, 0],
          [8, height],
        ])
        .on("brush", brush)
        .on("start", brushstart)
        .on("end", brushend);
    });

    svg.selectAll(".dimension").remove();

    const g = svg
      .selectAll(".dimension")
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "dimension")
      .attr("transform", (d) => `translate(${x(d)})`)
      .call(
        d3
          .drag()
          .on("start", function (event, d) {
            if (isBrushing) return;
            dragging[d] = x(d);
          })
          .on("drag", function (event, d) {
            if (isBrushing) return;
            dragging[d] = Math.min(width, Math.max(0, event.x));
            dimensions.sort((a, b) => position(a) - position(b));
            x.domain(dimensions);
            g.attr("transform", (d) => `translate(${position(d)})`);
            svg.selectAll(".foreground path").attr("d", path);
          })
          .on("end", function (event, d) {
            if (isBrushing) return;
            delete dragging[d];
            d3.select(this)
              .transition()
              .duration(500)
              .attr("transform", `translate(${x(d)})`);
            svg
              .selectAll(".foreground path")
              .transition()
              .duration(500)
              .attr("d", path);
          })
      );

    dimensions.forEach((dim) => {
      g.filter((d) => d === dim)
        .append("g")
        .attr("class", "axis")
        .each(function (d) {
          d3.select(this).call(d3.axisLeft(y[d]));
        })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text((d) => d.charAt(0).toUpperCase() + d.slice(1).replace(/-/g, " "))
        .call(
          d3
            .drag()
            .on("start", function (event, d) {
              if (isBrushing) return;
              dragging[d] = x(d);
            })
            .on("drag", function (event, d) {
              if (isBrushing) return;
              dragging[d] = Math.min(width, Math.max(0, event.x));
              dimensions.sort((a, b) => position(a) - position(b));
              x.domain(dimensions);
              g.attr("transform", (d) => `translate(${position(d)})`);
              svg.selectAll(".foreground path").attr("d", path);
            })
            .on("end", function (event, d) {
              if (isBrushing) return;
              delete dragging[d];
              d3.select(this.parentNode)
                .transition()
                .duration(500)
                .attr("transform", `translate(${x(d)})`);
              svg
                .selectAll(".foreground path")
                .transition()
                .duration(500)
                .attr("d", path);
            })
        );

      g.filter((d) => d === dim)
        .append("g")
        .attr("class", "brush")
        .each(function (d) {
          d3.select(this).call(brushes[d]);
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);
    });

    redrawLines();
  }

  function redrawLines() {
    svg.selectAll(".foreground path").remove();
    const foreground = svg
      .append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", (d) => color(d.make))
      .style("stroke-opacity", 0.3);
  }

  function path(d) {
    return d3.line()(dimensions.map((p) => [position(p), y[p](d[p])]));
  }

  function position(d) {
    var v = dragging[d];
    return v == null ? x(d) : v;
  }

  let visibleIndices = data.map((_, index) => index);

  let isBrushing = false;

  function brushstart() {
    isBrushing = true;
  }

  function brushend() {
    isBrushing = false;
  }

  function brush() {
    const actives = [];
    svg
      .selectAll(".brush")
      .filter(function (d) {
        return d3.brushSelection(this);
      })
      .each(function (d) {
        actives.push({
          dimension: d,
          extent: d3.brushSelection(this),
        });
      });

    brushstart();

    const filteredData = data.filter((d, index) => {
      const isInside = actives.every((active) => {
        const dim = active.dimension;
        const extent = active.extent;
        const scale = y[dim];
        const value = scale(dim === "make" ? d[dim] : d[dim]);
        return extent[0] <= value && value <= extent[1];
      });
      if (isInside) visibleIndices.push(index);
      return isInside;
    });

    visibleIndices = filteredData.map((d) => d.id);

    svg.selectAll(".foreground path").style("display", (d) => {
      return actives.every((active) => {
        const dim = active.dimension;
        const extent = active.extent;
        const scale = y[dim];
        const value = scale(dim === "make" ? d[dim] : d[dim]);
        return extent[0] <= value && value <= extent[1];
      })
        ? null
        : "none";
    });

    if (window.updateScatterFromBrush) {
      window.updateScatterFromBrush(filteredData);
    }
    if (window.updateDataTable) {
      window.updateDataTable(filteredData);
    }

    brushend();
  }

  window.highlightLine = function (id) {
    svg.selectAll(".foreground path").style("stroke-opacity", 0.05);

    svg
      .selectAll(".foreground path")
      .filter(function (d) {
        return d.id === parseInt(id);
      })
      .style("stroke-opacity", 1)
      .raise();
  };
  window.resetLines = function () {
    svg.selectAll(".foreground path").style("stroke-opacity", 0.3);
  };

  setupAxes();

  Object.keys(data[0]).forEach((key) => {
    const checkbox = document.getElementById(key);
    if (checkbox) {
      checkbox.addEventListener("change", setupAxes);
    }
  });
});
