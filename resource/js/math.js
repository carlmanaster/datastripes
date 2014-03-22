(function (datastripes) {
  
  // Export "package"
  datastripes.MathUtil = MathUtil;

  // Constructor
  function MathUtil() {
  }

  // Methods
  _.extend(MathUtil.prototype, {

    standardDeviation: function(values) {
      var mean = d3.mean(values)
      ,   n    = 0
      ,   sum  = 0
      ,   i;
      
      for (i = 0; i < values.length; i++) {
        if (!this.isNumber(values[i])) continue;
        n++;
        sum += Math.pow(values[i] - mean, 2);
      }
      
      return Math.sqrt(sum / n);
    },
    
    isNumber: function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
  
    });

}(window.datastripes));