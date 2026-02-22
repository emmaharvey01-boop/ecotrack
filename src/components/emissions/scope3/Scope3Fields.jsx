import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

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

export { BUSINESS_TRAVEL_FACTORS };

const COMMUTING_MODES = Object.keys(BUSINESS_TRAVEL_FACTORS).filter(
  mode => !mode.startsWith("Air")
);

function TravelModeSelect({ formData, setFormData, modes }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700">Transport Mode</Label>
      <Select value={formData.travel_mode} onValueChange={(v) => setFormData({ ...formData, travel_mode: v })}>
        <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select transport mode" /></SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {modes.map(mode => (
            <SelectItem key={mode} value={mode}>{mode}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TravelMilesInput({ formData, setFormData }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700">
        Miles Travelled {formData.travel_mode && `(${BUSINESS_TRAVEL_FACTORS[formData.travel_mode]?.unit})`}
      </Label>
      <Input type="number" step="0.01" value={formData.travel_miles}
        onChange={(e) => setFormData({ ...formData, travel_miles: e.target.value })}
        placeholder="Enter miles" className="h-11 rounded-xl border-slate-200" />
    </div>
  );
}

export function BusinessTravelFields({ formData, setFormData, calculatedEmissions }) {
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-2">
      <TravelModeSelect formData={formData} setFormData={setFormData} modes={Object.keys(BUSINESS_TRAVEL_FACTORS)} />
      <TravelMilesInput formData={formData} setFormData={setFormData} />
      {calculatedEmissions && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
          <span className="text-sm text-emerald-700 font-medium">Calculated Emissions</span>
          <span className="text-lg font-semibold text-emerald-800">{calculatedEmissions} tCO₂e</span>
        </motion.div>
      )}
    </motion.div>
  );
}

export function CommutingFields({ formData, setFormData, calculatedEmissions }) {
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-2">
      <TravelModeSelect formData={formData} setFormData={setFormData} modes={COMMUTING_MODES} />
      <TravelMilesInput formData={formData} setFormData={setFormData} />
      {calculatedEmissions && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
          <span className="text-sm text-emerald-700 font-medium">Calculated Emissions</span>
          <span className="text-lg font-semibold text-emerald-800">{calculatedEmissions} tCO₂e</span>
        </motion.div>
      )}
    </motion.div>
  );
}

export function OffsetsFields({ formData, setFormData }) {
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Offset Amount (tCO₂e)</Label>
        <Input type="number" step="0.0001" value={formData.offsets_tonnes}
          onChange={(e) => setFormData({ ...formData, offsets_tonnes: e.target.value })}
          placeholder="Enter offset amount in metric tons" className="h-11 rounded-xl border-slate-200" />
        <p className="text-xs text-slate-500">Enter as a positive number — offsets will be recorded as negative emissions.</p>
      </div>
      {formData.offsets_tonnes && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
          <span className="text-sm text-emerald-700 font-medium">Offset Credit</span>
          <span className="text-lg font-semibold text-emerald-800">-{parseFloat(formData.offsets_tonnes).toFixed(4)} tCO₂e</span>
        </motion.div>
      )}
    </motion.div>
  );
}