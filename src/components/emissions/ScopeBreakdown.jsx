import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CATEGORY_COLORS = {
  "Stationary Combustion": "#1B4332",
  "Mobile Combustion": "#2D6A4F",
  "Fugitive Emissions": "#40916C",
  "Process Emissions": "#52B788",
  "Purchased Electricity": "#52796F",
  "Purchased Heating": "#74A892",
  "Purchased Cooling": "#95C4B1"
};

export default function ScopeBreakdown({ records, scope, method, title }) {
  const scopeRecords = records.filter(r => {
    if (scope === "scope_2" && method) {
      return r.scope === scope && r.scope_2_method === method;
    }
    return r.scope === scope;
  });
  
  const categoryTotals = scopeRecords.reduce((acc, record) => {
    acc[record.category] = (acc[record.category] || 0) + (record.co2e_tonnes || 0);
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals)
    .map(([category, value]) => ({
      category: category.length > 20 ? category.slice(0, 18) + '...' : category,
      fullCategory: category,
      value: Math.round(value * 1000) / 1000
    }))
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const scopeLabel = title || (scope === "scope_1" ? "Scope 1" : "Scope 2");
  const scopeDescription = scope === "scope_1" 
    ? "Direct emissions from owned or controlled sources" 
    : "Indirect emissions from purchased energy";

  if (chartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-900">{scopeLabel} Breakdown</h3>
        </div>
        <p className="text-sm text-slate-500 mb-6">{scopeDescription}</p>
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-slate-400">No {scopeLabel.toLowerCase()} emissions recorded yet</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-900">{scopeLabel} Breakdown</h3>
        <span className="text-2xl font-bold text-slate-900">{total.toFixed(2)} <span className="text-sm font-normal text-slate-500">tCO₂e</span></span>
      </div>
      <p className="text-sm text-slate-500 mb-6">{scopeDescription}</p>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
            <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}`} />
            <YAxis 
              type="category" 
              dataKey="category" 
              width={120} 
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value, name, props) => [`${value} tCO₂e`, props.payload.fullCategory]}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                padding: '12px 16px'
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CATEGORY_COLORS[entry.fullCategory] || (scope === "scope_1" ? "#1B4332" : "#52796F")} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}