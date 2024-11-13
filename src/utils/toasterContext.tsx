// utils/toasterContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { useToaster } from "@/hooks/useToaster";
import Toaster from "../components/ui/MuiToaster";

// Create a context for Toaster
interface ToasterContextType {
  showToast: (message: string, severity: "error" | "warning" | "info" | "success") => void;
}

const ToasterContext = createContext<ToasterContextType | null>(null);

// ToasterProvider Component
export const ToasterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toastState, showToast, closeToast } = useToaster();

  return (
    <ToasterContext.Provider value={{ showToast }}>
      {children}
      <Toaster message={toastState.message} severity={toastState.severity} open={toastState.open} onClose={closeToast} />
    </ToasterContext.Provider>
  );
};

// Directly export showToast without needing useToasterContext
let showToastFn: ToasterContextType["showToast"];

export const ToasterConsumer: React.FC = () => {
  const context = useContext(ToasterContext);
  if (context) {
    showToastFn = context.showToast;
  }
  return null; // This component is used to grab the context and set the `showToastFn`.
};

// Export showToast as a function
export const showToast = (message: string, severity: "error" | "warning" | "info" | "success" = "info") => {
  if (showToastFn) {
    showToastFn(message, severity);
  } else {
    console.error("showToast function is not initialized. Ensure ToasterProvider is rendered in the component tree.");
  }
};