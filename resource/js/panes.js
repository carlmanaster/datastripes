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
      var i
      ,   columns = [];
  
      for (i = 0; i < datastripes.COLUMNS; i ++) {
        columns[i] = root.append("svg");
      }
      return columns;
    },
    
    overviews: function(root) {
      var i
      ,   overviews = [];
  
      overviews[0] = [];
      overviews[1] = [];
      for (i = 0; i < datastripes.COLUMNS; i ++) {
        overviews[0][i] = root.append("svg");
        overviews[1][i] = root.append("svg");
      }
      return overviews;
    }
  
  });

}(window.datastripes));