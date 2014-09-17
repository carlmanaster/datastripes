(function (datastripes) {
  
  // Export "package"
  datastripes.DataFileReader = DataFileReader;

  // Constructor
  function DataFileReader(options) {
    this.options = _.extend({
      file : null
    }, options);
    this.readDataset(this.options.file);
  }

  // Methods
  _.extend(DataFileReader.prototype, {

    readDataset: function(file) {
      var reader = new FileReader();
      reader.onload = function(event) {
          var contents = event.target.result
          ,   i
          ,   j
          ,   f
          ,   lines = contents.split(/\n+/);

          this.columnNames = lines[0].split(',');

          this.dataset = [];
          for (i = 1; i < lines.length; i++) {
            line = lines[i].split(',');
            for (j = 0; j < line.length; j++) {
              if (line[j] == "") line[j] = null;
              try {
                f = parseFloat(line[j]);
                if (!_.isNaN(f)) {
                  line[j] = f;
                }
              } catch (e) {
                // don't worry about it
              }
            }
            this.dataset[i - 1] = line;
          }

          var chart = new datastripes.DatastripesChart();
          chart.init(this.dataset, this.columnNames);
      };

      reader.onerror = function(event) {
          console.error("File could not be read! Code " + event.target.error.code);
      };

      var text = reader.readAsText(file);
    },

    getDataset: function () {
      return this.dataset;
    },

    getColumnNames: function () {
      return this.columnNames;
    }

  });

}(window.datastripes));