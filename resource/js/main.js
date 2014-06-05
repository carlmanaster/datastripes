// v000: display numeric columns and sort
// v001: add transition
// v002: add null support
// v003: use d3js scales
// v004: stable sort
// v005: column headings
// v006: brushing
// v007: summary charts
// v008: summary chart brushing
// v009: open file

// example upload script: http://syntagmatic.github.io/parallel-coordinates/examples/upload.html

(function (datastripes) {

  var generator     = new datastripes.DataGenerator({
							rows    : datastripes.ROWS,
							columns : datastripes.COLUMNS + 1
						  })
  ,   dataset       = generator.makeRandomCorrelatedDatasetWithNulls()
  ,   columnNames   = generator.makeColumnNames()
  ,   chart         = new datastripes.DatastripesChart();

  
  chart.init(dataset, columnNames);

}(window.datastripes));