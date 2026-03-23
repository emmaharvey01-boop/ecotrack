import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BUSINESS_TRAVEL_FACTORS, COMMUTING_MODES } from "../emissionConstants";

export default function BusinessTravelFields({ formData, setFormData, calculatedEmissions, isCommuting, yearFactors }) {
  const travelFactors = (yearFactors && yearFactors.BUSINESS_TRAVEL_FACTORS) || BUSINESS_TRAVEL_FACTORS;
  const commuteModes = Object.keys(travelFactors).filter(m => !m.startsWith("Air"));
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Transport Mode</Label>
        <Select value={formData.travel_mode} onValueChange={(v) => setFormData({ ...formData, travel_mode: v })}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select transport mode" /></SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {(isCommuting ? commuteModes : Object.keys(travelFactors)).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {isCommuting ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Avg. Commute Distance {formData.travel_mode && `(${travelFactors[formData.travel_mode]?.unit})`}</Label>
            <Input type="number" step="0.01" value={formData.commute_distance} onChange={(e) => {
              const dist = e.target.value, emp = formData.num_employees || "";
              setFormData({ ...formData, commute_distance: dist, travel_miles: dist && emp ? (parseFloat(dist) * parseFloat(emp)).toString() : "" });
            }} placeholder="Miles per employee" className="h-11 rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Number of Employees</Label>
            <Input type="number" step="1" value={formData.num_employees} onChange={(e) => {
              const emp = e.target.value, dist = formData.commute_distance || "";
              setFormData({ ...formData, num_employees: emp, travel_miles: dist && emp ? (parseFloat(dist) * parseFloat(emp)).toString() : "" });
            }} placeholder="# of employees" className="h-11 rounded-xl border-slate-200" />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Miles Travelled {formData.travel_mode && `(${travelFactors[formData.travel_mode]?.unit})`}</Label>
          <Input type="number" step="0.01" value={formData.travel_miles} onChange={(e) => setFormData({ ...formData, travel_miles: e.target.value })} placeholder="Enter miles" className="h-11 rounded-xl border-slate-200" />
        </div>
      )}
      {calculatedEmissions && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
          <span className="text-sm text-emerald-700 font-medium">Calculated Emissions</span>
          <span className="text-lg font-semibold text-emerald-800">{calculatedEmissions} tCO₂e</span>
        </motion.div>
      )}
    </div>
  );
}