import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, GraduationCap, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const SCOPES = [
  {
    id: "scope1",
    label: "Scope 1 — Direct Emissions",
    color: "bg-emerald-900 border-emerald-600",
    badge: "bg-emerald-500",
    description:
      "Scope 1 covers direct GHG emissions from sources owned or controlled by the reporting company. These are emissions you produce yourself.",
    examples: [
      "Natural gas burned in on-site boilers or furnaces",
      "Diesel or petrol used by company-owned vehicles",
      "Refrigerant leaks from air conditioning systems",
      "Propane used in forklifts or generators",
    ],
    detail:
      "These emissions are measured using fuel consumption data (e.g., cubic feet of gas, gallons of diesel) multiplied by EPA emission factors. Scope 1 is typically the most straightforward to measure because you have direct control over the sources.",
  },
  {
    id: "scope2",
    label: "Scope 2 — Indirect Energy Emissions",
    color: "bg-blue-900 border-blue-600",
    badge: "bg-blue-500",
    description:
      "Scope 2 covers indirect emissions from the generation of purchased electricity, steam, heating, or cooling consumed by the company.",
    examples: [
      "Electricity purchased from the grid to power offices or factories",
      "Steam purchased from a district energy supplier",
      "Chilled water purchased for building cooling",
      "Heat purchased from a municipal district heating system",
    ],
    detail:
      "Scope 2 is reported using two methods: Location-based (uses the average grid emission factor for your region — eGRID subregion) and Market-based (uses the emission factor from your specific electricity supplier or renewable energy certificates). Both must be reported.",
  },
  {
    id: "scope3",
    label: "Scope 3 — Value Chain Emissions",
    color: "bg-purple-900 border-purple-600",
    badge: "bg-purple-500",
    description:
      "Scope 3 covers all other indirect emissions in a company's value chain — both upstream (suppliers) and downstream (customers). These are often the largest share of a company's footprint.",
    examples: [
      "Employee business travel (flights, rental cars)",
      "Employee commuting to and from work",
      "Freight transport of goods you purchase",
      "Waste sent to landfill from your operations",
    ],
    detail:
      "Scope 3 is voluntary in many frameworks but increasingly required. It is the hardest to measure because it relies on data from suppliers, employees, and logistics partners. Categories include 15 upstream and downstream types defined by the GHG Protocol.",
  },
];

// Case study with known correct answers
const CASE_STUDY = {
  company: "GreenBuild Manufacturing Co.",
  description:
    "GreenBuild is a mid-sized building materials manufacturer based in California. They operate two factories, own a fleet of delivery trucks, purchase electricity from PG&E, fly their sales team for client visits, and send waste to a local landfill.",
  scenarios: [
    {
      id: "q1",
      text: "GreenBuild burns 50,000 therms of natural gas in their factory furnaces each year. Which scope is this?",
      answer: "1",
      hint: "The company owns and operates the furnaces directly.",
      explanation: "Scope 1 — direct combustion of natural gas in company-owned equipment.",
    },
    {
      id: "q2",
      text: "GreenBuild purchases 1,200,000 kWh of electricity annually from PG&E to power their factories. Which scope is this?",
      answer: "2",
      hint: "The electricity is generated elsewhere and purchased.",
      explanation: "Scope 2 — purchased electricity is an indirect emission from an external power source.",
    },
    {
      id: "q3",
      text: "GreenBuild's sales team flies 400,000 miles per year for client meetings. Which scope is this?",
      answer: "3",
      hint: "These flights are in aircraft GreenBuild doesn't own.",
      explanation: "Scope 3 — business travel in third-party vehicles is a value chain (upstream) emission.",
    },
    {
      id: "q4",
      text: "GreenBuild's 20 delivery trucks run on diesel. Which scope are those truck emissions?",
      answer: "1",
      hint: "GreenBuild owns and operates the trucks.",
      explanation: "Scope 1 — mobile combustion in company-owned vehicles is a direct emission.",
    },
    {
      id: "q5",
      text: "GreenBuild sends 200 short tons of manufacturing waste to landfill each year. Which scope is this?",
      answer: "3",
      hint: "Waste disposal happens at a facility GreenBuild doesn't own.",
      explanation: "Scope 3 — waste generated in operations and disposed of off-site is a Category 5 Scope 3 emission.",
    },
    {
      id: "q6",
      text: "GreenBuild purchases chilled water from a district cooling provider for their office HVAC. Which scope?",
      answer: "2",
      hint: "They purchase this energy rather than generate it.",
      explanation: "Scope 2 — purchased cooling is an indirect energy emission, alongside electricity and steam.",
    },
  ],
};

function ScopeCard({ scope }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border p-6 ${scope.color}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={`${scope.badge} text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider`}>
            {scope.id.replace("scope", "Scope ")}
          </span>
          <h3 className="text-white font-bold text-base">{scope.label.split("—")[1].trim()}</h3>
        </div>
        <button onClick={() => setOpen(!open)} className="text-white/60 hover:text-white transition-colors">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
      <p className="text-white/80 text-sm leading-relaxed mb-4">{scope.description}</p>
      <div>
        <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Examples</p>
        <ul className="space-y-1">
          {scope.examples.map((ex, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/70">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
              {ex}
            </li>
          ))}
        </ul>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-white/70 text-sm leading-relaxed">{scope.detail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LearningMode() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleSubmit = () => {
    let correct = 0;
    CASE_STUDY.scenarios.forEach((q) => {
      if ((answers[q.id] || "").trim() === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  const totalQ = CASE_STUDY.scenarios.length;
  const pct = score !== null ? Math.round((score / totalQ) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0f172a] font-['Inter',system-ui,sans-serif]">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/GetStarted">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white rounded-lg px-2">
              <ArrowLeft className="w-4 h-4 mr-1" />Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <h1 className="text-white font-semibold text-lg">Learning Hub</h1>
          </div>
          <span className="ml-2 bg-amber-400 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full">LEARNING MODE</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* Scope Explanations */}
        <section>
          <h2 className="text-white text-2xl font-bold mb-2">Understanding GHG Emission Scopes</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            The GHG Protocol divides emissions into three "scopes" based on their source and where in a company's operations they occur.
            Click any card to expand a deeper explanation.
          </p>
          <div className="space-y-4">
            {SCOPES.map((s) => <ScopeCard key={s.id} scope={s} />)}
          </div>
        </section>

        {/* Case Study Quiz */}
        <section>
          <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-8">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-6 h-6 text-amber-400" />
              <h2 className="text-white text-xl font-bold">Case Study Quiz</h2>
            </div>
            <p className="text-slate-400 text-sm mb-1 font-semibold">{CASE_STUDY.company}</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">{CASE_STUDY.description}</p>

            <p className="text-slate-300 text-sm mb-6 italic">
              For each scenario below, enter <strong className="text-white">1</strong>, <strong className="text-white">2</strong>, or <strong className="text-white">3</strong> to classify the emission scope.
            </p>

            <div className="space-y-6">
              {CASE_STUDY.scenarios.map((q, i) => {
                const isCorrect = submitted && (answers[q.id] || "").trim() === q.answer;
                const isWrong = submitted && (answers[q.id] || "").trim() !== q.answer;
                return (
                  <div key={q.id} className={`rounded-xl p-5 border transition-all ${
                    submitted
                      ? isCorrect ? "border-emerald-600 bg-emerald-900/30" : "border-red-600 bg-red-900/20"
                      : "border-slate-600 bg-slate-800/50"
                  }`}>
                    <div className="flex items-start gap-4">
                      <span className="text-slate-500 text-sm font-bold mt-0.5 flex-shrink-0">Q{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-white text-sm leading-relaxed mb-3">{q.text}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-xs">Scope:</span>
                          <Input
                            value={answers[q.id] || ""}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            disabled={submitted}
                            placeholder="1 / 2 / 3"
                            maxLength={1}
                            className="w-20 h-8 text-center rounded-lg border-slate-600 bg-slate-700 text-white text-sm"
                          />
                          {submitted && (
                            isCorrect
                              ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              : <XCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <AnimatePresence>
                          {submitted && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden mt-3">
                              {isWrong && (
                                <p className="text-red-300 text-xs mb-1">
                                  Your answer: <strong>{answers[q.id] || "blank"}</strong> — Correct: <strong>Scope {q.answer}</strong>
                                </p>
                              )}
                              <p className="text-slate-400 text-xs leading-relaxed">💡 {q.explanation}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              {!submitted ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold rounded-xl h-11 px-8"
                  disabled={Object.keys(answers).length < totalQ}
                >
                  Submit Answers
                </Button>
              ) : (
                <div className="flex items-center gap-6">
                  <div className={`text-center px-8 py-4 rounded-2xl border ${pct === 100 ? "bg-emerald-900/40 border-emerald-600" : pct >= 60 ? "bg-amber-900/40 border-amber-600" : "bg-red-900/40 border-red-600"}`}>
                    <p className="text-4xl font-black text-white">{score}/{totalQ}</p>
                    <p className="text-sm text-slate-300 mt-1">{pct}% — {pct === 100 ? "Perfect! 🎉" : pct >= 60 ? "Good effort!" : "Keep studying!"}</p>
                  </div>
                  <Button onClick={handleReset} variant="outline" className="rounded-xl h-11 px-6 border-slate-600 text-slate-300 hover:text-white">
                    Try Again
                  </Button>
                </div>
              )}
              {!submitted && Object.keys(answers).length < totalQ && (
                <p className="text-slate-500 text-xs mt-2">Answer all {totalQ} questions to submit.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}