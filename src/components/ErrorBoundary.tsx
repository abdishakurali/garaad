"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Waxaa dhacay qalad aan la filayn:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-2xl shadow-xl">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Waxbaa qaldamay
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Waxaan ka xunnahay dhibkaan. Fadlan isku day inaad bogga dib u
                  cusbooneysiiso.
                </p>
                <button
                  onClick={this.handleReload}
                  className="mt-4 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Dib u cusbooneysii bogga
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
