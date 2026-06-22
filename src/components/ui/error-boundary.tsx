"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    try {
      const payload = JSON.stringify({
        project: "education",
        message: error.message,
        stack: error.stack?.slice(0, 1000),
        componentStack: errorInfo.componentStack?.slice(0, 500),
      });
      navigator.sendBeacon?.("/api/log-error", payload);
    } catch {
      // silencio
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[60vh] items-center justify-center p-8">
            <div className="max-w-md text-center">
              <p className="text-4xl">⚠️</p>
              <h2 className="mt-4 text-xl font-semibold text-[#181410]">
                Algo salió mal
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Ocurrió un error inesperado. Recarga la página o intenta de nuevo.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 rounded-md bg-[#6D28FF] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#5c1ee6]"
              >
                Recargar página
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
