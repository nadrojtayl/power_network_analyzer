"use strict";
var fs = require("fs");


// takes string left,bottom,right,top defining bounding box
function check_serialized_data(left_bottom_right_top){
    var register = JSON.parse(
        fs.readFileSync(__dirname + "/serialized_osm_data/register.json")
        )
    return register[left_bottom_right_top];
}
var power_data;

// takes string left,bottom,right,top defining bounding box
function load_serialized_data_if_its_there(left_bottom_right_top){
    console.log("Checking if data is already present and serialized for this bounding box...")
    if(check_serialized_data(left_bottom_right_top)){
        console.log("It is...loading data")
        var data_string = fs.readFileSync(__dirname + "/serialized_osm_data/" + left_bottom_right_top + ".json","utf8");
        power_data = JSON.parse(data_string)

        return true;
    }
    console.log("It is not...pulling data from OSM...")
    return false;
}

// console.log(load_serialized_data_if_its_there("10,15,20,25"));
// console.log("DATA" + power_data)
// takes string left,bottom,right,top defining bounding box
function add_to_register(left_bottom_right_top){
        var register = JSON.parse(
            fs.readFileSync(__dirname + "/serialized_osm_data/register.json")
        )
        register[left_bottom_right_top] = true;
        fs.writeFileSync(__dirname + "/serialized_osm_data/register.json", JSON.stringify(register));
        console.log("Serializing data...wrote to register");
}



// add_to_register("5,10,15,20");

//takes [left,bottom,right,top],power_data
function serialize_data_as_json_file_in_serialized_directory(left_bottom_right_top,power_data){
    console.log("Serializing data...")
    var left = left_bottom_right_top[0], bottom = left_bottom_right_top[1],
    right = left_bottom_right_top[2], top = left_bottom_right_top[3];

    var file_name = left + "," + bottom + "," + right + "," + top;
    add_to_register(file_name)
    fs.writeFileSync(__dirname + "/serialized_osm_data/" + file_name + ".json",JSON.stringify(power_data));
}




var fs = require("fs")

class Node {
    constructor(metadata, tags) {
        this.metadata = metadata;
        this.tags = tags;
    }

}



var test_key_value = 'k="name:fr"'

var read_declaration = function(k_v_declaration) {
    // console.log("DECLARE" + k_v_declaration)

    var split_array = k_v_declaration.split("=");
    if (split_array[0] === undefined) {
        split_array[0] = "undefined";
    }

    if (split_array[1] === undefined) {
        split_array[1] = "undefined";
    }

    var meta_data_name = split_array[0].toString().replace("<", "").replace('"', "").replace('"', "");
    var meta_data_value = split_array[1].toString().replace('"', "").replace('"', "");
    return [meta_data_name, meta_data_value];
}


var test_tag = '<tag k="name:fr" v="District de Zhongzheng"/>';

var split_at_first_char = function(string, target_char) {
    var string_array = string.split("");
    var string1 = "";
    var string2 = "";
    var found_char = false;
    string_array.forEach(function(char) {
        if (char === target_char && !found_char) {
            found_char = true;
        } else {
            if (!found_char) {
                string1 = string1 + char;
            } else {
                string2 = string2 + char;
            }
        }
    });

    var result_array = [string1, string2];
    return result_array;
}
//takes input like this 'type="way" ref="364410686" role="outer"', returns an array of tuples matching all keys to values
var split_declarations = function(declaration) {
    var declarations = [];
    var current_kv_declaration = "";
    var lastchar = "";

    var split_array = declaration.split("").forEach(function(char) {
        if (char === " " && lastchar === '"') {
            declarations.push(current_kv_declaration);
            current_kv_declaration = "";
        } else {
            current_kv_declaration = current_kv_declaration + char;
        }
        lastchar = char;
    })

    declarations.push(current_kv_declaration);
    var tuple_array = declarations.map(function(declaration_string) {
        return read_declaration(declaration_string);
    })
    return tuple_array;
}

var test_declaration_list = 'type="way" ref="364410686" role="outer"'



var read_element = function(element_string, element_opening_string) {
    //example of element opening string =<tag 
    var element_string = element_string.replace(element_opening_string, "").replace("/>", "").replace("\n", "").trim();
    var declarations = split_declarations(element_string);
    return declarations;
}




var test_node = '<node id="60655724" lat="25.0323611" lon="121.5182670" version="12" timestamp="2017-09-12T07:31:06Z" changeset="51963093" uid="339581" user="nyuriks"><tag k="is_in" v="Taipei City, Taiwan"/><tag k="is_in:zh" v="台灣台北市"/></node>';

var get_meta_data_from_string = function(meta_data) {
    meta_data = meta_data + ">"
    var meta_tags = [];

    var split_array = meta_data.split("");
    var curr_str = "";
    var last_char;
    var meta_data_map = {};

    split_array.forEach(function(char) {
        if (char === " " && last_char === '"' || (char === ">")) {
            meta_tags.push(curr_str.trim());
            curr_str = "";
        }
        last_char = char;
        curr_str = curr_str + char;
    })
    meta_tags.forEach(function(declaration) {
        if (declaration !== "") {
            var tuple = read_declaration(declaration);
            meta_data_map[tuple[0]] = tuple[1];
        }
    })

    return meta_data_map;
}




var test_elements_list = '<node id="5332858655" lat="25.0454172" lon="121.5193158" version="1" timestamp="2018-01-11T09:06:46Z" changeset="55346108" uid="6802110" user="Bigmorr"/><node id="5333496269" lat="25.0649071" lon="121.5094043" version="1" timestamp="2018-01-11T16:23:48Z" changeset="55356575" uid="7406424" user="捲毛猩猩腸"/>"<node id="5333496270" lat="25.0648639" lon="121.5099250" version="1" timestamp="2018-01-11T16:23:48Z" changeset="55356575" uid="7406424" user="捲毛猩猩腸"/>'


var get_all_elements = function(string) {
    var elements_array = [];
    var split_array = string.split("");
    var curr_element = "";
    var last_char = "";
    split_array.forEach(function(char) {
        if (last_char === ">") {
            elements_array.push(curr_element);
            curr_element = "";
        }
        last_char = char;
        curr_element = curr_element + char;
    })
    return elements_array;
}

var get_elem_name = function(elem_string) {
    return elem_string.trim().split(" ")[0].replace("<", "");
}




var read_tag = function(tag_string) {
    var key_and_value_as_array = read_element(tag_string, "<tag ");
    var key_value = key_and_value_as_array[0][1].replace('"', "").replace('"', "");
    var value_value = key_and_value_as_array[1][1].replace('"', "").replace('"', "");
    return [key_value, value_value];
}


var turn_array_of_tuples_to_map = function(tuple_array) {
    var map = {};
    tuple_array.forEach(function(tuple) {
        map[tuple[0]] = tuple[1];
    })

    return map
}


var read_node = function(node_txt) {
    // if(scanning_unfound){
    //     console.log("TEXT"+ node_txt);
    // }
   
    // console.log("TEXT" + node_txt);
    if ((split_at_first_char(node_txt, ">")[1].length > 20) && !scanning_unfound) {
        node_txt = split_at_first_char(node_txt, ">")[1];
    }

    // if(scanning_unfound){
    //     console.log("TEXT3"+ node_txt);
    // }

    var split_string = split_at_first_char(node_txt, ">");
    // console.log("SPLIT" + split_string);

    var meta_data_part = split_string[0];
    var tags_part = split_string[1];
    var tags = get_all_elements(tags_part).map(function(tag) {
        return read_tag(tag);
    });
    tags = turn_array_of_tuples_to_map(tags);
    var meta_data = get_meta_data_from_string(meta_data_part);

    var node = new Node(meta_data, tags)

    // log = true;
    if(scanning_unfound){
        console.log("node" + JSON.stringify(node));
    }
    return node;
}




var test_way = '<way id="4860359" version="26" timestamp="2017-05-25T05:29:38Z" changeset="48962629" uid="3676463" user="iōngchun"><nd ref="662313734"/><nd ref="3992167379"/><nd ref="2092565984"/><nd ref="4210158333"/><tag k="highway" v="secondary"/><tag k="lanes" v="2"/></way>'
var split_out_different_kinds_of_elements_from_element_list = function(list_string, elements_to_search_for_as_array) {
    var map = {};
    var elem_name = "";
    elements_to_search_for_as_array.forEach(function(elem) {
        map[elem] = [];
    })

    var elems = get_all_elements(list_string);
    elems.forEach(function(elem, ind) {
        elem_name = get_elem_name(elem);
        if (map[elem_name] !== undefined) {
            map[elem_name].push(elem);
        }
    })
    return map;
}

class Way {
    constructor(metadata, node_references, tags) {
        this.metadata = metadata;
        this.node_references = node_references;
        this.tags = tags;
    }
}


var flatten_ref_list = function(ref_array) {
    var finalarray = [];
    ref_array.forEach(function(sub_arr) {
        finalarray.push(sub_arr[0][1]);
    })
    return finalarray;
}

var read_way = function(way_txt) {
    var split_string = split_at_first_char(way_txt, ">");
    var meta_data_part = split_string[0];
    var elements_part = split_string[1].replace("</way>");
    var elements_map = split_out_different_kinds_of_elements_from_element_list(elements_part, ["nd", "tag"]);
    var meta_data = get_meta_data_from_string(meta_data_part);
    var node_references = elements_map["nd"].map(function(ref) {
        return read_element(ref, "<nd ");
    })
    node_references = flatten_ref_list(node_references);

    var tags = elements_map["tag"].map(function(tag) {
        return read_tag(tag);
    })
    tags = turn_array_of_tuples_to_map(tags);

    return new Way(meta_data, node_references, tags);
}



var test_relation = '<relation id="33574" version="13" timestamp="2017-05-24T03:53:29Z" changeset="48933750" uid="1215520" user="bananatw"><member type="way" ref="60793791" role="outer"/><member type="way" ref="364410686" role="outer"/><tag k="addr:city" v="臺北市"/></relation>'

class Relation {
    constructor(metadata, members, tags) {
        this.metadata = metadata;
        this.members = members;
        this.tags = tags;
    }
}

var read_relation = function(relation_txt) {
    var split_string = split_at_first_char(relation_txt, ">");
    var meta_data_part = split_string[0];
    var meta_data = get_meta_data_from_string(meta_data_part);
    var elements_part = split_string[1].replace("</relation>");

    var elements_map = split_out_different_kinds_of_elements_from_element_list(elements_part, ["member", "tag"]);
    var members = elements_map["member"].map(function(member) {
        return read_element(member, "<member ");
    });
    members = members.map(function(member) {
        return turn_array_of_tuples_to_map(member);
    });
    var tags = turn_array_of_tuples_to_map(elements_map["tag"].map(function(tag) {
        return read_tag(tag);
    }));
    return new Relation(meta_data, members, tags);
}



// var test_xml = test_node + test_way + test_relation;
var test_xml = test_node + test_way + test_relation;

var read_xml = function(xml_string) {
    var char_array = xml_string.split("");
    var current_xml_piece = "";
    var element_currently_parsing = "";
    var current_element = "";
    var recording_element = false;
    var last_char = "";

    var results = {
        " />": [],
        "</way>": [],
        "</relation>": []
    }

    var end_tags = {
        "<node>": " />",
        "<way>": "</way>",
        "<relation>": "</relation>"
    }

    var to_ignore = {
        "<osm>": "",
        "<?xml>": "",
        "<bounds>": "",
        "<note>": "",
        "<meta>": "",
        "</note>": ""
    }
    // var identifiers = {
    // "<node>":"</node>",
    // "<way>":"</way>",
    // "<relation>":"</relation>"
    // }

    var parse_functions = {
        " />": read_node,
        "</way>": read_way,
        "</relation>": read_relation
    }

    var currently_parsing = false;

    char_array.forEach(function(char) {
        current_xml_piece = current_xml_piece + char;

        if (char === "<") {
            recording_element = true;
        }

        if ((char === " " || char === ">") && recording_element && (element_currently_parsing == "")) {
            recording_element = false;
            element_currently_parsing = current_element + ">";
            if (to_ignore[element_currently_parsing] === "") {
                element_currently_parsing = "";
                current_xml_piece = "";
            }
            current_element = "";

        }

        if (recording_element) {
            current_element = current_element + char;
        }

        if (char === ">") {
            recording_element = false;

            if ((current_element.includes("node") && current_element.length > 5) || (current_element === "" && last_char === "/")) {
                current_element = " />";
            }

            if (end_tags[element_currently_parsing] === current_element) {
                currently_parsing = current_element;
                element_currently_parsing = "";
                results[current_element].push(parse_functions[current_element](current_xml_piece));
                current_xml_piece = "";
            }


            current_element = "";
        }



        last_char = char;
    });



    var nicer_named_results = {
        "Nodes": results[" />"],
        "Ways": results["</way>"],
        "Relations": results["</relation>"]
    }

    return nicer_named_results;
}



var tag_filter = function(xml_results_array, search_term_array) {

    var tag_filter_helper = function(object) {
        var return_value = false;

        search_term_array.forEach(function(term){
          if (object["tags"][term] !== undefined) {
            return_value = true;
          }  
        })

        return return_value;
    }

    var filtered = {
        "Nodes": xml_results_array["Nodes"],
        "Ways": xml_results_array["Ways"].filter(tag_filter_helper),
        "Relations": xml_results_array["Relations"].filter(tag_filter_helper)
    };
    return filtered;
}



var request = require('request');


//use http://boundingbox.klokantech.com/



//taipei big pull including urban hub, lots of western less urban area: 121.405567,24.998051,121.622547,25.116236
    //building pull for above 121.405567,24.998051,121.622547,25.116237
//taipei southern less urban area: 121.41312,24.914632,121.620487,25.032897
    //building pull for above 121.41312,24.914632,121.620487,25.032898
//taipei eastern less urban area: 121.55045,24.973156,121.757817,25.091364
    // building pull for above 121.55045,24.973156,121.757817,25.091366
//taipei northern urban area: 121.446079,25.067732,121.653446,25.185849
    //building pull for above 121.446079,25.067732,121.653446,25.185850
//taipei big slice western area: 121.303257,24.996184,121.510624,25.114371
     //building pull for above: 121.303257,24.996184,121.510624,25.114372
var coords = [121.55045,24.973156,121.757817,25.091366]
//


//always translate from bounding box to left, bottom, right top like this:
// left,bottom,right,top


var left = coords[0];
var bottom = coords[1];
var right = coords[2];
var top = coords[3];



var power_data = {
    "Nodes": [],
    "Ways": [],
    "Relations": []
}

var nodes_map = {};
var ways_map = {};

var add_nodes_or_ways_to_map = function(map, array) {
    var id;
    var first_node_or_way = array[0]
    var key = (first_node_or_way instanceof Way) ? "way id" : "node id";

    array.forEach(function(node_or_way) {
        id = node_or_way["metadata"][key]
        map[id] = node_or_way;
    })
}

var unfound = []

var change_node_or_way_references_to_objects = function(obj) {
    obj["Nodes"] = obj["Nodes"];

    var notdefined;

    obj["Ways"].forEach(function(way) {
        way["node_references"] = way["node_references"].map(function(ref) {
            notdefined = nodes_map[ref] === undefined;
            if(notdefined){
                unfound.push(ref);
            }
            return notdefined ? ref : nodes_map[ref]
        });
    })

    obj["Relations"].forEach(function(relation) {
        relation["members"] = relation["members"].map(function(member) {
            if (member["type"] === "way") {
                return ways_map[member["ref"]] === undefined ? member : ways_map[member["ref"]];
            } else {
                notdefined = nodes_map[member["ref"]] === undefined;
                if(notdefined){
                    unfound.push(member["ref"]);
                }
                return notdefined ? member : nodes_map[member["ref"]];
            }
        })
    })

    return obj;
}


var array_to_comma_separated_list = function(arr){
    var list = arr[0].toString();
    var elem;

    for (var i =1;i<arr.length;i++){
        elem = arr[i];
        list = list + "," + elem
    }

    return list;
}

var scanning_unfound = false;

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

var num_unfound_bunches;
var unfound_bunches_loaded = 0;

var get_unfound = function(){
    var uniq_unfound = uniq(unfound);

    var amt_in_current_bunch = 0;
    var current_bunch = [];
    var unfound_bunches = [];

    for(var i = 0; i< uniq_unfound.length; i++){
        amt_in_current_bunch++;
        if(amt_in_current_bunch === 600 || i === uniq_unfound.length -1){
            unfound_bunches.push(current_bunch);
            current_bunch = [];
        }
        current_bunch.push(uniq_unfound[i]);
    }

    num_unfound_bunches = unfound_bunches.length;

    for(var j = 0;j<num_unfound_bunches;j++){
        make_unfound_request(unfound_bunches[j]);
    }
    console.log("Found " + num_unfound_bunches + "bunches of ~600 unfound nodes each")

}

var make_unfound_request = function(arr_of_unfound_nodes){
    var url = 'https://api.openstreetmap.org/api/0.6/nodes?nodes=' + array_to_comma_separated_list(arr_of_unfound_nodes)

    request(url, function(error, response, body) {
        console.log("REPLY FOR UNFOUND bunch #" + (unfound_bunches_loaded + 1));
        console.log(body);
        scanning_unfound = true;
        console.log("Got unfound nodes from OSM via API request")
        // console.log("UNFOUND RES" + body);
        var unfound_data = read_xml(body);
        // console.log("UNFOUND DATA" + JSON.stringify(unfound_data));
        add_nodes_or_ways_to_map(nodes_map, unfound_data["Nodes"]);
        unfound_bunches_loaded++;

        if(unfound_bunches_loaded === num_unfound_bunches){
            change_node_or_way_references_to_objects(power_data);
            console.log("Server ready to send power data");
            power_data["Nodes"] = [];
            serialize_data_as_json_file_in_serialized_directory([left,bottom,right,top],power_data);
            JSON.stringify(power_data);
        }
    });
}




var boxes_expected;
var boxes_loaded = 0;

var get_objects_for_box = function(left, bottom, right, top) {
    console.log("Making request");
    // console.log("BOX2"+ bottom);
    // left = 11.5636649525,bottom = 48.1742469614, right = 11.5956797993,top = 48.1883827229
    var url = 'https://api.openstreetmap.org/api/0.6/map?bbox=' + left + "," + bottom + "," + right + "," + top;
    request(url, function(error, response, body) {
        console.log('error:', error); // Print the error if one occurred
         // console.log("BODY"+ body);
        // console.log("DATA" + power_data["Nodes"]);
        var data = read_xml(body);
        // console.log(body);
        // console.log(body);
        if(body.length<5000){
            console.log(body);
            console.log("Shut out of OSM for too many requests...serializing the data we did manage to grab")
            serialize_data_as_json_file_in_serialized_directory([left,bottom,right,top],power_data);
            power_data = JSON.stringify(power_data)
        }
        add_nodes_or_ways_to_map(nodes_map, data["Nodes"]);


        add_nodes_or_ways_to_map(ways_map, data["Ways"]);

        // data = change_node_or_way_references_to_objects(data);

        var box_data = tag_filter(data, ["building","power"]);

        box_data = change_node_or_way_references_to_objects(box_data);

        var nodes_count = box_data["Nodes"].length;
        var ways_count = box_data["Ways"].length;
        var relations_count = box_data["Relations"].length;

        console.log("Found " + nodes_count + " nodes " + ways_count + " ways " + relations_count + " relations" );

        power_data["Nodes"] = power_data["Nodes"].concat(box_data["Nodes"])
        power_data["Ways"] = power_data["Ways"].concat(box_data["Ways"])
        power_data["Relations"] = power_data["Relations"].concat(box_data["Relations"])

        boxes_loaded = boxes_loaded + 1;
        console.log("Loaded " + boxes_loaded + " of " + boxes_expected + "boxes");
        if(boxes_loaded === boxes_expected){
            console.log("Didn't find these nodes " + unfound);
             console.log("Fetching those nodes");
            if(unfound.length > 0){
                console.log("UNFOUND" + JSON.stringify(unfound));
                get_unfound();
            } else {
               console.log("Found " + power_data["Nodes"].length + " nodes");
                console.log("Found " + power_data["Ways"].length + " ways");
                console.log("Found " + power_data["Relations"].length + " relations");
                power_data["Nodes"] = [];
                serialize_data_as_json_file_in_serialized_directory([left,bottom,right,top],power_data);
                power_data = JSON.stringify(power_data)
            }
             // console.log("Server ready to send power data");

             
             // power_data = JSON.stringify(power_data);
             
        }
        // power_data = JSON.stringify(power_data);
        
    });
}

var boxes_coords;


function read_data_if_there(left,bottom,right,top){
    var file_name = left + "," + bottom + "," + right + ',' + top + ".json";
    console.log("TRYING TO READ FROM " + file_name)
    var files = fs.readdirSync(__dirname + "/serialized_osm_data");
    console.log(files)
    if(files.indexOf(file_name) !== -1){
        var path = __dirname + "/serialized_osm_data/" + file_name
        return fs.readFileSync(path);
    } else {
        return false;
    }
}
function serialize(){
    var file_name = left + "," + bottom + "," + right + ',' + top
    console.log("Serializing to file " + file_name)
    fs.writeFileSync(__dirname + "/serialized_osm_data/" + file_name,power_data)
    
}

function create_dictionary_node_id_to_obj(node_arr){
    var dict = {};
    var id;

    node_arr.forEach(function(node){
        id = node["metadata"]["node id"];
        dict[id] = node;
    })

    return dict;
}

function turn_array_to_comma_separated_list(arr){
    var str = "";
    arr.forEach(function(elem,ind){
        if(ind < arr.length-1){
            str = str + elem + ",";
        } else {
            str = str + elem;
        }
    })
    return str;

}

function get_unfound_nodes_from_OSM_API(unfound_array){
    var url = 'https://api.openstreetmap.org/api/0.6/nodes?nodes=' + 
    turn_array_to_comma_separated_list(unfound_array);

    request(url, function(error, response, body) {
      var data = read_xml(body);
      var dictionary_node_id_to_obj = create_dictionary_node_id_to_obj(data["Nodes"]);
      var node_obj;

        power_data["Ways"].forEach(function(Way){
            Way.node_references.forEach(function(node_id,ind){
                node_obj = dictionary_node_id_to_obj[node_id];
                    Way["node_references"][ind] = dictionary_node_id_to_obj[node_id];
            })
        })  
        // console.log(power_data["Ways"])
        power_data = JSON.stringify(power_data);
        serialize();
        
    });


}

function turn_node_references_to_objects(){
    var dictionary_node_id_to_obj = create_dictionary_node_id_to_obj(power_data["Nodes"]);
    var unfound_array = [];
    // console.log("Length is");
    // console.log(Object.keys(dictionary_node_id_to_obj).length)
    var node_obj;

    power_data["Ways"].forEach(function(Way){
        Way.node_references.forEach(function(node_id,ind){
            node_obj = dictionary_node_id_to_obj[node_id];
            // console.log(typeof node_obj)
            if(typeof node_obj !== "object" && typeof node_id === "string"){
                // console.log(node_id);
                unfound_array.push(node_id);
            } else {
                // console.log("HERE")
                Way["node_references"][ind] = dictionary_node_id_to_obj[node_id];
                // console.log(dictionary_node_id_to_obj[node_id]);
            }
        })
    })
    console.log("Didn't find these nodes ")
    console.log(power_data["Ways"])
    console.log(unfound_array);
    get_unfound_nodes_from_OSM_API(unfound_array)
    power_data["Nodes"] = [];
}

var turn_coords_into_grid = function(coords) {
    var boxes = [];

    var acceptable_lat = 0.0141;
    var acceptable_long = 0.03201;

    var box_left = coords[0];
    var box_bottom = coords[1];
    var box_right = coords[2];
    var box_top = coords[3];

    var long_dif = coords[2] - coords[0];
    var lat_dif = coords[3] - coords[1];


    var rows = parseInt(lat_dif / acceptable_lat);
    var columns = parseInt(long_dif / acceptable_long);
    // console.log("DIF" + lat_dif);

    var left;
    var bottom;
    var right;
    var top;
    var box;

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            left = box_left + (j * acceptable_long);
            top = box_top - (i * acceptable_lat);

            right = left + acceptable_long;
            bottom = top - acceptable_lat;
            box = [left, bottom, right, top]
            // console.log("BOX IS " + box);
            boxes.push(box)
            // console.log("BOX" + [left,bottom,right,top]);
        }
    }
    boxes_coords = boxes;
    return boxes;

}



var get_power_objects_by_coordinates = function(left, bottom, right, top) {
    var serialized_data = read_data_if_there(left,bottom,right,top)
    if(serialized_data !== false){
        power_data = JSON. parse(serialized_data);
    } else {
        var boxes = turn_coords_into_grid([left, bottom, right, top])
        boxes_expected = boxes.length;
        console.log("Found " + boxes_expected + " boxes in the area you're pulling data for");
        boxes.forEach(function(box, ind) {
            get_objects_for_box(box[0], box[1], box[2], box[3]);
        });
    }

}

var app = require("express")();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => res.sendFile(__dirname + "/map.html"))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

app.get("/data", function(req, res) {
    console.log("Sent power_data");
    res.send(power_data);
})

app.get("/latlong", function(req, res) {
    var lat_long = [
        [top, left],
        [bottom, right]
    ]
    res.send(JSON.stringify(lat_long));
})

app.get("/boxes", function(req, res) {
 
    res.send(JSON.stringify(boxes_coords))  ;
})


 var node_txt = '<node id="5170844277" visible="true" version="1" changeset="52975572" timestamp="2017-10-16T08:50:41Z" user="Miller Liu" uid="5443326" lat="25.0907868" lon="121.5290472"><tag k="power" v="tower"/></node>'
// console.log(read_node(node_txt));
exports = {"read_xml":read_xml};

get_power_objects_by_coordinates(left, bottom, right, top);
console.log(check_serialized_data("example2"))