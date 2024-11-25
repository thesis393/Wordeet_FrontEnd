"use client";

import React, {
  useMemo,
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
interface UserInfoContextType {
  userInfo?: any;
  setUserInfo?: any;
}
const UserInfoContext = createContext<UserInfoContextType>({});

export const useUserInfo = () => {
  return useContext(UserInfoContext);
};

// Define the props for the UserInfoProvider
interface UserInfoProps {
  children: ReactNode;
}

export default function UserInfoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userInfo, setUserInfo] = useState();
  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
}
