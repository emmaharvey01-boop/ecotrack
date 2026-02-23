export default function SurveyProgress({ sections, currentSection }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {sections.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`flex flex-col items-center flex-1 ${i < sections.length - 1 ? "relative" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                i < currentSection
                  ? "bg-[#1B4332] border-[#1B4332] text-white"
                  : i === currentSection
                  ? "bg-white border-[#1B4332] text-[#1B4332]"
                  : "bg-white border-gray-300 text-gray-400"
              }`}>
                {i < currentSection ? "✓" : i + 1}
              </div>
              <span className={`text-xs mt-1 text-center hidden sm:block ${i === currentSection ? "text-[#1B4332] font-medium" : "text-gray-400"}`}>
                {s.title}
              </span>
            </div>
            {i < sections.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 mb-5 ${i < currentSection ? "bg-[#1B4332]" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center mt-1">
        Section {currentSection + 1} of {sections.length}
      </p>
    </div>
  );
}