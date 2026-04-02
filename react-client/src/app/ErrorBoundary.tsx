import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center gap-4 mt-20">
          <h1 className="text-4xl font-bold text-red-500">Something went wrong</h1>
          <p className="text-gray-600">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer">
            Go home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}