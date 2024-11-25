"use client";

import React, {
  useMemo,
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";

interface DraftBlogContextType {
  draftBlogInfo?: any;
  setDraftBlogInfo?: any;
}
const DraftBlogInfoContext = createContext<DraftBlogContextType>({});

export const useDraftBlogInfo = () => {
  return useContext(DraftBlogInfoContext);
};

// Define the props for the UserInfoProvider
interface UserInfoProps {
  children: ReactNode;
}

export default function DraftBlogInfoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [draftBlogInfo, setDraftBlogInfo] = useState();
  return (
    <DraftBlogInfoContext.Provider value={{ draftBlogInfo, setDraftBlogInfo }}>
      {children}
    </DraftBlogInfoContext.Provider>
  );
}
