import React, { createContext, useReducer, useContext } from 'react';
import { reducer, initialState } from './reducer'

export const MavenStateContext = createContext({});

export const ContextProvider = ({ children }) => (
    <MavenStateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </MavenStateContext.Provider>
)
export const useContextState = () => useContext(MavenStateContext);