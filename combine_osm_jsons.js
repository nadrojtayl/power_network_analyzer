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

var example_buildings = JSON.parse('[{"metadata":{"way id":"423669795","visible":"true","version":"1","changeset":"39889524","timestamp":"2016-06-08T17:19:44Z","user":"Supaplex","uid":"274857"},"nodes":[[25.0564819,121.6365708],[25.0564051,121.6366284],[25.0563094,121.636473],[25.0563862,121.6364153],[25.0564819,121.6365708]],"tags":{"building":"industrial","name":"台鐵南港變電站","power":"substation"}}]');


function distance_between_two_lat_longs(latlong1,latlong2){
	var lat_dist = Math.abs(latlong1[0] - latlong2[0]);
	var long_dist = Math.abs(latlong1[1] - latlong2[1]);
	return Math.sqrt((lat_dist*lat_dist) + (long_dist*long_dist))
}


function assign_center_to_buildings(building_array){
	var nodes;

	building_array.forEach(function(building){
		
		nodes = building["nodes"];
		building["center_lat_long"] = get_center(nodes);
	})
}

function get_center(nodes){
	var num_nodes = nodes.length;
	var lat_sum = 0;
	var long_sum = 0;
	nodes.forEach(function(node){
		lat_sum += node[0];
		long_sum += node[1];
	})


	var lat_center = lat_sum/num_nodes;
	var long_center = long_sum/num_nodes;
	return [lat_center,long_center]
}


function assign_served_buildings_to_substation(substation_array,array_all_buildings){
	var buildings_served;
	substation_array.forEach(function(substation){
		buildings_served = [];
		substation["buildings_served"] = buildings_served;
	})

	var closest_substation;
	var distance;
	var smallest_distance = Infinity;

	array_all_buildings.forEach(function(building){
		substation_array.forEach(function(substation){
			distance = distance_between_two_lat_longs(building["center_lat_long"],substation["center_lat_long"])
			if(distance < smallest_distance){
				smallest_distance = distance;
				closest_substation = substation;
			}
		})
		closest_substation["buildings_served"].push(building);
	})


}

function assign_outer_ring_for_graphing_purposes(substation){
	var buildings_served = substation["buildings_served"];
	var point_farthest_north;
	var point_farthest_south;
	var point_farthest_east;
	var point_farthest_west;

	var center; 
	var latitude;
	var longitude;

	buildings_served.forEach(function(building){
		center = building["center_lat_long"], latitude = center[0], longitude = center[1];
		if(point_farthest_north === undefined || latitude > point_farthest_north[0]){
			point_farthest_north = building;
		}
		if(point_farthest_south === undefined || latitude < point_farthest_south[0]){
			point_farthest_south = building;
		}
		if(point_farthest_east === undefined || longitude > point_farthest_east[1]){
			point_farthest_east = building;
		}
		if(point_farthest_west === undefined || longitude < point_farthest_west[1]){
			point_farthest_west = building;
		}
	})

	substation["outer-ring"] = [point_farthest_north,point_farthest_south,point_farthest_east,point_farthest_west];

}

function map_outer_ring(){
	
}

// function find_closest_buildings_to_each_substation =

