import { useState } from "react";
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
  { value: "purchased_electricity", label: "Purchased Electricity", sources: ["Grid Electricity", "Renewable Electricity"] },
  { value: "purchased_heating", label: "Purchased Heating", sources: ["District Heating", "Steam"] },
  { value: "purchased_cooling", label: "Purchased Cooling", sources: ["District Cooling", "Chilled Water"] }
];

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

export default function EmissionForm({ open, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
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
    capacity_change: ""
  });

  const categories = formData.scope === "scope_1" ? SCOPE_1_CATEGORIES : 
                     formData.scope === "scope_2" ? SCOPE_2_CATEGORIES : [];
  
  const selectedCategory = categories.find(c => c.value === formData.category);
  const sources = selectedCategory?.sources || [];
  const emissionFactor = EMISSION_FACTORS[formData.source];
  const isMobileCombustion = formData.category === "mobile_sources";
  const isStationaryCombustion = formData.category === "stationary_combustion";
  const isRefrigeration = formData.category === "refrigeration_ac";

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
    : formData.amount && emissionFactor 
    ? (parseFloat(formData.amount) * emissionFactor.factor).toFixed(4)
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const record = {
      company_name: formData.company_name,
      scope: formData.scope,
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
      capacity_change: ""
    });
  };

  const handleScopeChange = (value) => {
    setFormData({ ...formData, scope: value, category: "", source: "" });
  };

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value, source: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] p-0 gap-0 rounded-2xl overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 flex-shrink-0">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Add Emission Record
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
                  <SelectItem value="scope_1">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <span>Scope 1 (Direct)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="scope_2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>Scope 2 (Indirect)</span>
                    </div>
                  </SelectItem>
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
            {formData.category && !isMobileCombustion && !isStationaryCombustion && !isRefrigeration && (
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
                        <SelectContent>
                          <SelectItem value="Carbon Dioxide">Carbon Dioxide</SelectItem>
                          <SelectItem value="Sulphur hexafluoride">Sulphur hexafluoride</SelectItem>
                          <SelectItem value="Nitrogen Trifluoride">Nitrogen Trifluoride</SelectItem>
                          <SelectItem value="PFC types">PFC types</SelectItem>
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
                  : (!formData.source || !formData.amount)
                ) ||
                isSubmitting
              }
              className="flex-1 h-11 rounded-xl bg-[#1B4332] hover:bg-[#143728] text-white"
            >
              {isSubmitting ? "Adding..." : "Add Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}