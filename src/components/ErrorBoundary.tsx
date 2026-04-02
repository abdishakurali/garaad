"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class RootErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-2xl shadow-xl">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Waxbaa qaldamay
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Waxaan ka xunnahay dhibkaan. Try navigating again.
                </p>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
