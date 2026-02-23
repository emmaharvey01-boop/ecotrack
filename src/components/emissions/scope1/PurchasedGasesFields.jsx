import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PURCHASED_GASES_GWP_FACTORS } from "../emissionConstants";

const GAS_OPTIONS = [
  ["Carbon Dioxide (CO2)", "Carbon Dioxide (CO₂)"],
  ["Methane (CH4)", "Methane (CH₄)"],
  ["Nitrous Oxide (N2O)", "Nitrous Oxide (N₂O)"],
  ["Sulphur hexafluoride (SF6)", "Sulphur hexafluoride (SF₆)"],
  ["Nitrogen Trifluoride (NF3)", "Nitrogen Trifluoride (NF₃)"],
  ["CF4 (PFC)", "CF₄ (PFC)"], ["C2F6 (PFC)", "C₂F₆ (PFC)"], ["C3F8 (PFC)", "C₃F₈ (PFC)"],
  ["C4F10 (PFC)", "C₄F₁₀ (PFC)"], ["C5F12 (PFC)", "C₅F₁₂ (PFC)"], ["C6F14 (PFC)", "C₆F₁₄ (PFC)"],
  ["HFC-23", "HFC-23"], ["HFC-32", "HFC-32"], ["HFC-41", "HFC-41"], ["HFC-125", "HFC-125"],
  ["HFC-134", "HFC-134"], ["HFC-134a", "HFC-134a"], ["HFC-143", "HFC-143"], ["HFC-143a", "HFC-143a"],
  ["HFC-152a", "HFC-152a"], ["HFC-227ea", "HFC-227ea"], ["HFC-236fa", "HFC-236fa"],
  ["HFC-245fa", "HFC-245fa"], ["HFC-365mfc", "HFC-365mfc"], ["HFC-43-10mee", "HFC-43-10mee"],
];

export default function PurchasedGasesFields({ formData, setFormData, calculatedEmissions }) {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Gas Type</Label>
        <Select value={formData.purchased_gas_type} onValueChange={(v) => setFormData({ ...formData, purchased_gas_type: v })}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select gas type" /></SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {GAS_OPTIONS.map(([val, label]) => <SelectItem key={val} value={val}>{label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Amount (lbs)</Label>
        <Input type="number" step="0.01" value={formData.purchased_gas_amount} onChange={(e) => setFormData({ ...formData, purchased_gas_amount: e.target.value })} placeholder="Enter amount" className="h-11 rounded-xl border-slate-200" />
      </div>
      {calculatedEmissions && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
          <span className="text-sm text-emerald-700 font-medium">Calculated Emissions</span>
          <span className="text-lg font-semibold text-emerald-800">{calculatedEmissions} tCO₂e</span>
        </motion.div>
      )}
    </div>
  );
}