import React, { createContext, useState } from 'react';

export const MainContext = createContext(null);

export const MainProvider = ({ children }) => {
    const [homeReload, setHomeReload] = useState(false);

    return (
        <MainContext.Provider value={{ homeReload, setHomeReload }}>
            {children}
        </MainContext.Provider>
    );
};
