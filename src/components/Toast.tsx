"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle } from "react-icons/fa";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`toast-container ${toast.visible ? "fade-in" : ""}`} role="status" aria-live="polite">
          <FaCheckCircle className="toast-icon" />
          <span>{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
