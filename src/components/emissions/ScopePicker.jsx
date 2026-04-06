import { motion } from "framer-motion";
import { Flame, Zap, Globe } from "lucide-react";

const SCOPES = [
  {
    id: "scope_1",
    label: "Scope 1",
    subtitle: "Direct Emissions",
    description: "Emissions from sources owned or controlled by your organization — stationary combustion, mobile sources, fugitive emissions, and process emissions.",
    icon: Flame,
    color: "from-emerald-900 to-emerald-800",
    border: "border-emerald-700",
    iconColor: "text-emerald-400",
    examples: ["Natural gas boilers", "Company vehicles", "Refrigerants"],
  },
  {
    id: "scope_2",
    label: "Scope 2",
    subtitle: "Indirect Energy Emissions",
    description: "Emissions from the generation of purchased electricity, steam, heating, or cooling consumed by your organization.",
    icon: Zap,
    color: "from-blue-900 to-blue-800",
    border: "border-blue-700",
    iconColor: "text-blue-400",
    examples: ["Purchased electricity", "District steam", "Purchased heating/cooling"],
  },
  {
    id: "scope_3",
    label: "Scope 3",
    subtitle: "Value Chain Emissions",
    description: "All other indirect emissions that occur in your organization's upstream and downstream value chain.",
    icon: Globe,
    color: "from-violet-900 to-violet-800",
    border: "border-violet-700",
    iconColor: "text-violet-400",
    examples: ["Business travel", "Employee commuting", "Waste & transportation"],
  },
];

export default function ScopePicker({ onSelectScope }) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-white font-semibold text-xl mb-1">Add Your First Emission Record</h2>
        <p className="text-slate-400 text-sm">Select an emission scope to get started.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SCOPES.map((scope, i) => {
          const Icon = scope.icon;
          return (
            <motion.button
              key={scope.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelectScope(scope.id)}
              className={`text-left p-6 rounded-2xl bg-gradient-to-br ${scope.color} border ${scope.border} hover:scale-[1.02] transition-transform`}
            >
              <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${scope.iconColor}`} />
              </div>
              <div className="text-white font-bold text-lg mb-0.5">{scope.label}</div>
              <div className={`text-sm font-medium mb-3 ${scope.iconColor}`}>{scope.subtitle}</div>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">{scope.description}</p>
              <ul className="space-y-1">
                {scope.examples.map(ex => (
                  <li key={ex} className="text-slate-400 text-xs flex items-center gap-1.5">
                    <span className={`w-1 h-1 rounded-full ${scope.iconColor} bg-current`} />
                    {ex}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}