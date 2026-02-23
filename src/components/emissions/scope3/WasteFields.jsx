import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WASTE_EMISSION_FACTORS, WASTE_DISPOSAL_LABELS } from "../emissionConstants";

export default function WasteFields({ formData, setFormData, calculatedEmissions }) {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Waste Material</Label>
        <Select value={formData.waste_material} onValueChange={(v) => setFormData({ ...formData, waste_material: v, waste_disposal: "" })}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select waste material" /></SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {Object.keys(WASTE_EMISSION_FACTORS).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {formData.waste_material && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Disposal Type</Label>
          <Select value={formData.waste_disposal} onValueChange={(v) => setFormData({ ...formData, waste_disposal: v })}>
            <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select disposal type" /></SelectTrigger>
            <SelectContent>
              {Object.entries(WASTE_DISPOSAL_LABELS).filter(([key]) =>
                WASTE_EMISSION_FACTORS[formData.waste_material]?.[key] !== null &&
                WASTE_EMISSION_FACTORS[formData.waste_material]?.[key] !== undefined
              ).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Weight</Label>
          <Input type="number" step="0.01" value={formData.waste_weight} onChange={(e) => setFormData({ ...formData, waste_weight: e.target.value })} placeholder="Enter weight" className="h-11 rounded-xl border-slate-200" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Unit</Label>
          <Select value={formData.waste_unit} onValueChange={(v) => setFormData({ ...formData, waste_unit: v })}>
            <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="short_tons">Short Tons</SelectItem>
              <SelectItem value="lbs">Pounds (lbs)</SelectItem>
              <SelectItem value="kg">Kilograms (kg)</SelectItem>
              <SelectItem value="metric_tons">Metric Tons</SelectItem>
            </SelectContent>
          </Select>
        </div>
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