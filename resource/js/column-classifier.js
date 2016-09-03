(function (datastripes) {

  // Export "package"
  datastripes.ColumnClassifier = ColumnClassifier;

  // Constructor
  function ColumnClassifier() {
  }

  // Methods
  _.extend(ColumnClassifier.prototype, {

    classify: function(columnData) {
      var isNumber = _.every(columnData, function(a) {return _.isNull(a) || _.isNumber(a);});
      if (isNumber) return 'numeric';

      var isDate = _.every(columnData, function(a) {return _.isNull(a) || _.isDate(a);});
      if (isDate) return 'date';

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
