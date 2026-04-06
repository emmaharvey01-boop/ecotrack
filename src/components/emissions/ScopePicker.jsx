import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap, Globe, ChevronDown } from "lucide-react";

const SCOPES = [
  {
    id: "scope_1",
    label: "Scope 1",
    subtitle: "Direct Emissions",
    description: "Emissions from sources owned or controlled by your organization.",
    icon: Flame,
    color: "from-emerald-900 to-emerald-800",
    border: "border-emerald-700",
    iconColor: "text-emerald-400",
    tagBg: "bg-emerald-900/60 border-emerald-600 text-emerald-200 hover:bg-emerald-800/80",
    dotColor: "bg-emerald-400",
    examples: ["Natural gas boilers", "Company vehicles", "Refrigerants"],
    categories: ["Stationary Combustion", "Mobile Sources", "Fugitive Emissions"],
    side: "right",
  },
  {
    id: "scope_2",
    label: "Scope 2",
    subtitle: "Indirect Energy Emissions",
    description: "Emissions from purchased electricity, steam, heating, or cooling.",
    icon: Zap,
    color: "from-blue-900 to-blue-800",
    border: "border-blue-700",
    iconColor: "text-blue-400",
    tagBg: "bg-blue-900/60 border-blue-600 text-blue-200 hover:bg-blue-800/80",
    dotColor: "bg-blue-400",
    examples: ["Purchased electricity", "District steam", "Heating & cooling"],
    categories: ["Purchased Electricity", "Purchased Steam", "Purchased Heating", "Purchased Cooling"],
    side: "right",
  },
  {
    id: "scope_3",
    label: "Scope 3",
    subtitle: "Value Chain Emissions",
    description: "Indirect emissions in your upstream and downstream value chain.",
    icon: Globe,
    color: "from-violet-900 to-violet-800",
    border: "border-violet-700",
    iconColor: "text-violet-400",
    tagBg: "bg-violet-900/60 border-violet-600 text-violet-200 hover:bg-violet-800/80",
    dotColor: "bg-violet-400",
    examples: ["Business travel", "Employee commuting", "Waste & logistics"],
    categories: ["Business Travel", "Employee Commuting", "Upstream Transport", "Waste"],
    side: "left",
  },
];

function CategoriesPanel({ scope, isHovered }) {
  const isLeft = scope.side === "left";
  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden flex-shrink-0"
        >
          <div className={`${isLeft ? "pr-3" : "pl-3"} flex flex-col gap-2`}>
            {scope.categories.map((cat, ci) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, x: isLeft ? 12 : -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ci * 0.07 }}
                className="flex items-center gap-2"
              >
                {isLeft ? (
                  <>
                    <button className={`text-xs font-medium px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${scope.tagBg}`}>{cat}</button>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-px bg-white/20" />
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${scope.dotColor}`} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${scope.dotColor}`} />
                      <div className="w-4 h-px bg-white/20" />
                    </div>
                    <button className={`text-xs font-medium px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${scope.tagBg}`}>{cat}</button>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ScopeCard({ scope, isHovered, isOther, onHover, onLeave, onSelectScope }) {
  const Icon = scope.icon;
  const isLeft = scope.side === "left";

  return (
    <motion.div
      className="flex items-center"
      animate={{ opacity: isOther ? 0 : 1, scale: isOther ? 0.97 : 1 }}
      transition={{ duration: 0.18 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Categories on left side (Scope 3) */}
      {isLeft && <CategoriesPanel scope={scope} isHovered={isHovered} />}

      <button
        onClick={() => onSelectScope(scope.id)}
        className={`text-left p-6 rounded-2xl bg-gradient-to-br ${scope.color} border ${scope.border} hover:scale-[1.02] transition-transform w-full flex-shrink-0`}
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
        <div className={`flex justify-center mt-4 ${scope.iconColor}`}>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </button>

      {/* Categories on right side (Scope 1 & 2) */}
      {!isLeft && <CategoriesPanel scope={scope} isHovered={isHovered} />}
    </motion.div>
  );
}

export default function ScopePicker({ onSelectScope }) {
  const [hoveredScope, setHoveredScope] = useState(null);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-white font-semibold text-xl mb-1">Add Your First Emission Record</h2>
        <p className="text-slate-400 text-sm">Select an emission scope to get started.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {SCOPES.map((scope) => (
          <ScopeCard
            key={scope.id}
            scope={scope}
            isHovered={hoveredScope === scope.id}
            isOther={hoveredScope !== null && hoveredScope !== scope.id}
            onHover={() => setHoveredScope(scope.id)}
            onLeave={() => setHoveredScope(null)}
            onSelectScope={onSelectScope}
          />
        ))}
      </div>
    </div>
  );
}