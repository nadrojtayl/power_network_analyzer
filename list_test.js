

 	var segment_length = function(node1,node2){
 		var lat_diff = Math.abs(node1[0] - node2[0]);

 		var long_diff = Math.abs(node1[1] - node2[1]);

 		var seg_length = Math.sqrt(lat_diff*lat_diff + long_diff*long_diff)
 		// console.log(lat_diff*lat_diff)
 		return seg_length
 	}

 	 var get_perimeter = function(nodes){
 	 	var perimeter = 0
 	 	var seg_length;
 	 	for(var i = 1;i<nodes.length;i++){
 	 		seg_length = segment_length(nodes[i-1],nodes[i]);
 	 		perimeter = perimeter + seg_length;
 	 	}
 	 	return perimeter;
 	}





 	console.log(segment_length([1,2],[2,3]));

 	var get_percentage_of_differences = function(arr){
 		var percentages = [];
 		var sum = 0;
 		var pct;

 		arr.forEach(function(diff,ind){
 			sum = sum + diff;
 			avg = sum/(ind + 1);
 			pct = diff/avg;
 			percentages.push(pct);

 		})
 		return percentages;

 	}

 	var cluster_nodes = function(numbers){
 		//find a better, machine learning k means clustering way to do this later

 		var sorted = numbers.sort(function(a,b){
 			if(a>b){return 1} return -1;
 		});
 		// console.log("SORTED " + sorted)
 		
 		var differences = [];
 		for(var i =1; i < sorted.length; i++){
 			differences.push(sorted[i] - sorted[i-1]);
 		}
 		// console.log("SORTEDX " + sorted);
 		

 		// var sum_of_differences = differences.reduce(function(a,b){return a+b;})

 		// var percentage_of_differences = differences.map(function(num){return num/sum_of_differences})
// 
 		 var percentage_of_differences = get_percentage_of_differences(differences);
 		
 		 // console.log("END_RESULT" + percentage_of_differences)
 		

 		var sorted_percentage_of_differences = copy_then_sort_array_max_to_lowest(percentage_of_differences);

 		// console.log("SORTED DIFFS " + sorted_percentage_of_differences);

 		var n = sorted.length/2;

 	//	var curr_amount_difference_between_clusters = 0;
 		var curr_max_goodness;
 		var num_break_points;
 		var goodness;

 		var differences = {};

 		var indexes_to_split_clusters_at = {};
 		// console.log()
 		for(var j=1;j<n;j++){
 		//	curr_amount_difference_between_clusters = curr_amount_difference_between_clusters + sorted_percentage_of_differences[i];
 			goodness = sorted_percentage_of_differences[j] - sorted_percentage_of_differences[j-1]
 			// console.log("index " + j)
 			if(curr_max_goodness<Math.abs(goodness) || curr_max_goodness === undefined){
 				curr_max_goodness = Math.abs(goodness);
 				// console.log("GOODNESS " + goodness)
 				num_break_points = j;
 			}
 		}
 		// console.log("MAX GOOD" + curr_max_goodness)
 		// console.log("Clusters " + num_clusters)

 		for(var k = 0;k<num_break_points;k++){
 			differences[sorted_percentage_of_differences[k]] = true;
 		}
 		 
 		// console.log("DIFFS " + JSON.stringify(differences));

 		for(var l = 0;l<percentage_of_differences.length;l++){
 			if(differences[percentage_of_differences[l]]){
 				indexes_to_split_clusters_at[l] = true;
 			}
 		}

 		var clusters = [];
 		var curr_cluster = []
 		for(var m = 0; m<sorted.length;m++){
 			curr_cluster.push(sorted[m]);
 			if(indexes_to_split_clusters_at[m]){
 				clusters.push(curr_cluster);
 				curr_cluster = [];
 			}
 		}

 		clusters.push(curr_cluster);

 		return clusters
 		
 		// console.log(percentage_of_differences);
 	//1,1,3,3,6,6

 	//0,2,0,3,0
 	//0,2/5,0,3/5,0

 	//2/5,


 	//line them up in order
 	//find the differences
 	//find the sum of the differences
 	//find the percentage that each difference is of the total difference
 	//create clusters that maximize for the greatest amount of total difference between sets as a percentage of total difference in the set -- while also having the fewest number of clusters possible -- do this by setting the max number of clusters as the total number of values divided by two
 	//then for n from n = 2 to n = values/2, run through all the percentages, and choose the n highest
 	//for that set of differences, take the percentage of difference between clusters and divide by number of clusters 
 	//choose n = highest for that value and make sets based on that

 		// buildings.forEach(function(building){
 		// 	building
 		// })
 	}

 	function copy_then_sort_array_max_to_lowest(arr){
 		var new_arr = [];
 		arr.forEach(function(num){
 			new_arr.push(num);
 		})

 		new_arr.sort(function(a,b){
 			if(a<b){return 1} return -1;
 		});
 		// console.log("ARR " + new_arr)

 		return new_arr;
 	}


		 console.log(cluster_nodes([1,2,3,300,500]))
		
		
 	console.log("TYPE" + typeof 1)