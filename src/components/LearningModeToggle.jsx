import { Link } from "react-router-dom";
import { useLearningMode } from "@/lib/LearningModeContext";
import { GraduationCap } from "lucide-react";

export default function LearningModeToggle() {
  const { learningMode, setLearningMode } = useLearningMode();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLearningMode(!learningMode)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
          learningMode
            ? "bg-amber-400 text-amber-900 border-amber-500 shadow-md"
            : "bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600"
        }`}
      >
        <GraduationCap className="w-3.5 h-3.5" />
        {learningMode ? "Learning Mode ON" : "Learning Mode"}
      </button>
      {learningMode && (
        <Link
          to="/LearningMode"
          className="text-xs text-amber-300 underline hover:text-amber-200 font-medium"
        >
          Open Learning Hub →
        </Link>
      )}
    </div>
  );
}