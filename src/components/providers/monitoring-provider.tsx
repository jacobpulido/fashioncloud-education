"use client";

import { useEffect } from "react";

/**
 * MonitoringProvider — captura errores JS no manejados
 */
export function MonitoringProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      try {
        const body = JSON.stringify({
          project: "education",
          type: "window_error",
          message: event.message,
          file: event.filename?.slice(0, 200),
          line: event.lineno,
        });
        navigator.sendBeacon?.("/api/log-error", body);
      } catch {}
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      try {
        const body = JSON.stringify({
          project: "education",
          type: "unhandled_rejection",
          reason: event.reason?.message || String(event.reason),
        });
        navigator.sendBeacon?.("/api/log-error", body);
      } catch {}
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return <>{children}</>;
}
