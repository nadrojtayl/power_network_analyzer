"use strict";

var scanning_unfound = false;

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



var tag_filter = function(xml_results_array, search_term) {

    var tag_filter_helper = function(object) {
        if (object["tags"][search_term] !== undefined) {
            return true
        }
        return false;
    }

    var filtered = {
        "Nodes": xml_results_array["Nodes"],
        "Ways": xml_results_array["Ways"].filter(tag_filter_helper),
        "Relations": xml_results_array["Relations"].filter(tag_filter_helper)
    };
    return filtered;
}

module.exports = {
    "read_xml":read_xml,
    "Way": Way,
    "Node": Node,
    "Relation":Relation
}