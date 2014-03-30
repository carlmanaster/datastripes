(function (datastripes) {
  
  // Export "package"
  datastripes.Util = Util;

  // Constructor
  function Util() {
  }

  // Methods
  _.extend(Util.prototype, {
  
    instrumentDataset: function(dataset) {
      var row;
      for (row = 0; row < dataset.length; row++) {
        dataset[row] = {
          selected: false,
          index:    row,
          data:     dataset[row]
        };
      }
      return dataset;
    },
  
    sortByColumn: function(dataset, column) {
      dataset.sort(function(a, b) { 
        var valueA = a.data[column]
        ,   valueB = b.data[column];
        if (valueA === valueB) return a.index - b.index;
        if (valueA === null) return -1;
        if (valueB === null) return 1;
        return d3.ascending(valueA, valueB);
      });
  
      _.each(dataset, function(item, index) {item.index = index});
    }
  
  });

}(window.datastripes));