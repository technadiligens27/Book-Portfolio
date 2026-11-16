import { createContext, useContext, useRef } from "react";

// ==========================================
// CREATE CONTEXT
// Creates a shared context for accessing
// the 3D book model reference.
// ==========================================

const ModelContext = createContext(null);

// ==========================================
// MODEL PROVIDER
// Wrap your app with this provider so every
// component can access the same modelRef.
// ==========================================

export const ModelProvider = ({ children }) => {

    // ==========================================
    // MODEL REF
    // Stores the Three.js group containing
    // the main book model.
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
// Use this hook inside components that need
// to read or animate the 3D book model.
// ==========================================

export const useModelContext = () => {
    const context = useContext(ModelContext);

    // Makes sure the hook is used within
    // the ModelProvider component.
    if (!context) {
        throw new Error(
            "useModelContext must be used inside ModelProvider"
        );
    }

    return context;
};