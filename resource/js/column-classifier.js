(function (datastripes) {
  
  // Export "package"
  datastripes.ColumnClassifier = ColumnClassifier;

  // Constructor
  function ColumnClassifier() {
  }

  // Methods
  _.extend(ColumnClassifier.prototype, {
  
    classify: function(columnData) {
      return _.some(columnData, function(a) {return !_.isNumber(a) && !_.isNull(a);}) ? "ordinal" : "numeric";
    }
  
  });

}(window.datastripes));