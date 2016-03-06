(function (datastripes) {

  // Export "package"
  datastripes.BooleanCharts = BooleanCharts;
  
  var math     = new datastripes.MathUtil();
  var geometry = new datastripes.Geometry();
  var Tooltip  = new datastripes.Tooltip();

  // Constructor
  function BooleanCharts(columnNames, dataset, columns, overviews, index) {
    this.columnNames  = columnNames;
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
                                .rangeRoundBands([this.x1, this.x2], 0.3, 0.9);
    this.overviewScale = d3.scale.linear()
                          .domain([0, 1])
                          .range([this.x1, this.x1 + datastripes.COLUMN_WIDTH]);
  }

  // Methods
  _.extend(BooleanCharts.prototype, {
  
    booleanColor: function(b) {
      if (_.isNull(b)) return datastripes.NULL_COLOR;
      return b === 'true' ? datastripes.TRUE_COLOR : datastripes.FALSE_COLOR;
    },

    drawColumn: function() {
      var self   = this
      ,   lines  = this.column.selectAll("line")
                              .data(this.dataset, function(d) { return d.data; });
      lines.enter()
           .append("line")
           .attr("stroke", function(a)  { return self.booleanColor(a.data[self.index]); })
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
      values.forEach(    function(k) {map[k]++; } );
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

      var name = this.columnNames[this.index] + (overviewIndex == 0 ? ' overall' : ' selection');
      var html = '<strong>' + name + '</strong>' + '</br>';
      var sum = 0;
      var i;
      freq.forEach( function(f) {sum += f;} );
      for (i = 0; i < this.keys.length; i++) {
        if (this.keys[i] !== 'true') continue;
        html +=  Math.round(100 * freq[i] / sum) + '% ' + this.keys[i] + '</br>'
      }

      overview
        .on("mouseover", function(d) { Tooltip.show(html); })
        .on("mouseout", Tooltip.hide);

      this.drawMean(overview, histogramValues, y1);
    },
  
    drawMean: function(overview, histogramValues, y1) {
      var self       = this
      ,   all        = this.columnValues.all(this.index)
      ,   statData   = histogramValues.length == 0 ? all : histogramValues
      ,   freq       = this.frequencies(histogramValues)
      ,   percent_true = freq[1] / (freq[0] + freq[1])
      ,   stat       = [_.isNaN(percent_true) ? 0 : percent_true]
      ,   y2         = y1 + datastripes.SUMMARY_HEIGHT
      ,   line       = overview.selectAll("line")
                               .data(stat);

      if (histogramValues.length === 0) return

      var x = self.overviewScale;

      line.enter().append("line")
          .attr("y1",     y1)
          .attr("y2",     y2)
          .attr("stroke", 'black');
      line.transition()
          .attr("x1",     x)
          .attr("x2",     x);
    }

  });

}(window.datastripes));