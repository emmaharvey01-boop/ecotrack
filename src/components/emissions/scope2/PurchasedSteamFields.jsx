import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATIONARY_COMBUSTION_FACTORS } from "../emissionConstants";

function calcSteamTonnes(formData, marketFactors) {
  const steamPurchased = parseFloat(formData.steam_purchased) || 0;
  const eff = parseFloat(formData.steam_boiler_efficiency) / 100;
  if (!eff) return "0.0000";
  const mmBtu = steamPurchased / eff;
  const [co2k, ch4k, n2ok] = marketFactors;
  if (co2k !== "" || ch4k !== "" || n2ok !== "") {
    const f = ((parseFloat(co2k)||0)/1000) + ((parseFloat(ch4k)||0)/1e6*28) + ((parseFloat(n2ok)||0)/1e6*265);
    return (mmBtu * f).toFixed(4);
  }
  const fuel = STATIONARY_COMBUSTION_FACTORS[formData.steam_fuel_type];
  return fuel ? ((mmBtu * fuel.co2PerMmBtu) / 1000).toFixed(4) : "0.0000";
}

export default function PurchasedSteamFields({ formData, setFormData }) {
  const showCalc = formData.steam_purchased && formData.steam_fuel_type && formData.steam_boiler_efficiency;
  const marketTonnes = showCalc ? calcSteamTonnes(formData, [formData.steam_market_co2_factor, formData.steam_market_ch4_factor, formData.steam_market_n2o_factor]) : null;
  const locationTonnes = showCalc ? calcSteamTonnes(formData, [formData.steam_location_co2_factor, formData.steam_location_ch4_factor, formData.steam_location_n2o_factor]) : null;

  const factorInputs = (prefix, label) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      <div className="grid grid-cols-3 gap-2">
        {[["co2", "CO₂", "kg/mmBtu"], ["ch4", "CH₄", "g/mmBtu"], ["n2o", "N₂O", "g/mmBtu"]].map(([key, placeholder, unit]) => (
          <div key={key} className="space-y-1">
            <Input type="number" step="0.01" value={formData[`${prefix}_${key}_factor`]} onChange={(e) => setFormData({ ...formData, [`${prefix}_${key}_factor`]: e.target.value })} placeholder={placeholder} className="h-11 rounded-xl border-slate-200" />
            <p className="text-xs text-slate-400">{unit}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Source Area</Label>
        <Input value={formData.steam_source_area} onChange={(e) => setFormData({ ...formData, steam_source_area: e.target.value })} placeholder="Enter source area" className="h-11 rounded-xl border-slate-200" />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Fuel Type</Label>
        <Select value={formData.steam_fuel_type} onValueChange={(v) => setFormData({ ...formData, steam_fuel_type: v })}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select fuel type" /></SelectTrigger>
          <SelectContent>{Object.keys(STATIONARY_COMBUSTION_FACTORS).map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Boiler Efficiency (%)</Label>
        <Input type="number" step="0.01" value={formData.steam_boiler_efficiency} onChange={(e) => setFormData({ ...formData, steam_boiler_efficiency: e.target.value })} placeholder="Enter efficiency (e.g., 80)" className="h-11 rounded-xl border-slate-200" />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Steam Purchased (mmBtu)</Label>
        <Input type="number" step="0.01" value={formData.steam_purchased} onChange={(e) => setFormData({ ...formData, steam_purchased: e.target.value })} placeholder="Enter mmBtu" className="h-11 rounded-xl border-slate-200" />
      </div>
      {factorInputs("steam_market", "Market-Based Emission Factors (Optional)")}
      {factorInputs("steam_location", "Location-Based Emission Factors (Optional)")}
      <p className="text-xs text-slate-500">Leave blank to use default fuel-based factors</p>
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