(function (datastripes) {
  
  // Export "package"
  datastripes.Select = Select;

  // Constructor
  function Select(dataset) {
    this.dataset = dataset;
  }

  // Methods
  _.extend(Select.prototype, {
  
    clear: function() {
      _.each(this.dataset, function(item) {item.selected = false});
    },
  
    byIndex: function (min, max) {
      _.each(this.dataset, function(item, index) {item.selected = min <= index && index <= max});
    },
    
    byValue: function (column, min, max) {
      _.each(this.dataset, function(item) {item.selected = min <= item.data[column] && item.data[column] <= max});
    },
    
    selectedByValue: function(column, min, max) {
      _.each(this.dataset, function(item) {item.selected = item.selected  && min <= item.data[column] && item.data[column] <= max});
    }

  });

}(window.datastripes));