"use client";

import React, {
  useMemo,
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
interface AppContextType {
  loading?: any;
  setLoading?: any;
  status?: string;
  setStatus?: any;
}
const AppContext = createContext<AppContextType>({});

export const useAppContext = () => {
  return useContext(AppContext);
};

// Define the props for the UserInfoProvider

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Loading...");
  return (
    <AppContext.Provider value={{ loading, setLoading, status, setStatus }}>
      {children}
    </AppContext.Provider>
  );
}
