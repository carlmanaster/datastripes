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
      var i;
      for (i = 0; i < this.dataset.length; i++) {
        this.dataset[i].selected = false;
      }
    },
  
    byIndex: function (min, max) {
      var i;
      for (i = 0; i < this.dataset.length; i++) {
        this.dataset[i].selected = min <= i && i <= max;
      }
    },
    
    byValue: function (column, min, max) {
      var i
      , value;
      for (i = 0; i < this.dataset.length; i++) {
        value = this.dataset[i].data[column];
        this.dataset[i].selected = min <= value && value <= max;
      }
    },
    
    selectedByValue: function(column, min, max) {
      var i
      ,   value;
      for (i = 0; i < this.dataset.length; i++) {
        value = this.dataset[i].data[column];
        this.dataset[i].selected = this.dataset[i].selected  && min <= value && value <= max;
      }
    }

  });

}(window.datastripes));