(function (datastripes) {
  
  // Export "package"
  datastripes.Geometry = Geometry;

  // Constructor
  function Geometry() {
  }

  // Methods
  _.extend(Geometry.prototype, {
    
    columnStart: function(index) {
      return datastripes.COLUMN_WIDTH * index;
    }
  
  });

}(window.datastripes));


  
