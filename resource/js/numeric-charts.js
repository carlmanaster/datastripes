(function (datastripes) {

  // Export "package"
  datastripes.NumericCharts = NumericCharts;
  
  var math     = new datastripes.MathUtil();
  var geometry = new datastripes.Geometry();

  // Constructor
  function NumericCharts(dataset, columns, overviews, index) {
    this.dataset      = dataset;
    this.column       = columns[index];
    this.overviews    = overviews;
    this.index        = index;
    this.columnValues = new datastripes.ColumnValues(dataset);
    this.x1           = geometry.columnStart(index)
    this.extent       = d3.extent(this.dataset, function(a) { return a.data[index]; })
    this.scale        = d3.scale.linear()
                          .domain(this.extent)
                          .range([this.x1, this.x1 + datastripes.COLUMN_WIDTH]);
  }

  // Methods
  _.extend(NumericCharts.prototype, {
  
    drawColumn: function() {
      var self   = this
      ,   index  = this.index
      ,   lines  = this.column.selectAll("line")
                              .data(this.dataset, function(d) { return d.data; });

      lines.enter()
           .append("line")
           .attr("stroke", function(a)  { return _.isNull(a.data[index]) ? datastripes.NULL_COLOR : datastripes.BAR_COLOR; })
           .attr("x1",     self.scale(self.extent[0]))
           .attr("x2",     function(a)  { return _.isNull(a.data[index]) ? self.scale(self.extent[1]) : self.scale(a.data[index]); });
  
      lines.transition()
           .duration(datastripes.SORT_ANIMATION_DURATION)
           .attr("y1", function(a, i) { return datastripes.Y_MIN + i; })
           .attr("y2", function(a, i) { return datastripes.Y_MIN + i; });
    },
    
    histogramChart: function(all, values) {
      return d3.layout.histogram()
               .bins(datastripes.HISTOGRAM_BINS)
               .range(d3.extent(all))
               .frequency(true)
               (values)
    },
  
    drawOverview: function(overviewIndex, histogramValues, y1) {
      var self       = this
      ,   all        = this.columnValues.all(this.index)
      ,   all_hist   = this.histogramChart(all, all)
      ,   histogram  = this.histogramChart(all, histogramValues)
      ,   y2         = y1 + datastripes.SUMMARY_HEIGHT
      ,   extent     = d3.extent(all_hist, function(d) { return d.y; })
      ,   yscale     = d3.scale.linear()
                         .domain([0, extent[1]])
                         .range([0, datastripes.SUMMARY_HEIGHT])
      ,   overview   = this.overviews[overviewIndex][this.index]
      ,   barWidth   = (datastripes.COLUMN_WIDTH - 1) / datastripes.HISTOGRAM_BINS
      ,   bars       = overview.selectAll("rect")
                               .data(histogram);      
      bars.enter().append("rect")
          .attr("x",      function(d, i) { return self.x1 + i * barWidth; })
          .attr("width",  barWidth)
          .attr("fill",   datastripes.HISTOGRAM_COLOR);
      bars.transition()
          .attr("height", function(d) { return yscale(d.length); })
          .attr("y",      function(d) { return y2 - yscale(d.length); })
      this.drawMean(overview, histogramValues, y1);
    },
  
    drawMean: function(overview, histogramValues, y1) {
      var self       = this
      ,   all        = this.columnValues.all(this.index)
      ,   statData   = histogramValues.length == 0 ? all : histogramValues
      ,   stat       = [d3.mean(statData)]
      ,   y2         = y1 + datastripes.SUMMARY_HEIGHT
      ,   line       = overview.selectAll("line")
                               .data(stat)
      ,   inRange    = isNaN(stat[0]) || Math.abs(d3.mean(all) - stat[0]) < math.standardDeviation(all);
      line.enter().append("line")
          .attr("y1",     y1)
          .attr("y2",     y2)
          .attr("stroke", datastripes.MEAN_COLOR);
      line.transition()
          .attr("x1",     function(d) { return self.scale(d); })
          .attr("x2",     function(d) { return self.scale(d); })
          .attr("stroke", function(d) { return inRange == true ? datastripes.MEAN_COLOR : datastripes.OUTLIER_MEAN_COLOR; }); 
    }
  
  });

}(window.datastripes));