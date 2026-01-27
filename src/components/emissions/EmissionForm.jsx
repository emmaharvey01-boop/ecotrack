import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Leaf, Zap } from "lucide-react";

const SCOPE_1_CATEGORIES = [
  { value: "stationary_combustion", label: "Stationary Combustion", sources: ["Natural Gas", "Diesel", "Propane", "Fuel Oil", "Coal"] },
  { value: "mobile_combustion", label: "Mobile Combustion", sources: ["Fleet Vehicles - Gasoline", "Fleet Vehicles - Diesel", "Company Aircraft", "Company Vessels"] },
  { value: "fugitive_emissions", label: "Fugitive Emissions", sources: ["Refrigerants", "Air Conditioning Units", "Fire Suppressants"] },
  { value: "process_emissions", label: "Process Emissions", sources: ["Chemical Processes", "Manufacturing", "Waste Treatment"] }
];

const SCOPE_2_CATEGORIES = [
  { value: "purchased_electricity", label: "Purchased Electricity", sources: ["Grid Electricity", "Renewable Electricity"] },
  { value: "purchased_heating", label: "Purchased Heating", sources: ["District Heating", "Steam"] },
  { value: "purchased_cooling", label: "Purchased Cooling", sources: ["District Cooling", "Chilled Water"] }
];

const EMISSION_FACTORS = {
  "Natural Gas": { factor: 0.00205, unit: "therms" },
  "Diesel": { factor: 0.00268, unit: "liters" },
  "Propane": { factor: 0.00159, unit: "liters" },
  "Fuel Oil": { factor: 0.00275, unit: "liters" },
  "Coal": { factor: 0.00247, unit: "kg" },
  "Fleet Vehicles - Gasoline": { factor: 0.00023, unit: "km" },
  "Fleet Vehicles - Diesel": { factor: 0.00027, unit: "km" },
  "Company Aircraft": { factor: 0.00025, unit: "km" },
  "Company Vessels": { factor: 0.00015, unit: "nautical miles" },
  "Refrigerants": { factor: 1.43, unit: "kg" },
  "Air Conditioning Units": { factor: 1.81, unit: "kg" },
  "Fire Suppressants": { factor: 7.14, unit: "kg" },
  "Chemical Processes": { factor: 0.5, unit: "tonnes" },
  "Manufacturing": { factor: 0.3, unit: "tonnes" },
  "Waste Treatment": { factor: 0.2, unit: "tonnes" },
  "Grid Electricity": { factor: 0.000417, unit: "kWh" },
  "Renewable Electricity": { factor: 0.00002, unit: "kWh" },
  "District Heating": { factor: 0.00019, unit: "kWh" },
  "Steam": { factor: 0.00022, unit: "kg" },
  "District Cooling": { factor: 0.00015, unit: "kWh" },
  "Chilled Water": { factor: 0.00012, unit: "kWh" }
};

const REPORTING_PERIODS = [
  "Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", 
  "2024", "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "2025"
];

export default function EmissionForm({ open, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    scope: "",
    category: "",
    source: "",
    amount: "",
    reporting_period: "",
    notes: ""
  });

  const categories = formData.scope === "scope_1" ? SCOPE_1_CATEGORIES : 
                     formData.scope === "scope_2" ? SCOPE_2_CATEGORIES : [];
  
  const selectedCategory = categories.find(c => c.value === formData.category);
  const sources = selectedCategory?.sources || [];
  const emissionFactor = EMISSION_FACTORS[formData.source];

  const calculatedEmissions = formData.amount && emissionFactor 
    ? (parseFloat(formData.amount) * emissionFactor.factor).toFixed(4)
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const record = {
      scope: formData.scope,
      category: selectedCategory?.label || formData.category,
      source: formData.source,
      amount: parseFloat(formData.amount),
      unit: emissionFactor?.unit || "",
      emission_factor: emissionFactor?.factor || 0,
      co2e_tonnes: parseFloat(calculatedEmissions) || 0,
      reporting_period: formData.reporting_period,
      notes: formData.notes
    };

    onSubmit(record);
    setFormData({
      scope: "",
      category: "",
      source: "",
      amount: "",
      reporting_period: "",
      notes: ""
    });
  };

  const handleScopeChange = (value) => {
    setFormData({ ...formData, scope: value, category: "", source: "" });
  };

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value, source: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Add Emission Record
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Scope</Label>
              <Select value={formData.scope} onValueChange={handleScopeChange}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200">
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scope_1">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <span>Scope 1 (Direct)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="scope_2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>Scope 2 (Indirect)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Reporting Period</Label>
              <Select 
                value={formData.reporting_period} 
                onValueChange={(value) => setFormData({ ...formData, reporting_period: value })}
              >
                <SelectTrigger className="h-11 rounded-xl border-slate-200">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {REPORTING_PERIODS.map(period => (
                    <SelectItem key={period} value={period}>{period}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {formData.scope && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label className="text-sm font-medium text-slate-700">Category</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {formData.category && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label className="text-sm font-medium text-slate-700">Emission Source</Label>
                <Select 
                  value={formData.source} 
                  onValueChange={(value) => setFormData({ ...formData, source: value })}
                >
                  <SelectTrigger className="h-11 rounded-xl border-slate-200">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {formData.source && emissionFactor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label className="text-sm font-medium text-slate-700">
                  Amount ({emissionFactor.unit})
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder={`Enter amount in ${emissionFactor.unit}`}
                  className="h-11 rounded-xl border-slate-200"
                />
                
                {calculatedEmissions && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl mt-3"
                  >
                    <span className="text-sm text-emerald-700 font-medium">Calculated Emissions</span>
                    <span className="text-lg font-semibold text-emerald-800">{calculatedEmissions} tCO₂e</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Notes (Optional)</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional documentation or notes..."
              className="rounded-xl border-slate-200 resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 h-11 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!formData.scope || !formData.category || !formData.source || !formData.amount || !formData.reporting_period || isSubmitting}
              className="flex-1 h-11 rounded-xl bg-[#1B4332] hover:bg-[#143728] text-white"
            >
              {isSubmitting ? "Adding..." : "Add Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}