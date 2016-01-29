(function (datastripes) {

  // Export "package"
  datastripes.Tooltip = Tooltip;

  function Tooltip() {
  }

  // Methods
  _.extend(Tooltip.prototype, {

    create: function() {
      return d3.select("body").append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);
    },
  
    show: function(html, color) {
      color = color || 'white'
      tooltip.transition()
          .duration(500)
          .style("opacity", .9)
          .style("background-color", color);
	    tooltip.html(html)
	      .style("left", (d3.event.pageX) + "px")
	      .style("top", (d3.event.pageY + 10) + "px");
    },

    hide: function() {
      tooltip.transition()
          .duration(500)
          .style("opacity", 0);
    },

    hideImmediately: function() {
      tooltip.transition()
          .duration(0)
          .style("opacity", 0);
    }

  });

}(window.datastripes));