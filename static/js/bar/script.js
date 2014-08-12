var width = 1000,
	height = 700;
	bottomHeight = 800;

var chart = d3.select(".chart")
	.attr('class', 'chart')
	.attr("width", width)
	.attr("height", bottomHeight);

 function visualize(dataArray) {
 
	var barWidth = width / dataArray.length;
	var y = d3.scale.linear()
		.domain([0, d3.max(d3.values(dataArray), function(d) { return d.value; })])
		.range([height, 0]);
		
	var x = function(d) { return d.value; };

	// creating group
    /* var bar = chart.selectAll("g")
     .data(dataArray, function(d) {return dataArray.indexOf(d)})
     .enter().append("g")
	 .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; })
	  */

	// adding rectangles
	chart.selectAll("rect")
	.data(dataArray, function(d) {return dataArray.indexOf(d)})
	.enter().append("rect")
	.attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; })
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })
    .attr("width", barWidth - 3);

	// adding value text
	chart.selectAll("text.value")
	.data(dataArray, function(d) {return dataArray.indexOf(d)})
	.enter().append("text")
	.attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; })
      .attr("x", barWidth / 2)
      .attr("y", function(d) { return y(d.value) + 2; })
      .attr("dy", ".75em")
      .text(function(d) { return d.value; });
	
	// removing texts	
	var v = chart.selectAll("text")
	.data(dataArray, function(d) {return dataArray.indexOf(d)})
	.exit().remove();
	  
	// adding name text
	var labels = chart.selectAll("text.name")
	.data(dataArray, function(d) {return dataArray.indexOf(d)})
	.enter().append("text")
    .attr("x", barWidth/2)
      .attr("y", height+3)
      .attr("dy", ".75em")
	  .attr("transform",  function(d, i) { return "translate(" + i * barWidth + ",0) " ; })
	  //.attr("transform", function(d) {return "rotate(-65)"} )
      .text(function(d) { return d.name; }); 
	    
	  
	 // removing rectangles
	 var r = chart.selectAll("rect")
	.data(dataArray, function(d) {return dataArray.indexOf(d)})
	.exit().remove();
}


//Copy this function over to your javascript/html file
//this function gets data from the server based on the command that you pass in
//example ajax("execute",{"sql":"Select * from users;"},function(res){//callback function})
function ajax(command, params, cb) {  
	var server = "http://192.81.129.111:9988"
	$.post(server, { "command" : command, args : JSON.stringify(params) }, cb)
}

//here is an example calling of the ajax function
//it gets all of the location pairs with a command of "getAllLocationPairs" and params of user_id
//this also shows how to do a callback since ajax is asynchronous
$(document).ready(function() {
	ajax("getUsers", {}, getUserID)
	ajax("getLocationsForUser",{"user_id":1},getLocations)
	//ajax("getAllLocationPairs",{"user_id":1},getPairs)
	//ajax("getAllPlacesVisitedFromALocation", {"user_id":1, "location_name": "School"},getPlaces)
});

/* function getPairs(res) {
parsed = JSON.parse(res);
for(p in parsed) {
}
}

function getPlaces(res) {
parsed = JSON.parse(res);
for(p in parsed) {
	console.log(parsed[p]["location_name"]);
}
} */

function getUserID(res) {
var count = 0;
var userArray = [];
	parsed = JSON.parse(res)
	for(p in parsed) {
		count++;
		userArray[p] = parsed[p]["user_id"]
	}
	console.log(userArray);
	console.log(count+" users");
	
	$.each(userArray, function(key, value) {   
	 $('#userlist')
         .append($("<option></option>")
         //.attr("value",key)
		 .attr("id", value)
         .text(value));
	});
}

function getLocations(res){
	var r = [];
	parsed = JSON.parse(res);
	for(p in parsed) {
		//console.log(parsed[p]["location_name"]);
		r[p] = parsed[p]["location_name"];
	}
	var freqArray = getFrequency(r);
	visualize(freqArray);
}

function change() {
	var id = $("#userlist").val();
	console.log(id)
	ajax("getLocationsForUser",{"user_id":id},getLocations);
}

//returns frequency, used for locations visited array
function getFrequency(arr) {
    var freq = {};
	var keyfreq = [];
    for (var i=0; i<arr.length;i++) {
        var str = arr[i]
        if (freq[str]) {
           freq[str]++;
        } else {
           freq[str] = 1;
        }
    }
	for(var f in freq) {
		if(freq[f] >9) {
		keyfreq.push({"name":f,"value":freq[f]});
		}
	}
    return keyfreq;
}