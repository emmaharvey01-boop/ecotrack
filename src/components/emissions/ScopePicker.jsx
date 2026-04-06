import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap, Globe, ChevronDown, ArrowDown } from "lucide-react";

const SCOPES = [
  {
    id: "scope_1",
    label: "Scope 1",
    subtitle: "Direct Emissions",
    description: "Emissions from sources owned or controlled by your organization: stationary combustion, mobile sources, fugitive emissions, and process emissions.",
    icon: Flame,
    color: "from-emerald-900 to-emerald-800",
    border: "border-emerald-700",
    iconColor: "text-emerald-400",
    arrowColor: "text-emerald-300",
    categoryColor: "text-emerald-200",
    examples: ["Natural gas boilers", "Company vehicles", "Refrigerants"],
    categories: ["Stationary Combustion", "Mobile Sources", "Fugitive Emissions"],
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
    arrowColor: "text-blue-300",
    categoryColor: "text-blue-200",
    examples: ["Purchased electricity", "District steam", "Purchased heating/cooling"],
    categories: ["Purchased Electricity", "Purchased Steam", "Purchased Heating", "Purchased Cooling"],
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
    arrowColor: "text-violet-300",
    categoryColor: "text-violet-200",
    examples: ["Business travel", "Employee commuting", "Waste & transportation"],
    categories: ["Business Travel", "Employee Commuting", "Upstream Transport", "Waste"],
  },
];

export default function ScopePicker({ onSelectScope }) {
  const [hoveredScope, setHoveredScope] = useState(null);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-white font-semibold text-xl mb-1">Add Your First Emission Record</h2>
        <p className="text-slate-400 text-sm">Select an emission scope to get started.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {SCOPES.map((scope, i) => {
          const Icon = scope.icon;
          const isHovered = hoveredScope === scope.id;
          const isOther = hoveredScope && hoveredScope !== scope.id;

          return (
            <motion.div
              key={scope.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isOther ? 0 : 1,
                y: 0,
                scale: isOther ? 0.97 : 1,
              }}
              transition={{ delay: hoveredScope ? 0 : i * 0.1, duration: 0.2 }}
              onMouseEnter={() => setHoveredScope(scope.id)}
              onMouseLeave={() => setHoveredScope(null)}
              className="flex flex-col"
            >
              {/* Main card */}
              <button
                onClick={() => onSelectScope(scope.id)}
                className={`text-left p-6 rounded-2xl bg-gradient-to-br ${scope.color} border ${scope.border} hover:scale-[1.02] transition-transform w-full`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
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

                {/* See more arrow */}
                <div className={`flex justify-center mt-4 ${scope.arrowColor}`}>
                  <ChevronDown className="w-5 h-5 animate-bounce" />
                </div>
              </button>

              {/* Expanded categories */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col items-center pt-1">
                      {scope.categories.map((cat, ci) => (
                        <motion.div
                          key={cat}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: ci * 0.06 }}
                          className="flex flex-col items-center w-full"
                        >
                          <ArrowDown className={`w-4 h-4 ${scope.arrowColor} my-1`} />
                          <button
                            onClick={() => onSelectScope(scope.id)}
                            className={`w-full text-center text-xs font-medium px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors ${scope.categoryColor}`}
                          >
                            {cat}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}