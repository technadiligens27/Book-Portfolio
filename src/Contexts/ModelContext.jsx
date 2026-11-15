
import { createContext, useContext, useRef } from "react";

// ==========================================
// CREATE CONTEXT
// ==========================================

const ModelContext = createContext(null);

// ==========================================
// MODEL PROVIDER
// ==========================================

export const ModelProvider = ({ children }) => {

    // ==========================================
    // MODEL REF
    // ==========================================

    const modelRef = useRef(null);

    return (
        <ModelContext.Provider
            value={{
                modelRef
            }}
        >
            {children}
        </ModelContext.Provider>
    );
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useModelContext = () => {
    const context = useContext(ModelContext);

    if (!context) {
        throw new Error(
            "useModelContext must be used inside ModelProvider"
        );
    }

    return context;
};
