import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function StatsCard({ title, value, unit, icon: Icon, trend, trendValue, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900 tracking-tight">{value}</span>
            <span className="text-sm text-slate-400 font-medium">{unit}</span>
          </div>
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              trend === "up" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
            )}>
              <span>{trend === "up" ? "↑" : "↓"}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-slate-50 rounded-xl">
            <Icon className="w-5 h-5 text-slate-600" />
          </div>
        )}
      </div>
    </motion.div>
  );
}