use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use wasm_bindgen::prelude::*;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct VehicleStats {
    pub spd: u8,
    pub acc: u8,
    pub pwr: u8,
    pub hnd: u8,
    pub brk: u8,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Vehicle {
    pub id: u32,
    pub make: String,
    pub name: String,
    pub yr: u32,
    pub cat: String,
    pub tier: String,
    pub hp: u32,
    pub tor: String,
    pub eng: String,
    pub spd: String,
    pub wt: String,
    pub a0: String,
    pub pr: String,
    pub ctry: String,
    pub stats: VehicleStats,
    pub rt: u8,
    pub desc: String,
}

static VEHICLES: Lazy<Mutex<Vec<Vehicle>>> = Lazy::new(|| Mutex::new(Vec::new()));

#[wasm_bindgen]
pub fn set_vehicles(vehicles_json: &str) -> Result<(), JsValue> {
    let parsed: Vec<Vehicle> = serde_json::from_str(vehicles_json)
        .map_err(|e| JsValue::from_str(&format!("vehicles_json parse error: {e}")))?;
    let mut slot = VEHICLES.lock().unwrap();
    *slot = parsed;
    Ok(())
}

#[wasm_bindgen]
pub fn filter_vehicles(query: &str, category_key: &str) -> Result<JsValue, JsValue> {
    let q = query.trim().to_lowercase();
    let cat = category_key.trim().to_lowercase();

    let slot = VEHICLES.lock().unwrap();
    if slot.is_empty() {
        return Ok(serde_wasm_bindgen::to_value(&Vec::<usize>::new()).unwrap());
    }

    let indices: Vec<usize> = slot
        .iter()
        .enumerate()
        .filter(|(_, v)| {
            let ok_cat = if cat == "all" {
                true
            } else if cat == "bronze" {
                v.tier == "bronze"
            } else {
                // Our frontend uses category keys like 'hypercar', 'supercar', 'ev', etc.
                v.cat == cat
            };

            if !ok_cat {
                return false;
            }
            if q.is_empty() {
                return true;
            }

            let blob = format!(
                "{} {} {} {} {}",
                v.make, v.name, v.ctry, v.cat, v.tier
            )
            .to_lowercase();
            blob.contains(&q)
        })
        .map(|(i, _)| i)
        .collect();

    serde_wasm_bindgen::to_value(&indices).map_err(|e| JsValue::from_str(&e.to_string()))
}

