import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, BarChart2, FileDown, ArrowRight } from "lucide-react";
import { createPageUrl } from "@/utils";

const FEATURES = [
  { icon: Building2, title: "Organization Setup", desc: "Enter entity details, contacts, and reporting boundaries." },
  { icon: BarChart2, title: "Emissions Inventory", desc: "Log Scope 1, 2, and 3 emissions with guided data entry." },
  { icon: FileDown, title: "Export Reports", desc: "Download a complete GHG report in CSV format." },
];

export default function GetStarted() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navy Header */}
      <header className="bg-[#1a2744] text-white">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center gap-3">
          <Building2 className="w-7 h-7 opacity-90" />
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-tight">GHG Inventory Platform</h1>
            <p className="text-blue-200 text-sm">Greenhouse Gas Emissions Reporting Tool</p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <div className="inline-block bg-[#1a2744] text-blue-200 text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full mb-5">
              GHG Reporting
            </div>
            <h2 className="text-4xl font-black text-gray-900 leading-tight mb-4">
              Track & Report<br />Your Carbon Emissions
            </h2>
            <p className="text-gray-500 text-base mb-8 leading-relaxed">
              A comprehensive platform for managing your greenhouse gas inventory across Scope 1, 2, and 3 emissions — built for accuracy and compliance.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to={createPageUrl("CompanySurvey")}>
                <Button className="bg-[#1a2744] hover:bg-[#243260] text-white rounded-xl h-12 px-7 font-bold text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Start a New Company Log
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to={createPageUrl("OrganizationInfo")}>
                <Button variant="outline" className="rounded-xl h-12 px-7 font-bold text-sm border-gray-300 text-gray-700 hover:border-[#1a2744] hover:text-[#1a2744]">
                  View Organizations
                </Button>
              </Link>
            </div>
          </div>

          {/* Status card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-[#1a2744] rounded-full" />
              <h3 className="text-sm font-black tracking-widest text-gray-800 uppercase">Get Started</h3>
            </div>
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm mb-5 max-w-xs">
                Start a new company log to fill in organization information and begin tracking emissions.
              </p>
              <div className="bg-gray-50 rounded-xl border border-gray-200 px-8 py-3 mb-5 w-full">
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Status</p>
                <span className="inline-block bg-orange-500 text-white text-xs font-black tracking-widest px-4 py-1.5 rounded-full uppercase">Not Started</span>
              </div>
              <Link to={createPageUrl("CompanySurvey")} className="w-full">
                <Button className="w-full bg-[#1a2744] hover:bg-[#243260] text-white rounded-xl h-11 font-bold text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Start a New Company Log
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="w-10 h-10 rounded-lg bg-[#1a2744]/10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-[#1a2744]" />
              </div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">{title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}