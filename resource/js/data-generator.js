(function (datastripes) {
  
  // Export "package"
  datastripes.DataGenerator = DataGenerator;

  // Constructor
  function DataGenerator(options) {
    this.options = _.extend({
      rows    : 0,
      columns : 0
    }, options);
    this.options.numericColumns = this.options.columns;
    this.options.columns++; 
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
      for (i = 0; i < this.options.columns ; i++) {
        result[i] = Math.random();
      }
      result[this.options.columns - 1] = this.randomColor();
      return result;
    },
    
    randomColor: function() {
      return ["red", "yellow", "green", "blue", "red"][Math.floor(Math.random() * 5)];
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
      for (i = 0; i < 100; i++) {
        row    = Math.floor(Math.random() * this.options.rows);
        column = Math.floor(Math.random() * (this.options.columns));
        this.dataset[row][column] = null;
      }      
    }, 
    
    makeColumnNames: function() {
    var i
    ,   result = [];
    for (i = 0; i < this.options.columns - 1; i++)
      result[i] = "Column " + (i + 1);
    result[this.options.columns - 1] = "Ordinal"
    return result;
  }



  });

}(window.datastripes));