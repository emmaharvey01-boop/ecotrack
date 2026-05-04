import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, Sparkles, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EGRID_SUBREGIONS = [
  "AKGD","AKMS","AZNM","CAMX","ERCT","FRCC","HIMS","HIOA","MROE","MROW",
  "NEWE","NWPP","NYCW","NYLI","NYUP","RFCE","RFCM","RFCW","RMPA","SPNO",
  "SPSO","SRMV","SRMW","SRSO","SRTV","SRVC"
];

// Map bill type → scope/category fields for the emission form
function mapBillToFormFields(data) {
  const period = data.billing_period || "";
  const notes = [data.supplier_name, data.account_number, data.notes].filter(Boolean).join(" | ");

  if (data.bill_type === "electricity") {
    return {
      scope: "scope_2",
      category: "purchased_electricity",
      reporting_period: period,
      electricity_kwh: data.consumption_amount?.toString() || "",
      electricity_unit: normalizeElectricityUnit(data.consumption_unit),
      egrid_subregion: matchEgridSubregion(data.egrid_subregion),
      notes,
    };
  }

  if (data.bill_type === "natural_gas" || data.bill_type === "propane" || data.bill_type === "fuel_oil") {
    const fuelMap = {
      natural_gas: "Natural Gas",
      propane: "Propane Gas",
      fuel_oil: "Fuel Oil No. 2",
    };
    return {
      scope: "scope_1",
      category: "stationary_combustion",
      reporting_period: period,
      fuel_combusted: data.fuel_type || fuelMap[data.bill_type] || "Natural Gas",
      fuel_state: data.bill_type === "natural_gas" || data.bill_type === "propane" ? "gas" : "liquid",
      quantity_combusted: data.consumption_amount?.toString() || "",
      combustion_units: normalizeCombustionUnit(data.consumption_unit),
      notes,
    };
  }

  if (data.bill_type === "steam") {
    return {
      scope: "scope_2",
      category: "purchased_steam",
      reporting_period: period,
      steam_purchased: data.consumption_amount?.toString() || "",
      steam_energy_unit: normalizeSteamUnit(data.consumption_unit),
      notes,
    };
  }

  if (data.bill_type === "heating") {
    return {
      scope: "scope_2",
      category: "purchased_heating",
      reporting_period: period,
      hc_purchased: data.consumption_amount?.toString() || "",
      hc_energy_unit: normalizeSteamUnit(data.consumption_unit),
      notes,
    };
  }

  if (data.bill_type === "cooling") {
    return {
      scope: "scope_2",
      category: "purchased_cooling",
      reporting_period: period,
      hc_purchased: data.consumption_amount?.toString() || "",
      hc_energy_unit: normalizeSteamUnit(data.consumption_unit),
      notes,
    };
  }

  // Fallback — return what we can
  return {
    reporting_period: period,
    notes,
  };
}

function normalizeElectricityUnit(unit = "") {
  const u = unit.toLowerCase();
  if (u.includes("mwh")) return "MWh";
  return "kWh";
}

function normalizeCombustionUnit(unit = "") {
  const u = unit.toLowerCase();
  if (u.includes("therm")) return "therm";
  if (u.includes("mmbtu") || u.includes("mmBtu")) return "mmBtu";
  if (u.includes("ccf") || u.includes("scf")) return "SCF";
  if (u.includes("gallon")) return "gallon";
  if (u.includes("liter")) return "liter";
  if (u.includes("gj")) return "GJ";
  return "SCF";
}

function normalizeSteamUnit(unit = "") {
  const u = unit.toLowerCase();
  if (u.includes("gj")) return "GJ";
  if (u.includes("mj")) return "MJ";
  return "mmBtu";
}

function matchEgridSubregion(suggestion = "") {
  if (!suggestion) return "";
  const upper = suggestion.toUpperCase();
  return EGRID_SUBREGIONS.find(r => upper.includes(r)) || "";
}

export default function BillUploader({ onExtracted }) {
  const [status, setStatus] = useState("idle"); // idle | uploading | extracting | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [extractedSummary, setExtractedSummary] = useState(null);
  const fileInputRef = useRef();

  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setErrorMsg("Please upload a PDF file.");
      setStatus("error");
      return;
    }

    setStatus("uploading");
    setErrorMsg("");
    setExtractedSummary(null);

    // Upload the file
    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    setStatus("extracting");

    // Call backend to extract data
    const response = await base44.functions.invoke("extractBillEmissions", { file_url });
    const { data } = response.data;

    if (!data) {
      setErrorMsg("Could not extract data from this bill. Please check the file and try again.");
      setStatus("error");
      return;
    }

    setExtractedSummary(data);
    const formFields = mapBillToFormFields(data);
    onExtracted(formFields);
    setStatus("done");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setStatus("idle");
    setErrorMsg("");
    setExtractedSummary(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mb-2">
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 cursor-pointer transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700">Auto-fill from utility bill</p>
              <p className="text-xs text-slate-400">Upload a PDF bill to extract data automatically</p>
            </div>
            <Upload className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 flex-shrink-0" />
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </motion.div>
        )}

        {(status === "uploading" || status === "extracting") && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200"
          >
            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin flex-shrink-0" />
            <p className="text-sm text-emerald-700 font-medium">
              {status === "uploading" ? "Uploading bill…" : "Reading bill with AI…"}
            </p>
          </motion.div>
        )}

        {status === "done" && extractedSummary && (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-xl bg-emerald-50 border border-emerald-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-emerald-800">Bill extracted successfully</p>
                  <p className="text-xs text-emerald-600 truncate">
                    {[extractedSummary.supplier_name, extractedSummary.billing_period, extractedSummary.consumption_amount && `${extractedSummary.consumption_amount} ${extractedSummary.consumption_unit}`].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
              <button onClick={reset} className="text-emerald-500 hover:text-emerald-700 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200"
          >
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 flex-1">{errorMsg}</p>
            <button onClick={reset} className="text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}