import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATIONARY_COMBUSTION_FACTORS } from "../emissionConstants";

function toMmBtu(value, unit) {
  const v = parseFloat(value) || 0;
  if (unit === "GJ") return v * 0.947817;
  if (unit === "MJ") return v * 0.000947817;
  return v;
}

function calcSteamTonnes(formData, co2Key, ch4Key, n2oKey) {
  const steamPurchased = toMmBtu(formData.steam_purchased, formData.steam_energy_unit);
  const eff = parseFloat(formData.steam_boiler_efficiency) / 100;
  if (!eff) return "0.0000";
  const mmBtu = steamPurchased / eff;
  const c2 = formData[co2Key], c4 = formData[ch4Key], n2 = formData[n2oKey];
  if (c2 !== "" || c4 !== "" || n2 !== "") {
    const f = ((parseFloat(c2)||0)/1000) + ((parseFloat(c4)||0)/1e6*28) + ((parseFloat(n2)||0)/1e6*265);
    return (mmBtu * f).toFixed(4);
  }
  const fuel = STATIONARY_COMBUSTION_FACTORS[formData.steam_fuel_type];
  return fuel ? ((mmBtu * fuel.co2PerMmBtu) / 1000).toFixed(4) : "0.0000";
}

export default function PurchasedSteamFields({ formData, setFormData }) {
  const showCalc = formData.steam_purchased && formData.steam_fuel_type && formData.steam_boiler_efficiency;
  const marketTonnes = showCalc ? calcSteamTonnes(formData, "steam_market_co2_factor", "steam_market_ch4_factor", "steam_market_n2o_factor") : null;
  const locationTonnes = showCalc ? calcSteamTonnes(formData, "steam_location_co2_factor", "steam_location_ch4_factor", "steam_location_n2o_factor") : null;

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  return (
    <div className="space-y-4 pt-2">
      <div className="p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">Both methods will be calculated. If no supplier factors are provided, market-based will equal location-based.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Source Area</Label>
        <Input value={formData.steam_source_area} onChange={set("steam_source_area")} placeholder="Enter source area" className="h-11 rounded-xl border-slate-200" />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Fuel Type (for Location-Based)</Label>
        <Select value={formData.steam_fuel_type} onValueChange={(v) => setFormData({ ...formData, steam_fuel_type: v })}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select fuel type" /></SelectTrigger>
          <SelectContent>{Object.keys(STATIONARY_COMBUSTION_FACTORS).map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Boiler Efficiency (%)</Label>
        <Input type="number" step="0.01" value={formData.steam_boiler_efficiency} onChange={set("steam_boiler_efficiency")} placeholder="Enter efficiency (e.g., 80)" className="h-11 rounded-xl border-slate-200" />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Energy Unit</Label>
        <Select value={formData.steam_energy_unit || "mmBtu"} onValueChange={(v) => setFormData({ ...formData, steam_energy_unit: v })}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="mmBtu">mmBtu</SelectItem>
            <SelectItem value="GJ">GJ (Gigajoule)</SelectItem>
            <SelectItem value="MJ">MJ (Megajoule)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Steam Purchased ({formData.steam_energy_unit || "mmBtu"})</Label>
        <Input type="number" step="0.01" value={formData.steam_purchased} onChange={set("steam_purchased")} placeholder={`Enter ${formData.steam_energy_unit || "mmBtu"}`} className="h-11 rounded-xl border-slate-200" />
      </div>

      {/* Market-Based Supplier Factors */}
      <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <Label className="text-sm font-semibold text-slate-700">Supplier Emission Factors (for Market-Based)</Label>
        <p className="text-xs text-slate-500">Leave blank to use default fuel-based factors.</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">CO₂ (kg/mmBtu)</Label>
            <Input type="number" step="0.01" value={formData.steam_market_co2_factor} onChange={set("steam_market_co2_factor")} placeholder="e.g. 53" className="h-10 rounded-xl border-slate-200" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">CH₄ (g/mmBtu)</Label>
            <Input type="number" step="0.0001" value={formData.steam_market_ch4_factor} onChange={set("steam_market_ch4_factor")} placeholder="e.g. 1.0" className="h-10 rounded-xl border-slate-200" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">N₂O (g/mmBtu)</Label>
            <Input type="number" step="0.0001" value={formData.steam_market_n2o_factor} onChange={set("steam_market_n2o_factor")} placeholder="e.g. 0.1" className="h-10 rounded-xl border-slate-200" />
          </div>
        </div>
      </div>

      {showCalc && (
        <div className="space-y-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
            <span className="text-sm text-emerald-700 font-medium">Market-Based Emissions</span>
            <span className="text-lg font-semibold text-emerald-800">{marketTonnes} tCO₂e</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <span className="text-sm text-blue-700 font-medium">Location-Based Emissions</span>
            <span className="text-lg font-semibold text-blue-800">{locationTonnes} tCO₂e</span>
          </motion.div>
        </div>
      )}
    </div>
  );
}