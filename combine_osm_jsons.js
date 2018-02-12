var fs = require("fs");
var data = {"Nodes":[],"Ways":[],"Relations":[]}

function concat_files(array_of_filenames){
	for(var i = 0;i<array_of_filenames.length;i++){
		var file_data = fs.readFileSync(__dirname + filename + ".json");
		data["Ways"] = data["Ways"].concat(file_data["Ways"])
		data["Nodes"] = data["Nodes"].concat(file_data["Nodes"])
		data["Relations"] = data["Relations"].concat(file_data["Relations"])
	}
}

// function unique_data(){
// 	var way_ids = {};
// 	var relation_ids = {};

// 	var filtered_ways = [];
// 	var filtered_relations [];

// 	var id;
// 	data["Ways"].forEach(function(way){
// 		if(way_ids[])
// 	})
// }

