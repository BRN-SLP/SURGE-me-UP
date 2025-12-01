import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="glass-panel p-8 rounded-3xl border border-red-500/20 max-w-md text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Что-то пошло не так
                        </h2>
                        <p className="text-white/70 mb-6">
                            Не волнуйтесь, ваши данные сохранены. Попробуйте обновить страницу.
                        </p>
                        <Button
                            onClick={this.handleReset}
                            className="gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Попробовать снова
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
