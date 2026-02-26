import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, ChevronDown, ChevronUp, Calculator } from "lucide-react";

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

// Compute disclosure totals from emission records
function computeDisclosureTotals(records, annualRevenue) {
  const scope1 = records.filter(r => r.scope === "scope_1");
  const scope2 = records.filter(r => r.scope === "scope_2");

  const sum = (arr) => arr.reduce((s, r) => s + (r.co2e_tonnes || 0), 0);

  const scope1Total = sum(scope1);
  const scope1Stationary = sum(scope1.filter(r => r.category?.toLowerCase().includes("stationary")));
  const scope1Process = sum(scope1.filter(r => r.category?.toLowerCase().includes("process")));
  const scope1Mobile = sum(scope1.filter(r => r.category?.toLowerCase().includes("mobile")));
  const scope1Fugitive = sum(scope1.filter(r =>
    r.category?.toLowerCase().includes("fugitive") ||
    r.category?.toLowerCase().includes("refriger") ||
    r.category?.toLowerCase().includes("fire")
  ));

  const scope2MarketTotal = sum(scope2.filter(r => r.scope_2_method === "market_based"));
  const scope2LocationTotal = sum(scope2.filter(r => r.scope_2_method === "location_based"));
  const scope2Electricity = sum(scope2.filter(r => r.category?.toLowerCase().includes("electric")));
  const scope2Steam = sum(scope2.filter(r => r.category?.toLowerCase().includes("steam")));
  const scope2Heating = sum(scope2.filter(r => r.category?.toLowerCase().includes("heat")));
  const scope2Cooling = sum(scope2.filter(r => r.category?.toLowerCase().includes("cool")));

  const revenueMillions = annualRevenue ? annualRevenue / 1_000_000 : null;

  return {
    scope1_total_direct: +scope1Total.toFixed(4),
    scope1_stationary_total: +scope1Stationary.toFixed(4),
    scope1_process_total: +scope1Process.toFixed(4),
    scope1_mobile_total: +scope1Mobile.toFixed(4),
    scope1_fugitive_total: +scope1Fugitive.toFixed(4),
    scope1_intensity: revenueMillions ? +(scope1Total / revenueMillions).toFixed(4) : "",
    scope2_total_indirect_market: +scope2MarketTotal.toFixed(4),
    scope2_total_indirect_location: +scope2LocationTotal.toFixed(4),
    scope2_electricity_total: +scope2Electricity.toFixed(4),
    scope2_steam_total: +scope2Steam.toFixed(4),
    scope2_heating_total: +scope2Heating.toFixed(4),
    scope2_cooling_total: +scope2Cooling.toFixed(4),
    scope2_intensity_market: revenueMillions ? +(scope2MarketTotal / revenueMillions).toFixed(4) : "",
    scope2_intensity_location: revenueMillions ? +(scope2LocationTotal / revenueMillions).toFixed(4) : "",
  };
}

export default function AdditionalInfoForm({ company, orgInfo, records = [], onSaved }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);

  const computed = computeDisclosureTotals(records, orgInfo?.annual_revenue);

  useEffect(() => {
    if (orgInfo) setForm(orgInfo);
    else if (company) setForm({ company_name: company });
  }, [orgInfo?.id, company]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (orgInfo) return base44.entities.OrganizationInfo.update(orgInfo.id, data);
      return base44.entities.OrganizationInfo.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgInfo"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      if (onSaved) onSaved();
    },
  });

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));
  const setInput = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const setNum = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value ? Number(e.target.value) : "" }));

  return (
    <div>
      <Section title="3rd Party Verification">
        <Field label="Verifier Organization Name"><Input value={form.third_party_verifier_name || ""} onChange={setInput("third_party_verifier_name")} className={inputCls} /></Field>
        <Field label="Verifier Contact Name"><Input value={form.third_party_verifier_contact || ""} onChange={setInput("third_party_verifier_contact")} className={inputCls} /></Field>
        <Field label="Verifier Email"><Input value={form.third_party_verifier_email || ""} onChange={setInput("third_party_verifier_email")} className={inputCls} /></Field>
        <Field label="Verifier Phone (10 digits)"><Input value={form.third_party_verifier_phone || ""} onChange={setInput("third_party_verifier_phone")} className={inputCls} /></Field>
        <Field label="Verifier Address" full><Input value={form.third_party_verifier_address || ""} onChange={setInput("third_party_verifier_address")} className={inputCls} /></Field>
        <Field label="Scope 1 — 3rd Party Verified?"><YesNo value={form.scope1_third_party_verified} onChange={set("scope1_third_party_verified")} /></Field>
        <Field label="If No, provide explanation" full><Textarea value={form.scope1_verification_explanation || ""} onChange={setInput("scope1_verification_explanation")} className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none" rows={2} /></Field>
        <Field label="Scope 2 — 3rd Party Verified?"><YesNo value={form.scope2_third_party_verified} onChange={set("scope2_third_party_verified")} /></Field>
        <Field label="If No, provide explanation" full><Textarea value={form.scope2_verification_explanation || ""} onChange={setInput("scope2_verification_explanation")} className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none" rows={2} /></Field>
      </Section>

      <Section title="Inventory Boundary">
        <Field label="Reporting Start Date (yyyy-mm-dd)"><Input value={form.inventory_start_date || ""} onChange={setInput("inventory_start_date")} placeholder="yyyy-mm-dd" className={inputCls} /></Field>
        <Field label="Reporting End Date (yyyy-mm-dd)"><Input value={form.inventory_end_date || ""} onChange={setInput("inventory_end_date")} placeholder="yyyy-mm-dd" className={inputCls} /></Field>
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
        <Field label="Equity Share % (if applicable)"><Input type="number" value={form.equity_share_percentage || ""} onChange={setNum("equity_share_percentage")} className={inputCls} /></Field>
        <Field label="List of obligated entities/facilities (Equity Share)" full><Textarea value={form.equity_share_entities || ""} onChange={setInput("equity_share_entities")} placeholder="Separate each item with ," className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none" rows={2} /></Field>
        <Field label="List of obligated entities/facilities (Financial/Operational Control)" full><Textarea value={form.control_entities || ""} onChange={setInput("control_entities")} placeholder="Separate each item with ," className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none" rows={2} /></Field>
        <Field label="Subsidiary reports separately?"><YesNo value={form.subsidiary_reports_separately} onChange={set("subsidiary_reports_separately")} /></Field>
        <Field label="Regions/facilities excluded from boundary?"><YesNo value={form.regions_excluded} onChange={set("regions_excluded")} /></Field>
        <Field label="Excluded regions/facilities details" full><Textarea value={form.regions_excluded_details || ""} onChange={setInput("regions_excluded_details")} className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none" rows={2} /></Field>
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

      <Section title="Disclosure — Scope 1">
        <Field label="Scope 1 Total Direct Emissions (mtCO₂e)"><Input type="number" value={form.scope1_total_direct || ""} onChange={setNum("scope1_total_direct")} className={inputCls} /></Field>
        <Field label="Scope 1 from Stationary Combustion (mtCO₂e)"><Input type="number" value={form.scope1_stationary_total || ""} onChange={setNum("scope1_stationary_total")} className={inputCls} /></Field>
        <Field label="Scope 1 from Process Sources (mtCO₂e)"><Input type="number" value={form.scope1_process_total || ""} onChange={setNum("scope1_process_total")} className={inputCls} /></Field>
        <Field label="Scope 1 from Mobile Combustion (mtCO₂e)"><Input type="number" value={form.scope1_mobile_total || ""} onChange={setNum("scope1_mobile_total")} className={inputCls} /></Field>
        <Field label="Scope 1 from Fugitive Sources (mtCO₂e)"><Input type="number" value={form.scope1_fugitive_total || ""} onChange={setNum("scope1_fugitive_total")} className={inputCls} /></Field>
        <Field label="Scope 1 Emission Intensity (mtCO₂e / $millions revenue)"><Input type="number" value={form.scope1_intensity || ""} onChange={setNum("scope1_intensity")} className={inputCls} /></Field>
        <Field label="All Scope 1 at limited assurance level?"><YesNo value={form.scope1_limited_assurance} onChange={set("scope1_limited_assurance")} /></Field>
        <Field label="If No, provide explanation" full><Textarea value={form.scope1_assurance_explanation || ""} onChange={setInput("scope1_assurance_explanation")} className="rounded-xl border-slate-600 bg-[#0f172a] text-white resize-none" rows={2} /></Field>
      </Section>

      <Section title="Disclosure — Scope 2">
        <Field label="Scope 2 Total Indirect Emissions (mtCO₂e)"><Input type="number" value={form.scope2_total_indirect || ""} onChange={setNum("scope2_total_indirect")} className={inputCls} /></Field>
        <Field label="Scope 2 from Purchased/Acquired Electricity (mtCO₂e)"><Input type="number" value={form.scope2_electricity_total || ""} onChange={setNum("scope2_electricity_total")} className={inputCls} /></Field>
        <Field label="Scope 2 from Purchased/Acquired Steam (mtCO₂e)"><Input type="number" value={form.scope2_steam_total || ""} onChange={setNum("scope2_steam_total")} className={inputCls} /></Field>
        <Field label="Scope 2 from Purchased/Acquired Heating (mtCO₂e)"><Input type="number" value={form.scope2_heating_total || ""} onChange={setNum("scope2_heating_total")} className={inputCls} /></Field>
        <Field label="Scope 2 from Purchased/Acquired Cooling (mtCO₂e)"><Input type="number" value={form.scope2_cooling_total || ""} onChange={setNum("scope2_cooling_total")} className={inputCls} /></Field>
        <Field label="Scope 2 Emission Intensity (mtCO₂e / $millions revenue)"><Input type="number" value={form.scope2_intensity || ""} onChange={setNum("scope2_intensity")} className={inputCls} /></Field>
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
        <Field label="Materiality Threshold"><Input type="number" value={form.materiality_threshold || ""} onChange={setNum("materiality_threshold")} className={inputCls} /></Field>
        <Field label="CA MRR Facility ID Numbers" full><Input value={form.mrr_field || ""} onChange={setInput("mrr_field")} placeholder="Separate each item with ;" className={inputCls} /></Field>
      </Section>

      <div className="flex justify-end pb-8">
        <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="bg-[#1B4332] hover:bg-[#143728] text-white rounded-xl h-11 px-6">
          <Save className="w-4 h-4 mr-2" />{saved ? "Saved!" : saveMutation.isPending ? "Saving…" : "Save Additional Info"}
        </Button>
      </div>
    </div>
  );
}