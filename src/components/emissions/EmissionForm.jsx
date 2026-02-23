import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  StationaryCombustionFields,
  MobileCombustionFields,
  RefrigerationFields,
  FireSuppressionFields,
  STATIONARY_COMBUSTION_FUELS,
  REFRIGERANT_GWP_FACTORS,
  FIRE_SUPPRESSION_GWP_FACTORS,
} from "./CombustionFields";



const SCOPE_1_CATEGORIES = [
  { 
    value: "stationary_combustion", 
    label: "Stationary Combustion", 
    sources: STATIONARY_COMBUSTION_FUELS.map(f => f.name),
    needsDetailedFields: true
  },
  { 
    value: "mobile_sources", 
    label: "Mobile Sources", 
    sources: ["Mobile Sources"],
    needsDetailedFields: true
  },
  { value: "refrigeration_ac", label: "Refrigeration and A/C Equipment Use", sources: ["Refrigerants", "Air Conditioning Units"] },
  { value: "fire_suppression", label: "Fire Suppression", sources: ["Fire Suppressants", "Halon", "CO2 Systems"] },
  { value: "purchased_gases", label: "Purchased Gases", sources: ["Nitrogen", "Oxygen", "Argon", "Other Industrial Gases"] }
];

const SCOPE_2_CATEGORIES = [
  { value: "purchased_electricity", label: "Purchased Electricity", sources: [] },
  { value: "purchased_steam", label: "Purchased Steam", sources: [] }
];

const SCOPE_3_CATEGORIES = [
  { value: "business_travel", label: "Business Travel", sources: [] },
  { value: "commuting", label: "Employee Commuting", sources: [] },
  { value: "upstream_transport", label: "Upstream Transport and Distribution", sources: [] },
  { value: "waste", label: "Waste", sources: [] },
  { value: "offsets", label: "Offsets", sources: [] }
];

const BUSINESS_TRAVEL_FACTORS = {
  "Passenger Car":                                  { co2: 0.306, ch4: 0.009,   n2o: 0.006,  unit: "vehicle-mile" },
  "Light-Duty Truck":                               { co2: 0.405, ch4: 0.011,   n2o: 0.010,  unit: "vehicle-mile" },
  "Motorcycle":                                     { co2: 0.376, ch4: 0.091,   n2o: 0.019,  unit: "vehicle-mile" },
  "Intercity Rail - Northeast Corridor":            { co2: 0.058, ch4: 0.0055,  n2o: 0.0007, unit: "passenger-mile" },
  "Intercity Rail - Other Routes":                  { co2: 0.150, ch4: 0.0117,  n2o: 0.0038, unit: "passenger-mile" },
  "Intercity Rail - National Average":              { co2: 0.113, ch4: 0.0092,  n2o: 0.0026, unit: "passenger-mile" },
  "Commuter Rail":                                  { co2: 0.133, ch4: 0.0105,  n2o: 0.0026, unit: "passenger-mile" },
  "Transit Rail (i.e. Subway, Tram)":              { co2: 0.093, ch4: 0.0075,  n2o: 0.0010, unit: "passenger-mile" },
  "Bus":                                            { co2: 0.071, ch4: 0.0050,  n2o: 0.0021, unit: "passenger-mile" },
  "Air Short Haul (< 300 miles)":                  { co2: 0.207, ch4: 0.0064,  n2o: 0.0066, unit: "passenger-mile" },
  "Air Medium Haul (>= 300 miles, < 2300 miles)":  { co2: 0.129, ch4: 0.0006,  n2o: 0.0041, unit: "passenger-mile" },
  "Air Long Haul (>= 2300 miles)":                 { co2: 0.163, ch4: 0.0006,  n2o: 0.0052, unit: "passenger-mile" }
};

const COMMUTING_MODES = Object.keys(BUSINESS_TRAVEL_FACTORS).filter(m => !m.startsWith("Air"));

const UPSTREAM_TRANSPORT_VEHICLE_MILE = {
  "Passenger Car":                { co2: 0.306, ch4: 0.009,  n2o: 0.006,  unit: "vehicle-mile" },
  "Light-Duty Truck":             { co2: 0.405, ch4: 0.011,  n2o: 0.010,  unit: "vehicle-mile" },
  "Medium- and Heavy-Duty Truck": { co2: 1.360, ch4: 0.012,  n2o: 0.038,  unit: "vehicle-mile" },
};

const UPSTREAM_TRANSPORT_TON_MILE = {
  "Medium- and Heavy-Duty Truck": { co2: 0.168, ch4: 0.0015, n2o: 0.0047, unit: "short ton-mile" },
  "Rail":                         { co2: 0.022, ch4: 0.0017, n2o: 0.0005, unit: "short ton-mile" },
  "Waterborne Craft":             { co2: 0.082, ch4: 0.0326, n2o: 0.0021, unit: "short ton-mile" },
  "Aircraft":                     { co2: 0.905, ch4: 0,      n2o: 0.0279, unit: "short ton-mile" },
};

const EGRID_SUBREGIONS = {
  "ASCC Alaska Grid": { co2: 1052.1, ch4: 0.088, n2o: 0.012 },
  "ASCC Miscellaneous": { co2: 495.8, ch4: 0.023, n2o: 0.004 },
  "WECC Southwest": { co2: 776.0, ch4: 0.051, n2o: 0.007 },
  "WECC California": { co2: 497.4, ch4: 0.030, n2o: 0.004 },
  "ERCOT All": { co2: 771.1, ch4: 0.049, n2o: 0.007 },
  "FRCC All": { co2: 813.8, ch4: 0.048, n2o: 0.006 },
  "HICC Miscellaneous": { co2: 1155.5, ch4: 0.124, n2o: 0.019 },
  "HICC Oahu": { co2: 1575.4, ch4: 0.183, n2o: 0.025 },
  "MRO East": { co2: 1642.8, ch4: 0.123, n2o: 0.019 },
  "MRO West": { co2: 936.5, ch4: 0.102, n2o: 0.015 },
  "NPCC New England": { co2: 538.4, ch4: 0.063, n2o: 0.008 },
  "WECC Northwest": { co2: 602.1, ch4: 0.056, n2o: 0.008 },
  "NPCC NYC/Westchester": { co2: 885.2, ch4: 0.023, n2o: 0.003 },
  "NPCC Long Island": { co2: 1200.7, ch4: 0.135, n2o: 0.018 },
  "NPCC Upstate NY": { co2: 274.6, ch4: 0.015, n2o: 0.002 },
  "Puerto Rico Miscellaneous": { co2: 1593.5, ch4: 0.087, n2o: 0.014 },
  "RFC East": { co2: 657.4, ch4: 0.045, n2o: 0.006 },
  "RFC Michigan": { co2: 1216.4, ch4: 0.116, n2o: 0.016 },
  "RFC West": { co2: 1000.1, ch4: 0.087, n2o: 0.012 },
  "WECC Rockies": { co2: 1124.9, ch4: 0.101, n2o: 0.014 },
  "SPP North": { co2: 952.6, ch4: 0.100, n2o: 0.014 },
  "SPP South": { co2: 970.4, ch4: 0.072, n2o: 0.010 },
  "SERC Mississippi Valley": { co2: 801.0, ch4: 0.040, n2o: 0.006 },
  "SERC Midwest": { co2: 1369.9, ch4: 0.151, n2o: 0.022 },
  "SERC South": { co2: 893.3, ch4: 0.064, n2o: 0.009 },
  "SERC Tennessee Valley": { co2: 933.1, ch4: 0.082, n2o: 0.012 },
  "SERC Virginia/Carolina": { co2: 823.0, ch4: 0.047, n2o: 0.007 },
  "US Average": { co2: 856.1, ch4: 0.066, n2o: 0.009 }
};

const VEHICLE_TYPES = [
  { name: "Passenger Cars", mpg: 24.8 },
  { name: "Other 2-Axle, 4-Tire Vehicles", mpg: 18.1 },
  { name: "Motorcycles", mpg: 44.0 },
  { name: "Single unit 2-Axle 6-Tire or More Trucks", mpg: 7.9 },
  { name: "Combination Trucks", mpg: 6.9 },
  { name: "Diesel Buses (Diesel Heavy-Duty Vehicles)", mpg: 7.4 }
];



const PURCHASED_GASES_GWP_FACTORS = {
  "Carbon Dioxide (CO2)": 1, "Methane (CH4)": 28, "Nitrous Oxide (N2O)": 265,
  "Sulphur hexafluoride (SF6)": 23500, "Nitrogen Trifluoride (NF3)": 16100,
  "CF4 (PFC)": 6630, "C2F6 (PFC)": 11100, "C3F8 (PFC)": 8900, "C4F10 (PFC)": 9200,
  "C5F12 (PFC)": 8550, "C6F14 (PFC)": 7910, "HFC-23": 12400, "HFC-32": 677,
  "HFC-41": 116, "HFC-125": 3170, "HFC-134": 1120, "HFC-134a": 1300, "HFC-143": 328,
  "HFC-143a": 4800, "HFC-152a": 138, "HFC-227ea": 3350, "HFC-236fa": 8060,
  "HFC-245fa": 858, "HFC-365mfc": 804, "HFC-43-10mee": 1650,
};

const STATIONARY_COMBUSTION_FACTORS = {
  "Natural Gas": { co2PerMmBtu: 53.06 },
  "Distillate Fuel Oil No. 2": { co2PerMmBtu: 73.96 },
  "Residual Fuel Oil No. 6": { co2PerMmBtu: 75.10 },
  "Kerosene": { co2PerMmBtu: 75.20 },
  "Liquefied Petroleum Gases (LPG)": { co2PerMmBtu: 61.71 },
  "Anthracite Coal": { co2PerMmBtu: 103.69 },
  "Bituminous Coal": { co2PerMmBtu: 93.28 },
  "Sub-bituminous Coal": { co2PerMmBtu: 97.17 },
  "Lignite Coal": { co2PerMmBtu: 97.72 },
  "Mixed (Commercial Sector)": { co2PerMmBtu: 94.27 },
  "Mixed (Electric Power Sector)": { co2PerMmBtu: 95.52 },
  "Mixed (Industrial Coking)": { co2PerMmBtu: 93.9 },
  "Mixed (Industrial Sector)": { co2PerMmBtu: 94.67 },
  "Coal Coke": { co2PerMmBtu: 113.67 },
  "Municipal Solid Waste": { co2PerMmBtu: 90.7 },
  "Petroleum Coke (Solid)": { co2PerMmBtu: 102.41 },
  "Plastics": { co2PerMmBtu: 75 },
  "Tires": { co2PerMmBtu: 85.97 },
  "Agricultural Byproducts": { co2PerMmBtu: 118.17 },
  "Peat": { co2PerMmBtu: 111.84 },
  "Solid Byproducts": { co2PerMmBtu: 105.51 },
  "Wood and Wood Residuals": { co2PerMmBtu: 0 },
  "Propane Gas": { co2PerMmBtu: 61.46 },
  "Landfill Gas": { co2PerMmBtu: 0 },
  "Biodiesel (100%)": { co2PerMmBtu: 73.84 },
  "Ethanol (100%)": { co2PerMmBtu: 68.44 },
  "Rendered Animal Fat": { co2PerMmBtu: 71.06 },
  "Vegetable Oil": { co2PerMmBtu: 81.55 }
};

const EMISSION_FACTORS = {
  "Natural Gas": { factor: 0.00205, unit: "therms" },
  "Diesel": { factor: 0.00268, unit: "liters" },
  "Propane": { factor: 0.00159, unit: "liters" },
  "Fuel Oil": { factor: 0.00275, unit: "liters" },
  "Coal": { factor: 0.00247, unit: "kg" },
  "Fleet Vehicles - Gasoline": { factor: 0.00023, unit: "km" },
  "Fleet Vehicles - Diesel": { factor: 0.00027, unit: "km" },
  "Company Aircraft": { factor: 0.00025, unit: "km" },
  "Company Vessels": { factor: 0.00015, unit: "nautical miles" },
  "Refrigerants": { factor: 1.43, unit: "kg" },
  "Air Conditioning Units": { factor: 1.81, unit: "kg" },
  "Fire Suppressants": { factor: 7.14, unit: "kg" },
  "Chemical Processes": { factor: 0.5, unit: "tonnes" },
  "Manufacturing": { factor: 0.3, unit: "tonnes" },
  "Waste Treatment": { factor: 0.2, unit: "tonnes" },
  "Grid Electricity": { factor: 0.000417, unit: "kWh" },
  "Renewable Electricity": { factor: 0.00002, unit: "kWh" },
  "District Heating": { factor: 0.00019, unit: "kWh" },
  "Steam": { factor: 0.00022, unit: "kg" },
  "District Cooling": { factor: 0.00015, unit: "kWh" },
  "Chilled Water": { factor: 0.00012, unit: "kWh" }
};

// WARM Emission Factors (MT CO2e per short ton)
// Columns: recycled, landfilled, combusted, composted, anaerobically_digested
const WASTE_EMISSION_FACTORS = {
  "Grains":                               { recycled: null,  landfilled: 2.06,  combusted: 0.05, composted: 0.11, anaerobically_digested: 0.14 },
  "Bread":                                { recycled: null,  landfilled: 1.49,  combusted: 0.05, composted: 0.11, anaerobically_digested: 0.14 },
  "Fruits and Vegetables":                { recycled: null,  landfilled: 1.05,  combusted: 0.05, composted: 0.11, anaerobically_digested: 0.14 },
  "Dairy Products":                       { recycled: null,  landfilled: 0.72,  combusted: 0.05, composted: 0.11, anaerobically_digested: 0.11 },
  "Yard Trimmings":                       { recycled: null,  landfilled: 0.36,  combusted: 0.05, composted: 0.14, anaerobically_digested: null  },
  "Grass":                                { recycled: null,  landfilled: 0.28,  combusted: 0.05, composted: 0.14, anaerobically_digested: 0.09  },
  "Leaves":                               { recycled: null,  landfilled: 0.28,  combusted: 0.05, composted: 0.14, anaerobically_digested: 0.12  },
  "Branches":                             { recycled: null,  landfilled: 0.58,  combusted: 0.05, composted: 0.14, anaerobically_digested: 0.15  },
  "Mixed Paper (general)":                { recycled: 0.07,  landfilled: 0.89,  combusted: 0.05, composted: null, anaerobically_digested: null  },
  "Mixed Paper (primarily residential)":  { recycled: 0.07,  landfilled: 0.86,  combusted: 0.05, composted: null, anaerobically_digested: null  },
  "Mixed Paper (primarily from offices)": { recycled: 0.03,  landfilled: 0.84,  combusted: 0.05, composted: null, anaerobically_digested: null  },
  "Mixed Metals":                         { recycled: 0.23,  landfilled: 0.02,  combusted: 0.01, composted: null, anaerobically_digested: null  },
  "Mixed Plastics":                       { recycled: 0.22,  landfilled: 0.02,  combusted: 2.34, composted: null, anaerobically_digested: null  },
  "Mixed Recyclables":                    { recycled: 0.09,  landfilled: 0.75,  combusted: 0.05, composted: null, anaerobically_digested: null  },
  "Food Waste":                           { recycled: null,  landfilled: 0.68,  combusted: 0.05, composted: 0.11, anaerobically_digested: 0.13  },
  "Mixed Organics":                       { recycled: null,  landfilled: 0.50,  combusted: 0.05, composted: 0.13, anaerobically_digested: null  },
  "Mixed MSW (municipal solid waste)":    { recycled: null,  landfilled: 0.58,  combusted: 0.43, composted: null, anaerobically_digested: null  },
  "Carpet":                               { recycled: null,  landfilled: 0.02,  combusted: 1.68, composted: null, anaerobically_digested: null  },
  "Desktop CPUs":                         { recycled: 0.01,  landfilled: 0.02,  combusted: 0.40, composted: null, anaerobically_digested: null  },
  "Portable Electronic Devices":          { recycled: 0.01,  landfilled: 0.02,  combusted: 0.89, composted: null, anaerobically_digested: null  },
  "Flat-panel Displays":                  { recycled: 0.02,  landfilled: 0.02,  combusted: 0.74, composted: null, anaerobically_digested: null  },
  "CRT Displays":                         { recycled: 0.02,  landfilled: 0.02,  combusted: 0.64, composted: null, anaerobically_digested: null  },
  "Electronic Peripherals":               { recycled: 0.05,  landfilled: 0.02,  combusted: 1.23, composted: null, anaerobically_digested: null  },
  "Hard-copy Devices":                    { recycled: 0.01,  landfilled: 0.02,  combusted: 1.92, composted: null, anaerobically_digested: null  },
  "Mixed Electronics":                    { recycled: 0.02,  landfilled: 0.02,  combusted: 0.96, composted: null, anaerobically_digested: null  },
  "Clay Bricks":                          { recycled: 0.02,  landfilled: 0.02,  combusted: null, composted: null, anaerobically_digested: null  },
  "Concrete":                             { recycled: 0.01,  landfilled: 0.02,  combusted: null, composted: null, anaerobically_digested: null  },
  "Fly Ash":                              { recycled: null,  landfilled: null,   combusted: null, composted: null, anaerobically_digested: null  },
  "Tires":                                { recycled: 0.10,  landfilled: 0.02,  combusted: 2.21, composted: null, anaerobically_digested: null  },
  "Asphalt Concrete":                     { recycled: 0.004, landfilled: 0.02,  combusted: null, composted: null, anaerobically_digested: null  },
  "Asphalt Shingles":                     { recycled: 0.03,  landfilled: 0.02,  combusted: 0.70, composted: null, anaerobically_digested: null  },
  "Drywall":                              { recycled: 0.05,  landfilled: 0.02,  combusted: null, composted: null, anaerobically_digested: null  },
  "Fiberglass Insulation":                { recycled: 0.05,  landfilled: 0.02,  combusted: null, composted: null, anaerobically_digested: null  },
  "Structural Steel":                     { recycled: 0.04,  landfilled: 0.02,  combusted: null, composted: null, anaerobically_digested: null  },
  "Vinyl Flooring":                       { recycled: null,  landfilled: 0.02,  combusted: 0.29, composted: null, anaerobically_digested: null  },
  "Wood Flooring":                        { recycled: null,  landfilled: 0.18,  combusted: null, composted: null, anaerobically_digested: 0.08  },
};

const WASTE_DISPOSAL_LABELS = {
  recycled:               "Recycled",
  landfilled:             "Landfilled",
  combusted:              "Combusted (Waste-to-Energy)",
  composted:              "Composted",
  anaerobically_digested: "Anaerobically Digested",
};

const REPORTING_PERIODS = [
  "2024", "2025", "2026", "2027", "2028"
];

export default function EmissionForm({ open, onClose, onSubmit, editingRecord, isSubmitting }) {
  const [formData, setFormData] = useState({
    company_name: "",
    scope: "",
    scope_2_method: "",
    category: "",
    upstream_mode: "",
    travel_mode: "",
    travel_miles: "",
    commute_distance: "",
    num_employees: "",
    offsets_tonnes: "",
    waste_material: "",
    waste_disposal: "",
    waste_weight: "",
    waste_unit: "short_tons",
    source: "",
    amount: "",
    reporting_period: "",
    notes: "",
    vehicle_type: "",
    fuel_usage: "",
    fuel_units: "",
    miles_travelled: "",
    fuel_combusted: "",
    fuel_state: "",
    combustion_units: "",
    quantity_combusted: "",
    refrigeration_method: "",
    gas_type: "",
    inventory_change: "",
    transfer_amount: "",
    capacity_change: "",
    fire_suppression_method: "",
    fire_suppression_gas: "",
    fire_inventory_change: "",
    fire_transfer_amount: "",
    fire_capacity_change: "",
    purchased_gas_type: "",
    purchased_gas_amount: "",
    egrid_subregion: "",
    electricity_kwh: "",
    custom_emission_factor: "",
    steam_source_area: "",
    steam_fuel_type: "",
    steam_boiler_efficiency: "",
    steam_purchased: "",
    steam_market_co2_factor: "",
    steam_market_ch4_factor: "",
    steam_market_n2o_factor: "",
    steam_location_co2_factor: "",
    steam_location_ch4_factor: "",
    steam_location_n2o_factor: ""
  });

  // Populate form when editing
  useEffect(() => {
    if (editingRecord && open) {
      setFormData({
        company_name: editingRecord.company_name || "",
        scope: editingRecord.scope || "",
        scope_2_method: editingRecord.scope_2_method || "",
        category: editingRecord.category === "Stationary Combustion" ? "stationary_combustion" 
                : editingRecord.category === "Mobile Sources" ? "mobile_sources"
                : editingRecord.category === "Refrigeration and A/C Equipment Use" ? "refrigeration_ac"
                : editingRecord.category === "Fire Suppression" ? "fire_suppression"
                : editingRecord.category === "Purchased Gases" ? "purchased_gases"
                : editingRecord.category === "Purchased Electricity" ? "purchased_electricity"
                : editingRecord.category === "Purchased Heating" ? "purchased_heating"
                : editingRecord.category === "Purchased Cooling" ? "purchased_cooling"
                : "",
        source: editingRecord.source || "",
        amount: editingRecord.amount?.toString() || "",
        reporting_period: editingRecord.reporting_period || "",
        notes: editingRecord.notes || "",
        vehicle_type: editingRecord.source_area || "",
        fuel_usage: editingRecord.quantity_combusted?.toString() || "",
        fuel_units: editingRecord.combustion_units || "",
        miles_travelled: "",
        fuel_combusted: editingRecord.fuel_combusted || "",
        fuel_state: editingRecord.fuel_state || "",
        combustion_units: editingRecord.combustion_units || "",
        quantity_combusted: editingRecord.quantity_combusted?.toString() || "",
        refrigeration_method: "",
        gas_type: "",
        inventory_change: "",
        transfer_amount: "",
        capacity_change: "",
        fire_suppression_method: "",
        fire_suppression_gas: "",
        fire_inventory_change: "",
        fire_transfer_amount: "",
        fire_capacity_change: "",
        purchased_gas_type: "",
        purchased_gas_amount: "",
        egrid_subregion: "",
        electricity_kwh: "",
        custom_emission_factor: "",
        steam_source_area: "",
        steam_fuel_type: "",
        steam_boiler_efficiency: "",
        steam_purchased: "",
        steam_co2_factor: "",
        steam_ch4_factor: "",
        steam_n2o_factor: ""
      });
    } else if (!open) {
      setFormData({
        company_name: "",
        scope: "",
        scope_2_method: "",
        category: "",
        source: "",
        amount: "",
        reporting_period: "",
        notes: "",
        vehicle_type: "",
        fuel_usage: "",
        fuel_units: "",
        miles_travelled: "",
        fuel_combusted: "",
        fuel_state: "",
        combustion_units: "",
        quantity_combusted: "",
        refrigeration_method: "",
        gas_type: "",
        inventory_change: "",
        transfer_amount: "",
        capacity_change: "",
        fire_suppression_method: "",
        fire_suppression_gas: "",
        fire_inventory_change: "",
        fire_transfer_amount: "",
        fire_capacity_change: "",
        purchased_gas_type: "",
        purchased_gas_amount: "",
        egrid_subregion: "",
        electricity_kwh: "",
        custom_emission_factor: "",
        steam_source_area: "",
        steam_fuel_type: "",
        steam_boiler_efficiency: "",
        steam_purchased: "",
        steam_co2_factor: "",
        steam_ch4_factor: "",
        steam_n2o_factor: ""
      });
    }
  }, [editingRecord, open]);

  const categories = formData.scope === "scope_1" ? SCOPE_1_CATEGORIES : 
                     formData.scope === "scope_2" ? SCOPE_2_CATEGORIES :
                     formData.scope === "scope_3" ? SCOPE_3_CATEGORIES : [];
  
  const selectedCategory = categories.find(c => c.value === formData.category);
  const sources = selectedCategory?.sources || [];
  const emissionFactor = EMISSION_FACTORS[formData.source];
  const isMobileCombustion = formData.category === "mobile_sources";
  const isStationaryCombustion = formData.category === "stationary_combustion";
  const isRefrigeration = formData.category === "refrigeration_ac";
  const isFireSuppression = formData.category === "fire_suppression";
  const isPurchasedGases = formData.category === "purchased_gases";
  const isPurchasedElectricity = formData.category === "purchased_electricity";
  const isPurchasedSteam = formData.category === "purchased_steam";
  const isBusinessTravel = formData.category === "business_travel";
  const isCommuting = formData.category === "commuting";
  const isUpstreamTransport = formData.category === "upstream_transport";
  const isOffsets = formData.category === "offsets";
  const isWaste = formData.category === "waste";

  // Calculate emissions for mobile sources
  const calculateMobileCombustionEmissions = () => {
    if (!formData.fuel_usage || !formData.fuel_units) {
      return null;
    }

    const fuelUsage = parseFloat(formData.fuel_usage);
    
    // Emission factors
    const emissionFactors = {
      "gallons": 8.887, // kg CO2 per gallon of gasoline
      "scf": 0.0551 // kg CO2 per SCF of natural gas
    };
    
    const co2Kg = fuelUsage * (emissionFactors[formData.fuel_units] || 0);
    const co2Tonnes = co2Kg / 1000;
    
    return co2Tonnes.toFixed(4);
  };

  // Calculate emissions for refrigeration Material Balance
  const calculateRefrigerationEmissions = () => {
    if (!formData.gas_type || !formData.inventory_change || !formData.transfer_amount || !formData.capacity_change) {
      return null;
    }

    const inventoryChange = parseFloat(formData.inventory_change) || 0;
    const transferAmount = parseFloat(formData.transfer_amount) || 0;
    const capacityChange = parseFloat(formData.capacity_change) || 0;

    const totalKg = inventoryChange + transferAmount + capacityChange;
    const gwpFactor = REFRIGERANT_GWP_FACTORS[formData.gas_type] || 0;
    
    // CO2e in kg, then convert to tonnes
    const co2eKg = totalKg * gwpFactor;
    const co2eTonnes = co2eKg / 1000;
    
    return co2eTonnes.toFixed(4);
  };

  // Calculate emissions for fire suppression Material Balance
  const calculateFireSuppressionEmissions = () => {
    if (!formData.fire_suppression_gas || !formData.fire_inventory_change || !formData.fire_transfer_amount || !formData.fire_capacity_change) {
      return null;
    }

    const inventoryChange = parseFloat(formData.fire_inventory_change) || 0;
    const transferAmount = parseFloat(formData.fire_transfer_amount) || 0;
    const capacityChange = parseFloat(formData.fire_capacity_change) || 0;

    const totalLbs = inventoryChange + transferAmount + capacityChange;
    const gwpFactor = FIRE_SUPPRESSION_GWP_FACTORS[formData.fire_suppression_gas] || 0;
    
    // CO2e in lbs, then convert to tonnes (1 ton = 2204.62 lbs)
    const co2eLbs = totalLbs * gwpFactor;
    const co2eTonnes = co2eLbs / 2204.62;
    
    return co2eTonnes.toFixed(4);
  };

  // Calculate emissions for purchased gases
  const calculatePurchasedGasesEmissions = () => {
    if (!formData.purchased_gas_type || !formData.purchased_gas_amount) {
      return null;
    }

    const amount = parseFloat(formData.purchased_gas_amount) || 0;
    const gwpFactor = PURCHASED_GASES_GWP_FACTORS[formData.purchased_gas_type] || 0;
    
    // CO2e in lbs, then convert to tonnes
    const co2eLbs = amount * gwpFactor;
    const co2eTonnes = co2eLbs / 2204.62;
    
    return co2eTonnes.toFixed(4);
  };

  // Calculate emissions for upstream transport
  const calculateUpstreamTransportEmissions = () => {
    if (!formData.upstream_mode || !formData.travel_mode || !formData.travel_miles) return null;
    const distance = parseFloat(formData.travel_miles) || 0;
    const factorTable = formData.upstream_mode === "vehicle_mile" ? UPSTREAM_TRANSPORT_VEHICLE_MILE : UPSTREAM_TRANSPORT_TON_MILE;
    const factors = factorTable[formData.travel_mode];
    if (!factors) return null;
    const totalKgCO2e = distance * (factors.co2 + (factors.ch4 / 1000) * 28 + (factors.n2o / 1000) * 265);
    return (totalKgCO2e / 1000).toFixed(4);
  };

  // Calculate emissions for business travel / commuting
  const calculateBusinessTravelEmissions = () => {
    if (!formData.travel_mode || !formData.travel_miles) return null;
    const miles = parseFloat(formData.travel_miles) || 0;
    const factors = BUSINESS_TRAVEL_FACTORS[formData.travel_mode];
    if (!factors) return null;
    // co2 in kg/unit, ch4 in g/unit, n2o in g/unit
    const co2KgPerMile = factors.co2;
    const ch4KgPerMile = factors.ch4 / 1000;
    const n2oKgPerMile = factors.n2o / 1000;
    const totalKgCO2e = miles * (co2KgPerMile + ch4KgPerMile * 28 + n2oKgPerMile * 265);
    return (totalKgCO2e / 1000).toFixed(4);
  };

  // Calculate emissions for purchased electricity
  const calculateElectricityEmissions = () => {
    if (!formData.electricity_kwh) {
      return null;
    }

    const kWh = parseFloat(formData.electricity_kwh) || 0;
    const mWh = kWh / 1000; // Convert kWh to MWh

    if (formData.scope_2_method === "market_based" && formData.custom_emission_factor) {
      // Market-based: use custom emission factor (in lb CO2e/MWh)
      const customFactor = parseFloat(formData.custom_emission_factor) || 0;
      const lbsCO2e = mWh * customFactor;
      const metricTonnes = lbsCO2e / 2204.62;
      return metricTonnes.toFixed(4);
    } else if (formData.scope_2_method === "location_based" && formData.egrid_subregion) {
      // Location-based: use eGRID factors
      const subregion = EGRID_SUBREGIONS[formData.egrid_subregion];
      if (!subregion) return null;

      // Calculate total emissions in lbs CO2e/MWh
      const co2Factor = subregion.co2;
      const ch4Factor = subregion.ch4 * 28; // CH4 GWP = 28
      const n2oFactor = subregion.n2o * 265; // N2O GWP = 265
      const totalFactor = co2Factor + ch4Factor + n2oFactor;

      const lbsCO2e = mWh * totalFactor;
      const metricTonnes = lbsCO2e / 2204.62;
      return metricTonnes.toFixed(4);
    }

    return null;
  };

  // Calculate emissions for stationary combustion
  const calculateStationaryCombustionEmissions = () => {
    if (!formData.fuel_combusted || !formData.quantity_combusted || !formData.combustion_units) {
      return null;
    }

    const quantity = parseFloat(formData.quantity_combusted);
    const fuelData = STATIONARY_COMBUSTION_FACTORS[formData.fuel_combusted];
    
    if (!fuelData) return null;

    // Convert to mmBtu based on unit type
    let mmBtu = 0;
    
    switch (formData.combustion_units) {
      case "mmBtu":
        mmBtu = quantity;
        break;
      case "therm":
        mmBtu = quantity * 0.1; // 1 therm = 0.1 mmBtu
        break;
      case "SCF":
        // Natural Gas: 1 mmBtu ≈ 1,000 SCF
        // Propane: 1 mmBtu ≈ 11,000 SCF
        if (formData.fuel_combusted === "Natural Gas") {
          mmBtu = quantity / 1000;
        } else if (formData.fuel_combusted === "Propane Gas") {
          mmBtu = quantity / 11000;
        } else if (formData.fuel_combusted === "Landfill Gas") {
          mmBtu = quantity / 1000;
        }
        break;
      case "short ton":
        // For solid fuels, approximate 25 mmBtu per short ton (varies by fuel)
        mmBtu = quantity * 25;
        break;
      case "gallon":
        // For liquid fuels, approximate 0.138 mmBtu per gallon (varies by fuel)
        if (formData.fuel_combusted.includes("Fuel Oil")) {
          mmBtu = quantity * 0.138;
        } else if (formData.fuel_combusted === "Kerosene") {
          mmBtu = quantity * 0.135;
        } else {
          mmBtu = quantity * 0.09; // Default for other liquids
        }
        break;
      default:
        return null;
    }

    // Calculate CO2 in kg, then convert to tonnes
    const co2Kg = mmBtu * fuelData.co2PerMmBtu;
    const co2Tonnes = co2Kg / 1000;
    
    return co2Tonnes.toFixed(4);
  };

  // Calculate waste emissions
  const calculateWasteEmissions = () => {
    if (!formData.waste_material || !formData.waste_disposal || !formData.waste_weight) return null;
    const factors = WASTE_EMISSION_FACTORS[formData.waste_material];
    if (!factors) return null;
    const factor = factors[formData.waste_disposal];
    if (factor === null || factor === undefined) return null;
    let weightShortTons = parseFloat(formData.waste_weight) || 0;
    if (formData.waste_unit === "lbs") weightShortTons = weightShortTons / 2000;
    else if (formData.waste_unit === "kg") weightShortTons = weightShortTons / 907.185;
    else if (formData.waste_unit === "metric_tons") weightShortTons = weightShortTons * 1.10231;
    return (weightShortTons * factor).toFixed(4);
  };

  const calculatedEmissions = isWaste
    ? calculateWasteEmissions()
    : isUpstreamTransport
    ? calculateUpstreamTransportEmissions()
    : (isBusinessTravel || isCommuting)
    ? calculateBusinessTravelEmissions()
    : isMobileCombustion 
    ? calculateMobileCombustionEmissions()
    : isStationaryCombustion
    ? calculateStationaryCombustionEmissions()
    : isRefrigeration && formData.refrigeration_method === "material_balance"
    ? calculateRefrigerationEmissions()
    : isFireSuppression && formData.fire_suppression_method === "material_balance"
    ? calculateFireSuppressionEmissions()
    : isPurchasedGases
    ? calculatePurchasedGasesEmissions()
    : isPurchasedElectricity
    ? calculateElectricityEmissions()
    : formData.amount && emissionFactor 
    ? (parseFloat(formData.amount) * emissionFactor.factor).toFixed(4)
    : null;


  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Handle waste
    if (isWaste) {
      const factors = WASTE_EMISSION_FACTORS[formData.waste_material];
      const factor = factors?.[formData.waste_disposal] ?? 0;
      let weightShortTons = parseFloat(formData.waste_weight) || 0;
      if (formData.waste_unit === "lbs") weightShortTons = weightShortTons / 2000;
      else if (formData.waste_unit === "kg") weightShortTons = weightShortTons / 907.185;
      else if (formData.waste_unit === "metric_tons") weightShortTons = weightShortTons * 1.10231;
      onSubmit({
        company_name: formData.company_name,
        scope: "scope_3",
        category: "Waste",
        source: `${formData.waste_material} - ${WASTE_DISPOSAL_LABELS[formData.waste_disposal]}`,
        amount: parseFloat(formData.waste_weight),
        unit: formData.waste_unit,
        emission_factor: factor,
        co2e_tonnes: weightShortTons * factor,
        reporting_period: formData.reporting_period,
        notes: formData.notes
      });
      return;
    }

    // Handle offsets
    if (isOffsets) {
      const tonnes = parseFloat(formData.offsets_tonnes) || 0;
      onSubmit({
        company_name: formData.company_name,
        scope: "scope_3",
        category: "Offsets",
        source: "Carbon Offsets",
        amount: tonnes,
        unit: "tCO₂e",
        emission_factor: -1,
        co2e_tonnes: -tonnes,
        reporting_period: formData.reporting_period,
        notes: formData.notes
      });
      return;
    }

    // Handle upstream transport
    if (isUpstreamTransport) {
      const distance = parseFloat(formData.travel_miles) || 0;
      const factorTable = formData.upstream_mode === "vehicle_mile" ? UPSTREAM_TRANSPORT_VEHICLE_MILE : UPSTREAM_TRANSPORT_TON_MILE;
      const factors = factorTable[formData.travel_mode];
      const totalKgCO2e = distance * (factors.co2 + (factors.ch4 / 1000) * 28 + (factors.n2o / 1000) * 265);
      const co2eTonnes = totalKgCO2e / 1000;
      onSubmit({
        company_name: formData.company_name,
        scope: "scope_3",
        category: "Upstream Transport and Distribution",
        source: formData.travel_mode,
        amount: distance,
        unit: factors.unit,
        emission_factor: factors.co2,
        co2e_tonnes: co2eTonnes,
        reporting_period: formData.reporting_period,
        notes: formData.notes
      });
      return;
    }

    // Handle business travel / commuting
    if (isBusinessTravel || isCommuting) {
      const miles = parseFloat(formData.travel_miles) || 0;
      const factors = BUSINESS_TRAVEL_FACTORS[formData.travel_mode];
      const co2KgPerMile = factors.co2;
      const ch4KgPerMile = factors.ch4 / 1000;
      const n2oKgPerMile = factors.n2o / 1000;
      const totalKgCO2e = miles * (co2KgPerMile + ch4KgPerMile * 28 + n2oKgPerMile * 265);
      const co2eTonnes = totalKgCO2e / 1000;
      onSubmit({
        company_name: formData.company_name,
        scope: "scope_3",
        category: isBusinessTravel ? "Business Travel" : "Employee Commuting",
        source: formData.travel_mode,
        amount: miles,
        unit: factors.unit,
        emission_factor: factors.co2,
        co2e_tonnes: co2eTonnes,
        reporting_period: formData.reporting_period,
        notes: formData.notes
      });
      return;
    }

    // For purchased steam, create both market-based and location-based records
    if (isPurchasedSteam) {
      const steamPurchased = parseFloat(formData.steam_purchased);
      const boilerEfficiency = parseFloat(formData.steam_boiler_efficiency) / 100;
      
      // Calculate mmBtu of fuel consumed (divide by efficiency since efficiency < 1 means more fuel needed)
      const mmBtuConsumed = steamPurchased / boilerEfficiency;
      
      // Market-based calculation
      let marketBasedTonnes;
      const hasMarketCO2Factor = formData.steam_market_co2_factor !== "";
      const hasMarketCH4Factor = formData.steam_market_ch4_factor !== "";
      const hasMarketN2OFactor = formData.steam_market_n2o_factor !== "";
      
      if (hasMarketCO2Factor || hasMarketCH4Factor || hasMarketN2OFactor) {
        // Use custom market-based factors (CO2 in kg/mmBtu, CH4 and N2O in g/mmBtu)
        const co2Factor = parseFloat(formData.steam_market_co2_factor) || 0;
        const ch4Factor = parseFloat(formData.steam_market_ch4_factor) || 0;
        const n2oFactor = parseFloat(formData.steam_market_n2o_factor) || 0;
        
        // Convert to metric tons CO2e/mmBtu and apply GWP (CH4=28, N2O=265)
        const totalFactor = (co2Factor / 1000) + (ch4Factor / 1000000 * 28) + (n2oFactor / 1000000 * 265);
        marketBasedTonnes = mmBtuConsumed * totalFactor;
      } else {
        // Use fuel-based default factors
        const fuelFactor = STATIONARY_COMBUSTION_FACTORS[formData.steam_fuel_type];
        if (fuelFactor) {
          const co2Kg = mmBtuConsumed * fuelFactor.co2PerMmBtu;
          marketBasedTonnes = co2Kg / 1000;
        } else {
          marketBasedTonnes = 0;
        }
      }
      
      const marketBasedRecord = {
        company_name: formData.company_name,
        scope: "scope_2",
        scope_2_method: "market_based",
        category: "Purchased Steam",
        source: formData.steam_source_area,
        amount: steamPurchased,
        unit: "mmBtu",
        emission_factor: marketBasedTonnes / steamPurchased,
        co2e_tonnes: marketBasedTonnes,
        reporting_period: formData.reporting_period,
        notes: formData.notes
      };
      
      // Location-based calculation
      let locationBasedTonnes;
      const hasLocationCO2Factor = formData.steam_location_co2_factor !== "";
      const hasLocationCH4Factor = formData.steam_location_ch4_factor !== "";
      const hasLocationN2OFactor = formData.steam_location_n2o_factor !== "";
      
      if (hasLocationCO2Factor || hasLocationCH4Factor || hasLocationN2OFactor) {
        // Use custom location-based factors (CO2 in kg/mmBtu, CH4 and N2O in g/mmBtu)
        const co2Factor = parseFloat(formData.steam_location_co2_factor) || 0;
        const ch4Factor = parseFloat(formData.steam_location_ch4_factor) || 0;
        const n2oFactor = parseFloat(formData.steam_location_n2o_factor) || 0;
        
        // Convert to metric tons CO2e/mmBtu and apply GWP (CH4=28, N2O=265)
        const totalFactor = (co2Factor / 1000) + (ch4Factor / 1000000 * 28) + (n2oFactor / 1000000 * 265);
        locationBasedTonnes = mmBtuConsumed * totalFactor;
      } else {
        // Use fuel-based default factors (same as market-based)
        const fuelFactor = STATIONARY_COMBUSTION_FACTORS[formData.steam_fuel_type];
        if (fuelFactor) {
          const co2Kg = mmBtuConsumed * fuelFactor.co2PerMmBtu;
          locationBasedTonnes = co2Kg / 1000;
        } else {
          locationBasedTonnes = 0;
        }
      }
      
      const locationBasedRecord = {
        company_name: formData.company_name,
        scope: "scope_2",
        scope_2_method: "location_based",
        category: "Purchased Steam",
        source: formData.steam_source_area,
        amount: steamPurchased,
        unit: "mmBtu",
        emission_factor: locationBasedTonnes / steamPurchased,
        co2e_tonnes: locationBasedTonnes,
        reporting_period: formData.reporting_period,
        notes: formData.notes
      };
      
      // Submit both records
      onSubmit([marketBasedRecord, locationBasedRecord]);
      
      setFormData({
        company_name: "",
        scope: "",
        scope_2_method: "",
        category: "",
        source: "",
        amount: "",
        reporting_period: "",
        notes: "",
        vehicle_type: "",
        fuel_usage: "",
        fuel_units: "",
        miles_travelled: "",
        fuel_combusted: "",
        fuel_state: "",
        combustion_units: "",
        quantity_combusted: "",
        refrigeration_method: "",
        gas_type: "",
        inventory_change: "",
        transfer_amount: "",
        capacity_change: "",
        fire_suppression_method: "",
        fire_suppression_gas: "",
        fire_inventory_change: "",
        fire_transfer_amount: "",
        fire_capacity_change: "",
        purchased_gas_type: "",
        purchased_gas_amount: "",
        egrid_subregion: "",
        electricity_kwh: "",
        custom_emission_factor: "",
        steam_source_area: "",
        steam_fuel_type: "",
        steam_boiler_efficiency: "",
        steam_purchased: "",
        steam_co2_factor: "",
        steam_ch4_factor: "",
        steam_n2o_factor: ""
      });
      return;
    }
    
    // For purchased electricity, create both market-based and location-based records
    if (isPurchasedElectricity) {
      const kWh = parseFloat(formData.electricity_kwh);
      const mWh = kWh / 1000;
      const subregion = EGRID_SUBREGIONS[formData.egrid_subregion];
      const locationTotalFactor = subregion.co2 + (subregion.ch4 * 28) + (subregion.n2o * 265);
      
      // Market-based record
      let marketBasedTonnes, marketBasedFactor, marketBasedSource;
      
      if (formData.custom_emission_factor !== "") {
        // Use custom supplier factor
        const customFactor = parseFloat(formData.custom_emission_factor) || 0;
        const marketBasedLbs = mWh * customFactor;
        marketBasedTonnes = marketBasedLbs / 2204.62;
        marketBasedFactor = customFactor / 1000;
        marketBasedSource = "Custom Supplier";
      } else {
        // No supplier data: market-based equals location-based
        const locationBasedLbs = mWh * locationTotalFactor;
        marketBasedTonnes = locationBasedLbs / 2204.62;
        marketBasedFactor = locationTotalFactor / 1000;
        marketBasedSource = formData.egrid_subregion;
      }
      
      const marketBasedRecord = {
        company_name: formData.company_name,
        scope: "scope_2",
        scope_2_method: "market_based",
        category: "Purchased Electricity",
        source: marketBasedSource,
        amount: kWh,
        unit: "kWh",
        emission_factor: marketBasedFactor,
        co2e_tonnes: marketBasedTonnes,
        reporting_period: formData.reporting_period,
        notes: formData.notes
      };
      
      // Location-based record
      const locationBasedLbs = mWh * locationTotalFactor;
      const locationBasedTonnes = locationBasedLbs / 2204.62;
      
      const locationBasedRecord = {
        company_name: formData.company_name,
        scope: "scope_2",
        scope_2_method: "location_based",
        category: "Purchased Electricity",
        source: formData.egrid_subregion,
        amount: kWh,
        unit: "kWh",
        emission_factor: locationTotalFactor / 1000,
        co2e_tonnes: locationBasedTonnes,
        reporting_period: formData.reporting_period,
        notes: formData.notes
      };
      
      // Submit both records
      onSubmit([marketBasedRecord, locationBasedRecord]);
      
      setFormData({
        company_name: "",
        scope: "",
        scope_2_method: "",
        category: "",
        source: "",
        amount: "",
        reporting_period: "",
        notes: "",
        vehicle_type: "",
        fuel_usage: "",
        fuel_units: "",
        miles_travelled: "",
        fuel_combusted: "",
        fuel_state: "",
        combustion_units: "",
        quantity_combusted: "",
        refrigeration_method: "",
        gas_type: "",
        inventory_change: "",
        transfer_amount: "",
        capacity_change: "",
        fire_suppression_method: "",
        fire_suppression_gas: "",
        fire_inventory_change: "",
        fire_transfer_amount: "",
        fire_capacity_change: "",
        purchased_gas_type: "",
        purchased_gas_amount: "",
        egrid_subregion: "",
        electricity_kwh: "",
        custom_emission_factor: "",
        steam_mmbtu: "",
        steam_subregion: "",
        steam_supplier_factor: ""
      });
      return;
    }
    
    const record = {
      company_name: formData.company_name,
      scope: formData.scope,
      scope_2_method: formData.scope === "scope_2" ? formData.scope_2_method : undefined,
      category: selectedCategory?.label || formData.category,
      source: formData.source,
      reporting_period: formData.reporting_period,
      notes: formData.notes
    };

    if (isMobileCombustion) {
      record.source = formData.vehicle_type;
      record.source_area = formData.vehicle_type;
      record.fuel_combusted = formData.fuel_units === "gallons" ? "Gasoline" : "Natural Gas";
      record.fuel_state = formData.fuel_units === "gallons" ? "liquid" : "gas";
      record.quantity_combusted = parseFloat(formData.fuel_usage);
      record.combustion_units = formData.fuel_units;
      record.amount = parseFloat(formData.fuel_usage);
      record.unit = formData.fuel_units;
      
      const emissionFactors = {
        "gallons": 8.887,
        "scf": 0.0551
      };
      record.emission_factor = emissionFactors[formData.fuel_units] || 0;
      record.co2e_tonnes = parseFloat(calculatedEmissions) || 0;
    } else if (isStationaryCombustion) {
      const fuelData = STATIONARY_COMBUSTION_FACTORS[formData.fuel_combusted];
      record.source = formData.fuel_combusted;
      record.fuel_combusted = formData.fuel_combusted;
      record.fuel_state = formData.fuel_state;
      record.quantity_combusted = parseFloat(formData.quantity_combusted);
      record.combustion_units = formData.combustion_units;
      record.amount = parseFloat(formData.quantity_combusted);
      record.unit = formData.combustion_units;
      record.emission_factor = fuelData?.co2PerMmBtu || 0;
      record.co2e_tonnes = parseFloat(calculatedEmissions) || 0;
    } else if (isRefrigeration && formData.refrigeration_method === "material_balance") {
      record.source = formData.gas_type;
      record.amount = parseFloat(formData.inventory_change) + parseFloat(formData.transfer_amount) + parseFloat(formData.capacity_change);
      record.unit = "kg";
      record.emission_factor = REFRIGERANT_GWP_FACTORS[formData.gas_type] || 0;
      record.co2e_tonnes = parseFloat(calculatedEmissions) || 0;
    } else if (isFireSuppression && formData.fire_suppression_method === "material_balance") {
      record.source = formData.fire_suppression_gas;
      record.amount = parseFloat(formData.fire_inventory_change) + parseFloat(formData.fire_transfer_amount) + parseFloat(formData.fire_capacity_change);
      record.unit = "lbs";
      record.emission_factor = FIRE_SUPPRESSION_GWP_FACTORS[formData.fire_suppression_gas] || 0;
      record.co2e_tonnes = parseFloat(calculatedEmissions) || 0;
    } else if (isPurchasedGases) {
      record.source = formData.purchased_gas_type;
      record.amount = parseFloat(formData.purchased_gas_amount);
      record.unit = "lbs";
      record.emission_factor = PURCHASED_GASES_GWP_FACTORS[formData.purchased_gas_type] || 0;
      record.co2e_tonnes = parseFloat(calculatedEmissions) || 0;
    } else if (isPurchasedElectricity) {
      record.source = formData.scope_2_method === "location_based" 
        ? formData.egrid_subregion 
        : "Custom Supplier";
      record.amount = parseFloat(formData.electricity_kwh);
      record.unit = "kWh";
      
      if (formData.scope_2_method === "location_based" && formData.egrid_subregion) {
        const subregion = EGRID_SUBREGIONS[formData.egrid_subregion];
        const totalFactor = subregion.co2 + (subregion.ch4 * 28) + (subregion.n2o * 265);
        record.emission_factor = totalFactor / 1000; // Convert to per kWh
      } else if (formData.scope_2_method === "market_based") {
        record.emission_factor = parseFloat(formData.custom_emission_factor) / 1000 || 0;
      }
      
      record.co2e_tonnes = parseFloat(calculatedEmissions) || 0;
    } else {
      record.amount = parseFloat(formData.amount);
      record.unit = emissionFactor?.unit || "";
      record.emission_factor = emissionFactor?.factor || 0;
      record.co2e_tonnes = parseFloat(calculatedEmissions) || 0;
    }

    onSubmit(record);
    setFormData({
      company_name: "",
      scope: "",
      category: "",
      source: "",
      amount: "",
      reporting_period: "",
      notes: "",
      vehicle_type: "",
      fuel_usage: "",
      fuel_units: "",
      miles_travelled: "",
      fuel_combusted: "",
      fuel_state: "",
      combustion_units: "",
      quantity_combusted: "",
      refrigeration_method: "",
      gas_type: "",
      inventory_change: "",
      transfer_amount: "",
      capacity_change: "",
      fire_suppression_method: "",
      fire_suppression_gas: "",
      fire_inventory_change: "",
      fire_transfer_amount: "",
      fire_capacity_change: "",
      purchased_gas_type: "",
      purchased_gas_amount: "",
      egrid_subregion: "",
      electricity_kwh: "",
      custom_emission_factor: "",
      steam_source_area: "",
      steam_fuel_type: "",
      steam_boiler_efficiency: "",
      steam_purchased: "",
      steam_co2_factor: "",
      steam_ch4_factor: "",
      steam_n2o_factor: ""
    });
  };

  const handleScopeChange = (value) => {
    setFormData({ ...formData, scope: value, scope_2_method: "", category: "", source: "" });
  };

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value, source: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] p-0 gap-0 rounded-2xl overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 flex-shrink-0">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            {editingRecord ? "Edit Emission Record" : "Add Emission Record"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Company Name (Optional)</Label>
            <Input
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              placeholder="Enter company name"
              className="h-11 rounded-xl border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Scope</Label>
              <Select value={formData.scope} onValueChange={handleScopeChange}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200">
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scope_1">Scope 1</SelectItem>
                  <SelectItem value="scope_2">Scope 2</SelectItem>
                  <SelectItem value="scope_3">Scope 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Reporting Period</Label>
              <Select 
                value={formData.reporting_period} 
                onValueChange={(value) => setFormData({ ...formData, reporting_period: value })}
              >
                <SelectTrigger className="h-11 rounded-xl border-slate-200">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {REPORTING_PERIODS.map(period => (
                    <SelectItem key={period} value={period}>{period}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {formData.scope && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label className="text-sm font-medium text-slate-700">Category</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {formData.category && !isMobileCombustion && !isStationaryCombustion && !isRefrigeration && !isFireSuppression && !isPurchasedGases && !isPurchasedElectricity && !isPurchasedSteam && !isBusinessTravel && !isCommuting && !isUpstreamTransport && !isWaste && !isOffsets && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label className="text-sm font-medium text-slate-700">Emission Source</Label>
                <Select 
                  value={formData.source} 
                  onValueChange={(value) => setFormData({ ...formData, source: value })}
                >
                  <SelectTrigger className="h-11 rounded-xl border-slate-200">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Waste Detailed Fields */}
          <AnimatePresence mode="wait">
            {isWaste && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Waste Material</Label>
                  <Select
                    value={formData.waste_material}
                    onValueChange={(value) => setFormData({ ...formData, waste_material: value, waste_disposal: "" })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select waste material" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {Object.keys(WASTE_EMISSION_FACTORS).map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.waste_material && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Disposal Type</Label>
                    <Select
                      value={formData.waste_disposal}
                      onValueChange={(value) => setFormData({ ...formData, waste_disposal: value })}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-slate-200">
                        <SelectValue placeholder="Select disposal type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(WASTE_DISPOSAL_LABELS).filter(([key]) =>
                          WASTE_EMISSION_FACTORS[formData.waste_material]?.[key] !== null &&
                          WASTE_EMISSION_FACTORS[formData.waste_material]?.[key] !== undefined
                        ).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Weight</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.waste_weight}
                      onChange={(e) => setFormData({ ...formData, waste_weight: e.target.value })}
                      placeholder="Enter weight"
                      className="h-11 rounded-xl border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Unit</Label>
                    <Select
                      value={formData.waste_unit}
                      onValueChange={(value) => setFormData({ ...formData, waste_unit: value })}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short_tons">Short Tons</SelectItem>
                        <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="metric_tons">Metric Tons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {calculatedEmissions && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl"
                  >
                    <span className="text-sm text-emerald-700 font-medium">Calculated Emissions</span>
                    <span className="text-lg font-semibold text-emerald-800">{calculatedEmissions} tCO₂e</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upstream Transport Detailed Fields */}
          <AnimatePresence mode="wait">
            {isUpstreamTransport && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Transport Method</Label>
                  <Select
                    value={formData.upstream_mode}
                    onValueChange={(value) => setFormData({ ...formData, upstream_mode: value, travel_mode: "", travel_miles: "" })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select transport method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vehicle_mile">On-Road Transport (Vehicle Miles)</SelectItem>
                      <SelectItem value="ton_mile">Product Transport (Short Ton Miles)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.upstream_mode && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Vehicle Type</Label>
                      <Select
                        value={formData.travel_mode}
                        onValueChange={(value) => setFormData({ ...formData, travel_mode: value })}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-slate-200">
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(formData.upstream_mode === "vehicle_mile" ? UPSTREAM_TRANSPORT_VEHICLE_MILE : UPSTREAM_TRANSPORT_TON_MILE).map(mode => (
                            <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        {formData.upstream_mode === "vehicle_mile" ? "Vehicle Miles" : "Short Ton Miles"}
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.travel_miles}
                        onChange={(e) => setFormData({ ...formData, travel_miles: e.target.value })}
                        placeholder={`Enter ${formData.upstream_mode === "vehicle_mile" ? "vehicle miles" : "short ton miles"}`}
                        className="h-11 rounded-xl border-slate-200"
                      />
                    </div>
                  </>
                )}

                {calculatedEmissions && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl"
                  >
                    <span className="text-sm text-emerald-700 font-medium">Calculated Emissions</span>
                    <span className="text-lg font-semibold text-emerald-800">{calculatedEmissions} tCO₂e</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Business Travel / Commuting Detailed Fields */}
          <AnimatePresence mode="wait">
            {(isBusinessTravel || isCommuting) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Transport Mode</Label>
                  <Select
                    value={formData.travel_mode}
                    onValueChange={(value) => setFormData({ ...formData, travel_mode: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select transport mode" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {(isCommuting ? COMMUTING_MODES : Object.keys(BUSINESS_TRAVEL_FACTORS)).map(mode => (
                        <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isCommuting ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Avg. Commute Distance {formData.travel_mode && `(${BUSINESS_TRAVEL_FACTORS[formData.travel_mode]?.unit})`}</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.commute_distance}
                        onChange={(e) => {
                          const dist = e.target.value;
                          const emp = formData.num_employees || "";
                          setFormData({ ...formData, commute_distance: dist, travel_miles: dist && emp ? (parseFloat(dist) * parseFloat(emp)).toString() : "" });
                        }}
                        placeholder="Miles per employee"
                        className="h-11 rounded-xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Number of Employees</Label>
                      <Input
                        type="number"
                        step="1"
                        value={formData.num_employees}
                        onChange={(e) => {
                          const emp = e.target.value;
                          const dist = formData.commute_distance || "";
                          setFormData({ ...formData, num_employees: emp, travel_miles: dist && emp ? (parseFloat(dist) * parseFloat(emp)).toString() : "" });
                        }}
                        placeholder="# of employees"
                        className="h-11 rounded-xl border-slate-200"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Miles Travelled {formData.travel_mode && `(${BUSINESS_TRAVEL_FACTORS[formData.travel_mode]?.unit})`}
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.travel_miles}
                      onChange={(e) => setFormData({ ...formData, travel_miles: e.target.value })}
                      placeholder="Enter miles"
                      className="h-11 rounded-xl border-slate-200"
                    />
                  </div>
                )}

                {calculatedEmissions && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl"
                  >
                    <span className="text-sm text-emerald-700 font-medium">Calculated Emissions</span>
                    <span className="text-lg font-semibold text-emerald-800">{calculatedEmissions} tCO₂e</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Offsets Detailed Fields */}
          <AnimatePresence mode="wait">
            {isOffsets && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Offset Amount (tCO₂e)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={formData.offsets_tonnes}
                    onChange={(e) => setFormData({ ...formData, offsets_tonnes: e.target.value })}
                    placeholder="Enter offset amount in metric tons"
                    className="h-11 rounded-xl border-slate-200"
                  />
                  <p className="text-xs text-slate-500">Enter as a positive number — offsets will be recorded as negative emissions.</p>
                </div>

                {formData.offsets_tonnes && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl"
                  >
                    <span className="text-sm text-emerald-700 font-medium">Offset Credit</span>
                    <span className="text-lg font-semibold text-emerald-800">-{parseFloat(formData.offsets_tonnes).toFixed(4)} tCO₂e</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Purchased Steam Detailed Fields */}
          <AnimatePresence mode="wait">
            {isPurchasedSteam && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Source Area</Label>
                  <Input
                    value={formData.steam_source_area}
                    onChange={(e) => setFormData({ ...formData, steam_source_area: e.target.value })}
                    placeholder="Enter source area"
                    className="h-11 rounded-xl border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Fuel Type</Label>
                  <Select 
                    value={formData.steam_fuel_type} 
                    onValueChange={(value) => setFormData({ ...formData, steam_fuel_type: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(STATIONARY_COMBUSTION_FACTORS).map(fuel => (
                        <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Boiler Efficiency (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.steam_boiler_efficiency}
                    onChange={(e) => setFormData({ ...formData, steam_boiler_efficiency: e.target.value })}
                    placeholder="Enter efficiency (e.g., 80)"
                    className="h-11 rounded-xl border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Steam Purchased (mmBtu)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.steam_purchased}
                    onChange={(e) => setFormData({ ...formData, steam_purchased: e.target.value })}
                    placeholder="Enter mmBtu"
                    className="h-11 rounded-xl border-slate-200"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700">Market-Based Emission Factors (Optional)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.steam_market_co2_factor}
                        onChange={(e) => setFormData({ ...formData, steam_market_co2_factor: e.target.value })}
                        placeholder="CO₂"
                        className="h-11 rounded-xl border-slate-200"
                      />
                      <p className="text-xs text-slate-400">kg/mmBtu</p>
                    </div>
                    <div className="space-y-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.steam_market_ch4_factor}
                        onChange={(e) => setFormData({ ...formData, steam_market_ch4_factor: e.target.value })}
                        placeholder="CH₄"
                        className="h-11 rounded-xl border-slate-200"
                      />
                      <p className="text-xs text-slate-400">g/mmBtu</p>
                    </div>
                    <div className="space-y-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.steam_market_n2o_factor}
                        onChange={(e) => setFormData({ ...formData, steam_market_n2o_factor: e.target.value })}
                        placeholder="N₂O"
                        className="h-11 rounded-xl border-slate-200"
                      />
                      <p className="text-xs text-slate-400">g/mmBtu</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700">Location-Based Emission Factors (Optional)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.steam_location_co2_factor}
                        onChange={(e) => setFormData({ ...formData, steam_location_co2_factor: e.target.value })}
                        placeholder="CO₂"
                        className="h-11 rounded-xl border-slate-200"
                      />
                      <p className="text-xs text-slate-400">kg/mmBtu</p>
                    </div>
                    <div className="space-y-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.steam_location_ch4_factor}
                        onChange={(e) => setFormData({ ...formData, steam_location_ch4_factor: e.target.value })}
                        placeholder="CH₄"
                        className="h-11 rounded-xl border-slate-200"
                      />
                      <p className="text-xs text-slate-400">g/mmBtu</p>
                    </div>
                    <div className="space-y-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.steam_location_n2o_factor}
                        onChange={(e) => setFormData({ ...formData, steam_location_n2o_factor: e.target.value })}
                        placeholder="N₂O"
                        className="h-11 rounded-xl border-slate-200"
                      />
                      <p className="text-xs text-slate-400">g/mmBtu</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Leave blank to use default fuel-based factors</p>
                </div>

                {formData.steam_purchased && formData.steam_fuel_type && formData.steam_boiler_efficiency && (
                  <div className="space-y-2">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl"
                    >
                      <span className="text-sm text-emerald-700 font-medium">Market-Based Emissions</span>
                      <span className="text-lg font-semibold text-emerald-800">
                        {(() => {
                          const steamPurchased = parseFloat(formData.steam_purchased) || 0;
                          const boilerEfficiency = parseFloat(formData.steam_boiler_efficiency) / 100;
                          const mmBtuConsumed = steamPurchased / boilerEfficiency;
                          
                          const hasMarketCO2 = formData.steam_market_co2_factor !== "";
                          const hasMarketCH4 = formData.steam_market_ch4_factor !== "";
                          const hasMarketN2O = formData.steam_market_n2o_factor !== "";
                          
                          if (hasMarketCO2 || hasMarketCH4 || hasMarketN2O) {
                            const co2Factor = parseFloat(formData.steam_market_co2_factor) || 0;
                            const ch4Factor = parseFloat(formData.steam_market_ch4_factor) || 0;
                            const n2oFactor = parseFloat(formData.steam_market_n2o_factor) || 0;
                            const totalFactor = (co2Factor / 1000) + (ch4Factor / 1000000 * 28) + (n2oFactor / 1000000 * 265);
                            const metricTonnes = mmBtuConsumed * totalFactor;
                            return metricTonnes.toFixed(4);
                          } else {
                            const fuelFactor = STATIONARY_COMBUSTION_FACTORS[formData.steam_fuel_type];
                            if (fuelFactor) {
                              const co2Kg = mmBtuConsumed * fuelFactor.co2PerMmBtu;
                              return (co2Kg / 1000).toFixed(4);
                            }
                            return "0.0000";
                          }
                        })()} tCO₂e
                      </span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-xl"
                    >
                      <span className="text-sm text-blue-700 font-medium">Location-Based Emissions</span>
                      <span className="text-lg font-semibold text-blue-800">
                        {(() => {
                          const steamPurchased = parseFloat(formData.steam_purchased) || 0;
                          const boilerEfficiency = parseFloat(formData.steam_boiler_efficiency) / 100;
                          const mmBtuConsumed = steamPurchased / boilerEfficiency;
                          
                          const hasLocationCO2 = formData.steam_location_co2_factor !== "";
                          const hasLocationCH4 = formData.steam_location_ch4_factor !== "";
                          const hasLocationN2O = formData.steam_location_n2o_factor !== "";
                          
                          if (hasLocationCO2 || hasLocationCH4 || hasLocationN2O) {
                            const co2Factor = parseFloat(formData.steam_location_co2_factor) || 0;
                            const ch4Factor = parseFloat(formData.steam_location_ch4_factor) || 0;
                            const n2oFactor = parseFloat(formData.steam_location_n2o_factor) || 0;
                            const totalFactor = (co2Factor / 1000) + (ch4Factor / 1000000 * 28) + (n2oFactor / 1000000 * 265);
                            const metricTonnes = mmBtuConsumed * totalFactor;
                            return metricTonnes.toFixed(4);
                          } else {
                            const fuelFactor = STATIONARY_COMBUSTION_FACTORS[formData.steam_fuel_type];
                            if (fuelFactor) {
                              const co2Kg = mmBtuConsumed * fuelFactor.co2PerMmBtu;
                              return (co2Kg / 1000).toFixed(4);
                            }
                            return "0.0000";
                          }
                        })()} tCO₂e
                      </span>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Purchased Electricity Detailed Fields */}
          <AnimatePresence mode="wait">
            {isPurchasedElectricity && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="p-4 bg-blue-50 rounded-xl mb-2">
                  <p className="text-sm text-blue-800">
                    Both methods will be calculated. If no supplier factor is provided, market-based will equal location-based.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Electricity Consumed (kWh)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.electricity_kwh}
                    onChange={(e) => setFormData({ ...formData, electricity_kwh: e.target.value })}
                    placeholder="Enter kWh"
                    className="h-11 rounded-xl border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">eGRID Subregion (for Location-Based)</Label>
                  <Select 
                    value={formData.egrid_subregion} 
                    onValueChange={(value) => setFormData({ ...formData, egrid_subregion: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select eGRID subregion" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {Object.keys(EGRID_SUBREGIONS).map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Supplier Emission Factor (lb CO₂e/MWh) (Optional - for Market-Based)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.custom_emission_factor}
                    onChange={(e) => setFormData({ ...formData, custom_emission_factor: e.target.value })}
                    placeholder="Optional: Enter supplier factor or 0 for renewable"
                    className="h-11 rounded-xl border-slate-200"
                  />
                  <p className="text-xs text-slate-500">Leave blank to calculate location-based only, or enter 0 for 100% renewable</p>
                </div>

                {formData.electricity_kwh && formData.egrid_subregion && (
                  <div className="space-y-2">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl"
                    >
                      <span className="text-sm text-emerald-700 font-medium">Market-Based Emissions</span>
                      <span className="text-lg font-semibold text-emerald-800">
                        {(() => {
                          const kWh = parseFloat(formData.electricity_kwh) || 0;
                          const mWh = kWh / 1000;
                          
                          if (formData.custom_emission_factor !== "") {
                            // Use custom factor
                            const customFactor = parseFloat(formData.custom_emission_factor) || 0;
                            const lbsCO2e = mWh * customFactor;
                            const metricTonnes = lbsCO2e / 2204.62;
                            return metricTonnes.toFixed(4);
                          } else {
                            // Use location-based
                            const subregion = EGRID_SUBREGIONS[formData.egrid_subregion];
                            if (!subregion) return "0.0000";
                            const totalFactor = subregion.co2 + (subregion.ch4 * 28) + (subregion.n2o * 265);
                            const lbsCO2e = mWh * totalFactor;
                            const metricTonnes = lbsCO2e / 2204.62;
                            return metricTonnes.toFixed(4);
                          }
                        })()} tCO₂e
                      </span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-xl"
                    >
                      <span className="text-sm text-blue-700 font-medium">Location-Based Emissions</span>
                      <span className="text-lg font-semibold text-blue-800">
                        {(() => {
                          const kWh = parseFloat(formData.electricity_kwh) || 0;
                          const mWh = kWh / 1000;
                          const subregion = EGRID_SUBREGIONS[formData.egrid_subregion];
                          if (!subregion) return "0.0000";
                          const totalFactor = subregion.co2 + (subregion.ch4 * 28) + (subregion.n2o * 265);
                          const lbsCO2e = mWh * totalFactor;
                          const metricTonnes = lbsCO2e / 2204.62;
                          return metricTonnes.toFixed(4);
                        })()} tCO₂e
                      </span>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Purchased Gases Detailed Fields */}
          <AnimatePresence mode="wait">
            {isPurchasedGases && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Gas Type</Label>
                  <Select 
                    value={formData.purchased_gas_type} 
                    onValueChange={(value) => setFormData({ ...formData, purchased_gas_type: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select gas type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="Carbon Dioxide (CO2)">Carbon Dioxide (CO₂)</SelectItem>
                      <SelectItem value="Methane (CH4)">Methane (CH₄)</SelectItem>
                      <SelectItem value="Nitrous Oxide (N2O)">Nitrous Oxide (N₂O)</SelectItem>
                      <SelectItem value="Sulphur hexafluoride (SF6)">Sulphur hexafluoride (SF₆)</SelectItem>
                      <SelectItem value="Nitrogen Trifluoride (NF3)">Nitrogen Trifluoride (NF₃)</SelectItem>
                      
                      {/* PFCs */}
                      <SelectItem value="CF4 (PFC)">CF₄ (PFC)</SelectItem>
                      <SelectItem value="C2F6 (PFC)">C₂F₆ (PFC)</SelectItem>
                      <SelectItem value="C3F8 (PFC)">C₃F₈ (PFC)</SelectItem>
                      <SelectItem value="C4F10 (PFC)">C₄F₁₀ (PFC)</SelectItem>
                      <SelectItem value="C5F12 (PFC)">C₅F₁₂ (PFC)</SelectItem>
                      <SelectItem value="C6F14 (PFC)">C₆F₁₄ (PFC)</SelectItem>
                      
                      {/* HFCs */}
                      <SelectItem value="HFC-23">HFC-23</SelectItem>
                      <SelectItem value="HFC-32">HFC-32</SelectItem>
                      <SelectItem value="HFC-41">HFC-41</SelectItem>
                      <SelectItem value="HFC-125">HFC-125</SelectItem>
                      <SelectItem value="HFC-134">HFC-134</SelectItem>
                      <SelectItem value="HFC-134a">HFC-134a</SelectItem>
                      <SelectItem value="HFC-143">HFC-143</SelectItem>
                      <SelectItem value="HFC-143a">HFC-143a</SelectItem>
                      <SelectItem value="HFC-152a">HFC-152a</SelectItem>
                      <SelectItem value="HFC-227ea">HFC-227ea</SelectItem>
                      <SelectItem value="HFC-236fa">HFC-236fa</SelectItem>
                      <SelectItem value="HFC-245fa">HFC-245fa</SelectItem>
                      <SelectItem value="HFC-365mfc">HFC-365mfc</SelectItem>
                      <SelectItem value="HFC-43-10mee">HFC-43-10mee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Amount (lbs)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.purchased_gas_amount}
                    onChange={(e) => setFormData({ ...formData, purchased_gas_amount: e.target.value })}
                    placeholder="Enter amount"
                    className="h-11 rounded-xl border-slate-200"
                  />
                </div>

                {calculatedEmissions && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl"
                  >
                    <span className="text-sm text-emerald-700 font-medium">Calculated Emissions</span>
                    <span className="text-lg font-semibold text-emerald-800">{calculatedEmissions} tCO₂e</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fire Suppression Detailed Fields */}
          <AnimatePresence mode="wait">
            {isFireSuppression && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <FireSuppressionFields formData={formData} setFormData={setFormData} calculatedEmissions={calculatedEmissions} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Refrigeration Detailed Fields */}
          <AnimatePresence mode="wait">
            {isRefrigeration && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <RefrigerationFields formData={formData} setFormData={setFormData} calculatedEmissions={calculatedEmissions} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stationary Combustion Detailed Fields */}
          <AnimatePresence mode="wait">
            {isStationaryCombustion && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <StationaryCombustionFields formData={formData} setFormData={setFormData} calculatedEmissions={calculatedEmissions} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Sources Detailed Fields */}
          <AnimatePresence mode="wait">
            {isMobileCombustion && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <MobileCombustionFields formData={formData} setFormData={setFormData} calculatedEmissions={calculatedEmissions} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {formData.source && emissionFactor && !isMobileCombustion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label className="text-sm font-medium text-slate-700">
                  Amount ({emissionFactor.unit})
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder={`Enter amount in ${emissionFactor.unit}`}
                  className="h-11 rounded-xl border-slate-200"
                />
                
                {calculatedEmissions && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl mt-3"
                  >
                    <span className="text-sm text-emerald-700 font-medium">Calculated Emissions</span>
                    <span className="text-lg font-semibold text-emerald-800">{calculatedEmissions} tCO₂e</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Notes (Optional)</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional documentation or notes..."
              className="rounded-xl border-slate-200 resize-none"
              rows={3}
            />
          </div>

          </div>
          
          <div className="flex gap-3 p-6 pt-4 border-t border-slate-100 flex-shrink-0 bg-white">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 h-11 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={
                !formData.scope || 
                !formData.category || 
                !formData.reporting_period || 
                (isMobileCombustion 
                  ? (!formData.vehicle_type || !formData.fuel_usage || !formData.fuel_units)
                  : isStationaryCombustion
                  ? (!formData.fuel_combusted || !formData.fuel_state || !formData.quantity_combusted || !formData.combustion_units)
                  : isRefrigeration
                  ? (!formData.refrigeration_method || 
                      (formData.refrigeration_method === "material_balance" && 
                        (!formData.gas_type || !formData.inventory_change || !formData.transfer_amount || !formData.capacity_change)))
                  : isFireSuppression
                  ? (!formData.fire_suppression_method || 
                      (formData.fire_suppression_method === "material_balance" && 
                        (!formData.fire_suppression_gas || !formData.fire_inventory_change || !formData.fire_transfer_amount || !formData.fire_capacity_change)))
                  : isPurchasedGases
                  ? (!formData.purchased_gas_type || !formData.purchased_gas_amount)
                  : isPurchasedElectricity
                  ? (!formData.electricity_kwh || !formData.egrid_subregion)
                  : isPurchasedSteam
                  ? (!formData.steam_source_area || !formData.steam_fuel_type || !formData.steam_boiler_efficiency || !formData.steam_purchased)
                  : isUpstreamTransport
                  ? (!formData.upstream_mode || !formData.travel_mode || !formData.travel_miles)
                  : (isBusinessTravel || isCommuting)
                  ? (!formData.travel_mode || !formData.travel_miles)
                  : isWaste
                  ? (!formData.waste_material || !formData.waste_disposal || !formData.waste_weight || !formData.waste_unit)
                  : isOffsets
                  ? !formData.offsets_tonnes
                  : (!formData.source || !formData.amount)
                ) ||
                isSubmitting
              }
              className="flex-1 h-11 rounded-xl bg-[#1B4332] hover:bg-[#143728] text-white"
            >
              {isSubmitting ? (editingRecord ? "Updating..." : "Adding...") : (editingRecord ? "Update Record" : "Add Record")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}