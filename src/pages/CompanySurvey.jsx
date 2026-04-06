import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, SkipForward } from "lucide-react";
import { motion } from "framer-motion";

const NAICS_CODES = ["11","21","22","23","31-33","42","44-45","48-49","51","52","53","54","55","56","61","62","71","72","81","92"];

const ORG_QUESTIONS = [
  { key: "ein", label: "Employer Identification Number (EIN)", type: "text" },
  { key: "naics_code", label: "Primary Industry NAICS Code", type: "dropdown", options: NAICS_CODES },
  { key: "website", label: "Entity Website URL", type: "text" },
  { key: "street_address", label: "Headquarter Street Address", type: "text" },
  { key: "city", label: "City", type: "text" },
  { key: "state", label: "State / Province", type: "text" },
  { key: "country", label: "Country", type: "text" },
  { key: "postal_code", label: "Postal Code", type: "text" },
  { key: "contact_name", label: "Contact Person Name", type: "text" },
  { key: "contact_title", label: "Contact Person Title", type: "text" },
  { key: "contact_phone", label: "Contact Phone Number", type: "text" },
  { key: "contact_email", label: "Contact Email Address", type: "text" },
  { key: "annual_revenue", label: "Annual Revenue (USD)", type: "number" },
  { key: "verification_date", label: "Verification Date (yyyy-mm-dd)", type: "text", placeholder: "yyyy-mm-dd" },
];

export default function CompanySurvey() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("landing"); // "landing" | "orgInfo"
  const [companyName, setCompanyName] = useState("");
  const [form, setForm] = useState({});

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.OrganizationInfo.create(data),
    onSuccess: (_, variables, context) => {
      const step = variables._goToEmissions ? "&step=emissions" : "";
      navigate(`/CompanyDashboard?company=${encodeURIComponent(variables.company_name)}${step}`);
    },
  });

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleProceedToInventory = (goToEmissions = false) => {
    saveMutation.mutate({ company_name: companyName, _goToEmissions: goToEmissions });
  };

  const handleSubmitOrgInfo = (e) => {
    e.preventDefault();
    saveMutation.mutate({ ...form, company_name: companyName });
  };

  // ── Phase 1: Landing ──────────────────────────────────────────────────────
  if (phase === "landing") {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg text-center"
        >
          <h1 className="text-3xl font-semibold text-white mb-10">
            Enter the name of your entity.
          </h1>

          <Input
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            placeholder="Entity name"
            className="h-14 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-lg text-center focus-visible:ring-white/30 mb-10"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              disabled={!companyName.trim()}
              onClick={() => setPhase("orgInfo")}
              variant="outline"
              className="h-12 px-7 rounded-xl border-white/30 text-white bg-transparent hover:bg-white/10 text-sm"
            >
              Enter Organisation Information
            </Button>
            <Button
              disabled={!companyName.trim() || saveMutation.isPending}
              onClick={() => handleProceedToInventory(false)}
              className="h-12 px-7 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm"
            >
              {saveMutation.isPending ? "Saving..." : "Proceed to GHG Inventory"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Phase 2: Org Info Form ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Top bar with skip button */}
      <div className="sticky top-0 z-10 bg-[#0f172a] border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <p className="text-slate-400 text-sm">Organisation Information — <span className="text-white">{companyName}</span></p>
        <Button
          onClick={handleProceedToInventory}
          disabled={saveMutation.isPending}
          variant="outline"
          className="h-9 px-5 rounded-xl border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white text-sm"
          onClick={() => handleProceedToInventory(true)}
        >
          <SkipForward className="w-4 h-4 mr-1.5" />
          Skip to GHG Inventory
        </Button>
      </div>

      <div className="max-w-xl mx-auto px-4 py-10">
        <h2 className="text-white text-xl font-semibold mb-8">Organisation Details</h2>
        <form onSubmit={handleSubmitOrgInfo} className="space-y-5">
          {ORG_QUESTIONS.map(q => (
            <div key={q.key} className="space-y-1.5">
              <Label className="text-slate-300 text-sm">{q.label}</Label>
              {q.type === "dropdown" ? (
                <Select value={form[q.key] || ""} onValueChange={v => set(q.key, v)}>
                  <SelectTrigger className="h-11 rounded-xl bg-[#1e293b] border-slate-600 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {q.options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={q.type === "number" ? "number" : "text"}
                  value={form[q.key] || ""}
                  onChange={e => set(q.key, q.type === "number" ? (e.target.value ? Number(e.target.value) : "") : e.target.value)}
                  placeholder={q.placeholder || ""}
                  className="h-11 rounded-xl bg-[#1e293b] border-slate-600 text-white placeholder:text-slate-500"
                />
              )}
            </div>
          ))}

          <div className="pt-4">
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full h-12 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-base"
            >
              {saveMutation.isPending ? "Saving..." : "Save & Go to GHG Inventory"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}