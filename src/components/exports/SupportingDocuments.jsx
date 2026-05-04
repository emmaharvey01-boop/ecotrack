import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupportingDocuments({ billRecords }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">Supporting Documents</h3>
          <p className="text-slate-400 text-sm mt-0.5">
            {billRecords.length} uploaded bill{billRecords.length !== 1 ? "s" : ""} available as proof of emissions for regulators.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setExpanded(v => !v)}
          className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white rounded-xl"
        >
          {expanded ? (
            <><ChevronUp className="w-4 h-4 mr-2" />Hide</>
          ) : (
            <><ChevronDown className="w-4 h-4 mr-2" />View & Download</>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 mt-4">
              {billRecords.map((r) => (
                <a
                  key={r.id}
                  href={r.bill_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-900/60 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{r.category} — {r.source}</p>
                      <p className="text-slate-400 text-xs">{r.reporting_period}{r.scope_2_method ? ` · ${r.scope_2_method.replace("_", "-")}` : ""}</p>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-xs font-medium flex-shrink-0 group-hover:underline flex items-center gap-1">
                    <Download className="w-3 h-3" />Open PDF
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}