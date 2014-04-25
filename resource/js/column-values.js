(function (datastripes) {
  
  // Export "package"
  datastripes.ColumnValues = ColumnValues;

  // Constructor
  function ColumnValues(dataset) {
    this.dataset = dataset;
  }

  // Methods
  _.extend(ColumnValues.prototype, {
  
    all: function(column) {
      var result = _.map(this.dataset, function(item) {return item.data[column];});
      return this.nonNull(result);
    },
  
    selected: function(column) {
      var result = _.map(this.dataset, function(item) {return item.selected ? item.data[column] : null;});
      return this.nonNull(result);
    },

    nonNull: function(values) {
      return _.filter(values, function(value) {return !_.isNull(value);});
    }
  
  });

}(window.datastripes));
