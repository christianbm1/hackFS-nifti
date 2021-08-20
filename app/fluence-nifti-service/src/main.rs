/*
 * Copyright 2021 Fluence Labs Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

use marine_rs_sdk::{marine, module_manifest, MountedBinaryResult};
use serde::{Serialize, Deserialize};
use serde_json;
use geoutils::{Location, Distance};

#[macro_use]
extern crate fstrings;
extern crate geoutils;

module_manifest!();

pub fn main() {}

#[marine]
#[derive(Serialize, Deserialize, Debug, Clone)]

pub struct Res {
    pub lat: f64,
    pub long: f64,
    pub metadata_uri: String,
    pub content_cid: String,
    pub content_filename: String,
    pub chain_id: u64,
    pub contract_address: String,
    pub owner_address: String,
    pub token_id: u64,
    pub category: Vec<u8>,
    pub nsfw: bool,
    pub content_type: String,
    pub name: String,
    pub desc: String,
    pub txn_hash: String,
    pub stat_interaction: u64,
    pub stat_impressions: u64,
    pub key: String
}

#[marine]
pub struct Result {
    pub result: Vec<Res>,
    pub success: bool,
    pub error_msg: String,
}

#[marine]
pub fn proximity_check(my_lat: f64, my_long:f64, i_lat: f64, i_long:f64, dist:f64) -> bool {
    let my_location = Location::new(my_lat, my_long);
    let item_location = Location::new(i_lat, i_long);
    return item_location.is_in_circle(&my_location, Distance::from_meters(dist)).unwrap();
}

#[marine]
pub fn proximity_filter(data_in: Vec<Res>, current_lat: f64, current_long: f64, distance: f64) -> Result {
    //et testobj: Vec<Res> = serde_json::json!(&dataIn);
    let mut vec = Vec::<Res>::new();
    for data in data_in.iter() {
        let cl_res = data.clone();
        if proximity_check(current_lat, current_long, cl_res.lat, cl_res.long, distance) {
            vec.push(cl_res);
        }
    }            
    Result {
        result: vec,
        success: true,
        error_msg: "".to_string(),
    }

    /*let ran_val = Res {
        lat: 0.0,
        long: 0.0,
        tag: "null".to_string(),
        key: "null".to_string()
    };

    let url =
        f!("http://localhost:3000/mq");
    let curl_cmd = vec![
        "-X".to_string(),
        "GET".to_string(),
        "-H".to_string(),
        "Accept: application/json".to_string(),
        url,
    ];
    let response = curl_request(curl_cmd);
    let result = String::from_utf8(response.stdout);

    match result {
        Ok(res) => {
            let json_res: serde_json::Result<serde_json::Value> = serde_json::from_str(&res.clone());

            if json_res.is_err() {
                return Result {
                    result: [ran_val].to_vec(),
                    success: false,
                    error_msg: "Failure to complete call".to_string(),
                };
            }

            let json_res2: Vec<serde_json::Value> = serde_json::from_str(&res.clone()).unwrap();
            let mut vec = Vec::<Res>::new();
            for data in json_res2 {
                if(check_location(current_lat, current_long, data["lat"].as_f64().unwrap(), data["long"].as_f64().unwrap(), distance)){
                    let x = Res {
                        lat: data["lat"].as_f64().unwrap(),
                        long: data["long"].as_f64().unwrap(),
                        tag: data["tag"].to_string(),
                        key: data["key"].to_string()
                    };
                    vec.push(x);
                }
            }            
            Result {
                result: vec,
                success: true,
                error_msg: "".to_string(),
            }
        }
        Err(_) => Result {
            result: [ran_val].to_vec(),
            success: false,
            error_msg: String::from_utf8(response.stderr).unwrap(),
        },
    } */
}

/*#[marine]
#[link(wasm_import_module = "curl_adapter")]
extern "C" {
    pub fn curl_request(cmd: Vec<String>) -> MountedBinaryResult;
}*/


//#[marine]
//#[link(wasm_import_module = "curl_adapter")]
//extern "C" {
//    pub fn curl_request(cmd: Vec<String>) -> MountedBinaryResult;
//}

// To run tests:
// cargo test --release
// Since the unit tests are using the wasm module via the marine_test crate import
// the modules and Config.toml need to exist. That is, run ./build.sh before you run cargo test.
// Moreover, the test function(s) need to be prefixed by the wasm module namespace, which
// generally is derived from the project name.
// if you name the project "greeting", e.g., cargo generate -g https:// ... --name greeting
// the unit test can be executed as is. If not, the project needs to replace the "greeting"
// reference in place
// if
// cargo generate -g https:// ... --name project-name
// then
// let res = project_name.greeting(name.to_string());
#[cfg(test)]
mod tests {
    use marine_rs_sdk_test::marine_test;

    #[marine_test(config_path = "../Config.toml", modules_dir = "../artifacts")]
    fn test_greeting() {
        let name = "Marine";
        let res = nifti_service.price_getter();
        println!("{}", res);
        assert_eq!(res, format!("Hi, {}", name));
    }
}
