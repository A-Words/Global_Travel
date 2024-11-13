import React, {createContext, useContext, useState} from 'react';

interface AnimationContextType {
    animationSource: { x: number; y: number } | null;
    setAnimationSource: (source: { x: number; y: number } | null) => void;
}

const AnimationContext = createContext<AnimationContextType>({
    animationSource: null,
    setAnimationSource: () => {
    },
});

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [animationSource, setAnimationSource] = useState<{ x: number; y: number } | null>(null);

    return (
        <AnimationContext.Provider value={{animationSource, setAnimationSource}}>
            {children}
        </AnimationContext.Provider>
    );
};

export const useAnimation = () => useContext(AnimationContext); 