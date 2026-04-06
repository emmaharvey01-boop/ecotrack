import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UPSTREAM_TRANSPORT_VEHICLE_MILE, UPSTREAM_TRANSPORT_TON_MILE } from "../emissionConstants";

export default function UpstreamTransportFields({ formData, setFormData, calculatedEmissions, yearFactors }) {
  const vmTable = (yearFactors && yearFactors.UPSTREAM_TRANSPORT_VEHICLE_MILE) || UPSTREAM_TRANSPORT_VEHICLE_MILE;
  const tmTable = (yearFactors && yearFactors.UPSTREAM_TRANSPORT_TON_MILE) || UPSTREAM_TRANSPORT_TON_MILE;
  const factorTable = formData.upstream_mode === "vehicle_mile" ? vmTable : tmTable;
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Transport Method</Label>
        <Select value={formData.upstream_mode} onValueChange={(v) => setFormData({ ...formData, upstream_mode: v, travel_mode: "", travel_miles: "" })}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select transport method" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="vehicle_mile">On-Road Transport (Vehicle Miles)</SelectItem>
            <SelectItem value="vehicle_km">On-Road Transport (Vehicle Kilometers)</SelectItem>
            <SelectItem value="ton_mile">Product Transport (Short Ton Miles)</SelectItem>
            <SelectItem value="tonne_km">Product Transport (Metric Tonne-km)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formData.upstream_mode && (<>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Vehicle Type</Label>
          <Select value={formData.travel_mode} onValueChange={(v) => setFormData({ ...formData, travel_mode: v })}>
            <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select vehicle type" /></SelectTrigger>
            <SelectContent>{Object.keys(factorTable).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            {formData.upstream_mode === "vehicle_mile" ? "Vehicle Miles" : formData.upstream_mode === "vehicle_km" ? "Vehicle Kilometers" : formData.upstream_mode === "tonne_km" ? "Metric Tonne-km" : "Short Ton Miles"}
          </Label>
          <Input type="number" step="0.01" value={formData.travel_miles} onChange={(e) => {
            const val = e.target.value;
            // Convert km to miles, tonne-km to short ton-miles for calculation
            let miles = val;
            if (formData.upstream_mode === "vehicle_km") miles = (parseFloat(val) * 0.621371).toString();
            else if (formData.upstream_mode === "tonne_km") miles = (parseFloat(val) * 0.621371 / 1.10231).toString();
            setFormData({ ...formData, travel_miles: miles, raw_distance: val });
          }} placeholder={`Enter distance`} className="h-11 rounded-xl border-slate-200" />
        </div>
      </>)}
      {calculatedEmissions && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
          <span className="text-sm text-emerald-700 font-medium">Calculated Emissions</span>
          <span className="text-lg font-semibold text-emerald-800">{calculatedEmissions} tCO₂e</span>
        </motion.div>
      )}
    </div>
  );
}