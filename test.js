/**
 * Created by seal on 4/20/16.
 */

(function(){
    "use strict";
    var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

    var width = 960,
        height = 100,
        duration = 1500;


    var svg = d3.select("svg#test")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(32," + (height / 2) + ")");

    function update(data) {

        // DATA JOIN
        // Join new data with old elements, if any.
        var text = svg.selectAll("text")
            .data(data, function(d) { return d.key; });

        // UPDATE
        // Update old elements as needed.
        text.attr("class", "update")
            .transition()
            .duration(duration)
            .attr("x", function(d, i) { return i * 64; });

        // ENTER
        // Create new elements as needed.
        text.enter().append("text")
            .attr("class", "enter")
            .attr("dy", ".35em")
            .attr("y", -60)
            .attr("x", function(d, i) { return i * 64; })
            .style("fill-opacity", 1e-6)
            .text(function(d) { return d.note; })
            .transition()
            .duration(duration)
            .attr("y", 0)
            .style("fill-opacity", 1);

        // EXIT
        // Remove old elements as needed.
        text.exit()
            .attr("class", "exit")
            .transition()
            .duration(duration)
            .attr("y", 60)
            .style("fill-opacity", 1e-6)
            .remove();
    }

// The initial display.
    let my_array = [];
    my_array[0] = [
        {key: 1, note: "E"},
        {key: 2, note: "->"},
        {key: 3, note: "E"},
        {key: 4, note: "+"},
        {key: 5, note: "T"},
        {key: 6, note: "|"},
        {key: 7, note: "E"},
        {key: 8, note: "-"},
        {key: 9, note: "T"},
        {key: 10, note: "|"},
        {key: 11, note: "T"}
    ];

    my_array[1] = [
        {key: 1, note: "E"},
        {key: 2, note: "->"},
        {key: 11, note: "T"},
        {key: 12, note: "E'"}
    ];

    my_array[2] = [
        {key: 1, note: "E"},
        {key: 2, note: "->"},
        {key: 3, note: "E"},
        {key: 4, note: "+"},
        {key: 5, note: "T"},
        {key: 6, note: "|"},
        {key: 7, note: "E"},
        {key: 8, note: "-"},
        {key: 9, note: "T"},
        {key: 10, note: "|"},
        {key: 11, note: "T"}
    ];

    my_array[3] = [
        {key: 12, note: "E'"},
        {key: 2, note: "->"},
        {key: 4, note: "+"},
        {key: 5, note: "T"},
        {key: 13, note: "E'"},
        {key: 6, note: "|"},
        {key: 8, note: "-"},
        {key: 9, note: "T"},
        {key: 14, note: "E'"},
        {key: 10, note: "|"},
        {key: 15, note: "ϵ"}
    ];

    let count = 0;
    update(my_array[count++]);

// Grab a random sample of letters from the alphabet, in alphabetical order.

    setInterval(function() {
        console.log(my_array[count]);
        update(my_array[count++ % 4].slice());
    }, 3000);

})();
