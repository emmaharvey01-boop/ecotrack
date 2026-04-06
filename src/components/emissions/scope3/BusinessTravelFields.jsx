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
        <Label className="text-sm font-medium text-slate-700">Distance Unit</Label>
        <Select value={formData.distance_unit || "miles"} onValueChange={(v) => setFormData({ ...formData, distance_unit: v, travel_miles: "", commute_distance: "", raw_distance: "" })}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="miles">Miles</SelectItem>
            <SelectItem value="km">Kilometers (km)</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
            <Label className="text-sm font-medium text-slate-700">Avg. Commute Distance {formData.distance_unit === "km" ? "(km/employee)" : "(miles/employee)"}</Label>
            <Input type="number" step="0.01" value={formData.commute_distance} onChange={(e) => {
              const rawDist = e.target.value;
              const distMiles = formData.distance_unit === "km" ? parseFloat(rawDist) * 0.621371 : parseFloat(rawDist);
              const emp = formData.num_employees || "";
              setFormData({ ...formData, commute_distance: rawDist, travel_miles: rawDist && emp ? (distMiles * parseFloat(emp)).toString() : "" });
            }} placeholder={`${formData.distance_unit === "km" ? "km" : "miles"} per employee`} className="h-11 rounded-xl border-slate-200" />
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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Distance Unit</Label>
            <Select value={formData.distance_unit || "miles"} onValueChange={(v) => setFormData({ ...formData, distance_unit: v, travel_miles: "", raw_distance: "" })}>
              <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="miles">Miles</SelectItem>
                <SelectItem value="km">Kilometers (km)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Distance {formData.distance_unit === "km" ? "(km)" : "(miles)"}</Label>
            <Input type="number" step="0.01" value={formData.raw_distance || formData.travel_miles} onChange={(e) => {
              const val = e.target.value;
              const miles = formData.distance_unit === "km" ? (parseFloat(val) * 0.621371).toString() : val;
              setFormData({ ...formData, raw_distance: val, travel_miles: miles });
            }} placeholder={`Enter distance in ${formData.distance_unit === "km" ? "km" : "miles"}`} className="h-11 rounded-xl border-slate-200" />
          </div>
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