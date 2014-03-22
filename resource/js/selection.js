(function (datastripes) {
  
  // Export "package"
  datastripes.Selection = Selection;

  // Constructor
  function Selection(dataset) {
    this.dataset = dataset;
  }

  // Methods
  _.extend(Selection.prototype, {

  clear: function() {
    var i;
    for (i = 0; i < this.dataset.length; i++) {
      this.dataset[i].selected = false;
    }
  },

  selectByIndex: function (min, max) {
    var i;
    for (i = 0; i < this.dataset.length; i++) {
      this.dataset[i].selected = min <= i && i <= max;
    }
  },
  
  selectByValue: function (column, min, max) {
    var i
    , value;
    for (i = 0; i < this.dataset.length; i++) {
      value = this.dataset[i].data[column];
      this.dataset[i].selected = min <= value && value <= max;
    }
  },
  
  selectSelectedByValue: function(column, min, max) {
    var i
    ,   value;
    for (i = 0; i < this.dataset.length; i++) {
      value = this.dataset[i].data[column];
      this.dataset[i].selected = this.dataset[i].selected  && min <= value && value <= max;
    }
  }


  });

}(window.datastripes));