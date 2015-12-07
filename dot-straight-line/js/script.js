var w = 400;
var dataset = [10,10,10,10,10,10,10,10];
var spacing = 2 * Math.PI / 16;

var svg = d3.select('#chart').append('svg')
                                .attr('width',w)
                                .attr('height',w);

var lineContainer = svg.selectAll('g')
                        .data(dataset)
                        .enter()
                        .append('g')
                        .attr('class','lineContainer')
                        .attr('transform',function(d,i){
                            var angleDeg = (360*i)/(2*dataset.length); //Parent container gets rotated; but content should not. Counter rotate here.
                            var angleRad = angleDeg * (Math.PI / 180);
                            var transX = w/2 * (1 - Math.cos(angleRad));
                            var transY = -w/2 * Math.sin(angleRad);
                            return 'translate('+ transX +','+ (w/2+transY) +') rotate('+ angleDeg +')';}
                        );

var line = lineContainer.append('line')
                            .attr('y1',0)
                            .attr('x1',10)
                            .attr('y2',0)
                            .attr('x2',w-10);

var circle = lineContainer.append('circle')
                            .attr('r',10)
                            .attr('cx',10)
                            .attr('cy',0);

var animateCircle = function(selection){

                    selection.transition()
                            .duration(5000)
                            .ease('sin')
                            // .delay(
                            //     function(d,i){
                            //         return (i-1)*(10000/8);
                            // })
                            .attr('cx',w-10)
                            .transition()
                            .duration(5000)
                            .ease('sin')
                            .attr('cx',10)
                            .each('end',function(d,i){
                                if (i===0){
                                    animateCircle(selection);
                                }
                            });
};

animateCircle(circle);
