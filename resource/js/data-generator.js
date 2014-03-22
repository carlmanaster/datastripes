(function (datastripes) {
  
  // Export "package"
  datastripes.DataGenerator = DataGenerator;

  // Constructor
  function DataGenerator(options) {
    this.options = _.extend({
      rows    : 0,
      columns : 0
    }, options);
  }

  // Methods
  _.extend(DataGenerator.prototype, {

    makeRandomCorrelatedDatasetWithNulls: function () {
      this.dataset = this.makeRandomDataset();
      this.introduceCorrelation();
      this.introduceNulls();
      return this.dataset;
    },

    makeRandomDataset: function () {
      var result = [],
          i;
      for (i = 0; i < this.options.rows; i++) {
        result[i] = this.makeRandomRow();
      }
      return result;
    },

    makeRandomRow: function () {
      var result = [],
          i;
      for (i = 0; i < this.options.columns; i++) {
        result[i] = Math.random();
      }
      return result;
    },

    introduceCorrelation: function () {
      var i;
      for (i = 0; i < this.options.rows; i++) {
        this.dataset[i][3] = (this.dataset[i][0] + this.dataset[i][1]) / 2;
        this.dataset[i][4] = this.dataset[i][2] - 0.10 + Math.random() * 0.20;
      }      
    },

    introduceNulls: function () {
      var row,
          column,
          i;
      for (i = 0; i < 50; i++) {
        row    = Math.floor(Math.random() * this.options.rows);
        column = Math.floor(Math.random() * this.options.columns);
        this.dataset[row][column] = null;
      }      
    }, 
    
    makeColumnNames: function() {
    var i
    ,   result = [];
    for (i = 0; i < this.options.columns; i++)
      result[i] = "Column " + (i + 1);
    return result;
  }



  });

}(window.datastripes));