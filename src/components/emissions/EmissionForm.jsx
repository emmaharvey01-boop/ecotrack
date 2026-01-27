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

const SCOPE_1_CATEGORIES = [
  { value: "stationary_combustion", label: "Stationary Combustion", sources: ["Natural Gas", "Diesel", "Propane", "Fuel Oil", "Coal"] },
  { 
    value: "mobile_combustion", 
    label: "Mobile Combustion", 
    sources: ["Mobile Combustion"],
    needsDetailedFields: true
  },
  { value: "fugitive_emissions", label: "Fugitive Emissions", sources: ["Refrigerants", "Air Conditioning Units", "Fire Suppressants"] },
  { value: "process_emissions", label: "Process Emissions", sources: ["Chemical Processes", "Manufacturing", "Waste Treatment"] }
];

const SCOPE_2_CATEGORIES = [
  { value: "purchased_electricity", label: "Purchased Electricity", sources: ["Grid Electricity", "Renewable Electricity"] },
  { value: "purchased_heating", label: "Purchased Heating", sources: ["District Heating", "Steam"] },
  { value: "purchased_cooling", label: "Purchased Cooling", sources: ["District Cooling", "Chilled Water"] }
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

const MOBILE_COMBUSTION_FACTORS = {
  "Natural Gas": {
    "mmBtu": { toScf: 974.7, co2Factor: 53.06 },
    "therm": { toScf: 97.5, co2Factor: 53.06 },
    "ccf": { toScf: 100, co2Factor: 53.06 },
    "Mcf": { toScf: 1000, co2Factor: 53.06 },
    "cubic meter": { toScf: 35.31, co2Factor: 53.06 },
    "kWh": { toScf: 3.326, co2Factor: 53.06 },
    "SCF": { toScf: 1, co2Factor: 53.06 }
  },
  "Anthracite Coal": {
    "mmBtu": { toShortTon: 0.03986, co2Factor: 103.69 }
  },
  "Bituminous Coal": {
    "mmBtu": { toShortTon: 0.04011, co2Factor: 93.28 }
  },
  "Sub-bituminous Coal": {
    "mmBtu": { toShortTon: 0.05797, co2Factor: 97.17 }
  },
  "Lignite Coal": {
    "mmBtu": { toShortTon: 0.07037, co2Factor: 96.57 }
  },
  "Mixed (Commercial Sector)": {
    "mmBtu": { toShortTon: 0.04675, co2Factor: 95.35 }
  },
  "Mixed (Electric Power Sector)": {
    "mmBtu": { toShortTon: 0.05068, co2Factor: 95.15 }
  },
  "Mixed (Industrial Coking)": {
    "mmBtu": { toShortTon: 0.03805, co2Factor: 93.90 }
  },
  "Mixed (Industrial Sector)": {
    "mmBtu": { toShortTon: 0.04474, co2Factor: 93.92 }
  },
  "Coal Coke": {
    "mmBtu": { toShortTon: 0.04032, co2Factor: 113.67 }
  },
  "Agricultural Byproducts": {
    "mmBtu": { toShortTon: 0.12121, co2Factor: 0 }
  },
  "Peat": {
    "mmBtu": { toShortTon: 0.12500, co2Factor: 95.52 }
  },
  "Solid Byproducts": {
    "mmBtu": { toShortTon: 0.09625, co2Factor: 93.90 }
  },
  "Wood and Wood Residuals": {
    "mmBtu": { toShortTon: 0.05721, co2Factor: 0 }
  },
  "Municipal Solid Waste": {
    "mmBtu": { toShortTon: 0.10050, co2Factor: 89.98 }
  },
  "Petroleum Coke (Solid)": {
    "mmBtu": { toShortTon: 0.03333, co2Factor: 102.41 }
  },
  "Plastics": {
    "mmBtu": { toShortTon: 0.02632, co2Factor: 75.02 }
  },
  "Tires": {
    "mmBtu": { toShortTon: 0.03571, co2Factor: 85.97 }
  },
  "Distillate Fuel Oil No. 2": {
    "mmBtu": { toGallon: 7.2464, co2Factor: 73.96 }
  },
  "Residual Fuel Oil No. 6": {
    "mmBtu": { toGallon: 6.667, co2Factor: 75.10 }
  },
  "Kerosene": {
    "mmBtu": { toGallon: 7.407, co2Factor: 72.31 }
  },
  "Liquefied Petroleum Gases (LPG)": {
    "mmBtu": { toGallon: 10.870, co2Factor: 61.71 }
  },
  "Biodiesel (100%)": {
    "mmBtu": { toGallon: 7.813, co2Factor: 0 }
  },
  "Ethanol (100%)": {
    "mmBtu": { toGallon: 11.905, co2Factor: 0 }
  },
  "Rendered Animal Fat": {
    "mmBtu": { toGallon: 8.000, co2Factor: 0 }
  },
  "Vegetable Oil": {
    "mmBtu": { toGallon: 8.333, co2Factor: 0 }
  },
  "Propane Gas": {
    "mmBtu": { toScf: 397, co2Factor: 61.71 },
    "therm": { toScf: 39.7, co2Factor: 61.71 },
    "SCF": { toScf: 1, co2Factor: 61.71 }
  },
  "Landfill Gas": {
    "mmBtu": { toScf: 2062, co2Factor: 52.07 },
    "therm": { toScf: 206.2, co2Factor: 52.07 },
    "SCF": { toScf: 1, co2Factor: 52.07 }
  },
  "Steam": {
    "mmBtu": { toMmBtu: 1, co2Factor: 0 }
  }
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
  "Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", 
  "2024", "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "2025"
];

export default function EmissionForm({ open, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    scope: "",
    category: "",
    source: "",
    amount: "",
    reporting_period: "",
    notes: "",
    source_area: "",
    fuel_combusted: "",
    fuel_state: "",
    quantity_combusted: "",
    combustion_units: ""
  });

  const categories = formData.scope === "scope_1" ? SCOPE_1_CATEGORIES : 
                     formData.scope === "scope_2" ? SCOPE_2_CATEGORIES : [];
  
  const selectedCategory = categories.find(c => c.value === formData.category);
  const sources = selectedCategory?.sources || [];
  const emissionFactor = EMISSION_FACTORS[formData.source];
  const isMobileCombustion = formData.category === "mobile_combustion";

  // Calculate emissions for mobile combustion
  const calculateMobileCombustionEmissions = () => {
    if (!formData.fuel_combusted || !formData.quantity_combusted || !formData.combustion_units) {
      return null;
    }

    const fuelData = MOBILE_COMBUSTION_FACTORS[formData.fuel_combusted];
    if (!fuelData) return null;

    const unitData = fuelData[formData.combustion_units];
    if (!unitData) return null;

    const quantity = parseFloat(formData.quantity_combusted);
    
    // Calculate mmBtu first
    let mmBtu;
    if (formData.combustion_units === "mmBtu") {
      mmBtu = quantity;
    } else if (formData.combustion_units === "MmBTU") {
      mmBtu = quantity;
    } else {
      // For other units, we need to convert through the conversion factor
      // The formula is: quantity / conversion_factor = mmBtu
      const conversionFactor = Object.values(unitData)[0]; // Get the conversion value
      mmBtu = quantity / conversionFactor;
    }

    // CO2 factor is in kg CO2 per mmBtu, convert to metric tonnes
    const co2Tonnes = (mmBtu * unitData.co2Factor) / 1000;
    
    return co2Tonnes.toFixed(4);
  };

  const calculatedEmissions = isMobileCombustion 
    ? calculateMobileCombustionEmissions()
    : formData.amount && emissionFactor 
    ? (parseFloat(formData.amount) * emissionFactor.factor).toFixed(4)
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const record = {
      scope: formData.scope,
      category: selectedCategory?.label || formData.category,
      source: formData.source,
      reporting_period: formData.reporting_period,
      notes: formData.notes
    };

    if (isMobileCombustion) {
      const fuelData = MOBILE_COMBUSTION_FACTORS[formData.fuel_combusted];
      const unitData = fuelData?.[formData.combustion_units];
      
      record.source_area = formData.source_area;
      record.fuel_combusted = formData.fuel_combusted;
      record.fuel_state = formData.fuel_state;
      record.quantity_combusted = parseFloat(formData.quantity_combusted);
      record.combustion_units = formData.combustion_units;
      record.amount = parseFloat(formData.quantity_combusted);
      record.unit = formData.combustion_units;
      record.emission_factor = unitData?.co2Factor || 0;
      record.co2e_tonnes = parseFloat(calculatedEmissions) || 0;
    } else {
      record.amount = parseFloat(formData.amount);
      record.unit = emissionFactor?.unit || "";
      record.emission_factor = emissionFactor?.factor || 0;
      record.co2e_tonnes = parseFloat(calculatedEmissions) || 0;
    }

    onSubmit(record);
    setFormData({
      scope: "",
      category: "",
      source: "",
      amount: "",
      reporting_period: "",
      notes: "",
      source_area: "",
      fuel_combusted: "",
      fuel_state: "",
      quantity_combusted: "",
      combustion_units: ""
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
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Add Emission Record
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
            {formData.category && !isMobileCombustion && (
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

          {/* Mobile Combustion Detailed Fields */}
          <AnimatePresence mode="wait">
            {isMobileCombustion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Source Area</Label>
                  <Input
                    value={formData.source_area}
                    onChange={(e) => setFormData({ ...formData, source_area: e.target.value, source: e.target.value })}
                    placeholder="e.g., Company Fleet, Delivery Trucks"
                    className="h-11 rounded-xl border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Fuel Combusted</Label>
                  <Select 
                    value={formData.fuel_combusted} 
                    onValueChange={(value) => {
                      const fuel = MOBILE_COMBUSTION_FUELS.find(f => f.name === value);
                      setFormData({ 
                        ...formData, 
                        fuel_combusted: value,
                        fuel_state: fuel?.state || "",
                        quantity_combusted: "",
                        combustion_units: ""
                      });
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {MOBILE_COMBUSTION_FUELS.map(fuel => (
                        <SelectItem key={fuel.name} value={fuel.name}>
                          {fuel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Fuel State</Label>
                  <Input
                    value={formData.fuel_state}
                    readOnly
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 capitalize"
                    placeholder="Auto-filled based on fuel"
                  />
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
                      onValueChange={(value) => setFormData({ ...formData, combustion_units: value, quantity_combusted: "" })}
                      disabled={!formData.fuel_combusted}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-slate-200">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.fuel_combusted && MOBILE_COMBUSTION_FACTORS[formData.fuel_combusted] && 
                          Object.keys(MOBILE_COMBUSTION_FACTORS[formData.fuel_combusted]).map(unit => (
                            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                          ))
                        }
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

          <div className="flex gap-3 pt-2">
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
                  ? (!formData.source_area || !formData.fuel_combusted || !formData.fuel_state || !formData.quantity_combusted || !formData.combustion_units)
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