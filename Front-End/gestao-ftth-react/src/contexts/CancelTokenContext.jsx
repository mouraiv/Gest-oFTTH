import React, { createContext, useContext, useRef } from 'react';

const CancelTokenContext = createContext();

export const CancelTokenProvider = ({ children }) => {
  const cancelToken = useRef();

  return (
    <CancelTokenContext.Provider value={cancelToken}>
      {children}
    </CancelTokenContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCancelToken = () => useContext(CancelTokenContext);
