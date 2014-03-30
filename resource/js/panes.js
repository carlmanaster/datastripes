(function (datastripes) {
  
  // Export "package"
  datastripes.Panes = Panes;

  // Constructor
  function Panes() {
  }

  // Methods
  _.extend(Panes.prototype, {
  
    root: function() {
      return d3.select("body")
               .append("svg")
               .attr("width", datastripes.WIDTH)
               .attr("height", datastripes.HEIGHT);
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
      return _.map(_.range(datastripes.COLUMNS), function() {return root.append("svg");});
    }
  
  });

}(window.datastripes));