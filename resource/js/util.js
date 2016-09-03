(function (datastripes) {

  // Export "package"
  datastripes.Util = Util;

  // Constructor
  function Util() {
  }

  // Methods
  _.extend(Util.prototype, {

    transformDataset: function(dataset) {
      // coerce columns which are all 1 or 0 to boolean
      for (let i = 0; i < dataset[0].length; i++) {
        let shouldBeBool = true
        for (let j = 0; j < dataset.length; j++) {
          let value = dataset[j][i]
          if (!(_.isNull(value) || value === undefined || value === 0 || value === 1)) {
            shouldBeBool = false
            break
          }
        }
        if (shouldBeBool) {
          for (let j = 0; j < dataset.length; j++) {
            let value = dataset[j][i]
            dataset[j][i] = value === 1
          }
        }
      }
      return dataset;
    },

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
