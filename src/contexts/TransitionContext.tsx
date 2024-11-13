import React, {createContext, useContext, useState} from 'react';

interface TransitionState {
    sourceRect: DOMRect | null;
    setSourceRect: (rect: DOMRect | null) => void;
}

const TransitionContext = createContext<TransitionState>({
    sourceRect: null,
    setSourceRect: () => {
    },
});

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);

    return (
        <TransitionContext.Provider value={{sourceRect, setSourceRect}}>
            {children}
        </TransitionContext.Provider>
    );
};

export const useTransition = () => useContext(TransitionContext); 