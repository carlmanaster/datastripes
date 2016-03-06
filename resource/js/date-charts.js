(function (datastripes) {

  // Export "package"
  datastripes.DateCharts = DateCharts;
  
  var math     = new datastripes.MathUtil();
  var geometry = new datastripes.Geometry();
  var Tooltip  = new datastripes.Tooltip();

  // Constructor
  function DateCharts(columnNames, dataset, columns, overviews, index) {
    this.columnNames  = columnNames;
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
  _.extend(DateCharts.prototype, {
  
    drawColumn: function() {
      var self   = this
      ,   index  = this.index
      ,   lines  = this.column.selectAll("line")
                              .data(this.dataset, function(d) { return d.data; });

      lines.enter()
           .append("line")
           .attr("stroke", function(a)  { return _.isNull(a.data[index]) ? datastripes.NULL_COLOR : 'blue'; })
           .attr("x1",     function(a)  { return _.isNull(a.data[index]) ? self.scale(self.extent[0]) : self.scale(a.data[index]) - 1; })
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

    formattedSd: function(statData) {
      if (statData.length <= 2) return '--';

      var sd = d3.deviation(statData).toFixed(0);
      var seconds = sd / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var months = days / 30;
      var years = days / 365;

      if (years > 1) return years.toFixed(1) + ' years';
      if (months > 1) return months.toFixed(1) + ' months';
      if (days > 1) return days.toFixed(1) + ' days';
      if (hours > 1) return hours.toFixed(1) + ' hours';
      if (minutes > 1) return minutes.toFixed(1) + ' minutes';
      if (seconds > 1) return seconds.toFixed(1) + ' seconds';
      return sd.toFixed(1) + ' ms';
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
          .attr("fill",   'lightblue');

      bars.transition()
          .attr("height", function(d) { return yscale(d.length); })
          .attr("y",      function(d) { return y2 - yscale(d.length); });

      var statData = histogramValues.length == 0 ? all : histogramValues;
      var mean     = d3.time.format("%x %X")(new Date(parseInt(d3.mean(statData).toFixed())));
      var sd       = this.formattedSd(statData)
      var name     = this.columnNames[this.index] + (overviewIndex == 0 ? ' overall' : ' selection');

      var html = '<strong>' + name + '</strong>' + '</br>'
                            + 'mean: ' + mean + '</br>'
                            + 'SD:   ' + sd   + '</br>';
      overview
        .on("mouseover", function(d) { Tooltip.show(html); })
        .on("mouseout", Tooltip.hide);

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
      ,   inRange    = isNaN(stat[0]) || Math.abs(d3.mean(all) - stat[0]) < d3.deviation(all);

      if (histogramValues.length === 0) return

      line.enter().append("line")
          .attr("y1",     y1)
          .attr("y2",     y2)
          .attr("stroke", datastripes.MEAN_COLOR);
      line.transition()
          .attr("x1",     self.scale)
          .attr("x2",     self.scale)
          .attr("stroke", function(d) { return inRange === true ? datastripes.MEAN_COLOR : datastripes.OUTLIER_MEAN_COLOR; }); 
    }
  
  });

}(window.datastripes));