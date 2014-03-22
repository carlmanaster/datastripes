// v000: display numeric columns and sort
// v001: add transition
// v002: add null support
// v003: use d3js scales
// v004: stable sort
// v005: column headings
// v006: brushing
// v007: summary charts
// v008: summary chart brushing
// v009: open file

// example upload script: http://syntagmatic.github.io/parallel-coordinates/examples/upload.html

(function (datastripes) {

  var geometry      = new datastripes.Geometry()
  ,   util          = new datastripes.Util();
  
  var generator     = new datastripes.DataGenerator({
							rows    : datastripes.ROWS,
							columns : datastripes.COLUMNS
						  })
  ,   dataset       = generator.makeRandomCorrelatedDatasetWithNulls()
  ,   columnNames   = generator.makeColumnNames();

  var panes         = new datastripes.Panes(),
      root          = panes.root(),
      highlightPane = panes.highlightPane(root),
      columns       = panes.columns(root),
      overviews     = panes.overviews(root);

  var columnValues  = new datastripes.ColumnValues(dataset)
  ,   dataset       = util.instrumentDataset(dataset)
  ,   draw          = new datastripes.Draw(dataset, highlightPane, columns)
  ,   numericCharts = new datastripes.NumericCharts(dataset, columns, overviews)
  ,   brushes       = new datastripes.Brushes(dataset, draw);

  drawColumnHeaders();
  drawOverviews();
  makeOverviewBrushes();
  draw.drawSelection();
  drawLines();

  var y    = d3.scale.linear()
               .range([datastripes.HEIGHT + datastripes.Y_MIN, datastripes.Y_MIN])
               .domain([datastripes.HEIGHT, 0])
  ,  brush = brushes.makeDatasetBrush(y, drawOverviews)
  ,  g     = root.append("g")
                 .attr("opacity", 0)
                 .call(brush)
                 .selectAll("rect")
                 .attr("x", 0)
                 .attr("y", datastripes.Y_MIN)
                 .attr("width", columns.length * datastripes.COLUMN_WIDTH);

  function drawColumnHeaders() {
    var headers = root.selectAll("text")
                      .data(columnNames, function(d) {return d;});
    headers.enter()
           .append("text")
           .attr("x", function(a, i) { return geometry.columnStart(i); })
           .attr("y", datastripes.Y_HEADER)
           .text( function(d) { return d; })
           .style("cursor", "pointer")
           .on("click", function(d, i) {
              util.sortByColumn(dataset, i);
              drawLines();
              draw.drawSelection();
           });
  };

  function drawLines() {
    var i;
    for (i = 0; i < columns.length; i++)
      drawColumn(i);
  };

  function drawColumn(index) {
    numericCharts.drawColumn(index);
  };

  function drawOverviews() {
    var i;
    for (i = 0; i < columns.length; i++) {
      drawOverview(i, 0, columnValues.all(i), datastripes.Y_SUMMARY);
      drawOverview(i, 1, columnValues.selected(i), datastripes.Y_SELECTION_SUMMARY);
    }
  };

  function drawOverview(column, overviewIndex, histogramValues, y1) {
  	numericCharts.drawOverview(column, overviewIndex, histogramValues, y1);
  };

  function makeOverviewBrushes() {
    var i;
    for (i = 0; i < columns.length; i++) {
      brushes.makeTotalOverviewBrush(columnValues, overviews, i, datastripes.Y_SUMMARY, drawOverviews);
      brushes.makeSelectionOverviewBrush(columnValues, overviews, i, datastripes.Y_SELECTION_SUMMARY, drawOverviews);
    }
  }

}(window.datastripes));