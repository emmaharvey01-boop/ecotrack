import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden mb-5">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>}
    </div>
  );
};

const Field = ({ label, children, full }) => (
  <div className={`space-y-1.5 ${full ? "md:col-span-2" : ""}`}>
    <Label className="text-slate-300 text-xs">{label}</Label>
    {children}
  </div>
);

const cls = "h-10 rounded-xl border-slate-600 bg-[#0f172a] text-white placeholder:text-slate-500 text-sm";

const YesNo = ({ value, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={cls}><SelectValue placeholder="Select" /></SelectTrigger>
    <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
  </Select>
);

const NAICS_CODES = ["11","21","22","23","31-33","42","44-45","48-49","51","52","53","54","55","56","61","62","71","72","81","92"];

export default function OrgInfoForm({ company, orgInfo, onSaved, onNext }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ company_name: company });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (orgInfo) setForm(orgInfo);
    else setForm({ company_name: company });
  }, [orgInfo?.id, company]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (orgInfo) return base44.entities.OrganizationInfo.update(orgInfo.id, data);
      return base44.entities.OrganizationInfo.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgInfo"] });
      onSaved?.();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));
  const inp = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <Section title="Organization Information">
        <Field label="Entity Name *"><Input value={form.company_name || ""} onChange={inp("company_name")} className={cls} /></Field>
        <Field label="EIN"><Input value={form.ein || ""} onChange={inp("ein")} placeholder="Employer ID Number" className={cls} /></Field>
        <Field label="NAICS Code">
          <Select value={form.naics_code} onValueChange={set("naics_code")}>
            <SelectTrigger className={cls}><SelectValue placeholder="Select NAICS" /></SelectTrigger>
            <SelectContent>{NAICS_CODES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Website"><Input value={form.website || ""} onChange={inp("website")} placeholder="https://..." className={cls} /></Field>
        <Field label="Annual Revenue (USD)"><Input type="number" value={form.annual_revenue || ""} onChange={inp("annual_revenue")} placeholder="e.g. 5000000" className={cls} /></Field>
        <Field label="Street Address" full><Input value={form.street_address || ""} onChange={inp("street_address")} className={cls} /></Field>
        <Field label="City"><Input value={form.city || ""} onChange={inp("city")} className={cls} /></Field>
        <Field label="State/Province"><Input value={form.state || ""} onChange={inp("state")} className={cls} /></Field>
        <Field label="Country"><Input value={form.country || ""} onChange={inp("country")} className={cls} /></Field>
        <Field label="Postal Code"><Input value={form.postal_code || ""} onChange={inp("postal_code")} className={cls} /></Field>
        <Field label="Contact Name"><Input value={form.contact_name || ""} onChange={inp("contact_name")} className={cls} /></Field>
        <Field label="Contact Title"><Input value={form.contact_title || ""} onChange={inp("contact_title")} className={cls} /></Field>
        <Field label="Contact Phone"><Input value={form.contact_phone || ""} onChange={inp("contact_phone")} className={cls} /></Field>
        <Field label="Contact Email"><Input value={form.contact_email || ""} onChange={inp("contact_email")} className={cls} /></Field>
        <Field label="Verification Date (yyyy-mm-dd)"><Input value={form.verification_date || ""} onChange={inp("verification_date")} placeholder="yyyy-mm-dd" className={cls} /></Field>
      </Section>

      <Section title="3rd Party Verification" defaultOpen={false}>
        <Field label="Verifier Organization"><Input value={form.third_party_verifier_name || ""} onChange={inp("third_party_verifier_name")} className={cls} /></Field>
        <Field label="Verifier Contact Name"><Input value={form.third_party_verifier_contact || ""} onChange={inp("third_party_verifier_contact")} className={cls} /></Field>
        <Field label="Verifier Email"><Input value={form.third_party_verifier_email || ""} onChange={inp("third_party_verifier_email")} className={cls} /></Field>
        <Field label="Verifier Phone"><Input value={form.third_party_verifier_phone || ""} onChange={inp("third_party_verifier_phone")} className={cls} /></Field>
        <Field label="Verifier Address" full><Input value={form.third_party_verifier_address || ""} onChange={inp("third_party_verifier_address")} className={cls} /></Field>
        <Field label="Scope 1 — 3rd Party Verified?"><YesNo value={form.scope1_third_party_verified} onChange={set("scope1_third_party_verified")} /></Field>
        <Field label="If No, explain"><Input value={form.scope1_verification_explanation || ""} onChange={inp("scope1_verification_explanation")} className={cls} /></Field>
        <Field label="Scope 2 — 3rd Party Verified?"><YesNo value={form.scope2_third_party_verified} onChange={set("scope2_third_party_verified")} /></Field>
        <Field label="If No, explain"><Input value={form.scope2_verification_explanation || ""} onChange={inp("scope2_verification_explanation")} className={cls} /></Field>
      </Section>

      <Section title="Inventory Boundary" defaultOpen={false}>
        <Field label="Reporting Start Date"><Input value={form.inventory_start_date || ""} onChange={inp("inventory_start_date")} placeholder="yyyy-mm-dd" className={cls} /></Field>
        <Field label="Reporting End Date"><Input value={form.inventory_end_date || ""} onChange={inp("inventory_end_date")} placeholder="yyyy-mm-dd" className={cls} /></Field>
        <Field label="Consolidation Approach">
          <Select value={form.consolidation_approach} onValueChange={set("consolidation_approach")}>
            <SelectTrigger className={cls}><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Equity Share">Equity Share</SelectItem>
              <SelectItem value="Financial Control">Financial Control</SelectItem>
              <SelectItem value="Organizational Control">Organizational Control</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Equity Share %"><Input type="number" value={form.equity_share_percentage || ""} onChange={inp("equity_share_percentage")} className={cls} /></Field>
        <Field label="Subsidiary reports separately?"><YesNo value={form.subsidiary_reports_separately} onChange={set("subsidiary_reports_separately")} /></Field>
        <Field label="Regions/facilities excluded?"><YesNo value={form.regions_excluded} onChange={set("regions_excluded")} /></Field>
        <Field label="Excluded details" full><Textarea value={form.regions_excluded_details || ""} onChange={inp("regions_excluded_details")} className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none text-sm" rows={2} /></Field>
        <Field label="Scope 1 — Stationary Combustion?"><YesNo value={form.scope1_stationary_combustion} onChange={set("scope1_stationary_combustion")} /></Field>
        <Field label="Scope 1 — Process Emissions?"><YesNo value={form.scope1_process_emissions} onChange={set("scope1_process_emissions")} /></Field>
        <Field label="Scope 1 — Mobile Combustion?"><YesNo value={form.scope1_mobile_combustion} onChange={set("scope1_mobile_combustion")} /></Field>
        <Field label="Scope 1 — Fugitive Emissions?"><YesNo value={form.scope1_fugitive_emissions} onChange={set("scope1_fugitive_emissions")} /></Field>
        <Field label="Scope 2 — Location Electricity?"><YesNo value={form.scope2_location_electricity} onChange={set("scope2_location_electricity")} /></Field>
        <Field label="Scope 2 — Location Heating?"><YesNo value={form.scope2_location_heating} onChange={set("scope2_location_heating")} /></Field>
        <Field label="Scope 2 — Location Cooling?"><YesNo value={form.scope2_location_cooling} onChange={set("scope2_location_cooling")} /></Field>
        <Field label="Scope 2 — Market Electricity?"><YesNo value={form.scope2_market_electricity} onChange={set("scope2_market_electricity")} /></Field>
        <Field label="Scope 2 — Market Heating?"><YesNo value={form.scope2_market_heating} onChange={set("scope2_market_heating")} /></Field>
        <Field label="Scope 2 — Market Cooling?"><YesNo value={form.scope2_market_cooling} onChange={set("scope2_market_cooling")} /></Field>
        <Field label="Direct Biogenic included?"><YesNo value={form.includes_direct_biogenic} onChange={set("includes_direct_biogenic")} /></Field>
        <Field label="Indirect Biogenic included?"><YesNo value={form.includes_indirect_biogenic} onChange={set("includes_indirect_biogenic")} /></Field>
        <Field label="Facilities excluded from inventory?"><YesNo value={form.facilities_excluded_inventory} onChange={set("facilities_excluded_inventory")} /></Field>
        <Field label="Facilities excluded details" full><Textarea value={form.facilities_excluded_details || ""} onChange={inp("facilities_excluded_details")} className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none text-sm" rows={2} /></Field>
      </Section>

      <Section title="Methods & Disclosure" defaultOpen={false}>
        <Field label="Reporting Year"><Input value={form.reporting_year || ""} onChange={inp("reporting_year")} placeholder="yyyy" className={cls} /></Field>
        <Field label="Scope 1 Emission Factors Source"><Input value={form.scope1_emission_factors_source || ""} onChange={inp("scope1_emission_factors_source")} className={cls} /></Field>
        <Field label="Scope 2 Emission Factors Source"><Input value={form.scope2_emission_factors_source || ""} onChange={inp("scope2_emission_factors_source")} className={cls} /></Field>
        <Field label="GWP Factors Source"><Input value={form.gwp_factors_source || ""} onChange={inp("gwp_factors_source")} className={cls} /></Field>
        <Field label="Other Emission Factor Source"><Input value={form.other_emission_factor_source || ""} onChange={inp("other_emission_factor_source")} className={cls} /></Field>
        <Field label="Calculation Approach" full><Textarea value={form.calculation_approach || ""} onChange={inp("calculation_approach")} className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none text-sm" rows={2} /></Field>
        <Field label="Calculation Tools / Models" full><Textarea value={form.calculation_tools || ""} onChange={inp("calculation_tools")} className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none text-sm" rows={2} /></Field>
        <Field label="Sources Excluded (Materiality)" full><Textarea value={form.sources_excluded_materiality || ""} onChange={inp("sources_excluded_materiality")} className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none text-sm" rows={2} /></Field>
        <Field label="Materiality Threshold"><Input type="number" value={form.materiality_threshold || ""} onChange={inp("materiality_threshold")} className={cls} /></Field>
        <Field label="CA MRR Facility ID Numbers" full><Input value={form.mrr_field || ""} onChange={inp("mrr_field")} placeholder="Separate each item with ;" className={cls} /></Field>
      </Section>

      <div className="flex justify-between items-center pt-2 pb-6">
        <Button type="button" onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} variant="outline" className="rounded-xl h-11 px-6 border-slate-600 text-slate-300">
          <Save className="w-4 h-4 mr-2" />{saved ? "Saved!" : saveMutation.isPending ? "Saving…" : "Save"}
        </Button>
        <Button type="button" onClick={() => { saveMutation.mutate(form); onNext?.(); }} className="bg-[#1B4332] hover:bg-[#143728] text-white rounded-xl h-11 px-6">
          Save & Continue to Emissions <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}