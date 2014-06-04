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

  var generator     = new datastripes.DataGenerator({
							rows    : datastripes.ROWS,
							columns : datastripes.COLUMNS + 1
						  })
  ,   dataset       = generator.makeRandomCorrelatedDatasetWithNulls()
  ,   columnNames   = generator.makeColumnNames();

  init(dataset, columnNames);

  function init(dataset, columnNames) {
    var geometry      = new datastripes.Geometry()
    ,   util          = new datastripes.Util();
    this.classifier    = new datastripes.ColumnClassifier();
    
    var panes         = new datastripes.Panes();
    this.root          = panes.root();
    var highlightPane = panes.highlightPane(this.root);

    dataset = util.instrumentDataset(dataset);
    this.columns       = panes.columns(root);
    this.overviews     = panes.overviews(root);
    this.columnValues  = new datastripes.ColumnValues(dataset);
    this.charts        = makeCharts(dataset, overviews);

    var draw          = new datastripes.Draw(dataset, highlightPane, this.columns);
    this.brushes       = new datastripes.Brushes(dataset, draw);

    drawColumnHeaders(draw, columnNames, geometry, util);
    drawOverviews();
    makeOverviewBrushes();
    draw.drawSelection();
    drawLines();
    makeRootGraphic();
  }

  function makeRootGraphic() {
    var y    = d3.scale.linear()
                 .range([datastripes.HEIGHT + datastripes.Y_MIN, datastripes.Y_MIN])
                 .domain([datastripes.HEIGHT, 0])
    ,  brush = this.brushes.makeDatasetBrush(y, drawOverviews);
    
    this.root.append("g")
             .attr("opacity", 0)
             .call(brush)
             .selectAll("rect")
             .attr("x", 0)
             .attr("y", datastripes.Y_MIN)
             .attr("width", this.columns.length * datastripes.COLUMN_WIDTH);
  }

  function makeCharts(dataset, overviews) {
    return _.map(_.range(this.columns.length), function(i) {
      var values = _.map(dataset, function(item) {return item.data[i];});

      switch (this.classifier.classify(values)) {
        case "numeric" : return new datastripes.NumericCharts(dataset, this.columns, overviews, i);
        case "ordinal" : return new datastripes.OrdinalCharts(dataset, this.columns, overviews, i);
      }
    });
  }

  function drawColumnHeaders(draw, columnNames, geometry, util) {
    var headers = this.root.selectAll("text")
                      .data(columnNames, function(d) { return d; });
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
    _.each(_.range(this.columns.length), drawColumn);
  };

  function drawColumn(index) {
    this.charts[index].drawColumn();
  };

  function drawOverviews() {
    _.each(_.range(this.columns.length), function(i) {drawOverviewBrushes(i);});
  };

  function drawOverviewBrushes(index) {
    var all      = this.columnValues.all(index)
    ,   selected = this.columnValues.selected(index);

    drawOverview(index, 0, all,      datastripes.Y_SUMMARY);
    drawOverview(index, 1, selected, datastripes.Y_SELECTION_SUMMARY);
  };

  function drawOverview(index, overviewIndex, histogramValues, y1) {
  	this.charts[index].drawOverview(overviewIndex, histogramValues, y1);
  };

  function makeOverviewBrushes() {
    _.each(_.range(this.columns.length), function(i) {makeBothOverviewBrushes(i);});
  };

  function makeBothOverviewBrushes(index) {
    var all      = this.columnValues.all(index)
    ,   selected = this.columnValues.selected(index);

    switch (this.classifier.classify(all)) {
      case "numeric" : 
        this.brushes.makeTotalOverviewNumericBrush    (this.columnValues, overviews, index, datastripes.Y_SUMMARY, drawOverviews);
        this.brushes.makeSelectionOverviewNumericBrush(this.columnValues, overviews, index, datastripes.Y_SELECTION_SUMMARY, drawOverviews);
        break;
      case "ordinal" : 
        this.brushes.makeTotalOverviewOrdinalBrush    (this.columnValues, overviews, index, datastripes.Y_SUMMARY, drawOverviews);
        this.brushes.makeSelectionOverviewOrdinalBrush(this.columnValues, overviews, index, datastripes.Y_SELECTION_SUMMARY, drawOverviews);
        break;
    }
  }

}(window.datastripes));