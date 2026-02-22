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
import { X, Leaf, Zap } from "lucide-react";

const STATIONARY_COMBUSTION_FUELS = [
  // Coal and Coke - Solid
  { name: "Anthracite Coal", state: "solid" },
  { name: "Bituminous Coal", state: "solid" },
  { name: "Sub-bituminous Coal", state: "solid" },
  { name: "Lignite Coal", state: "solid" },
  { name: "Mixed (Commercial Sector)", state: "solid" },
  { name: "Mixed (Electric Power Sector)", state: "solid" },
  { name: "Mixed (Industrial Coking)", state: "solid" },
  { name: "Mixed (Industrial Sector)", state: "solid" },
  { name: "Coal Coke", state: "solid" },
  // Other Fuels - Solid
  { name: "Municipal Solid Waste", state: "solid" },
  { name: "Petroleum Coke (Solid)", state: "solid" },
  { name: "Plastics", state: "solid" },
  { name: "Tires", state: "solid" },
  // Biomass Fuels - Solid
  { name: "Agricultural Byproducts", state: "solid" },
  { name: "Peat", state: "solid" },
  { name: "Solid Byproducts", state: "solid" },
  { name: "Wood and Wood Residuals", state: "solid" },
  // Gaseous Fuels
  { name: "Natural Gas", state: "gas" },
  { name: "Propane Gas", state: "gas" },
  { name: "Landfill Gas", state: "gas" },
  // Petroleum Products
  { name: "Distillate Fuel Oil No. 2", state: "liquid" },
  { name: "Residual Fuel Oil No. 6", state: "liquid" },
  { name: "Kerosene", state: "liquid" },
  { name: "Liquefied Petroleum Gases (LPG)", state: "liquid" },
  // Biomass Fuels - Liquid
  { name: "Biodiesel (100%)", state: "liquid" },
  { name: "Ethanol (100%)", state: "liquid" },
  { name: "Rendered Animal Fat", state: "liquid" },
  { name: "Vegetable Oil", state: "liquid" }
];

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

const MOBILE_COMBUSTION_FUELS = [
  { name: "Natural Gas", state: "gas" },
  { name: "Anthracite Coal", state: "solid" },
  { name: "Bituminous Coal", state: "solid" },
  { name: "Sub-bituminous Coal", state: "solid" },
  { name: "Lignite Coal", state: "solid" },
  { name: "Mixed (Commercial Sector)", state: "solid" },
  { name: "Mixed (Electric Power Sector)", state: "solid" },
  { name: "Mixed (Industrial Coking)", state: "solid" },
  { name: "Mixed (Industrial Sector)", state: "solid" },
  { name: "Coal Coke", state: "solid" },
  { name: "Agricultural Byproducts", state: "solid" },
  { name: "Peat", state: "solid" },
  { name: "Solid Byproducts", state: "solid" },
  { name: "Wood and Wood Residuals", state: "solid" },
  { name: "Municipal Solid Waste", state: "solid" },
  { name: "Petroleum Coke (Solid)", state: "solid" },
  { name: "Plastics", state: "solid" },
  { name: "Tires", state: "solid" },
  { name: "Distillate Fuel Oil No. 2", state: "liquid" },
  { name: "Residual Fuel Oil No. 6", state: "liquid" },
  { name: "Kerosene", state: "liquid" },
  { name: "Liquefied Petroleum Gases (LPG)", state: "liquid" },
  { name: "Biodiesel (100%)", state: "liquid" },
  { name: "Ethanol (100%)", state: "liquid" },
  { name: "Rendered Animal Fat", state: "liquid" },
  { name: "Vegetable Oil", state: "liquid" },
  { name: "Propane Gas", state: "gas" },
  { name: "Landfill Gas", state: "gas" },
  { name: "Steam", state: "gas" }
];

const FIRE_SUPPRESSION_GWP_FACTORS = {
  "Carbon Dioxide": 1,
  "HFC-23": 12400,
  "HFC-125": 3170,
  "HFC-134a": 1300,
  "HFC-227ea": 3350,
  "HFC-236fa": 8060,
  "PFC-14": 6630,
  "PFC-31-10": 9200
};

const PURCHASED_GASES_GWP_FACTORS = {
  "Carbon Dioxide (CO2)": 1,
  "Methane (CH4)": 28,
  "Nitrous Oxide (N2O)": 265,
  "Sulphur hexafluoride (SF6)": 23500,
  "Nitrogen Trifluoride (NF3)": 16100,
  "CF4 (PFC)": 6630,
  "C2F6 (PFC)": 11100,
  "C3F8 (PFC)": 8900,
  "C4F10 (PFC)": 9200,
  "C5F12 (PFC)": 8550,
  "C6F14 (PFC)": 7910,
  "HFC-23": 12400,
  "HFC-32": 677,
  "HFC-41": 116,
  "HFC-125": 3170,
  "HFC-134": 1120,
  "HFC-134a": 1300,
  "HFC-143": 328,
  "HFC-143a": 4800,
  "HFC-152a": 138,
  "HFC-227ea": 3350,
  "HFC-236fa": 8060,
  "HFC-245fa": 858,
  "HFC-365mfc": 804,
  "HFC-43-10mee": 1650
};

const REFRIGERANT_GWP_FACTORS = {
  "Carbon Dioxide": 1,
  "Sulphur hexafluoride": 23500,
  "Nitrogen Trifluoride": 16100,
  "CF4": 6630,
  "C2F6": 11100,
  "C3F8": 8900,
  "C4F10": 9200,
  "C5F12": 8550,
  "C6F14": 7910,
  "R-11": 4660,
  "R-12": 10200,
  "R-13": 14000,
  "R-14": 6630,
  "R-22": 1760,
  "R-23": 12400,
  "R-32": 677,
  "R-113": 5820,
  "R-114": 9800,
  "R-115": 7670,
  "R-123": 79,
  "R-124": 527,
  "R-125": 3170,
  "R-134a": 1300,
  "R-141b": 700,
  "R-142b": 2000,
  "R-143a": 4800,
  "R-152a": 138,
  "R-218": 8900,
  "R-227ea": 3350,
  "R-236fa": 8060,
  "R-245fa": 858,
  "R-404A": 3943,
  "R-407C": 1624,
  "R-410A": 1924,
  "R-507A": 3985,
  "HFC-23": 12400,
  "HFC-32": 677,
  "HFC-41": 116,
  "HFC-125": 3170,
  "HFC-134": 1120,
  "HFC-134a": 1300,
  "HFC-143": 328,
  "HFC-143a": 4800,
  "HFC-152a": 138,
  "HFC-227ea": 3350,
  "HFC-236fa": 8060,
  "HFC-245fa": 858,
  "HFC-365mfc": 804,
  "HFC-43-10mee": 1650,
  "R-401A": 18,
  "R-401B": 15,
  "R-401C": 21,
  "R-402A": 1902,
  "R-402B": 1205,
  "R-403B": 3471,
  "R-406A": 0,
  "R-407A": 1923,
  "R-407B": 2547,
  "R-407D": 1487,
  "R-408A": 2430,
  "R-409A": 0,
  "R-410B": 2048,
  "R-411A": 15,
  "R-411B": 4,
  "R-414A": 0,
  "R-414B": 0,
  "R-417A": 2127,
  "R-422A": 2847,
  "R-422D": 2473,
  "R-424A": 3104,
  "R-426A": 1371,
  "R-428A": 3417,
  "R-434A": 3075,
  "R-507A": 3985,
  "R-508A": 11607,
  "R-508B": 11698
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

const REPORTING_PERIODS = [
  "2024", "2025", "2026", "2027", "2028"
];

export default function EmissionForm({ open, onClose, onSubmit, editingRecord, isSubmitting }) {
  const [formData, setFormData] = useState({
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
  const isOffsets = formData.category === "offsets";

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

  const calculatedEmissions = isMobileCombustion 
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
                  <SelectItem value="scope_1">Scope 1 (Direct)</SelectItem>
                  <SelectItem value="scope_2">Scope 2 (Indirect)</SelectItem>
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
            {formData.category && !isMobileCombustion && !isStationaryCombustion && !isRefrigeration && !isFireSuppression && !isPurchasedGases && !isPurchasedElectricity && !isPurchasedSteam && (
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
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Calculation Method</Label>
                  <Select 
                    value={formData.fire_suppression_method} 
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      fire_suppression_method: value,
                      fire_suppression_gas: "",
                      fire_inventory_change: "",
                      fire_transfer_amount: "",
                      fire_capacity_change: ""
                    })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select calculation method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="material_balance">Material Balance Method</SelectItem>
                      <SelectItem value="simplified_material_balance">Simplified Material Balance Method</SelectItem>
                      <SelectItem value="screening">Screening Method</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.fire_suppression_method === "material_balance" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Gas Type</Label>
                      <Select 
                        value={formData.fire_suppression_gas} 
                        onValueChange={(value) => setFormData({ ...formData, fire_suppression_gas: value })}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-slate-200">
                          <SelectValue placeholder="Select gas type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Carbon Dioxide">Carbon Dioxide</SelectItem>
                          <SelectItem value="HFC-23">HFC-23</SelectItem>
                          <SelectItem value="HFC-125">HFC-125</SelectItem>
                          <SelectItem value="HFC-134a">HFC-134a</SelectItem>
                          <SelectItem value="HFC-227ea">HFC-227ea</SelectItem>
                          <SelectItem value="HFC-236fa">HFC-236fa</SelectItem>
                          <SelectItem value="PFC-14">PFC-14</SelectItem>
                          <SelectItem value="PFC-31-10">PFC-31-10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Inventory Change (lbs)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.fire_inventory_change}
                          onChange={(e) => setFormData({ ...formData, fire_inventory_change: e.target.value })}
                          placeholder="Enter amount"
                          className="h-11 rounded-xl border-slate-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Transfer Amount (lbs)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.fire_transfer_amount}
                          onChange={(e) => setFormData({ ...formData, fire_transfer_amount: e.target.value })}
                          placeholder="Enter amount"
                          className="h-11 rounded-xl border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Capacity Change (lbs)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.fire_capacity_change}
                        onChange={(e) => setFormData({ ...formData, fire_capacity_change: e.target.value })}
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
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Refrigeration Detailed Fields */}
          <AnimatePresence mode="wait">
            {isRefrigeration && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Calculation Method</Label>
                  <Select 
                    value={formData.refrigeration_method} 
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      refrigeration_method: value,
                      gas_type: "",
                      inventory_change: "",
                      transfer_amount: "",
                      capacity_change: ""
                    })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select calculation method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="material_balance">Material Balance Method</SelectItem>
                      <SelectItem value="simplified_material_balance">Simplified Material Balance Method</SelectItem>
                      <SelectItem value="screening">Screening Method</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.refrigeration_method === "material_balance" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Gas Type</Label>
                      <Select 
                        value={formData.gas_type} 
                        onValueChange={(value) => setFormData({ ...formData, gas_type: value })}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-slate-200">
                          <SelectValue placeholder="Select gas type" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectItem value="Carbon Dioxide">Carbon Dioxide</SelectItem>
                          <SelectItem value="Sulphur hexafluoride">Sulphur hexafluoride</SelectItem>
                          <SelectItem value="Nitrogen Trifluoride">Nitrogen Trifluoride</SelectItem>
                          
                          {/* PFC Types */}
                          <SelectItem value="CF4">CF4 (Perfluoromethane)</SelectItem>
                          <SelectItem value="C2F6">C2F6 (Perfluoroethane)</SelectItem>
                          <SelectItem value="C3F8">C3F8 (Perfluoropropane)</SelectItem>
                          <SelectItem value="C4F10">C4F10 (Perfluorobutane)</SelectItem>
                          <SelectItem value="C5F12">C5F12 (Perfluoropentane)</SelectItem>
                          <SelectItem value="C6F14">C6F14 (Perfluorohexane)</SelectItem>
                          
                          {/* R- Types */}
                          <SelectItem value="R-11">R-11</SelectItem>
                          <SelectItem value="R-12">R-12</SelectItem>
                          <SelectItem value="R-13">R-13</SelectItem>
                          <SelectItem value="R-14">R-14</SelectItem>
                          <SelectItem value="R-22">R-22</SelectItem>
                          <SelectItem value="R-23">R-23</SelectItem>
                          <SelectItem value="R-32">R-32</SelectItem>
                          <SelectItem value="R-113">R-113</SelectItem>
                          <SelectItem value="R-114">R-114</SelectItem>
                          <SelectItem value="R-115">R-115</SelectItem>
                          <SelectItem value="R-123">R-123</SelectItem>
                          <SelectItem value="R-124">R-124</SelectItem>
                          <SelectItem value="R-125">R-125</SelectItem>
                          <SelectItem value="R-134a">R-134a</SelectItem>
                          <SelectItem value="R-141b">R-141b</SelectItem>
                          <SelectItem value="R-142b">R-142b</SelectItem>
                          <SelectItem value="R-143a">R-143a</SelectItem>
                          <SelectItem value="R-152a">R-152a</SelectItem>
                          <SelectItem value="R-218">R-218</SelectItem>
                          <SelectItem value="R-227ea">R-227ea</SelectItem>
                          <SelectItem value="R-236fa">R-236fa</SelectItem>
                          <SelectItem value="R-245fa">R-245fa</SelectItem>
                          <SelectItem value="R-404A">R-404A</SelectItem>
                          <SelectItem value="R-407C">R-407C</SelectItem>
                          <SelectItem value="R-410A">R-410A</SelectItem>
                          <SelectItem value="R-507A">R-507A</SelectItem>
                          
                          {/* Blended Refrigerants */}
                          <SelectItem value="R-401A">R-401A</SelectItem>
                          <SelectItem value="R-401B">R-401B</SelectItem>
                          <SelectItem value="R-401C">R-401C</SelectItem>
                          <SelectItem value="R-402A">R-402A</SelectItem>
                          <SelectItem value="R-402B">R-402B</SelectItem>
                          <SelectItem value="R-403B">R-403B</SelectItem>
                          <SelectItem value="R-406A">R-406A</SelectItem>
                          <SelectItem value="R-407A">R-407A</SelectItem>
                          <SelectItem value="R-407B">R-407B</SelectItem>
                          <SelectItem value="R-407D">R-407D</SelectItem>
                          <SelectItem value="R-408A">R-408A</SelectItem>
                          <SelectItem value="R-409A">R-409A</SelectItem>
                          <SelectItem value="R-410B">R-410B</SelectItem>
                          <SelectItem value="R-411A">R-411A</SelectItem>
                          <SelectItem value="R-411B">R-411B</SelectItem>
                          <SelectItem value="R-414A">R-414A</SelectItem>
                          <SelectItem value="R-414B">R-414B</SelectItem>
                          <SelectItem value="R-417A">R-417A</SelectItem>
                          <SelectItem value="R-422A">R-422A</SelectItem>
                          <SelectItem value="R-422D">R-422D</SelectItem>
                          <SelectItem value="R-424A">R-424A</SelectItem>
                          <SelectItem value="R-426A">R-426A</SelectItem>
                          <SelectItem value="R-428A">R-428A</SelectItem>
                          <SelectItem value="R-434A">R-434A</SelectItem>
                          <SelectItem value="R-508A">R-508A</SelectItem>
                          <SelectItem value="R-508B">R-508B</SelectItem>
                          
                          {/* HFC Types */}
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Inventory Change (kg)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.inventory_change}
                          onChange={(e) => setFormData({ ...formData, inventory_change: e.target.value })}
                          placeholder="Enter amount"
                          className="h-11 rounded-xl border-slate-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Transfer Amount (kg)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.transfer_amount}
                          onChange={(e) => setFormData({ ...formData, transfer_amount: e.target.value })}
                          placeholder="Enter amount"
                          className="h-11 rounded-xl border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Capacity Change (kg)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.capacity_change}
                        onChange={(e) => setFormData({ ...formData, capacity_change: e.target.value })}
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
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stationary Combustion Detailed Fields */}
          <AnimatePresence mode="wait">
            {isStationaryCombustion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Fuel Combusted</Label>
                  <Select 
                    value={formData.fuel_combusted} 
                    onValueChange={(value) => {
                      const fuelData = STATIONARY_COMBUSTION_FUELS.find(f => f.name === value);
                      setFormData({ 
                        ...formData, 
                        fuel_combusted: value, 
                        fuel_state: fuelData?.state || "",
                        source: value 
                      });
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATIONARY_COMBUSTION_FUELS.map(fuel => (
                        <SelectItem key={fuel.name} value={fuel.name}>{fuel.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.fuel_combusted && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Fuel State</Label>
                      <Select 
                        value={formData.fuel_state} 
                        onValueChange={(value) => setFormData({ ...formData, fuel_state: value })}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-slate-200">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="liquid">Liquid</SelectItem>
                          <SelectItem value="gas">Gas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Quantity Combusted</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.quantity_combusted}
                          onChange={(e) => setFormData({ ...formData, quantity_combusted: e.target.value })}
                          placeholder="Enter quantity"
                          className="h-11 rounded-xl border-slate-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Units</Label>
                        <Select 
                          value={formData.combustion_units} 
                          onValueChange={(value) => setFormData({ ...formData, combustion_units: value })}
                        >
                          <SelectTrigger className="h-11 rounded-xl border-slate-200">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="therm">Therm</SelectItem>
                            <SelectItem value="mmBtu">mmBtu</SelectItem>
                            <SelectItem value="SCF">SCF</SelectItem>
                            <SelectItem value="short ton">Short Ton</SelectItem>
                            <SelectItem value="gallon">Gallon</SelectItem>
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
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Sources Detailed Fields */}
          <AnimatePresence mode="wait">
            {isMobileCombustion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Vehicle Type</Label>
                  <Select 
                    value={formData.vehicle_type} 
                    onValueChange={(value) => setFormData({ ...formData, vehicle_type: value, source: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_TYPES.map(vehicle => (
                        <SelectItem key={vehicle.name} value={vehicle.name}>{vehicle.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Fuel Usage</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.fuel_usage}
                      onChange={(e) => setFormData({ ...formData, fuel_usage: e.target.value })}
                      placeholder="Enter amount"
                      className="h-11 rounded-xl border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Units</Label>
                    <Select 
                      value={formData.fuel_units} 
                      onValueChange={(value) => setFormData({ ...formData, fuel_units: value })}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-slate-200">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gallons">Gallons</SelectItem>
                        <SelectItem value="scf">SCF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Miles Travelled</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.miles_travelled}
                    onChange={(e) => setFormData({ ...formData, miles_travelled: e.target.value })}
                    placeholder="Enter miles travelled"
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