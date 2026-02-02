import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = {
  scope_1: "#1B4332",
  scope_2: "#52796F"
};

const SCOPE_LABELS = {
  scope_1: "Scope 1 (Direct)",
  scope_2: "Scope 2 (Indirect)"
};

export default function EmissionChart({ records }) {
  const scopeTotals = records.reduce((acc, record) => {
    acc[record.scope] = (acc[record.scope] || 0) + (record.co2e_tonnes || 0);
    return acc;
  }, {});

  const chartData = Object.entries(scopeTotals).map(([scope, value]) => ({
    name: SCOPE_LABELS[scope],
    value: Math.round(value * 100) / 100,
    scope
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (chartData.length === 0 || total === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm h-[360px] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">No emission data yet</p>
          <p className="text-sm text-slate-400 mt-1">Add your first emission record to see the breakdown</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Emissions by Scope</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={chartData.length === 1 ? 0 : 4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.scope]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} tCO₂e`, '']}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                padding: '12px 16px'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}