import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export type AgeRange = "under_12" | "12_14" | "15_17" | "18_24" | "over_24";
export type CycleLength = "less_than_21" | "21_25" | "26_30" | "31_35" | "more_than_35" | "irregular";
export type PeriodDuration = "1_3" | "4_5" | "6_7" | "more_than_7";
export type FlowHeaviness = "light" | "moderate" | "heavy" | "very_heavy";
export type PainLevel = "none" | "mild" | "moderate" | "severe" | "debilitating";

export type MenstrualPattern = 
  | "regular" 
  | "irregular" 
  | "heavy" 
  | "pain" 
  | "developing";

export interface Recommendation {
  title: string;
  description: string;
}

export interface Symptoms {
  physical: string[];
  emotional: string[];
}

export interface AssessmentResult {
  age: AgeRange;
  cycleLength: CycleLength;
  periodDuration: PeriodDuration;
  flowHeaviness: FlowHeaviness;
  painLevel: PainLevel;
  symptoms: Symptoms;
  pattern?: MenstrualPattern;
  recommendations?: Recommendation[];
}

interface AssessmentResultState {
  result: AssessmentResult | null;
  isComplete: boolean;
}

type AssessmentResultAction =
  | { type: 'SET_RESULT'; payload: AssessmentResult }
  | { type: 'UPDATE_RESULT'; payload: Partial<AssessmentResult> }
  | { type: 'RESET_RESULT' }
  | { type: 'SET_PATTERN'; payload: MenstrualPattern }
  | { type: 'SET_RECOMMENDATIONS'; payload: Recommendation[] };

interface AssessmentResultContextType {
  state: AssessmentResultState;
  setResult: (result: AssessmentResult) => void;
  updateResult: (updates: Partial<AssessmentResult>) => void;
  resetResult: () => void;
  setPattern: (pattern: MenstrualPattern) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
}

// Initial state
const initialState: AssessmentResultState = {
  result: null,
  isComplete: false,
};

// Context
const AssessmentResultContext = createContext<AssessmentResultContextType | undefined>(undefined);

// Reducer
function assessmentResultReducer(
  state: AssessmentResultState,
  action: AssessmentResultAction
): AssessmentResultState {
  switch (action.type) {
    case 'SET_RESULT':
      return {
        ...state,
        result: action.payload,
        isComplete: true,
      };
    case 'UPDATE_RESULT':
      return {
        ...state,
        result: state.result ? { ...state.result, ...action.payload } : null,
      };
    case 'RESET_RESULT':
      return initialState;
    case 'SET_PATTERN':
      return {
        ...state,
        result: state.result ? { ...state.result, pattern: action.payload } : null,
      };
    case 'SET_RECOMMENDATIONS':
      return {
        ...state,
        result: state.result ? { ...state.result, recommendations: action.payload } : null,
      };
    default:
      return state;
  }
}

// Provider component
export function AssessmentResultProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(assessmentResultReducer, initialState);

  const setResult = (result: AssessmentResult) => {
    dispatch({ type: 'SET_RESULT', payload: result });
  };

  const updateResult = (updates: Partial<AssessmentResult>) => {
    dispatch({ type: 'UPDATE_RESULT', payload: updates });
  };

  const resetResult = () => {
    dispatch({ type: 'RESET_RESULT' });
  };

  const setPattern = (pattern: MenstrualPattern) => {
    dispatch({ type: 'SET_PATTERN', payload: pattern });
  };

  const setRecommendations = (recommendations: Recommendation[]) => {
    dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations });
  };

  return (
    <AssessmentResultContext.Provider
      value={{
        state,
        setResult,
        updateResult,
        resetResult,
        setPattern,
        setRecommendations,
      }}
    >
      {children}
    </AssessmentResultContext.Provider>
  );
}

// Custom hook
export function useAssessmentResult() {
  const context = useContext(AssessmentResultContext);
  if (context === undefined) {
    throw new Error('useAssessmentResult must be used within an AssessmentResultProvider');
  }
  return context;
} 