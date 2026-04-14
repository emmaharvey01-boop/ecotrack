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
      const oldName = company;
      const newName = data.company_name;
      if (orgInfo) {
        await base44.entities.OrganizationInfo.update(orgInfo.id, data);
        // If name changed, update all emission records and drafts
        if (oldName && newName && oldName !== newName) {
          const [emissions, drafts] = await Promise.all([
            base44.entities.EmissionRecord.filter({ company_name: oldName }),
            base44.entities.DraftEmissionRecord.filter({ company_name: oldName }),
          ]);
          await Promise.all([
            ...emissions.map(r => base44.entities.EmissionRecord.update(r.id, { company_name: newName })),
            ...drafts.map(r => base44.entities.DraftEmissionRecord.update(r.id, { company_name: newName })),
          ]);
          // Navigate to updated company URL
          window.history.replaceState(null, "", `/CompanyDashboard?company=${encodeURIComponent(newName)}`);
        }
      } else {
        await base44.entities.OrganizationInfo.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgInfo"] });
      queryClient.invalidateQueries({ queryKey: ["emissions"] });
      queryClient.invalidateQueries({ queryKey: ["drafts"] });
      onSaved?.(form.company_name);
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