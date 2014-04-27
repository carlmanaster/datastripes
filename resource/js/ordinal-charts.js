(function (datastripes) {

  // Export "package"
  datastripes.OrdinalCharts = OrdinalCharts;
  
  var math     = new datastripes.MathUtil();
  var geometry = new datastripes.Geometry();

  // Constructor
  function OrdinalCharts(dataset, columns, overviews, index) {
    this.dataset      = dataset;
    this.column       = columns[index];
    this.overviews    = overviews;
    this.index        = index;
    this.columnValues = new datastripes.ColumnValues(dataset);
    this.x1           = geometry.columnStart(this.index);
    this.x2           = this.x1 + datastripes.COLUMN_WIDTH;
    this.extent       = d3.extent(this.dataset, function(a) { return a.data[this.index]; });
    this.all          = this.columnValues.all(this.index);

    this.scale        = d3.scale.ordinal()
                                .domain(_.uniq(this.all).sort())
                                .rangeRoundBands([this.x1, this.x2], 0.05, 0.05);
  }

  // Methods
  _.extend(OrdinalCharts.prototype, {
  
    drawColumn: function() {
      var self   = this
      ,   lines  = this.column.selectAll("line")
                              .data(this.dataset, function(d) { return d.data; });
      lines.enter()
           .append("line")
           .attr("stroke", function(a)  { return _.isNull(a.data[self.index]) ? datastripes.NULL_COLOR : datastripes.BAR_COLOR; })
           .attr("x1",     function(a)  { return _.isNull(a.data[self.index]) ? self.x1                : self.scale(a.data[self.index]); })
           .attr("x2",     function(a)  { return _.isNull(a.data[self.index]) ? self.x2                : self.scale(a.data[self.index]) + self.scale.rangeBand(); });
  
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
      var all        = this.columnValues.all(this.index)
      ,   all_hist   = this.histogramChart(all, all)
      ,   histogram  = this.histogramChart(all, histogramValues)
      ,   x1         = geometry.columnStart(this.index)
      ,   x2         = x1 + datastripes.COLUMN_WIDTH
      ,   y2         = y1 + datastripes.SUMMARY_HEIGHT
      ,   extent     = d3.extent(all_hist, function(d) { return d.y; })
      ,   scale      = d3.scale.linear()
                         .domain([0, extent[1]])
                         .range([0, datastripes.SUMMARY_HEIGHT])
      ,   overview   = this.overviews[overviewIndex][this.index]
      ,   barWidth   = (datastripes.COLUMN_WIDTH - 1) / datastripes.HISTOGRAM_BINS
      ,   bars       = overview.selectAll("rect")
                               .data(histogram)
      ,   statData   = histogramValues.length == 0 ? all : histogramValues
      ,   stat       = [d3.mean(statData)]
      ,   xScale     = d3.scale.linear()
                         .domain(d3.extent(all))
                         .range([x1, x2])
      ,   line       = overview.selectAll("line")
                               .data(stat)
      ,   inRange    = isNaN(stat[0]) || Math.abs(d3.mean(all) - stat[0]) < math.standardDeviation(all);
      
      // bars.enter().append("rect")
      //     .attr("x",      function(d, i) { return x1 + i * barWidth; })
      //     .attr("width",  barWidth)
      //     .attr("fill",   datastripes.HISTOGRAM_COLOR);
      // bars.transition()
      //     .attr("height", function(d) { return scale(d.length); })
      //     .attr("y",      function(d) { return y2 - scale(d.length); })
      // line.enter().append("line")
      //     .attr("y1",     y1)
      //     .attr("y2",     y2)
      //     .attr("stroke", datastripes.MEAN_COLOR);
      // line.transition()
      //     .attr("x1",     function(d) { return xScale(d); })
      //     .attr("x2",     function(d) { return xScale(d); })
      //     .attr("stroke", function(d) { return inRange == true ? datastripes.MEAN_COLOR : datastripes.OUTLIER_MEAN_COLOR; }); 
    }
  
  });

}(window.datastripes));