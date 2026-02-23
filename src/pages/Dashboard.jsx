import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Building2, ChevronRight, FileSpreadsheet, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import NewCompanyDialog from "@/components/company/NewCompanyDialog";

export default function Dashboard() {
  const [showNew, setShowNew] = useState(false);
  const queryClient = useQueryClient();

  const { data: allRecords = [] } = useQuery({
    queryKey: ["emissions"],
    queryFn: () => base44.entities.EmissionRecord.list("-created_date"),
  });

  const { data: orgInfoList = [] } = useQuery({
    queryKey: ["orgInfo"],
    queryFn: () => base44.entities.OrganizationInfo.list(),
  });

  // Build company list from both sources
  const companiesFromRecords = [...new Set(allRecords.map(r => r.company_name).filter(Boolean))];
  const companiesFromOrg = orgInfoList.map(o => o.company_name).filter(Boolean);
  const allCompanies = [...new Set([...companiesFromOrg, ...companiesFromRecords])].sort();

  const createOrgMutation = useMutation({
    mutationFn: (name) => base44.entities.OrganizationInfo.create({ company_name: name }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["orgInfo"] }); setShowNew(false); },
  });

  return (
    <div className="min-h-screen bg-[#0f172a] font-['Inter',system-ui,sans-serif]">
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Climate Disclosures</h1>
            <p className="text-slate-400 mt-1 text-sm">Select a company to manage its GHG inventory</p>
          </div>
          <Button onClick={() => setShowNew(true)} className="bg-[#1B4332] hover:bg-[#143728] text-white rounded-xl h-11 px-5">
            <Plus className="w-4 h-4 mr-2" />New Company
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {allCompanies.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <Building2 className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No companies yet</h2>
            <p className="text-slate-400 mb-6">Start by creating a new company log</p>
            <Button onClick={() => setShowNew(true)} className="bg-[#1B4332] hover:bg-[#143728] text-white rounded-xl h-11 px-6">
              <Plus className="w-4 h-4 mr-2" />Start New Company Log
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {allCompanies.map((company, i) => {
              const recordCount = allRecords.filter(r => r.company_name === company).length;
              const orgInfo = orgInfoList.find(o => o.company_name === company);
              const hasOrgInfo = !!orgInfo;
              return (
                <motion.div key={company} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={createPageUrl(`CompanyDashboard?company=${encodeURIComponent(company)}`)}>
                    <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-5 flex items-center justify-between hover:border-slate-500 hover:bg-[#263548] transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#1B4332] flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{company}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${hasOrgInfo ? "bg-emerald-900/50 text-emerald-400" : "bg-slate-700 text-slate-400"}`}>
                              {hasOrgInfo ? "Org info complete" : "Org info pending"}
                            </span>
                            <span className="text-xs text-slate-400">{recordCount} emission record{recordCount !== 1 ? "s" : ""}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <NewCompanyDialog open={showNew} onClose={() => setShowNew(false)} onCreate={(name) => createOrgMutation.mutate(name)} isCreating={createOrgMutation.isPending} />
    </div>
  );
}