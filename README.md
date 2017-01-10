datastripes
===========

Javascript multivariate data visualization.  Try it out [here](http://carlmanaster.github.io/datastripes/)

# Purpose

The basic idea behind datastripes is that you can see correlations between columns of data by sorting one column and seeing which columns sort with it.  If it's quick and easy enough to sort your data, it doesn't take a very sophisticated rendering of the data - just a pixel-high bar with width proportional to the value does the job.

So that's datastripes in a nutshell.  Values are displayed as a grid of bars, and you sort columns by clicking on the column header.  Null values are displayed as gray bars, and sort below any other values.  Hover over a bar to see its value.

At the top of each column are two histograms. The top histogram represents the distribution of all the values in the column; the lower histogram represents selected values.  You select rows by dragging in the data region or by dragging in either of the histograms.  Hover over a histogram to see a numeric summary.

Datastripes currently supports four column types: numeric, ordinal, boolean, and date.  Numeric columns are drawn as horizontal bars from the left edge of the column.  Ordinal columns are drawn as horizontal bars occupying a fraction of the column.  Boolean columns are drawn like ordinal columns but colored green for true and red for false.  Date columns are drawn in blue with just a dot at the value.

# Origins

The core idea of datastripes comes from Ramana Rao's [Table Lens](http://www.ramanarao.com/papers/tablelens-chi94.pdf).  Back in 2003 I implemented a version in C++ for the then-current Mac OS, but that hasn't worked for several years.  Recently I was introduced to Mike Bostock's fantastic javascript visualization library, [d3.js](http://d3js.org/), and reimplemented datastripes in javascript; this code is the result.

# Usage

Click "Choose File" to read a comma-delimited file or click "Random Data" to generate a randomized correlated dataset with ten columns and two hundred rows.

Click on the column headings to detect correlations.  Drag through the data rows to make a selection.  Drag in the summary charts to select by value.

# Requirements

Datastripes uses [d3.js](https://github.com/mbostock/d3/releases) and [underscore.js](http://underscorejs.org/).  It uses those resources over the internet, but you may prefer to store local copies in resource/js/vendor/.

