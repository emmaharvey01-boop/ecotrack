import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// Source: EPA Emission Factors for GHG Inventories, January 15, 2025 (Table 1)
const STATIONARY_COMBUSTION_FUELS = [
  // Coal and Coke
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
  // Biomass - Solid
  { name: "Agricultural Byproducts", state: "solid" },
  { name: "Peat", state: "solid" },
  { name: "Solid Byproducts", state: "solid" },
  { name: "Wood and Wood Residuals", state: "solid" },
  // Gaseous
  { name: "Natural Gas", state: "gas" },
  { name: "Propane Gas", state: "gas" },
  { name: "Landfill Gas", state: "gas" },
  { name: "Blast Furnace Gas", state: "gas" },
  { name: "Coke Oven Gas", state: "gas" },
  { name: "Fuel Gas", state: "gas" },
  { name: "Other Biomass Gases", state: "gas" },
  // Petroleum Products - Liquid
  { name: "Distillate Fuel Oil No. 1", state: "liquid" },
  { name: "Distillate Fuel Oil No. 2", state: "liquid" },
  { name: "Distillate Fuel Oil No. 4", state: "liquid" },
  { name: "Residual Fuel Oil No. 5", state: "liquid" },
  { name: "Residual Fuel Oil No. 6", state: "liquid" },
  { name: "Kerosene", state: "liquid" },
  { name: "Kerosene-Type Jet Fuel", state: "liquid" },
  { name: "Liquefied Petroleum Gases (LPG)", state: "liquid" },
  { name: "Motor Gasoline", state: "liquid" },
  { name: "Aviation Gasoline", state: "liquid" },
  { name: "Propane", state: "liquid" },
  { name: "Crude Oil", state: "liquid" },
  { name: "Lubricants", state: "liquid" },
  // Biomass - Liquid
  { name: "Biodiesel (100%)", state: "liquid" },
  { name: "Ethanol (100%)", state: "liquid" },
  { name: "Rendered Animal Fat", state: "liquid" },
  { name: "Vegetable Oil", state: "liquid" },
];

export { STATIONARY_COMBUSTION_FUELS };

const VEHICLE_TYPES = [
  { name: "Passenger Cars", mpg: 24.8 },
  { name: "Other 2-Axle, 4-Tire Vehicles", mpg: 18.1 },
  { name: "Motorcycles", mpg: 44.0 },
  { name: "Single unit 2-Axle 6-Tire or More Trucks", mpg: 7.9 },
  { name: "Combination Trucks", mpg: 6.9 },
  { name: "Diesel Buses (Diesel Heavy-Duty Vehicles)", mpg: 7.4 },
];

const FIRE_SUPPRESSION_GWP_FACTORS = {
  "Carbon Dioxide": 1, "HFC-23": 12400, "HFC-125": 3170, "HFC-134a": 1300,
  "HFC-227ea": 3350, "HFC-236fa": 8060, "PFC-14": 6630, "PFC-31-10": 9200,
};

export { FIRE_SUPPRESSION_GWP_FACTORS };

const REFRIGERANT_GWP_FACTORS = {
  "Carbon Dioxide": 1, "Sulphur hexafluoride": 23500, "Nitrogen Trifluoride": 16100,
  "CF4": 6630, "C2F6": 11100, "C3F8": 8900, "C4F10": 9200, "C5F12": 8550, "C6F14": 7910,
  "R-11": 4660, "R-12": 10200, "R-13": 14000, "R-14": 6630, "R-22": 1760, "R-23": 12400,
  "R-32": 677, "R-113": 5820, "R-114": 9800, "R-115": 7670, "R-123": 79, "R-124": 527,
  "R-125": 3170, "R-134a": 1300, "R-141b": 700, "R-142b": 2000, "R-143a": 4800,
  "R-152a": 138, "R-218": 8900, "R-227ea": 3350, "R-236fa": 8060, "R-245fa": 858,
  "R-404A": 3943, "R-407C": 1624, "R-410A": 1924, "R-507A": 3985,
  "HFC-23": 12400, "HFC-32": 677, "HFC-41": 116, "HFC-125": 3170, "HFC-134": 1120,
  "HFC-134a": 1300, "HFC-143": 328, "HFC-143a": 4800, "HFC-152a": 138, "HFC-227ea": 3350,
  "HFC-236fa": 8060, "HFC-245fa": 858, "HFC-365mfc": 804, "HFC-43-10mee": 1650,
  "R-401A": 18, "R-401B": 15, "R-401C": 21, "R-402A": 1902, "R-402B": 1205,
  "R-403B": 3471, "R-406A": 0, "R-407A": 1923, "R-407B": 2547, "R-407D": 1487,
  "R-408A": 2430, "R-409A": 0, "R-410B": 2048, "R-411A": 15, "R-411B": 4,
  "R-414A": 0, "R-414B": 0, "R-417A": 2127, "R-422A": 2847, "R-422D": 2473,
  "R-424A": 3104, "R-426A": 1371, "R-428A": 3417, "R-434A": 3075,
  "R-508A": 11607, "R-508B": 11698,
};

export { REFRIGERANT_GWP_FACTORS };

function EmissionResult({ value }) {
  if (!value) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
      <span className="text-sm text-emerald-700 font-medium">Calculated Emissions</span>
      <span className="text-lg font-semibold text-emerald-800">{value} tCO₂e</span>
    </motion.div>
  );
}

export function StationaryCombustionFields({ formData, setFormData, calculatedEmissions }) {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Fuel Combusted</Label>
        <Select value={formData.fuel_combusted} onValueChange={(value) => {
          const fuelData = STATIONARY_COMBUSTION_FUELS.find(f => f.name === value);
          setFormData({ ...formData, fuel_combusted: value, fuel_state: fuelData?.state || "", source: value });
        }}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select fuel type" /></SelectTrigger>
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
            <Select value={formData.fuel_state} onValueChange={(value) => setFormData({ ...formData, fuel_state: value })}>
              <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select state" /></SelectTrigger>
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
              <Input type="number" step="0.01" value={formData.quantity_combusted}
                onChange={(e) => setFormData({ ...formData, quantity_combusted: e.target.value })}
                placeholder="Enter quantity" className="h-11 rounded-xl border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Units</Label>
              <Select value={formData.combustion_units} onValueChange={(value) => setFormData({ ...formData, combustion_units: value })}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select unit" /></SelectTrigger>
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
          <EmissionResult value={calculatedEmissions} />
        </>
      )}
    </div>
  );
}

export function MobileCombustionFields({ formData, setFormData, calculatedEmissions }) {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Vehicle Type</Label>
        <Select value={formData.vehicle_type} onValueChange={(value) => setFormData({ ...formData, vehicle_type: value, source: value })}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select vehicle type" /></SelectTrigger>
          <SelectContent>
            {VEHICLE_TYPES.map(v => <SelectItem key={v.name} value={v.name}>{v.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Fuel Usage</Label>
          <Input type="number" step="0.01" value={formData.fuel_usage}
            onChange={(e) => setFormData({ ...formData, fuel_usage: e.target.value })}
            placeholder="Enter amount" className="h-11 rounded-xl border-slate-200" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Units</Label>
          <Select value={formData.fuel_units} onValueChange={(value) => setFormData({ ...formData, fuel_units: value })}>
            <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select unit" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="gallons">Gallons</SelectItem>
              <SelectItem value="scf">SCF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Miles Travelled</Label>
        <Input type="number" step="0.01" value={formData.miles_travelled}
          onChange={(e) => setFormData({ ...formData, miles_travelled: e.target.value })}
          placeholder="Enter miles travelled" className="h-11 rounded-xl border-slate-200" />
      </div>
      <EmissionResult value={calculatedEmissions} />
    </div>
  );
}

export function RefrigerationFields({ formData, setFormData, calculatedEmissions }) {
  const refrigerantList = [
    "Carbon Dioxide", "Sulphur hexafluoride", "Nitrogen Trifluoride",
    "CF4", "C2F6", "C3F8", "C4F10", "C5F12", "C6F14",
    "R-11","R-12","R-13","R-14","R-22","R-23","R-32","R-113","R-114","R-115",
    "R-123","R-124","R-125","R-134a","R-141b","R-142b","R-143a","R-152a","R-218",
    "R-227ea","R-236fa","R-245fa","R-404A","R-407C","R-410A","R-507A",
    "HFC-23","HFC-32","HFC-41","HFC-125","HFC-134","HFC-134a","HFC-143","HFC-143a",
    "HFC-152a","HFC-227ea","HFC-236fa","HFC-245fa","HFC-365mfc","HFC-43-10mee",
    "R-401A","R-401B","R-401C","R-402A","R-402B","R-403B","R-406A","R-407A","R-407B",
    "R-407D","R-408A","R-409A","R-410B","R-411A","R-411B","R-414A","R-414B","R-417A",
    "R-422A","R-422D","R-424A","R-426A","R-428A","R-434A","R-508A","R-508B",
  ];
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Calculation Method</Label>
        <Select value={formData.refrigeration_method} onValueChange={(value) =>
          setFormData({ ...formData, refrigeration_method: value, gas_type: "", inventory_change: "", transfer_amount: "", capacity_change: "" })}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select calculation method" /></SelectTrigger>
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
            <Select value={formData.gas_type} onValueChange={(value) => setFormData({ ...formData, gas_type: value })}>
              <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select gas type" /></SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {refrigerantList.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Inventory Change (kg)</Label>
              <Input type="number" step="0.01" value={formData.inventory_change}
                onChange={(e) => setFormData({ ...formData, inventory_change: e.target.value })}
                placeholder="Enter amount" className="h-11 rounded-xl border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Transfer Amount (kg)</Label>
              <Input type="number" step="0.01" value={formData.transfer_amount}
                onChange={(e) => setFormData({ ...formData, transfer_amount: e.target.value })}
                placeholder="Enter amount" className="h-11 rounded-xl border-slate-200" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Capacity Change (kg)</Label>
            <Input type="number" step="0.01" value={formData.capacity_change}
              onChange={(e) => setFormData({ ...formData, capacity_change: e.target.value })}
              placeholder="Enter amount" className="h-11 rounded-xl border-slate-200" />
          </div>
          <EmissionResult value={calculatedEmissions} />
        </>
      )}
    </div>
  );
}

export function FireSuppressionFields({ formData, setFormData, calculatedEmissions }) {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Calculation Method</Label>
        <Select value={formData.fire_suppression_method} onValueChange={(value) =>
          setFormData({ ...formData, fire_suppression_method: value, fire_suppression_gas: "", fire_inventory_change: "", fire_transfer_amount: "", fire_capacity_change: "" })}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select calculation method" /></SelectTrigger>
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
            <Select value={formData.fire_suppression_gas} onValueChange={(value) => setFormData({ ...formData, fire_suppression_gas: value })}>
              <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select gas type" /></SelectTrigger>
              <SelectContent>
                {Object.keys(FIRE_SUPPRESSION_GWP_FACTORS).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Inventory Change (lbs)</Label>
              <Input type="number" step="0.01" value={formData.fire_inventory_change}
                onChange={(e) => setFormData({ ...formData, fire_inventory_change: e.target.value })}
                placeholder="Enter amount" className="h-11 rounded-xl border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Transfer Amount (lbs)</Label>
              <Input type="number" step="0.01" value={formData.fire_transfer_amount}
                onChange={(e) => setFormData({ ...formData, fire_transfer_amount: e.target.value })}
                placeholder="Enter amount" className="h-11 rounded-xl border-slate-200" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Capacity Change (lbs)</Label>
            <Input type="number" step="0.01" value={formData.fire_capacity_change}
              onChange={(e) => setFormData({ ...formData, fire_capacity_change: e.target.value })}
              placeholder="Enter amount" className="h-11 rounded-xl border-slate-200" />
          </div>
          <EmissionResult value={calculatedEmissions} />
        </>
      )}
    </div>
  );
}