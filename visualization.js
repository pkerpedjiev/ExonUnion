var width = 960;
var numtext = 0;
			
d3.json('result.json', function (error, dataAgg){
	
	var xScale = d3.scale.linear()
        .domain(
         	[0,dataAgg.options.end-dataAgg.options.start]
        )
        .range([0,800]);


    var height = dataAgg.options.height;

	var zoom = d3.behavior.zoom()
	    .x(xScale)
	    .on("zoom", zoomed);


	var svg = d3.select("body").append("svg")
		.attr("class" , "svg")
	    .attr("width", width)
	    .attr("height", height)
	  	.append("g")
	    .call(zoom)
	  	.append("g")
	  	.attr("class", "g");
	    

	var xAxis = d3.svg.axis()
	    .scale(xScale)
	    .orient("bottom")
	    .tickSize(-height);

	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

    svg.append("rect")
	    .attr("class", "overlay")
	    .attr("width", width)
	    .attr("height", height)

	var yloc = 12;
	var yex = 9;
	var yend = 11;

	var text = svg.append("g").attr("class", "text");

	for(var i = 0; i < dataAgg.values.length; i++){

		svg.append("line")
            .attr("x1", 0)
            .attr("y1", yloc)
            .attr("x2", xScale(dataAgg.values[i].union.endx) - xScale(dataAgg.values[i].union.startx))
            .attr("y2", yloc)
            .attr("stroke-width", 2)
			.attr("stroke", "#3498db");

		d3.select(".svg").append("text")
			.attr("class", "vals")
			.attr("x", xScale(dataAgg.values[i].union.endx) - xScale(dataAgg.values[i].union.startx))
            .attr("y", yloc+4)
            .text(dataAgg.values[i].name)
            .attr("font-family", "sans-serif")
            .style("font-size", "10px");

        numtext++;

		for(var j = 0; j < dataAgg.values[i].union.exons.length; j++){
			svg.append("rect")
		        .attr("x", xScale(dataAgg.values[i].union.exons[j][0]) - xScale(dataAgg.values[i].union.startx))
		        .attr("y", yex)
		        .attr("width", xScale(dataAgg.values[i].union.exons[j][1]) - xScale(dataAgg.values[i].union.exons[j][0]))
		        .attr("height", 6)
		        .style("fill", "red");
        }	
        
        var end = d3.max(dataAgg.values[i].union.exons, function(array) {
		  return d3.max(array);
		});

		var start = d3.min(dataAgg.values[i].union.exons, function(array) {
		  return d3.min(array);
		});
        
        svg.append("rect")
            .attr("x", xScale(end) - xScale(dataAgg.values[i].union.startx))
            .attr("y", 9+5*10)
            .attr("width", xScale(dataAgg.values[i].union.endx) - xScale(end))
            .attr("height", 6)
            .style("fill", "green");

        svg.append("rect")
            .attr("x", 0)
            .attr("y", 9+5*10)
            .attr("width", xScale(start) - xScale(dataAgg.values[i].union.startx))
            .attr("height", 6)
            .style("fill", "green");

		yex += 10;
        yend += 10;
		yloc += 10;


		for(var j = 0; j < dataAgg.values[i].transcripts.length; j++){
			
			svg.append("line")
                .attr("x1", xScale(dataAgg.values[i].transcripts[j].startx) - xScale(dataAgg.values[i].union.startx))
                .attr("y1", yloc)
                .attr("x2", xScale(dataAgg.values[i].transcripts[j].endx) - xScale(dataAgg.values[i].union.startx))
                .attr("y2", yloc)
                .attr("stroke-width", 1)
				.attr("stroke", "#3498db");

			d3.select(".svg").append("text")
				.attr("class", "vals")//xScale(dataAgg.values[i].union.endx) - xScale(dataAgg.values[i].union.startx)
				.attr("x", xScale(dataAgg.values[i].transcripts[j].endx) - xScale(dataAgg.values[i].union.startx))
                .attr("y", yloc+4)
                .text(dataAgg.values[i].transcripts[j].name)
                .attr("font-family", "sans-serif")
                .style("font-size", "10px");

            numtext++;

			for(var k = 0; k<dataAgg.values[i].transcripts[j].exonStart.length; k++){
				svg.append("rect")
                    .attr("x", xScale(dataAgg.values[i].transcripts[j].exonStart[k]) - xScale(dataAgg.values[i].union.startx))
                    .attr("y", yex)
                    .attr("width", xScale(dataAgg.values[i].transcripts[j].exonEnd[k]) - xScale(dataAgg.values[i].transcripts[j].exonStart[k]))
                    .attr("height", 6)
                    .style("fill", "orange");
            }

            var end = d3.max(dataAgg.values[i].transcripts[j].exonEnd)
			var start = d3.min(dataAgg.values[i].transcripts[j].exonStart)

			svg.append("rect")
                .attr("x", xScale(end) - xScale(dataAgg.values[i].union.startx))
                .attr("y", yend)
                .attr("width", xScale(dataAgg.values[i].transcripts[j].endx) - xScale(end))
                .attr("height", 2)
                .style("fill", "green");

        	svg.append("rect")
                .attr("x", xScale(dataAgg.values[i].transcripts[j].startx) - xScale(dataAgg.values[i].union.startx))
                .attr("y", yend)
                .attr("width", xScale(start) - xScale(dataAgg.values[i].transcripts[j].startx))
                .attr("height", 2)
                .style("fill", "green");
            
            yex += 10;
            yend += 10;
			yloc += 10;
		}
	}

	var vals = []; 
	var complete = false;


	function zoomed() {
			  
		translate = [d3.event.translate[0], 0];
		svg.attr("transform", "translate(" + translate + ")scale(" + d3.event.scale + ", 1)");
		$(".vals").each(function(i, obj) {
    			
			if(vals.length < numtext){
				vals[i] = $(this).attr("x")
			} 
			console.log($(this))
			console.log($(this).attr("x"))
			
			val = vals[i] * d3.event.scale + d3.event.translate[0];
		
			$(this).attr("x", val);
		});
		
		d3.selectAll(".vals").each(function(d){
			console.log(d3.select(this))
			console.log(d3.select(this).attr("x"))
		/*	if(vals.length < numtext){
				vals[i] = d3.select(this).attr("x")
			} 
			val = vals[i] * d3.event.scale + d3.event.translate[0];
		
			d3.select(this).attr("x", val);
*/
			//console.log(vals)
		})
	}
			
})
			


			


			
