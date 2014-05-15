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
    this.all          = this.columnValues.all(this.index);
    this.keys         = this.columnValues.keys(this.index);
    this.scale        = d3.scale.ordinal()
                                .domain(this.keys)
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
    
    frequencies: function(values) {
      var map = {}
      ,   result = []
      ,   i;
      this.keys.forEach( function(k) {map[k] = 0;} );
      values.forEach(      function(k) {map[k]++; } );
      for (i = 0; i < this.keys.length; i++) {
        result[i] = map[this.keys[i]];
      }
      return result;
    },
  
    drawOverview: function(overviewIndex, histogramValues, y1) {
      var self       = this
      ,   all        = this.all
      ,   all_freq   = this.frequencies(all)
      ,   freq       = this.frequencies(histogramValues)
      ,   y2         = y1 + datastripes.SUMMARY_HEIGHT
      ,   yscale     = d3.scale.linear()
                         .domain([0, d3.max(all_freq)])
                         .range([0, datastripes.SUMMARY_HEIGHT])
      ,   overview   = this.overviews[overviewIndex][this.index]
      ,   barWidth   = this.scale.rangeBand()
      ,   bars       = overview.selectAll("rect")
                               .data(freq);      
      bars.enter().append("rect")
          .attr("x",      function(d, i) { return self.scale(self.keys[i]); })
          .attr("width",  barWidth)
          .attr("fill",   datastripes.HISTOGRAM_COLOR);
      bars.transition()
          .attr("height", function(d) { return yscale(d); })
          .attr("y",      function(d) { return y2 - yscale(d); })
    }
  
  });

}(window.datastripes));