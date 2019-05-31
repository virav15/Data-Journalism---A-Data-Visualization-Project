var svgWidth =825,
	svgHeight =700;

var margin = {
	t:50,
	r:50,
	b:100,
	l:100,
}; 

var width = svgWidth - margin.l - margin.r,
	height = svgHeight - margin.t - margin.b;

var svg = d3.select('#scatter')
	.classed('chart',true)
	.append('svg')
	.attr('width', svgWidth)
	.attr('height',svgHeight)

var chartGroup = svg.append('g')
	.attr('transform',`translate(${margin.l},${margin.t})`)

// =================================================================
// Create chart
// =================================================================

var chosenXAxis = 'poverty',
	chosenYAxis = 'healthcare';

d3.csv("/assets/data/data.csv").then( data =>{
	data.forEach( d =>{
		d.poverty = +d.poverty;
		d.age = +d.age;
		d.income = +d.income;
		d.obesity = +d.obesity;
		d.smokes = +d.smokes;
		d.healthcare = +d.healthcare;
	});

	var xScale = getXScaleForAxis(data,chosenXAxis),
		yScale = getYScaleForAxis(data,chosenYAxis);

	
	var xAxis = d3.axisBottom(xScale),
		yAxis = d3.axisLeft(yScale);

	var xAxis = chartGroup.append('g')
		.attr('transform',`translate(0,${height})`)
		.call(xAxis);
	var yAxis = chartGroup.append('g')
		.call(yAxis);

    chartGroup.append("text")
        .attr("transform", `translate(${width - 40},${height - 5})`)
        .attr("class", "axis-text-main")
        .text("Demographics")

    chartGroup.append("text")
        .attr("transform", `translate(15,60 )rotate(270)`)
        .attr("class", "axis-text-main")
        .text("Behavioral Risk Factors")



	var stateCircles = chartGroup.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.classed('stateCircle',true)
		.attr('cx', d => xScale(d[chosenXAxis]))
		.attr('cy', d => yScale(d[chosenYAxis]))
		.attr('r' , 10)
	
	var stateText = chartGroup.append('g').selectAll('text')
		.data(data)
		.enter()
		.append('text')
		.classed('stateText',true)
		.attr('x', d => xScale(d[chosenXAxis]))
		.attr('y', d => yScale(d[chosenYAxis]))
		.attr('transform','translate(0,4.5)')
		.text(d => d.abbr)

	var xLabelsGroup = chartGroup.append('g')
		.attr('transform', `translate(${width / 2}, ${height + 20})`);

	var povertyLabel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 20)
	    .attr('value', 'poverty')
	    .classed('aText active', true)
	    .text('In Poverty (%)');

	var ageLabel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 40)
	    .attr('value', 'age')
	    .classed('aText inactive', true)
	    .text('Age (Median)');

    var incomeLabel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 60)
	    .attr('value', 'income')
	    .classed('aText inactive', true)
	    .text('Household Income (Median)');

    var yLabelsGroup = chartGroup.append('g')

	var HealthLabel = yLabelsGroup.append('text')
	    .attr("transform", `translate(-40,${height / 2})rotate(-90)`)
	    .attr('value', 'healthcare')
	    .classed('aText active', true)
	    .text('Lacks Healthcare (%)');

	var smokesLabel = yLabelsGroup.append('text')
		.attr("transform", `translate(-60,${height / 2})rotate(-90)`)
	    .attr('value', 'smokes')
	    .classed('aText inactive', true)
	    .text('Smokes (%)');

    var obesityLabel = yLabelsGroup.append('text')
		.attr("transform", `translate(-80,${height / 2})rotate(-90)`)
	    .attr('value', 'obesity')
	    .classed('aText inactive', true)
	    .text('Obesse (%)');


	var stateCircles = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText),
		stateText = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText);


	xLabelsGroup.selectAll('text')
	    .on('click', function() {
		    var value = d3.select(this).attr('value');
		    if (value !== chosenXAxis) {
			    chosenXAxis = value;

		        xScale = getXScaleForAxis(data, chosenXAxis);

		        xAxis.transition()
				    .duration(1000)
				    .ease(d3.easeBack)
					.call(d3.axisBottom(xScale));

		        stateCircles.transition()
			        .duration(1000)
			        .ease(d3.easeBack)
			        .on('start',function(){
			        	d3.select(this)
			        		.attr("opacity", 0.50)
			        		.attr('r',15);
			        })
			        .on('end',function(){
			        	d3.select(this)
			        		.attr("opacity", 1)
			        		.attr('r',10)
			        })
			        .attr('cx', d => xScale(d[chosenXAxis]));

			    d3.selectAll('.stateText').transition()
			    	.duration(1000)
			    	.ease(d3.easeBack)
			    	.attr('x', d => xScale(d[chosenXAxis]));

	        	stateCircles = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText),
				stateText = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText);

		        if (chosenXAxis === 'poverty') {
				    povertyLabel
			            .classed('active', true)
			            .classed('inactive', false);
			        incomeLabel
			            .classed('active', false)
			            .classed('inactive', true);
		            ageLabel
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		        else if (chosenXAxis === 'age'){
		        	povertyLabel
			            .classed('active', false)
			            .classed('inactive', true);
			        incomeLabel
			            .classed('active', false)
			            .classed('inactive', true);
		            ageLabel
			            .classed('active', true)
			            .classed('inactive', false);
		        }
		        else {
		        	povertyLabel
			            .classed('active', false)
			            .classed('inactive', true);
			        incomeLabel
			            .classed('active', true)
			            .classed('inactive', false);
		            ageLabel
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		    }
	    });

    yLabelsGroup.selectAll('text')
	    .on('click', function() {
		    var value = d3.select(this).attr('value');
		    if (value !== chosenYAxis) {
			    chosenYAxis = value;

		        yScale = getYScaleForAxis(data, chosenYAxis);

		        yAxis.transition()
				    .duration(1000)
				    .ease(d3.easeBack)
					.call(d3.axisLeft(yScale));

		        stateCircles.transition()
			        .duration(1000)
			        .ease(d3.easeBack)
			        .on('start',function(){
			        	d3.select(this)
			        		.attr("opacity", 0.50)
			        		.attr('r',15);
			        })
			        .on('end',function(){
			        	d3.select(this)
			        		.attr("opacity", 1)
			        		.attr('r',10)
			        })
			        .attr('cy', d => yScale(d[chosenYAxis]));

			    d3.selectAll('.stateText').transition()
			    	.duration(1000)
			    	.ease(d3.easeBack)
			    	.attr('y', d => yScale(d[chosenYAxis]));

	        	stateCircles = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText),
				stateText = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText);

		        if (chosenYAxis === 'healthcare') {
				    HealthLabel
			            .classed('active', true)
			            .classed('inactive', false);
			        smokesLabel
			            .classed('active', false)
			            .classed('inactive', true);
		            obesityLabel
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		        else if (chosenYAxis === 'obesity'){
		        	HealthLabel
			            .classed('active', false)
			            .classed('inactive', true);
			        smokesLabel
			            .classed('active', false)
			            .classed('inactive', true);
		            obesityLabel
			            .classed('active', true)
			            .classed('inactive', false);
		        }
		        else {
		        	HealthLabel
			            .classed('active', false)
			            .classed('inactive', true);
			        smokesLabel
			            .classed('active', true)
			            .classed('inactive', false);
		            obesityLabel
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		    }
	    });

});


function getXScaleForAxis(data,chosenXAxis) {
	var xScale = d3.scaleLinear()
	    .domain([d3.min(data, d => d[chosenXAxis])*.9, 
	    		d3.max(data, d => d[chosenXAxis])*1.1])
	    .range([0, width]);
    
    return xScale;
}

function getYScaleForAxis(data,chosenYAxis) {
	var yScale = d3.scaleLinear()
	    .domain([d3.min(data, d => d[chosenYAxis])*.9, 
	    		d3.max(data, d => d[chosenYAxis])*1.1])
	    .range([height, 0]);

    return yScale;
}


function updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText) {
    var toolTip = d3.tip()
        .attr('class','d3-tip')
        .offset([80, -60])
        .html( d => {
        	if(chosenXAxis === "poverty")
	            return (`${d.state}<br>${chosenYAxis}:${d[chosenYAxis]}% 
	            		<br>${chosenXAxis}:${d[chosenXAxis]}%`)
        	else if (chosenXAxis === 'income')
	            return (`${d.state}<br>${chosenYAxis}:${d[chosenYAxis]}% 
	            		<br>${chosenXAxis}:$${d[chosenXAxis]}`)
	        else
	        	return (`${d.state}<br>${chosenYAxis}:${d[chosenYAxis]}% 
	            		<br>${chosenXAxis}:${d[chosenXAxis]}`)
	    });

	stateCircles.call(toolTip);
	stateCircles.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

	d3.selectAll('.stateText').call(toolTip);
	d3.selectAll('.stateText').on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

	return stateCircles;
	return stateText;
}