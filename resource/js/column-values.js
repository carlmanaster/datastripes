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
      var i
      ,   result = [];
      
      for (i = 0; i < this.dataset.length; i++) 
        if (this.dataset[i].data[column] != null)
          result.push(this.dataset[i].data[column]);
      return result;
    },
  
    selected: function(column) {
      var i
      ,   result = [];
      
      for (i = 0; i < this.dataset.length; i++)
        if (this.dataset[i].selected == true && this.dataset[i].data[column] != null)
          result.push(this.dataset[i].data[column]);
      return result;
    }
  
  });

}(window.datastripes));
