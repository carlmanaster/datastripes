(function (datastripes) {
  
  // Export "package"
  datastripes.Snap = Snap;

  // Constructor
  function Snap() {
  }

  // Methods
  _.extend(Snap.prototype, {
  
    toBinStart: function(value, domain) {
      return this.snap(value, domain, Math.floor);
    },
  
    toBinEnd: function(value, domain) {
      return this.snap(value, domain, Math.ceil);
    },

    intDomain: function(dateDomain) {
      return [dateDomain[0].getTime(), dateDomain[1].getTime()];
    },

    toDateBinStart: function(value, domain) {
      return this.snap(value, this.intDomain(domain), Math.floor);
    },
  
    toDateBinEnd: function(value, domain) {
      return this.snap(value, this.intDomain(domain), Math.ceil);
    },
  
    snap: function(value, domain, f) {
      var range    = domain[1] - domain[0]
      ,   fraction = (value - domain[0]) / range;

      return domain[0] + f(fraction * datastripes.HISTOGRAM_BINS) * range / datastripes.HISTOGRAM_BINS;
    }
  
  });

}(window.datastripes));