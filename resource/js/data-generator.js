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
      for (i = 0; i < this.options.columns - 3 ; i++) {
        result[i] = Math.random();
      }
      result[this.options.columns - 3] = this.randomColor();
      result[this.options.columns - 2] = this.randomBool();
      // result[this.options.columns - 1] = this.randomDayOfMonth(); // just want to see what n=31 looks like
      result[this.options.columns - 1] = this.randomDateWithinTheLastYear();
      return result;
    },
    
    randomColor: function() {
      return ["red", "yellow", "green", "blue", "red"][Math.floor(Math.random() * 5)];
    },
    
    randomBool: function() {
      return ['true', 'false'][Math.floor(Math.random() * 2)];
    },

    randomDayOfMonth: function() {
      return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', 
              '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', 
              '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'][Math.floor(Math.random() * 31)];
    },

    randomDateWithinTheLastYear: function() {
      var msPerYear = 1000 * 60 * 60 * 24 * 365;
      return new Date(Math.floor(Date.now() - Math.random() * msPerYear));
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
    for (i = 0; i < this.options.columns - 3; i++)
      result[i] = "Column " + (i + 1);
    result[this.options.columns - 3] = 'Color'
    result[this.options.columns - 2] = 'Bool'
    result[this.options.columns - 1] = 'Date'
    return result;
  }



  });

}(window.datastripes));