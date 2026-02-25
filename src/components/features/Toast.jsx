import { useState, useCallback, useEffect } from 'react';

export default function Toast({ toasts }) {
    return (
        <div className="toast-container" role="status" aria-live="polite" aria-atomic="true">
            {toasts.map(toast => (
                <div key={toast.id} className="toast">
                    {toast.color && (
                        <div
                            className="toast-color"
                            style={{ background: toast.color }}
                            aria-hidden="true"
                        />
                    )}
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}

// Hook for managing toasts
export function useToasts() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, color = null, duration = 2000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev.slice(-2), { id, message, color }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    return { toasts, addToast };
}
