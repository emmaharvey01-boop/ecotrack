import { createContext, useContext, useState } from "react";

const LearningModeContext = createContext();

export function LearningModeProvider({ children }) {
  const [learningMode, setLearningMode] = useState(false);
  return (
    <LearningModeContext.Provider value={{ learningMode, setLearningMode }}>
      {children}
    </LearningModeContext.Provider>
  );
}

export function useLearningMode() {
  return useContext(LearningModeContext);
}