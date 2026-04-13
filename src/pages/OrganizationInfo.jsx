import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Save, Download, Trash2, BarChart2, Plus, CheckCircle2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { exportToExcel } from "@/components/exports/ExcelExport";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const NAICS_CODES = ["11","21","22","23","31-33","42","44-45","48-49","51","52","53","54","55","56","61","62","71","72","81","92"];
const inputCls = "h-10 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#1a2744] focus:ring-1 focus:ring-[#1a2744]";

const TABS = ["OVERVIEW", "ORGANIZATION INFO", "EMISSIONS", "EXPORT"];

function FieldRow({ label, value }) {
  return (
    <div className="grid grid-cols-2 border-b border-gray-100 py-2.5 last:border-0">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <span className="text-sm text-gray-600">{value || <span className="text-gray-400 italic">—</span>}</span>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-6 bg-[#1a2744] rounded-full flex-shrink-0" />
      <h2 className="text-sm font-black tracking-widest text-gray-800 uppercase">{title}</h2>
    </div>
  );
}

export default function OrganizationInfoPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("OVERVIEW");

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

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const toDelete = allRecords.filter(r => r.company_name === selectedCompany);
      await Promise.all(toDelete.map(r => base44.entities.EmissionRecord.delete(r.id)));
      if (existingOrg) await base44.entities.OrganizationInfo.delete(existingOrg.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emissions"] });
      queryClient.invalidateQueries({ queryKey: ["orgInfo"] });
      setSelectedCompany("all");
    },
  });

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));
  const setInput = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const companyRecords = allRecords.filter(r => r.company_name === selectedCompany);
  const hasCompany = selectedCompany && selectedCompany !== "all";

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navy Header */}
      <header className="bg-[#1a2744] text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Building2 className="w-6 h-6 text-white opacity-90" />
              <h1 className="text-2xl font-black tracking-tight">Organization Information</h1>
            </div>
            <p className="text-blue-200 text-sm ml-9">Fill in your organization details to generate a complete GHG report</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <Select value={selectedCompany} onValueChange={(v) => { setSelectedCompany(v); if (v && v !== "all") navigate(`/CompanyDashboard?company=${encodeURIComponent(v)}`); }}>
              <SelectTrigger className="w-52 h-10 rounded-lg border-white/20 bg-white/10 text-white text-sm backdrop-blur [&>span]:text-white">
                <SelectValue placeholder="Select a company..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select a company…</SelectItem>
                {companies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-0">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-xs font-bold tracking-widest transition-all border-b-2 ${
                  activeTab === tab
                    ? "border-white text-white"
                    : "border-transparent text-blue-200 hover:text-white hover:border-white/40"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {!hasCompany ? (
          /* Empty State */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <SectionHeader title="Current Organization Setup" />
              <div className="text-center py-10 text-gray-400">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No company selected</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <SectionHeader title="Get Started: Create a New Log" />
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm mb-6 max-w-xs">Start a new company log to fill in organization information.</p>
                <div className="bg-gray-50 rounded-xl border border-gray-200 px-8 py-3 mb-5">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Status</p>
                  <span className="inline-block bg-orange-500 text-white text-xs font-black tracking-widest px-4 py-1.5 rounded-full uppercase">Not Started</span>
                </div>
                <Link to={createPageUrl("CompanySurvey")}>
                  <Button className="bg-[#1a2744] hover:bg-[#243260] text-white rounded-xl h-12 px-8 font-bold text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Start a New Company Log
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Company Selected */
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-gray-700">{selectedCompany}</span>
                <span className="ml-2 text-xs text-gray-400">{companyRecords.length} emission records</span>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/CompanyDashboard?company=${encodeURIComponent(selectedCompany)}`}>
                  <Button variant="outline" size="sm" className="rounded-lg border-gray-200 text-gray-700 font-semibold text-xs h-9">
                    <BarChart2 className="w-3.5 h-3.5 mr-1.5" />Go to Emissions
                  </Button>
                </Link>
                <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} size="sm" className="rounded-lg bg-[#1a2744] hover:bg-[#243260] text-white font-semibold text-xs h-9">
                  {saved ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />Saved!</> : <><Save className="w-3.5 h-3.5 mr-1.5" />{saveMutation.isPending ? "Saving…" : "Save"}</>}
                </Button>
                <Button onClick={() => exportToExcel(form, companyRecords)} size="sm" className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs h-9">
                  <Download className="w-3.5 h-3.5 mr-1.5" />Export Report
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="rounded-lg font-semibold text-xs h-9">
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{selectedCompany}"?</AlertDialogTitle>
                      <AlertDialogDescription>This will permanently delete the organization info and all {companyRecords.length} emission record(s). This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {deleteMutation.isPending ? "Deleting…" : "Delete Everything"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Overview / form */}
              <div className="space-y-5">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <SectionHeader title="Current Organization Setup" />
                  <div className="divide-y divide-gray-100">
                    <FieldRow label="Entity Name" value={form.company_name} />
                    <FieldRow label="EIN" value={form.ein} />
                    <FieldRow label="NAICS Code" value={form.naics_code} />
                    <FieldRow label="Website" value={form.website} />
                    <FieldRow label="Address" value={[form.street_address, form.city, form.state, form.country, form.postal_code].filter(Boolean).join(", ")} />
                    <FieldRow label="Contact" value={form.contact_name ? `${form.contact_name}${form.contact_title ? ` · ${form.contact_title}` : ""}` : ""} />
                    <FieldRow label="Contact Email" value={form.contact_email} />
                    <FieldRow label="Contact Phone" value={form.contact_phone} />
                    <FieldRow label="Verification Date" value={form.verification_date} />
                  </div>
                </div>
              </div>

              {/* Right: Edit Form */}
              <div className="space-y-5">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <SectionHeader title="Edit Organization Info" />
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Entity Name *", key: "company_name" },
                      { label: "EIN", key: "ein" },
                      { label: "Website", key: "website" },
                      { label: "Street Address", key: "street_address", full: true },
                      { label: "City", key: "city" },
                      { label: "State / Province", key: "state" },
                      { label: "Country", key: "country" },
                      { label: "Postal Code", key: "postal_code" },
                      { label: "Contact Name", key: "contact_name" },
                      { label: "Contact Title", key: "contact_title" },
                      { label: "Contact Phone", key: "contact_phone" },
                      { label: "Contact Email", key: "contact_email" },
                      { label: "Verification Date (yyyy-mm-dd)", key: "verification_date", placeholder: "yyyy-mm-dd" },
                    ].map(f => (
                      <div key={f.key} className={`space-y-1 ${f.full ? "col-span-2" : ""}`}>
                        <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{f.label}</Label>
                        <Input value={form[f.key] || ""} onChange={setInput(f.key)} placeholder={f.placeholder || ""} className={inputCls} />
                      </div>
                    ))}
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">NAICS Code</Label>
                      <Select value={form.naics_code} onValueChange={set("naics_code")}>
                        <SelectTrigger className={inputCls}><SelectValue placeholder="Select NAICS code" /></SelectTrigger>
                        <SelectContent>{NAICS_CODES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="bg-[#1a2744] hover:bg-[#243260] text-white rounded-lg h-10 px-6 font-bold text-sm">
                      <Save className="w-4 h-4 mr-2" />{saved ? "Saved!" : "Save Organization Info"}
                    </Button>
                    <Button onClick={() => exportToExcel(form, companyRecords)} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg h-10 px-5 font-bold text-sm">
                      <Download className="w-4 h-4 mr-2" />Export (.csv)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}