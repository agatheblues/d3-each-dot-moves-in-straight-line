var margin = {top: 20, right: 100, bottom: 100, left: 100};
var padding = 10;
var height = document.documentElement.clientHeight;
var width = document.documentElement.clientWidth;
var w = (width>height) ? height : width;
w = w - margin.left - margin.bottom;
var dataset = new Array(25); //[10,10,10,10,10,10,10,10,10];
var transitionDuration = 5000;


var svg = d3.select('#chart').append('svg')
                                .attr('width',width-margin.left)
                                .attr('height',height-margin.bottom-3*margin.top);

//Graph of the dots moving in straight lines
var graphContainer = svg.append('g')
                            .attr('id','graphContainer')
                            .attr('transform','translate('+ margin.left +','+ margin.top +')');

var mainLineContainer = graphContainer.append('g')
                                .attr('id','mainLineContainer');

var mainCircleContainer = graphContainer.append('g')
                                .attr('id','mainCircleContainer');

//Graph of the sin-in-out curve
var curveContainer = svg.append('g')
                            .attr('id','curveContainer')
                            .attr('transform','translate('+ (width/2 + margin.left) +','+ margin.top +')');


//update(dataset) -> update graph with new size of dataset (=new amount of lines)
function update(dataset){

    // Lines containers
    var lineContainer = mainLineContainer.selectAll('g.lineContainer')
                                        .data(dataset);

                        //New lines
                        lineContainer.enter()
                                        .append('g')
                                        .attr('class','lineContainer')
                                        .attr('transform',function(d,i){
                                            var angleDeg = (360*i)/(2*dataset.length); //Parent container gets rotated; but content should not. Counter rotate here.
                                            var angleRad = angleDeg * (Math.PI / 180);
                                            var transX = w/2 * (1 - Math.cos(angleRad));
                                            var transY = -w/2 * Math.sin(angleRad);
                                            return 'translate('+ transX +','+ (w/2+transY) +') rotate('+ angleDeg +')';
                                        })
                                        .append('line') //Line creation
                                            .attr('y1',0)
                                            .attr('x1',padding)
                                            .attr('y2',0)
                                            .attr('x2',w-padding)
                                            .attr('class','straightLines')
                                            .attr('stroke','#F4F1BB');

                        //Moves Update + Enter
                        lineContainer.transition()
                                        .duration(500)
                                        .attr('transform',function(d,i){
                                            var angleDeg = (360*i)/(2*dataset.length); //Parent container gets rotated; but content should not. Counter rotate here.
                                            var angleRad = angleDeg * (Math.PI / 180);
                                            var transX = w/2 * (1 - Math.cos(angleRad));
                                            var transY = -w/2 * Math.sin(angleRad);
                                            return 'translate('+ transX +','+ (w/2+transY) +') rotate('+ angleDeg +')';
                                        });

                        //Remove what's not in update or enter
                        lineContainer.exit()
                                        .remove();


    // Circles containers
    var circleContainer = mainCircleContainer.selectAll('g.circleContainer')
                                        .data(dataset);

                        //New circles
                        circleContainer.enter()
                                        .append('g')
                                        .attr('class','circleContainer')
                                        .attr('transform',function(d,i){
                                            var angleDeg = (360*i)/(2*dataset.length); //Parent container gets rotated; but content should not. Counter rotate here.
                                            var angleRad = angleDeg * (Math.PI / 180);
                                            var transX = w/2 * (1 - Math.cos(angleRad));
                                            var transY = -w/2 * Math.sin(angleRad);
                                            return 'translate('+ transX +','+ (w/2+transY) +') rotate('+ angleDeg +')';}
                                        )
                                        .append('circle')     // Circle creation
                                            .attr('r',10)
                                            .attr('cx',padding)
                                            .attr('cy',0)
                                            .attr('class','straightCircles')
                                            .attr('id',function(d,i){return 'straightCircles'+i;})
                                            .attr('fill','#ED6A5A');

                        //Moves Update + Enter
                        circleContainer.transition()
                                        .duration(500)
                                        .attr('transform',function(d,i){
                                            var angleDeg = (360*i)/(2*dataset.length); //Parent container gets rotated; but content should not. Counter rotate here.
                                            var angleRad = angleDeg * (Math.PI / 180);
                                            var transX = w/2 * (1 - Math.cos(angleRad));
                                            var transY = -w/2 * Math.sin(angleRad);
                                            return 'translate('+ transX +','+ (w/2+transY) +') rotate('+ angleDeg +')';}
                                        );

                        //Remove what's not in update or enter
                        circleContainer.exit()
                                        .remove();


    // Animation
    var animateCircle = function(selection){

                        selection.transition()
                                    .duration(transitionDuration)
                                    .ease('sin-in-out')
                                    .delay(
                                        function(d,i){
                                            return i*(transitionDuration/(dataset.length));
                                    })
                                    .attr('cx',w-padding)
                                .transition()
                                    .duration(transitionDuration)
                                    .ease('sin-in-out')
                                    .attr('cx',padding)
                                    .each('end',function(d,i){
                                        if (i===0){
                                            animateCircle(selection);
                                        }
                                });
    };

animateCircle(d3.selectAll('.circleContainer').select('.straightCircles'));
}

update(dataset);


/** Curve sin graph **/
// Axis
var xScale = d3.scale.linear()
                        .domain([0,2])
                        .range([0,w]);

var yScale = d3.scale.linear()
                        .domain([0,1])
                        .range([w,0]);

var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom')
                    .ticks(2);

var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
                    .ticks(2);

var xContainer = curveContainer.append('g')
                                .attr('id','xContainer')
                                .attr('class','axis')
                                .attr('transform','translate(0,'+ w +')')
                                .call(xAxis);

var yContainer = curveContainer.append('g')
                                .attr('id','yContainer')
                                .attr('class','axis')
                                .call(yAxis);

var path = d3.svg.line();

var curve = curveContainer.append('g')
                            .attr('id','curve')
                            .append('path')
                            .attr("d", path(d3.range(0, 2, .002).concat(2).map(function(t) { // .002 is step. Need concat last point on the curve (2) because range doesnt include stop element
                                return [xScale(t), yScale(sinInOut(t))];
                            })));

var dot = curveContainer.append("circle")
                            .attr('id','dot');

d3.timer(function(elapsed) {
  var t = 2*(elapsed % (2*transitionDuration)) / (2*transitionDuration);
  dot.attr("cx", xScale(t)).attr("cy", yScale(sinInOut(t)));
});

function sinInOut(t) {
  return (1 - Math.cos(Math.PI * t)) / 2;
}

//Event handler : on slide, change number of datas
d3.select("#nData").on("input", function() {
    var nData=this.value;
    d3.select("#nData-value").text(nData);
    d3.select("#nData").property("value", nData);
    dataset = new Array(parseInt(nData));
    update(dataset); //Redraw chart with new number of datas
});
