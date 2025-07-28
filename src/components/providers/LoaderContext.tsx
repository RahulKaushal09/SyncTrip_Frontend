"use client"; // If using Next.js App Router

import React, { createContext, useContext, useState, ReactNode } from "react";
import FullScreenLoader from "../Loader/FullScreenLoader";

interface LoaderContextType {
    showLoader: () => void;
    hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return (
        <LoaderContext.Provider value={{ showLoader, hideLoader }}>
            {children}
            <FullScreenLoader isVisible={isLoading} />
        </LoaderContext.Provider>
    );
};

export const showLoader = () => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error("showLoader must be used within LoaderProvider");
    }
    const { showLoader } = context;
    showLoader();
}
export const hideLoader = () => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error("hideLoader must be used within LoaderProvider");
    }
    const { hideLoader } = context;
    hideLoader();
}
export const useLoader = (): LoaderContextType => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error("useLoader must be used within LoaderProvider");
    }
    return context;
};
