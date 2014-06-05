(function (datastripes) {
  
  // Export "package"
  datastripes.DatastripesChart = DatastripesChart;

  // Constructor
  function DatastripesChart() {
  }

  // Methods
  _.extend(DatastripesChart.prototype, {
  
  init: function(dataset, columnNames) {
    var geometry       = new datastripes.Geometry()
    ,   util           = new datastripes.Util();
    this.classifier    = new datastripes.ColumnClassifier();
    
    var panes          = new datastripes.Panes();
    this.root          = panes.root();
    var highlightPane  = panes.highlightPane(this.root);

    dataset = util.instrumentDataset(dataset);
    this.columns       = panes.columns(this.root);
    this.overviews     = panes.overviews(this.root);
    this.columnValues  = new datastripes.ColumnValues(dataset);
    this.charts        = this.makeCharts(dataset, this.overviews);

    var draw           = new datastripes.Draw(dataset, highlightPane, this.columns);
    this.brushes       = new datastripes.Brushes(dataset, draw);

    this.drawColumnHeaders(draw, columnNames, geometry, util, dataset);
    this.drawOverviews();
    this.makeOverviewBrushes();
    draw.drawSelection();
    this.drawLines();
    this.makeRootGraphic();
  },

  makeRootGraphic: function() {
    var y    = d3.scale.linear()
                 .range([datastripes.HEIGHT + datastripes.Y_MIN, datastripes.Y_MIN])
                 .domain([datastripes.HEIGHT, 0])
    ,  brush = this.brushes.makeDatasetBrush(y, this.drawOverviews);
    
    this.root.append("g")
             .attr("opacity", 0)
             .call(brush)
             .selectAll("rect")
             .attr("x", 0)
             .attr("y", datastripes.Y_MIN)
             .attr("width", this.columns.length * datastripes.COLUMN_WIDTH);
  },

  makeCharts: function(dataset, overviews) {
    var self = this;
    return _.map(_.range(self.columns.length), function(i) {
      var values = _.map(dataset, function(item) {return item.data[i];});

      switch (self.classifier.classify(values)) {
        case "numeric" : return new datastripes.NumericCharts(dataset, self.columns, overviews, i);
        case "ordinal" : return new datastripes.OrdinalCharts(dataset, self.columns, overviews, i);
      }
    });
  },

  drawColumnHeaders: function(draw, columnNames, geometry, util, dataset) {
    var self    = this
    ,   headers = self.root.selectAll("text")
                      .data(columnNames, function(d) { return d; });
    headers.enter()
           .append("text")
           .attr("x", function(a, i) { return geometry.columnStart(i); })
           .attr("y", datastripes.Y_HEADER)
           .text( function(d) { return d; })
           .style("cursor", "pointer")
           .on("click", function(d, i) {
              util.sortByColumn(dataset, i);
              self.drawLines();
              draw.drawSelection();
           });
  },

  drawLines: function() {
    var self = this;
    _.each(_.range(self.columns.length), function(i) {self.drawColumn(i);});
  },

  drawColumn: function(index) {
    this.charts[index].drawColumn();
  },

  drawOverviews: function() {
    var self = this;
    _.each(_.range(self.columns.length), function(i) {self.drawOverviewBrushes(i);});
  },

  drawOverviewBrushes: function(index) {
    var self     = this
    ,   all      = self.columnValues.all(index)
    ,   selected = self.columnValues.selected(index);

    self.drawOverview(index, 0, all,      datastripes.Y_SUMMARY);
    self.drawOverview(index, 1, selected, datastripes.Y_SELECTION_SUMMARY);
  },

  drawOverview: function(index, overviewIndex, histogramValues, y1) {
    this.charts[index].drawOverview(overviewIndex, histogramValues, y1);
  },

  makeOverviewBrushes: function() {
    var self = this;

    _.each(_.range(this.columns.length), function(i) {self.makeBothOverviewBrushes(i);});
  },

  makeBothOverviewBrushes: function(index) {
    var self     = this
    ,   all      = self.columnValues.all(index)
    ,   selected = self.columnValues.selected(index);

    switch (self.classifier.classify(all)) {
      case "numeric" : 
        self.brushes.makeTotalOverviewNumericBrush    
          (self.columnValues, self.overviews, index, datastripes.Y_SUMMARY, function() {self.drawOverviews();});
        self.brushes.makeSelectionOverviewNumericBrush
          (self.columnValues, self.overviews, index, datastripes.Y_SELECTION_SUMMARY, function() {self.drawOverviews();});
        break;
      case "ordinal" : 
        self.brushes.makeTotalOverviewOrdinalBrush    
          (self.columnValues, self.overviews, index, datastripes.Y_SUMMARY, function() {self.drawOverviews();});
        self.brushes.makeSelectionOverviewOrdinalBrush
          (self.columnValues, self.overviews, index, datastripes.Y_SELECTION_SUMMARY, function() {self.drawOverviews();});
        break;
    }
  }

  });

}(window.datastripes));