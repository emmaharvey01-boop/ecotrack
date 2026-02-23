import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OffsetsFields({ formData, setFormData }) {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">GHG Reduction Scope</Label>
        <Select
          value={formData.offsets_ghg_scope}
          onValueChange={(v) => setFormData({ ...formData, offsets_ghg_scope: v })}
        >
          <SelectTrigger className="h-11 rounded-xl border-slate-200">
            <SelectValue placeholder="Select scope / category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Scope 1">Scope 1</SelectItem>
            <SelectItem value="Scope 2 - Location-Based">Scope 2 - Location-Based</SelectItem>
            <SelectItem value="Scope 2 - Market-Based">Scope 2 - Market-Based</SelectItem>
            <SelectItem value="Scope 3 - Business Travel">Scope 3 - Business Travel</SelectItem>
            <SelectItem value="Scope 3 - Employee Commuting">Scope 3 - Employee Commuting</SelectItem>
            <SelectItem value="Scope 3 - Upstream Transportation and Distribution">Scope 3 - Upstream Transportation and Distribution</SelectItem>
            <SelectItem value="Scope 3 - Waste">Scope 3 - Waste</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Offset Amount (tCO₂e)</Label>
        <Input
          type="number"
          step="0.0001"
          value={formData.offsets_tonnes}
          onChange={(e) => setFormData({ ...formData, offsets_tonnes: e.target.value })}
          placeholder="Enter offset amount in metric tons"
          className="h-11 rounded-xl border-slate-200"
        />
        <p className="text-xs text-slate-500">Enter as a positive number — offsets will be recorded as negative emissions.</p>
      </div>

      {formData.offsets_tonnes && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl"
        >
          <span className="text-sm text-emerald-700 font-medium">Offset Credit</span>
          <span className="text-lg font-semibold text-emerald-800">
            -{parseFloat(formData.offsets_tonnes).toFixed(4)} tCO₂e
          </span>
        </motion.div>
      )}
    </div>
  );
}