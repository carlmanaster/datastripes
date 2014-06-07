(function (datastripes) {
  
  // Export "package"
  datastripes.Panes = Panes;

  // Constructor
  function Panes(rowCount, columnCount) {
    this.rowCount    = rowCount;
    this.columnCount = columnCount;
  }

  // Methods
  _.extend(Panes.prototype, {
  
    root: function() {
      return d3.select("body")
               .append("svg")
               .attr("width",  this.columnCount * datastripes.COLUMN_WIDTH)
               .attr("height", this.rowCount + datastripes.Y_MIN);
    },
    
    highlightPane: function(root) {
      return root.append("svg")
    },
  
    columns: function(root) {
      return this.oneNewSvgPerColumn(root);
    },
    
    overviews: function(root) {
      return [this.oneNewSvgPerColumn(root), this.oneNewSvgPerColumn(root)];
    },

    oneNewSvgPerColumn: function(root) {
      // TODO: this should depend on the number of columns in the dataset
      return _.map(_.range(this.columnCount), function() {return root.append("svg");});
    }
  
  });

}(window.datastripes));