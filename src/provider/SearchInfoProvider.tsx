"use client";

import React, { useState, createContext, useContext, ReactNode } from "react";
interface SearchInfoContextType {
  searchInfo?: any;
  setSearchInfo?: any;
}
const SearchInfoContext = createContext<SearchInfoContextType>({});

export const useSearchInfo = () => {
  return useContext(SearchInfoContext);
};

// Define the props for the UserInfoProvider
interface SearchInfoProps {
  children: ReactNode;
}

export default function SearchInfoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchInfo, setSearchInfo] = useState();
  return (
    <SearchInfoContext.Provider value={{ searchInfo, setSearchInfo }}>
      {children}
    </SearchInfoContext.Provider>
  );
}
