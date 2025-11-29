import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export function useAlert() {
    return useContext(AlertContext);
}

export function AlertProvider({ children }) {
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type = 'info', onConfirm = null) => {
        setAlert({ message, type, onConfirm });
    };

    const closeAlert = () => {
        setAlert(null);
    };

    return (
        <AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
            {children}
        </AlertContext.Provider>
    );
}
