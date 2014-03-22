(function (datastripes) {
  
  // Export "package"
  datastripes.Draw = Draw;

  // Constructor
  function Draw(dataset, highlightPane, columns) {
    this.dataset       = dataset;
    this.highlightPane = highlightPane;
    this.columns       = columns;
  }

  // Methods
  _.extend(Draw.prototype, {
  
    drawSelection: function() {
      var x1    = 0
      ,   x2    = datastripes.COLUMN_WIDTH * this.columns.length
      ,   lines = this.highlightPane.selectAll("line")
                      .data(this.dataset);
      lines.enter()
         .append("line")
         .attr("class",   "highlight")
         .attr("x1",      x1)
         .attr("x2",      x2)
         .attr("y1",      function(a, i) { return datastripes.Y_MIN + i; })
         .attr("y2",      function(a, i) { return datastripes.Y_MIN + i; });
      lines.transition()
         .attr("stroke",  function(d)  { return d.selected == true ? datastripes.SELECTED_COLOR : datastripes.UNSELECTED_COLOR; })
         .attr("opacity", function(d)  { return d.selected == true ? 0.8 : 0; });
    }
  
  });

}(window.datastripes));