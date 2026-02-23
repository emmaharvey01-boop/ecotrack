import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EGRID_SUBREGIONS } from "../emissionConstants";

function calcLocationTonnes(kwh, subregionKey) {
  const s = EGRID_SUBREGIONS[subregionKey];
  if (!s) return "0.0000";
  const mWh = kwh / 1000;
  const totalFactor = s.co2 + (s.ch4 * 28) + (s.n2o * 265);
  return (mWh * totalFactor / 2204.62).toFixed(4);
}

export default function PurchasedElectricityFields({ formData, setFormData }) {
  const kwh = parseFloat(formData.electricity_kwh) || 0;
  const showCalc = formData.electricity_kwh && formData.egrid_subregion;

  const marketTonnes = (() => {
    if (!showCalc) return null;
    if (formData.custom_emission_factor !== "") {
      return ((kwh / 1000) * (parseFloat(formData.custom_emission_factor) || 0) / 2204.62).toFixed(4);
    }
    return calcLocationTonnes(kwh, formData.egrid_subregion);
  })();

  return (
    <div className="space-y-4 pt-2">
      <div className="p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">Both methods will be calculated. If no supplier factor is provided, market-based will equal location-based.</p>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Electricity Consumed (kWh)</Label>
        <Input type="number" step="0.01" value={formData.electricity_kwh} onChange={(e) => setFormData({ ...formData, electricity_kwh: e.target.value })} placeholder="Enter kWh" className="h-11 rounded-xl border-slate-200" />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">eGRID Subregion (for Location-Based)</Label>
        <Select value={formData.egrid_subregion} onValueChange={(v) => setFormData({ ...formData, egrid_subregion: v })}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select eGRID subregion" /></SelectTrigger>
          <SelectContent className="max-h-[300px]">{Object.keys(EGRID_SUBREGIONS).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Supplier Emission Factor (lb CO₂e/MWh) (Optional - for Market-Based)</Label>
        <Input type="number" step="0.01" value={formData.custom_emission_factor} onChange={(e) => setFormData({ ...formData, custom_emission_factor: e.target.value })} placeholder="Optional: Enter supplier factor or 0 for renewable" className="h-11 rounded-xl border-slate-200" />
        <p className="text-xs text-slate-500">Leave blank to calculate location-based only, or enter 0 for 100% renewable</p>
      </div>
      {showCalc && (
        <div className="space-y-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
            <span className="text-sm text-emerald-700 font-medium">Market-Based Emissions</span>
            <span className="text-lg font-semibold text-emerald-800">{marketTonnes} tCO₂e</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <span className="text-sm text-blue-700 font-medium">Location-Based Emissions</span>
            <span className="text-lg font-semibold text-blue-800">{calcLocationTonnes(kwh, formData.egrid_subregion)} tCO₂e</span>
          </motion.div>
        </div>
      )}
    </div>
  );
}