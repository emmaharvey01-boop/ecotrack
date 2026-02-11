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

export default function ScopeBreakdown({ records, scope }) {
  const scopeRecords = records.filter(r => r.scope === scope);
  
  let categoryTotals;
  let chartData;

  if (scope === "scope_2") {
    // For Scope 2, group by category AND method
    const categoryMethodTotals = scopeRecords.reduce((acc, record) => {
      const key = record.category;
      if (!acc[key]) {
        acc[key] = { market_based: 0, location_based: 0 };
      }
      if (record.scope_2_method === "market_based") {
        acc[key].market_based += (record.co2e_tonnes || 0);
      } else if (record.scope_2_method === "location_based") {
        acc[key].location_based += (record.co2e_tonnes || 0);
      }
      return acc;
    }, {});

    chartData = Object.entries(categoryMethodTotals)
      .map(([category, values]) => ({
        category: category.length > 20 ? category.slice(0, 18) + '...' : category,
        fullCategory: category,
        marketBased: Math.round(values.market_based * 1000) / 1000,
        locationBased: Math.round(values.location_based * 1000) / 1000
      }))
      .sort((a, b) => (b.marketBased + b.locationBased) - (a.marketBased + a.locationBased));
  } else {
    // For Scope 1, group by category only
    categoryTotals = scopeRecords.reduce((acc, record) => {
      acc[record.category] = (acc[record.category] || 0) + (record.co2e_tonnes || 0);
      return acc;
    }, {});

    chartData = Object.entries(categoryTotals)
      .map(([category, value]) => ({
        category: category.length > 20 ? category.slice(0, 18) + '...' : category,
        fullCategory: category,
        value: Math.round(value * 1000) / 1000
      }))
      .sort((a, b) => b.value - a.value);
  }

  const total = scope === "scope_2" 
    ? chartData.reduce((sum, item) => sum + item.marketBased + item.locationBased, 0)
    : chartData.reduce((sum, item) => sum + item.value, 0);
  const scopeLabel = scope === "scope_1" ? "Scope 1" : "Scope 2";
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
              formatter={(value, name) => {
                const label = name === "marketBased" ? "Market-Based" : name === "locationBased" ? "Location-Based" : name;
                return [`${value} tCO₂e`, label];
              }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                padding: '12px 16px'
              }}
            />
            {scope === "scope_2" ? (
              <>
                <Bar dataKey="marketBased" fill="#52796F" radius={[0, 6, 6, 0]} name="Market-Based" />
                <Bar dataKey="locationBased" fill="#74A892" radius={[0, 6, 6, 0]} name="Location-Based" />
              </>
            ) : (
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORY_COLORS[entry.fullCategory] || "#1B4332"} 
                  />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}