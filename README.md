datastripes
===========

javascript multivariate data visualization

# Purpose

The basic idea behind datastripes is that you can see correlations between columns of data by sorting one column and seeing which columns sort with it.  If it's quick and easy enough to sort your data, it doesn't take a very sophisticated rendering of the data - just a pixel-high bar with width proportional to the value does the job.

So that's datastripes in a nutshell.  Values are displayed as a grid of bars, and you sort columns by clicking on the column header.  Null values are displayed as gray bars, and sort below any other values.

At the top of each column are two histograms. The top histogram represents the distribution of all the values in the column; the lower histogram represents selected values.  You select rows by dragging in the data region or by dragging in either of the histograms.

# Origins

The core idea of datastripes comes from Ramana Rao's [Table Lens](http://www.ramanarao.com/papers/tablelens-chi94.pdf).  Back in 2003 I implemented a version in C++ for the then-current Mac OS, but that hasn't worked for several years.  Recently I was introduced to Mike Bostock's fantastic javascript visualization library, [d3.js](http://d3js.org/), and reimplemented datastripes in javascript; this code is the result.

# Code

The current state of the code is this: it demonstrates the functionality described above.  The html file creates a randomized correlated dataset with six columns and two hundred rows; click on the column headings to detect correlations.

If you want to use this code on your own data, you'll have to write a little javascript code to bring in that data; someday I'll introduce that functionality, but not yet.

Future plans for this code base include:
 - support for non-numeric data
 - support for binary data
 - ability to import your own data
 - hover to provide more information

# Requirements

To make this work, you'll need both [d3.js](https://github.com/mbostock/d3/releases) and [underscore.js](http://underscorejs.org/).  The html file expects to find those files in resource/js/vendor/.

