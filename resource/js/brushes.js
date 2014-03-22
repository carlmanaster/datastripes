(function (datastripes) {
  
  // Export "package"
  datastripes.Brushes = Brushes;

  // Constructor
  function Brushes(dataset, draw) {
    this.select = new datastripes.Select(dataset)
    this.draw   = draw;
  };

  var geometry = new datastripes.Geometry();
  var snap     = new datastripes.Snap();

  // Methods
  _.extend(Brushes.prototype, {
  
    brushStart: function() {
      this.select.clear();
      this.draw.drawSelection();
    },
    
    brushing: function(brush) {
      var top    = brush.extent()[0]
      ,   bottom = brush.extent()[1];
      
      this.select.byIndex(top, bottom);
      this.draw.drawSelection();
    },
    
    brushEnd: function(brush, drawOverviews) {
      this.brushing(brush);
      drawOverviews();
    },
    
    totalOverviewBrushing: function(column, brush, domain, drawOverviews) {
      var extent = brush.extent()
      ,   min    = snap.toBinStart(extent[0], domain)
      ,   max    = snap.toBinEnd(extent[1], domain);
      
      this.select.byValue(column, min, max);
      this.draw.drawSelection();
      drawOverviews();
    },
    
    totalOverviewBrushEnd: function (column, brush, domain, overviewIndex, overviews, drawOverviews) {
      var overview  = overviews[overviewIndex][column];
      this.totalOverviewBrushing(column, brush, domain, drawOverviews);
      overview.selectAll(".brush").call(brush.clear());        
    },
  
    selectionOverviewBrushEnd: function (column, brush, domain, overviewIndex, overviews, drawOverviews) {
      var overview  = overviews[overviewIndex][column]
      ,   extent    = brush.extent()
      ,   min       = snap.toBinStart(extent[0], domain)
      ,   max       = snap.toBinEnd(extent[1], domain);
      
      this.select.selectedByValue(column, min, max);
      this.draw.drawSelection();
      drawOverviews();
      overview.selectAll(".brush").call(brush.clear());        
    },
    
    makeDatasetBrush: function(y, drawOverviews) {
      var self   = this    
      ,   brush = d3.svg.brush().y(y)
                        .on("brushstart", function() { self.brushStart(); })
                        .on("brush",      function() { self.brushing(brush); })
                        .on("brushend",   function() { self.brushEnd(brush, drawOverviews); });
      return brush;
    },
    
    makeTotalOverviewBrush: function (columnValues, overviews, column, y1, drawOverviews) {
      var self     = this
      ,   all      = columnValues.all(column)
      ,   domain   = d3.extent(all)
      ,   overview = overviews[0][column]
      ,   x1       = geometry.columnStart(column)
      ,   x2       = x1 + datastripes.COLUMN_WIDTH
      ,   x        = d3.scale.linear()
                       .range([x1, x2])
                       .domain(domain)
      ,   brush    = d3.svg.brush().x(x)
                       .on("brushstart", function() { self.brushStart(); })
                       .on("brush",      function() { self.totalOverviewBrushing(column, brush, domain, drawOverviews); })
                       .on("brushend",   function() { self.totalOverviewBrushEnd(column, brush, domain, 0, overviews, drawOverviews); })
      ,   g        = overview.append("g")
                             .attr("class", "brush")
                             .attr("opacity", 0)
                             .call(brush)
                             .selectAll("rect")
                             .attr("x", x1)
                             .attr("y", y1)
                             .attr("width", datastripes.COLUMN_WIDTH)
                             .attr("height", datastripes.SUMMARY_HEIGHT);
      overview.selectAll(".brush").call(brush.clear());
    },
    
    makeSelectionOverviewBrush: function(columnValues, overviews, column, y1, drawOverviews) {
      var self     = this
      ,   all      = columnValues.all(column)
      ,   domain   = d3.extent(all)
      ,   overview = overviews[1][column]
      ,   x1       = geometry.columnStart(column)
      ,   x2       = x1 + datastripes.COLUMN_WIDTH
      ,   x        = d3.scale.linear()
                       .range([x1, x2])
                       .domain(domain)
      ,   brush    = d3.svg.brush().x(x)
                       .on("brushend", function() { self.selectionOverviewBrushEnd(column, brush, domain, 1, overviews, drawOverviews); })
      ,   g        = overview.append("g")
                             .attr("class", "brush")
                             .attr("opacity", 0)
                             .call(brush)
                             .selectAll("rect")
                             .attr("x", x1)
                             .attr("y", y1)
                             .attr("width", datastripes.COLUMN_WIDTH)
                             .attr("height", datastripes.SUMMARY_HEIGHT);
      overview.selectAll(".brush").call(brush.clear());        
    }
  
  });

}(window.datastripes));