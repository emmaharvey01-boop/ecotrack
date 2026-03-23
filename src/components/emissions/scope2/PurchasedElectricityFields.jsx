import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EGRID_SUBREGIONS } from "../emissionConstants";

function calcLocationTonnes(kwh, subregionKey, subregionData) {
  const s = subregionData[subregionKey];
  if (!s) return "0.0000";
  const mWh = kwh / 1000;
  const totalFactor = s.co2 + (s.ch4 * 28) + (s.n2o * 265);
  return (mWh * totalFactor / 2204.62).toFixed(4);
}

export default function PurchasedElectricityFields({ formData, setFormData, yearFactors }) {
  const subregionData = (yearFactors && yearFactors.EGRID_SUBREGIONS) || EGRID_SUBREGIONS;
  const unit = formData.electricity_unit || "kWh";
  const rawAmount = parseFloat(formData.electricity_kwh) || 0;
  // Always work in kWh internally
  const kwh = unit === "MWh" ? rawAmount * 1000 : rawAmount;
  const mWh = kwh / 1000;
  const showCalc = formData.electricity_kwh && formData.egrid_subregion;

  const marketTonnes = (() => {
    if (!showCalc) return null;
    if (hasMarketFactors) {
      const co2 = parseFloat(formData.market_co2_factor) || 0;
      const ch4 = parseFloat(formData.market_ch4_factor) || 0;
      const n2o = parseFloat(formData.market_n2o_factor) || 0;
      const co2e_per_mwh = co2 + (ch4 * 28) + (n2o * 265);
      return (mWh * co2e_per_mwh / 2204.62).toFixed(4);
    }
    return calcLocationTonnes(kwh, formData.egrid_subregion, subregionData);
  })();

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  return (
    <div className="space-y-4 pt-2">
      <div className="p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">Both methods will be calculated. If no supplier factors are provided, market-based will equal location-based.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Electricity Consumed</Label>
        <div className="flex gap-2">
          <Input type="number" step="0.01" value={formData.electricity_kwh} onChange={set("electricity_kwh")} placeholder={`Enter ${unit}`} className="h-11 rounded-xl border-slate-200 flex-1" />
          <Select value={unit} onValueChange={(v) => setFormData({ ...formData, electricity_unit: v })}>
            <SelectTrigger className="h-11 rounded-xl border-slate-200 w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="kWh">kWh</SelectItem>
              <SelectItem value="MWh">MWh</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">eGRID Subregion (for Location-Based)</Label>
        <Select value={formData.egrid_subregion} onValueChange={(v) => setFormData({ ...formData, egrid_subregion: v })}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select eGRID subregion" /></SelectTrigger>
          <SelectContent className="max-h-[300px]">{Object.keys(subregionData).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* Market-Based Supplier Factors */}
      <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <Label className="text-sm font-semibold text-slate-700">Supplier Emission Factors (for Market-Based)</Label>
        <p className="text-xs text-slate-500">Leave blank to use location-based factors. Enter 0 for CO₂ if 100% renewable.</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">CO₂ (lb/MWh)</Label>
            <Input type="number" step="0.01" value={formData.market_co2_factor} onChange={set("market_co2_factor")} placeholder="e.g. 850" className="h-10 rounded-xl border-slate-200" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">CH₄ (lb/MWh)</Label>
            <Input type="number" step="0.0001" value={formData.market_ch4_factor} onChange={set("market_ch4_factor")} placeholder="e.g. 0.08" className="h-10 rounded-xl border-slate-200" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">N₂O (lb/MWh)</Label>
            <Input type="number" step="0.0001" value={formData.market_n2o_factor} onChange={set("market_n2o_factor")} placeholder="e.g. 0.01" className="h-10 rounded-xl border-slate-200" />
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
            <span className="text-lg font-semibold text-blue-800">{calcLocationTonnes(kwh, formData.egrid_subregion, subregionData)} tCO₂e</span>
          </motion.div>
        </div>
      )}
    </div>
  );
}