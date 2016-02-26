(function (datastripes) {
  
  // Export "package"
  datastripes.ColumnClassifier = ColumnClassifier;

  // Constructor
  function ColumnClassifier() {
  }

  // Methods
  _.extend(ColumnClassifier.prototype, {
  
    // for future reference, _ includes also isDate() and isBoolean().
    // if all are number or null, 'numeric'
    // if all are date or null, 'date'
    // if all are bool or null, 'boolean'
    // else 'ordinal'
    // Might benefit by filtering out the nulls
    // Or could be a more explicit loop, ruling out until done
    classify: function(columnData) {
      var isNumber = _.every(columnData, function(a) {return _.isNull(a) || _.isNumber(a);});
      if (isNumber) return 'numeric';

      var isBoolean = _.every(columnData, function(a) {
        if (_.isNull(a)) return true;
        var s = a.toString().toLowerCase();
        return s === 'true' || s === 'false';
      });
      if (isBoolean) return 'boolean';

      return 'ordinal';
    }
  
  });

}(window.datastripes));