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
      var overview = overviews[overviewIndex][column]
      ,   extent   = brush.extent()
      ,   min      = snap.toBinStart(extent[0], domain)
      ,   max      = snap.toBinEnd(extent[1], domain);
      
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

    makeOverviewXScale: function(domain, column) {
      var x1 = geometry.columnStart(column)
      ,   x2 = x1 + datastripes.COLUMN_WIDTH
      return d3.scale.linear()
               .range([x1, x2])
               .domain(domain);
    },

    makeGraphic: function(overview, brush, x1, y1) {
      return overview.append("g")
                    .attr("class", "brush")
                    .attr("opacity", 0)
                    .call(brush)
                    .selectAll("rect")
                    .attr("x", x1)
                    .attr("y", y1)
                    .attr("width", datastripes.COLUMN_WIDTH)
                    .attr("height", datastripes.SUMMARY_HEIGHT);
    },
    
    makeTotalOverviewNumericBrush: function (columnValues, overviews, column, y1, drawOverviews) {
      var self     = this
      ,   domain   = d3.extent(columnValues.all(column))
      ,   overview = overviews[0][column]
      ,   x1       = geometry.columnStart(column)
      ,   xScale   = this.makeOverviewXScale(domain, column)
      ,   brush    = d3.svg.brush().x(xScale)
                       .on("brushstart", function() { self.brushStart(); })
                       .on("brush",      function() { self.totalOverviewBrushing(column, brush, domain, drawOverviews); })
                       .on("brushend",   function() { self.totalOverviewBrushEnd(column, brush, domain, 0, overviews, drawOverviews); });
      this.makeGraphic(overview, brush, x1, y1);
      overview.selectAll(".brush").call(brush.clear());
    },
    
    makeSelectionOverviewNumericBrush: function(columnValues, overviews, column, y1, drawOverviews) {
      var self     = this
      ,   domain   = d3.extent(columnValues.all(column))
      ,   overview = overviews[1][column]
      ,   x1       = geometry.columnStart(column)
      ,   xScale   = this.makeOverviewXScale(domain, column)
      ,   brush    = d3.svg.brush().x(xScale)
                       .on("brushend", function() { self.selectionOverviewBrushEnd(column, brush, domain, 1, overviews, drawOverviews); });
      this.makeGraphic(overview, brush, x1, y1);
      overview.selectAll(".brush").call(brush.clear());        
    },
  
    makeTotalOverviewOrdinalBrush: function (columnValues, overviews, column, y1, drawOverviews) {
      var self     = this
      ,   domain   = d3.extent(columnValues.all(column))
      ,   overview = overviews[0][column]
      ,   x1       = geometry.columnStart(column)
      ,   xScale   = this.makeOrdinalOverviewXScale(domain, column)
      ,   brush    = d3.svg.brush().x(xScale)
                       .on("brushstart", function() { self.brushStart(); })
                       .on("brush",      function() { self.totalOrdinalOverviewBrushing(columnValues, column, brush, drawOverviews); })
                       .on("brushend",   function() { self.totalOrdinalOverviewBrushEnd(columnValues, column, brush, 0, overviews, drawOverviews); });
      this.makeGraphic(overview, brush, x1, y1);
      overview.selectAll(".brush").call(brush.clear());
    },
    
    makeSelectionOverviewOrdinalBrush: function(columnValues, overviews, column, y1, drawOverviews) {
      var self     = this
      ,   domain   = d3.extent(columnValues.all(column))
      ,   overview = overviews[1][column]
      ,   x1       = geometry.columnStart(column)
      ,   xScale   = this.makeOrdinalOverviewXScale(domain, column)
      ,   brush    = d3.svg.brush().x(xScale)
                       .on("brushend", function() { self.selectionOrdinalOverviewBrushEnd(columnValues, column, brush, 1, overviews, drawOverviews); });
      this.makeGraphic(overview, brush, x1, y1);
      overview.selectAll(".brush").call(brush.clear());        
    },

    makeOrdinalOverviewXScale: function(domain, column) {
      var x1    = geometry.columnStart(column)
      ,   x2    = x1 + datastripes.COLUMN_WIDTH
      ,   scale = d3.scale.ordinal()
                    .domain(domain)
                    .rangeRoundBands([x1, x2], 0.05, 0.05);
      return scale;
    },

    selectionOrdinalOverviewBrushEnd: function (columnValues, column, brush, overviewIndex, overviews, drawOverviews) {
      var overview  = overviews[overviewIndex][column]
      ,   bounds    = this.getOrdinalBounds(column, columnValues);
      
      this.select.selectedByValue(column, bounds[0], bounds[1]);
      this.draw.drawSelection();
      drawOverviews();
      overview.selectAll(".brush").call(brush.clear());        
    },

    totalOrdinalOverviewBrushing: function(columnValues, column, brush, drawOverviews) {
      var extent = brush.extent()
      ,   bounds = this.getOrdinalBounds(column, columnValues);
      
      this.select.byValue(column, bounds[0], bounds[1]);
      this.draw.drawSelection();
      drawOverviews();
    },
    
    totalOrdinalOverviewBrushEnd: function (columnValues, column, brush, overviewIndex, overviews, drawOverviews) {
      var overview = overviews[overviewIndex][column]
      ,   bounds   = this.getOrdinalBounds(column, columnValues);
      
      this.select.byValue(column, bounds[0], bounds[1]);
      this.draw.drawSelection();
      drawOverviews();
      overview.selectAll(".brush").call(brush.clear());        
    },
  
    getOrdinalBounds: function(column, columnValues) {
      var extent = d3.event.target.extent()
      ,   x1     = geometry.columnStart(column)
      ,   x2     = x1 + datastripes.COLUMN_WIDTH
      ,   keys   = _.uniq(columnValues.all(column)).sort()
      ,   key1   = keys[Math.floor(keys.length * (extent[0] - x1) / (x2 - x1))]
      ,   key2   = keys[Math.floor(keys.length * (extent[1] - x1) / (x2 - x1))]

      return [key1, key2];
    }

  });

}(window.datastripes));