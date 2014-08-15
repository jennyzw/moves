function ajax(command, params, cb) {  
var server = "http://192.81.129.111:9988"
$.post(server, { "command" : command, args : JSON.stringify(params) }, cb)
}

// initial graph shown when the page loads
$(document).ready(function() {
ajax("getUsers", {}, users);
ajax("getAllLocationPairs",{"user_id":86051179},locations);
});

// gets all the user IDs and places them in user dropdown list
function users(res) {
var userArray = [];
	parsed = JSON.parse(res);
	for(p in parsed) {
		userArray[p] = parsed[p]["user_id"];
	}
	$.each(userArray, function(key, value) {   
	 $('#userlist')
         .append($("<option></option>")
		 .attr("id", value)
         .text(value));
	});
} 

function locations(res) {
	var pairs={};
	parsed = JSON.parse(res);
	for(p in parsed) {
		pairs[p] = parsed[p];
	} 
	visualize(pairs);
}

/* method to filter graph by user, day of week, time of day, etc.
   calls ajax function again with a rewritten callback in order to
   repopulate the data array with new parameters the user has chosen */
function change() {
	var id = $("#userlist").val();
	var dayVal = $('input[name="day"]:checked');
  	var timeVal = $('input[name="time"]:checked');
	// use the .filter function instead of going through a for loop? have to call ajax function again though
	ajax("getAllLocationPairs",{"user_id":id}, function(res) { 
		parsed = JSON.parse(res);
		var pairs = {};
		for(p in parsed) {
			var foundDay = false;
			var foundTime = false;
			for(var i = 0; i<dayVal.length; i++) {
				if(isoStringToDate(parsed[p]["start_date1"]).getDay() == dayVal[i].value)
					foundDay = true;
				for(var j = 0; j < timeVal.length; j++) {
					if(isoStringToDate(parsed[p]["end_date1"]).getHours() == timeVal[j].value)
						foundTime = true;
				}
			}
			if(foundDay && foundTime) {
				pairs[p] = parsed[p];
			}
			// else if(foundTime) {
			// 	pairs[p] = parsed[p];
			// }
		}
	
		visualize(pairs);
	});
}

// function filterTime() {
// 	var id = $("#userlist").val();
// 	var timeVal = $('input[name="time"]:checked');
// 	ajax("getAllLocationPairs",{"user_id":id}, function(res) { 
// 		parsed = JSON.parse(res);
// 		var pairs = {};
// 		for(p in parsed) {
// 			for(var i = 0; i<timeVal.length; i++) {
// 			if(isoStringToDate(parsed[p]["end_date1"]).getHours() == timeVal[i].value) {
// 				pairs[p] = parsed[p];
// 			}
// 		}
// 	} 
// 	visualize(pairs);
// 	});
// }