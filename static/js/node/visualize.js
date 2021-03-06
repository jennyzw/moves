// D3 - draws the graph
/*DESIGN ISSUE:
  (resolved) use the weight attribute for each node to filter the number of nodes shown (weight >=10)
  figure out another layout combination that will spread out the graph so its readable.
 */
 
var width = 1000,
    height = 700;
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
var nodeRadius = 8;

var color = d3.scale.category10();

function visualize(dataArray) {
var links = [];
for(var p in dataArray) {
  links.push({"source":dataArray[p]["location_name1"], "target":dataArray[p]["location_name2"]});
}
 
var nodes = {}; 
links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});

// initialize nodes and links
var force = d3.layout.force()
    .nodes(d3.values(nodes)) 
    .links(links)
	  .linkDistance(200)
	  .linkStrength(0.6)
    .charge(-120)
	  .friction(0.45)
    .size([width, height])
    .on("tick", tick) 
    .start();

// populating a new object with fewer, weighted nodes
var weightedNodes = {};
for(key in nodes) {
  if(nodes[key]["weight"]>20) {
    weightedNodes[key]=nodes[key];
  }
}
console.log(weightedNodes);

// removing links accordingly
// populating a new links object according to new nodes object
var weightedLinks = [];
var nodeLength = Object.keys(weightedNodes).length;
for(var i = 0; i < links.length; i++) {
  var foundSource = false;
  var foundTarget = false;
  for(j in weightedNodes) {
    if(links[i]["source"] == weightedNodes[j]) {
      foundSource = true;
    }
    for(k in weightedNodes) {
      if(links[i]["target"] == weightedNodes[k]) {
        foundTarget = true;
      } 
    }
  }
  if(foundSource && foundTarget) {
    weightedLinks.push(links[i]);
  }
}

// new filtered node & link graph
var force = d3.layout.force()
    .nodes(d3.values(weightedNodes))
    .links(weightedLinks)
    .linkDistance(200)
    .linkStrength(0.6)
    .charge(-120)
    .friction(0.45)
    .size([width, height])
    .on("tick", tick)
    .start();

	 // removing arrows
  svg.selectAll("marker")
  .data(dataArray)
  .exit().remove();
  // removing links
  svg.selectAll("path")
  .data(dataArray)
  .exit().remove();
  // removing nodes
  svg.selectAll("circle")
  .data(dataArray)
  .exit().remove();
  // removing text
  svg.selectAll("text")
  .data(dataArray)
  .exit().remove();

// building arrows
svg.append("svg:defs").selectAll("marker")
    .data(["end"])
  	.enter().append("marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
  	.append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

// adding links and arrows
var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  	.enter().append("svg:path") 
    .attr("class", function(d) { return "link " + d.type; })
	  .attr("class", "link")
	  .attr("marker-end", "url(#end)")

// creating gradients -- will work on later
// var defs = svg.append('defs');
// var gradient = defs.append('radialGradient')
//     .attr('id', 'fadient');
// gradient.append('stop')
//     .attr('offset', '75%')
//     .attr('stop-color', 'white')
//     .attr('stop-opacity', 1)
// gradient.append('stop')
//     .attr('offset', '100%')
//     .attr('stop-color', 'white')
//     .attr('stop-opacity', .1)

// var mask = defs.append('mask')
//     .attr('id', 'mask')
//     .attr('maskContentUnits', 'objectBoundingBox')
//   .append('circle')
//     .attr('fill', 'url(#fadient)')
//     .attr('cx', .5)
//     .attr('cy', .5)
//     .attr('r', .5)

// defining nodes
var circle = svg.selectAll("circle")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .call(force.drag);
    circle.append("circle")
    .attr("r", nodeRadius)
    .attr('mask', 'url(#mask)');
  //.attr("fill", function (d, i) { return color(i); });

// adding text
var text = svg.append("g").selectAll("text")
    .data(force.nodes())
  	.enter().append("text")
    .attr("x", 8)
    .attr("y", ".31em")
    .text(function(d) { return d.name; });

// Use elliptical arc path segments to doubly-encode directionality.
function tick() {
  path.attr("d", linkArc);
  circle.attr("transform", transform);
  text.attr("transform", transform);
}

function linkArc(d) {
  var dx = d.target.nodeRadius - d.source.x,
      dy = d.target.nodeRadius - d.source.y,
      //dr = Math.sqrt(dx * dx + dy * dy); //curved links, unncessary right now
	    dr = 0;
  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

function mouseover() {
  d3.select(this).select("circle").transition()
      .duration(350)
      .attr("r", 20);
}

function mouseout() {
  d3.select(this).select("circle").transition()
      .duration(350)
      .attr("r", nodeRadius);
}

// fisheye effect
var fisheye = d3.fisheye.circular()
    .radius(200)
    .distortion(2);

    svg.on("mousemove", function() {
  fisheye.focus(d3.mouse(this));
});

  // circle.each(function(d) { d.fisheye = fisheye(d); })
  //     .attr("cx", function(d) { return d.fisheye.x; })
  //     .attr("cy", function(d) { return d.fisheye.y; })
  //     .attr("r", function(d) { return d.fisheye.z * 4.5; });

  // path.attr("x1", function(d) { return d.source.fisheye.x; })
  //     .attr("y1", function(d) { return d.source.fisheye.y; })
  //     .attr("x2", function(d) { return d.target.fisheye.x; })
  //     .attr("y2", function(d) { return d.target.fisheye.y; });

}

