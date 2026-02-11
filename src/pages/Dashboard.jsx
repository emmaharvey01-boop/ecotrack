import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Leaf, Zap, Activity, TrendingDown, Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import StatsCard from "@/components/emissions/StatsCard";
import EmissionChart from "@/components/emissions/EmissionChart";
import EmissionForm from "@/components/emissions/EmissionForm";
import EmissionTable from "@/components/emissions/EmissionTable";
import ScopeBreakdown from "@/components/emissions/ScopeBreakdown";

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const queryClient = useQueryClient();

  const { data: allRecords = [], isLoading } = useQuery({
    queryKey: ["emissions"],
    queryFn: () => base44.entities.EmissionRecord.list("-created_date"),
  });

  // Get unique company names
  const companies = useMemo(() => {
    const uniqueCompanies = [...new Set(allRecords.map(r => r.company_name).filter(Boolean))];
    return uniqueCompanies.sort();
  }, [allRecords]);

  // Filter records by selected company
  const records = useMemo(() => {
    if (selectedCompany === "all") return allRecords;
    return allRecords.filter(r => r.company_name === selectedCompany);
  }, [allRecords, selectedCompany]);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Handle array of records (for electricity with both methods)
      if (Array.isArray(data)) {
        return Promise.all(data.map(record => base44.entities.EmissionRecord.create(record)));
      }
      return base44.entities.EmissionRecord.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emissions"] });
      setShowForm(false);
      setEditingRecord(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EmissionRecord.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emissions"] });
      setShowForm(false);
      setEditingRecord(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.EmissionRecord.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emissions"] });
    },
  });

  // Calculate totals
  const totalEmissions = records.reduce((sum, r) => sum + (r.co2e_tonnes || 0), 0);
  const scope1Total = records.filter(r => r.scope === "scope_1").reduce((sum, r) => sum + (r.co2e_tonnes || 0), 0);
  const scope2Total = records.filter(r => r.scope === "scope_2").reduce((sum, r) => sum + (r.co2e_tonnes || 0), 0);
  const scope2MarketBased = records.filter(r => r.scope === "scope_2" && r.scope_2_method === "market_based").reduce((sum, r) => sum + (r.co2e_tonnes || 0), 0);
  const scope2LocationBased = records.filter(r => r.scope === "scope_2" && r.scope_2_method === "location_based").reduce((sum, r) => sum + (r.co2e_tonnes || 0), 0);

  return (
    <div className="min-h-screen bg-[#0f172a] font-['Inter',system-ui,sans-serif]">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
              >
                Climate Disclosures
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400 mt-1"
              >
                Track and report your greenhouse gas emissions
              </motion.p>
            </div>
            
            {companies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="w-[200px] h-11 rounded-xl border-slate-600 bg-[#334155] text-white">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map(company => (
                      <SelectItem key={company} value={company}>{company}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                onClick={() => {
                  setEditingRecord(null);
                  setShowForm(true);
                }}
                className="bg-[#1B4332] hover:bg-[#143728] text-white rounded-xl h-11 px-5 shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Emission
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">Total Emissions</h3>
              <Activity className="w-5 h-5 text-slate-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Market-Based</div>
                <div className="text-2xl font-bold text-slate-900">{(scope1Total + scope2MarketBased).toFixed(2)}</div>
                <div className="text-xs text-slate-500 mt-1">tCO₂e</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Location-Based</div>
                <div className="text-2xl font-bold text-slate-900">{(scope1Total + scope2LocationBased).toFixed(2)}</div>
                <div className="text-xs text-slate-500 mt-1">tCO₂e</div>
              </div>
            </div>
          </motion.div>
          <StatsCard
            title="Scope 1"
            value={scope1Total.toFixed(2)}
            unit="tCO₂e"
            icon={Leaf}
            delay={0.1}
            className="border-l-4 border-l-[#1B4332]"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-l-4 border-l-[#52796F]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">Scope 2</h3>
              <Zap className="w-5 h-5 text-slate-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Market-Based</div>
                <div className="text-2xl font-bold text-slate-900">{scope2MarketBased.toFixed(2)}</div>
                <div className="text-xs text-slate-500 mt-1">tCO₂e</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Location-Based</div>
                <div className="text-2xl font-bold text-slate-900">{scope2LocationBased.toFixed(2)}</div>
                <div className="text-xs text-slate-500 mt-1">tCO₂e</div>
              </div>
            </div>
          </motion.div>
          <StatsCard
            title="Records"
            value={records.length}
            unit="entries"
            icon={TrendingDown}
            delay={0.3}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <EmissionChart records={records} />
          <ScopeBreakdown records={records} scope="scope_1" />
          <ScopeBreakdown records={records} scope="scope_2" />
        </div>

        {/* Table Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Emission Records</h2>
          </div>
          <EmissionTable 
            records={records} 
            onDelete={deleteMutation.mutate}
            onEdit={(record) => {
              setEditingRecord(record);
              setShowForm(true);
            }}
            isDeleting={deleteMutation.isPending}
          />
        </div>
      </main>

      {/* Form Modal */}
      <EmissionForm
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingRecord(null);
        }}
        onSubmit={(data) => {
          if (editingRecord) {
            updateMutation.mutate({ id: editingRecord.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        editingRecord={editingRecord}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}