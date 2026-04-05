import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Building2, ClipboardList, BarChart2, Download, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import EmissionForm from "@/components/emissions/EmissionForm";
import EmissionTable from "@/components/emissions/EmissionTable";
import EmissionChart from "@/components/emissions/EmissionChart";
import ScopeBreakdown from "@/components/emissions/ScopeBreakdown";
import StatsCard from "@/components/emissions/StatsCard";
import { Leaf, Zap, Activity, TrendingDown } from "lucide-react";
import OrgInfoForm from "@/components/company/OrgInfoForm";
import AdditionalInfoForm from "@/components/company/AdditionalInfoForm";
import { exportToExcel } from "@/components/exports/ExcelExport";

const STEPS = [
  { id: "org", label: "Organization Info", icon: ClipboardList },
  { id: "emissions", label: "Emissions Data", icon: BarChart2 },
  { id: "additional", label: "Additional Information", icon: ClipboardList },
  { id: "export", label: "Export", icon: Download },
];

export default function CompanyDashboard() {
  const urlParams = new URLSearchParams(window.location.search);
  const company = urlParams.get("company") || "";
  const [activeStep, setActiveStep] = useState("emissions");
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const queryClient = useQueryClient();

  const { data: allRecords = [] } = useQuery({
    queryKey: ["emissions"],
    queryFn: () => base44.entities.EmissionRecord.list("-created_date"),
  });

  const { data: orgInfoList = [] } = useQuery({
    queryKey: ["orgInfo"],
    queryFn: () => base44.entities.OrganizationInfo.list(),
  });

  const records = useMemo(() => allRecords.filter(r => r.company_name === company), [allRecords, company]);
  const orgInfo = orgInfoList.find(o => o.company_name === company);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      if (data.isDraft) {
        return base44.entities.DraftEmissionRecord.create({
          company_name: company,
          scope: data.formData.scope,
          scope_2_method: data.formData.scope_2_method,
          category: data.formData.category,
          draft_data: data.formData,
          notes: data.formData.notes
        });
      }
      if (Array.isArray(data)) return Promise.all(data.map(r => base44.entities.EmissionRecord.create(r)));
      return base44.entities.EmissionRecord.create(data);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["emissions"] }); queryClient.invalidateQueries({ queryKey: ["drafts"] }); setShowForm(false); setEditingRecord(null); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, records: allRecs }) => {
      if (Array.isArray(data)) {
        // Find the companion record (same category/period, other scope_2_method)
        const primary = data.find(r => r.scope_2_method === editingRecord?.scope_2_method) || data[0];
        const secondary = data.find(r => r !== primary);
        await base44.entities.EmissionRecord.update(id, primary);
        if (secondary) {
          const companion = (allRecs || []).find(r =>
            r.id !== id &&
            r.company_name === primary.company_name &&
            r.category === primary.category &&
            r.reporting_period === primary.reporting_period &&
            r.scope_2_method === secondary.scope_2_method
          );
          if (companion) await base44.entities.EmissionRecord.update(companion.id, secondary);
          else await base44.entities.EmissionRecord.create(secondary);
        }
      } else {
        await base44.entities.EmissionRecord.update(id, data);
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["emissions"] }); setShowForm(false); setEditingRecord(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.EmissionRecord.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["emissions"] }),
  });

  const totals = useMemo(() => records.reduce((acc, r) => {
    const val = r.co2e_tonnes || 0;
    if (r.scope === "scope_1") acc.scope1 += val;
    else if (r.scope === "scope_2") {
      if (r.scope_2_method === "market_based") acc.scope2Market += val;
      else if (r.scope_2_method === "location_based") acc.scope2Location += val;
    } else if (r.scope === "scope_3") acc.scope3 += val;
    return acc;
  }, { scope1: 0, scope2Market: 0, scope2Location: 0, scope3: 0 }), [records]);

  const { scope1: scope1Total, scope2Market: scope2MarketBased, scope2Location: scope2LocationBased, scope3: scope3Total } = totals;

  const hasOrgInfo = !!orgInfo;
  const hasEmissions = records.length > 0;

  return (
    <div className="min-h-screen bg-[#0f172a] font-['Inter',system-ui,sans-serif]">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white rounded-lg px-2">
                <ArrowLeft className="w-4 h-4 mr-1" />Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <h1 className="text-white font-semibold text-lg">{company}</h1>
            </div>
          </div>

          {/* Step tabs */}
          <div className="flex gap-1">
            {STEPS.map((step, i) => {
              const isComplete = (step.id === "org" && hasOrgInfo) || (step.id === "emissions" && hasEmissions);
              const isActive = activeStep === step.id;
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-all ${
                    isActive ? "bg-[#0f172a] text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {isComplete && !isActive ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Step content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeStep === "org" && (
          <OrgInfoForm
            company={company}
            orgInfo={orgInfo}
            onSaved={() => { queryClient.invalidateQueries({ queryKey: ["orgInfo"] }); }}
            onNext={() => setActiveStep("emissions")}
          />
        )}

        {activeStep === "emissions" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg">Emission Records</h2>
              <Button onClick={() => { setEditingRecord(null); setShowForm(true); }} className="bg-[#1B4332] hover:bg-[#143728] text-white rounded-xl h-10 px-4">
                <Plus className="w-4 h-4 mr-2" />Add Emission
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-600">Total</h3>
                  <Activity className="w-4 h-4 text-slate-400" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><div className="text-xs text-slate-500">Market</div><div className="text-xl font-bold text-slate-900">{(scope1Total + scope2MarketBased).toFixed(2)}</div></div>
                  <div><div className="text-xs text-slate-500">Location</div><div className="text-xl font-bold text-slate-900">{(scope1Total + scope2LocationBased).toFixed(2)}</div></div>
                </div>
                <div className="text-xs text-slate-500 mt-1">tCO₂e</div>
              </motion.div>
              <StatsCard title="Scope 1" value={scope1Total.toFixed(2)} unit="tCO₂e" icon={Leaf} delay={0.1} className="border-l-4 border-l-[#1B4332]" />
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 border-l-4 border-l-[#52796F]">
                <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-medium text-slate-600">Scope 2</h3><Zap className="w-4 h-4 text-slate-400" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><div className="text-xs text-slate-500">Market</div><div className="text-xl font-bold text-slate-900">{scope2MarketBased.toFixed(2)}</div></div>
                  <div><div className="text-xs text-slate-500">Location</div><div className="text-xl font-bold text-slate-900">{scope2LocationBased.toFixed(2)}</div></div>
                </div>
                <div className="text-xs text-slate-500 mt-1">tCO₂e</div>
              </motion.div>
              <StatsCard title="Scope 3" value={scope3Total.toFixed(2)} unit="tCO₂e" icon={TrendingDown} delay={0.3} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <EmissionChart records={records} />
              <ScopeBreakdown records={records} scope="scope_1" />
              <ScopeBreakdown records={records} scope="scope_2" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <ScopeBreakdown records={records} scope="scope_3" />
              <ScopeBreakdown records={records} scope="offsets" />
            </div>

            <EmissionTable records={records} onDelete={deleteMutation.mutate} onEdit={(r) => { setEditingRecord(r); setShowForm(true); }} isDeleting={deleteMutation.isPending} />

            <div className="flex justify-end mt-6">
              <Button onClick={() => setActiveStep("additional")} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl h-11 px-6">
                Continue to Additional Information
              </Button>
            </div>
          </div>
        )}

        {activeStep === "additional" && (
          <div>
            <div className="mb-6">
              <h2 className="text-white font-semibold text-lg">Additional Information</h2>
              <p className="text-slate-400 text-sm mt-1">3rd party verification, inventory boundary, and disclosure details.</p>
            </div>
            <AdditionalInfoForm
              company={company}
              orgInfo={orgInfo}
              records={records}
              onSaved={() => queryClient.invalidateQueries({ queryKey: ["orgInfo"] })}
            />
            <div className="flex justify-end mt-2 pb-8">
              <Button onClick={() => setActiveStep("export")} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl h-11 px-6">
                <Download className="w-4 h-4 mr-2" />Continue to Export
              </Button>
            </div>
          </div>
        )}

        {activeStep === "export" && (
          <div className="max-w-xl mx-auto text-center py-12">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1e293b] rounded-2xl border border-slate-700 p-10">
              <Download className="w-14 h-14 mx-auto text-emerald-400 mb-4" />
              <h2 className="text-white text-2xl font-bold mb-2">Export GHG Report</h2>
              <p className="text-slate-400 mb-2">
                Your report for <span className="text-white font-medium">{company}</span> will include:
              </p>
              <ul className="text-slate-400 text-sm space-y-1 mb-8 text-left inline-block">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Organization information</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Inventory boundary disclosures</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Scope 1, 2, 3 emission totals</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> All emission records ({records.length})</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Methods & verification info</li>
              </ul>
              {!hasOrgInfo && (
                <p className="text-amber-400 text-sm mb-4">⚠️ Organization info is incomplete. Consider filling it in for a full report.</p>
              )}
              <Button onClick={() => exportToExcel(orgInfo || { company_name: company }, records)} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl h-12 px-8 text-base w-full">
                <Download className="w-5 h-5 mr-2" />Download Report (.csv)
              </Button>
            </motion.div>
          </div>
        )}
      </main>

      <EmissionForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditingRecord(null); }}
        onSubmit={(data) => {
          const withCompany = Array.isArray(data)
            ? data.map(r => ({ ...r, company_name: company }))
            : { ...data, company_name: company };
          editingRecord
            ? updateMutation.mutate({ id: editingRecord.id, data: withCompany, records: allRecords })
            : createMutation.mutate(withCompany);
        }}
        editingRecord={editingRecord}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}