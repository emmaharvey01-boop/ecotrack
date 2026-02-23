import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Building2, Save, Download, ChevronDown, ChevronUp } from "lucide-react";
import { exportToExcel } from "@/components/exports/ExcelExport";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden mb-6">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <h2 className="text-white font-semibold text-base">{title}</h2>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>}
    </div>
  );
};

const Field = ({ label, children, full }) => (
  <div className={`space-y-1.5 ${full ? "md:col-span-2" : ""}`}>
    <Label className="text-slate-300 text-sm">{label}</Label>
    {children}
  </div>
);

const inputCls = "h-10 rounded-xl border-slate-600 bg-[#0f172a] text-white placeholder:text-slate-500";
const YesNo = ({ value, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={inputCls}><SelectValue placeholder="Select" /></SelectTrigger>
    <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
  </Select>
);

const NAICS_CODES = ["11","21","22","23","31-33","42","44-45","48-49","51","52","53","54","55","56","61","62","71","72","81","92"];

export default function OrganizationInfoPage() {
  const queryClient = useQueryClient();
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);

  const { data: allRecords = [] } = useQuery({ queryKey: ["emissions"], queryFn: () => base44.entities.EmissionRecord.list("-created_date") });
  const { data: orgInfoList = [] } = useQuery({ queryKey: ["orgInfo"], queryFn: () => base44.entities.OrganizationInfo.list() });

  const companies = [...new Set(allRecords.map(r => r.company_name).filter(Boolean))].sort();

  const existingOrg = orgInfoList.find(o => o.company_name === selectedCompany);

  useEffect(() => {
    if (existingOrg) setForm(existingOrg);
    else setForm(selectedCompany && selectedCompany !== "all" ? { company_name: selectedCompany } : {});
  }, [selectedCompany, existingOrg?.id]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (existingOrg) return base44.entities.OrganizationInfo.update(existingOrg.id, data);
      return base44.entities.OrganizationInfo.create(data);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["orgInfo"] }); setSaved(true); setTimeout(() => setSaved(false), 2500); },
  });

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));
  const setInput = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const companyRecords = allRecords.filter(r => r.company_name === selectedCompany);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Building2 className="w-6 h-6" /> Organization Information</h1>
            <p className="text-slate-400 mt-1 text-sm">Fill in your organization details to generate a complete GHG report</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {companies.length > 0 && (
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="w-[200px] h-11 rounded-xl border-slate-600 bg-[#334155] text-white"><SelectValue placeholder="Select company" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Select a company…</SelectItem>
                  {companies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            {selectedCompany && selectedCompany !== "all" && (
              <>
                <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="bg-[#1B4332] hover:bg-[#143728] text-white rounded-xl h-11 px-5">
                  <Save className="w-4 h-4 mr-2" />{saved ? "Saved!" : saveMutation.isPending ? "Saving…" : "Save"}
                </Button>
                <Button onClick={() => exportToExcel(form, companyRecords)} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl h-11 px-5">
                  <Download className="w-4 h-4 mr-2" />Export Report
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {(!selectedCompany || selectedCompany === "all") ? (
        <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-400">
          <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-6">Start a new company log to fill in organization information.</p>
          <Link to={createPageUrl("CompanySurvey")}>
            <Button className="bg-[#1B4332] hover:bg-[#143728] text-white rounded-xl h-11 px-6">
              <Building2 className="w-4 h-4 mr-2" />Start a New Company Log
            </Button>
          </Link>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <Section title="Organization Information">
            <Field label="Entity Name *"><Input value={form.company_name || ""} onChange={setInput("company_name")} placeholder="Company name" className={inputCls} /></Field>
            <Field label="EIN"><Input value={form.ein || ""} onChange={setInput("ein")} placeholder="Employer ID Number" className={inputCls} /></Field>
            <Field label="NAICS Code">
              <Select value={form.naics_code} onValueChange={set("naics_code")}>
                <SelectTrigger className={inputCls}><SelectValue placeholder="Select NAICS code" /></SelectTrigger>
                <SelectContent>{NAICS_CODES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Website"><Input value={form.website || ""} onChange={setInput("website")} placeholder="https://..." className={inputCls} /></Field>
            <Field label="Street Address" full><Input value={form.street_address || ""} onChange={setInput("street_address")} placeholder="123 Main St" className={inputCls} /></Field>
            <Field label="City"><Input value={form.city || ""} onChange={setInput("city")} className={inputCls} /></Field>
            <Field label="State/Province"><Input value={form.state || ""} onChange={setInput("state")} className={inputCls} /></Field>
            <Field label="Country"><Input value={form.country || ""} onChange={setInput("country")} className={inputCls} /></Field>
            <Field label="Postal Code"><Input value={form.postal_code || ""} onChange={setInput("postal_code")} className={inputCls} /></Field>
            <Field label="Contact Name"><Input value={form.contact_name || ""} onChange={setInput("contact_name")} className={inputCls} /></Field>
            <Field label="Contact Title"><Input value={form.contact_title || ""} onChange={setInput("contact_title")} className={inputCls} /></Field>
            <Field label="Contact Phone"><Input value={form.contact_phone || ""} onChange={setInput("contact_phone")} className={inputCls} /></Field>
            <Field label="Contact Email"><Input value={form.contact_email || ""} onChange={setInput("contact_email")} className={inputCls} /></Field>
            <Field label="Verification Date (yyyy-mm-dd)"><Input value={form.verification_date || ""} onChange={setInput("verification_date")} placeholder="yyyy-mm-dd" className={inputCls} /></Field>
          </Section>

          <Section title="3rd Party Verification" defaultOpen={false}>
            <Field label="Verifier Organization Name"><Input value={form.third_party_verifier_name || ""} onChange={setInput("third_party_verifier_name")} className={inputCls} /></Field>
            <Field label="Verifier Contact Name"><Input value={form.third_party_verifier_contact || ""} onChange={setInput("third_party_verifier_contact")} className={inputCls} /></Field>
            <Field label="Verifier Email"><Input value={form.third_party_verifier_email || ""} onChange={setInput("third_party_verifier_email")} className={inputCls} /></Field>
            <Field label="Verifier Phone"><Input value={form.third_party_verifier_phone || ""} onChange={setInput("third_party_verifier_phone")} className={inputCls} /></Field>
            <Field label="Verifier Address" full><Input value={form.third_party_verifier_address || ""} onChange={setInput("third_party_verifier_address")} className={inputCls} /></Field>
            <Field label="Scope 1 — 3rd Party Verified?"><YesNo value={form.scope1_third_party_verified} onChange={set("scope1_third_party_verified")} /></Field>
            <Field label="If No, explain"><Input value={form.scope1_verification_explanation || ""} onChange={setInput("scope1_verification_explanation")} className={inputCls} /></Field>
            <Field label="Scope 2 — 3rd Party Verified?"><YesNo value={form.scope2_third_party_verified} onChange={set("scope2_third_party_verified")} /></Field>
            <Field label="If No, explain"><Input value={form.scope2_verification_explanation || ""} onChange={setInput("scope2_verification_explanation")} className={inputCls} /></Field>
          </Section>

          <Section title="Inventory Boundary" defaultOpen={false}>
            <Field label="Reporting Start Date"><Input value={form.inventory_start_date || ""} onChange={setInput("inventory_start_date")} placeholder="yyyy-mm-dd" className={inputCls} /></Field>
            <Field label="Reporting End Date"><Input value={form.inventory_end_date || ""} onChange={setInput("inventory_end_date")} placeholder="yyyy-mm-dd" className={inputCls} /></Field>
            <Field label="Consolidation Approach">
              <Select value={form.consolidation_approach} onValueChange={set("consolidation_approach")}>
                <SelectTrigger className={inputCls}><SelectValue placeholder="Select approach" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Equity Share">Equity Share</SelectItem>
                  <SelectItem value="Financial Control">Financial Control</SelectItem>
                  <SelectItem value="Organizational Control">Organizational Control</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Equity Share % (if applicable)"><Input type="number" value={form.equity_share_percentage || ""} onChange={setInput("equity_share_percentage")} className={inputCls} /></Field>
            <Field label="Subsidiary reports separately?"><YesNo value={form.subsidiary_reports_separately} onChange={set("subsidiary_reports_separately")} /></Field>
            <Field label="Regions/facilities excluded?"><YesNo value={form.regions_excluded} onChange={set("regions_excluded")} /></Field>
            <Field label="Excluded regions details" full><Textarea value={form.regions_excluded_details || ""} onChange={setInput("regions_excluded_details")} className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none" rows={2} /></Field>
            <Field label="Scope 1 — Stationary Combustion included?"><YesNo value={form.scope1_stationary_combustion} onChange={set("scope1_stationary_combustion")} /></Field>
            <Field label="Scope 1 — Process Emissions included?"><YesNo value={form.scope1_process_emissions} onChange={set("scope1_process_emissions")} /></Field>
            <Field label="Scope 1 — Mobile Combustion included?"><YesNo value={form.scope1_mobile_combustion} onChange={set("scope1_mobile_combustion")} /></Field>
            <Field label="Scope 1 — Fugitive Emissions included?"><YesNo value={form.scope1_fugitive_emissions} onChange={set("scope1_fugitive_emissions")} /></Field>
            <Field label="Scope 2 — Location-Based Electricity included?"><YesNo value={form.scope2_location_electricity} onChange={set("scope2_location_electricity")} /></Field>
            <Field label="Scope 2 — Location-Based Heating included?"><YesNo value={form.scope2_location_heating} onChange={set("scope2_location_heating")} /></Field>
            <Field label="Scope 2 — Location-Based Cooling included?"><YesNo value={form.scope2_location_cooling} onChange={set("scope2_location_cooling")} /></Field>
            <Field label="Scope 2 — Market-Based Electricity included?"><YesNo value={form.scope2_market_electricity} onChange={set("scope2_market_electricity")} /></Field>
            <Field label="Scope 2 — Market-Based Heating included?"><YesNo value={form.scope2_market_heating} onChange={set("scope2_market_heating")} /></Field>
            <Field label="Scope 2 — Market-Based Cooling included?"><YesNo value={form.scope2_market_cooling} onChange={set("scope2_market_cooling")} /></Field>
            <Field label="Includes Direct Biogenic emissions?"><YesNo value={form.includes_direct_biogenic} onChange={set("includes_direct_biogenic")} /></Field>
            <Field label="Includes Indirect Biogenic emissions?"><YesNo value={form.includes_indirect_biogenic} onChange={set("includes_indirect_biogenic")} /></Field>
            <Field label="Facilities excluded from inventory?"><YesNo value={form.facilities_excluded_inventory} onChange={set("facilities_excluded_inventory")} /></Field>
            <Field label="Facilities excluded details" full><Textarea value={form.facilities_excluded_details || ""} onChange={setInput("facilities_excluded_details")} className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none" rows={2} /></Field>
          </Section>

          <Section title="Methods & Disclosure" defaultOpen={false}>
            <Field label="Reporting Year (yyyy)"><Input value={form.reporting_year || ""} onChange={setInput("reporting_year")} placeholder="yyyy" className={inputCls} /></Field>
            <Field label="Scope 1 Emission Factors Source"><Input value={form.scope1_emission_factors_source || ""} onChange={setInput("scope1_emission_factors_source")} className={inputCls} /></Field>
            <Field label="Scope 2 Emission Factors Source"><Input value={form.scope2_emission_factors_source || ""} onChange={setInput("scope2_emission_factors_source")} className={inputCls} /></Field>
            <Field label="GWP Factors Source"><Input value={form.gwp_factors_source || ""} onChange={setInput("gwp_factors_source")} className={inputCls} /></Field>
            <Field label="Other Emission Factor Source"><Input value={form.other_emission_factor_source || ""} onChange={setInput("other_emission_factor_source")} className={inputCls} /></Field>
            <Field label="Calculation Approach" full><Textarea value={form.calculation_approach || ""} onChange={setInput("calculation_approach")} className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none" rows={2} /></Field>
            <Field label="Calculation Tools / Models" full><Textarea value={form.calculation_tools || ""} onChange={setInput("calculation_tools")} className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none" rows={2} /></Field>
            <Field label="Sources Excluded (Materiality)" full><Textarea value={form.sources_excluded_materiality || ""} onChange={setInput("sources_excluded_materiality")} className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none" rows={2} /></Field>
            <Field label="Materiality Threshold"><Input type="number" value={form.materiality_threshold || ""} onChange={setInput("materiality_threshold")} className={inputCls} /></Field>
            <Field label="CA MRR Facility ID Numbers" full><Input value={form.mrr_field || ""} onChange={setInput("mrr_field")} placeholder="Separate each item with ;" className={inputCls} /></Field>
          </Section>

          <div className="flex justify-end gap-3 pb-8">
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="bg-[#1B4332] hover:bg-[#143728] text-white rounded-xl h-11 px-6">
              <Save className="w-4 h-4 mr-2" />{saved ? "Saved!" : "Save Organization Info"}
            </Button>
            <Button onClick={() => exportToExcel(form, companyRecords)} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl h-11 px-6">
              <Download className="w-4 h-4 mr-2" />Export Full Report (.csv)
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}