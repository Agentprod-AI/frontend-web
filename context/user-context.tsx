// import React, { useState, useMemo } from "react";

// export interface UserInterface {
//   id: string;
//   username?: string;
//   firstName?: string;
//   email?: string;
// }

// export const DummyUser: UserInterface = {
//   id: "9cbe5057-59fe-4e6e-8399-b9cd85cc9c6c",
//   username: "Agentprod",
//   firstName: "Agent",
//   email: "agentprod@agentprod.com",
// };

// export interface AppState {
//   user: UserInterface;
//   setUser: (user: UserInterface) => void;
// }

// const defaultState: AppState = {
//   user: DummyUser,
//   setUser: () => {},
// };

// const UserContext = React.createContext<AppState>(defaultState);
// export const useUserContext = () => React.useContext(UserContext);

// interface Props {
//   children: React.ReactNode;
// }

// export const UserContextProvider: React.FunctionComponent<Props> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<UserInterface>(DummyUser);

//   const contextValue = useMemo(
//     () => ({
//       user,
//       setUser,
//     }),
//     [user]
//   );

//   return (
//     <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
//   );
// };

import React, { useState, useEffect, useMemo } from "react";
import { setCookie, getCookie } from "cookies-next";

export interface UserInterface {
  id: string;
  username?: string;
  firstName?: string;
  email?: string;
}

export const DummyUser: UserInterface = {
  id: "9cbe5057-59fe-4e6e-8399-b9cd85cc9c6c",
  username: "Agentprod",
  firstName: "Agent",
  email: "agentprod@agentprod.com",
};

export interface AppState {
  user: UserInterface;
  setUser: (user: UserInterface) => void;
}

const defaultState: AppState = {
  user: DummyUser,
  setUser: () => {},
};

const UserContext = React.createContext<AppState>(defaultState);
export const useUserContext = () => React.useContext(UserContext);

// Helper functions for local storage management
const userKey = "user";

function getUserFromCookies(): UserInterface {
  const cookie = getCookie(userKey);
  return cookie ? JSON.parse(cookie as string) : null; // dummyuser
}

function setUserInCookies(user: UserInterface) {
  setCookie(userKey, JSON.stringify(user), { maxAge: 3600 * 24 * 7 }); // Expires in one week
}

interface Props {
  children: React.ReactNode;
}

export const UserContextProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInterface>(getUserFromCookies());

  useEffect(() => {
    setUserInCookies(user);
  }, [user]);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// import React, {
//   useState,
//   useEffect,
//   useMemo,
//   createContext,
//   useContext,
// } from "react";
// import { setCookie, getCookie } from "cookies-next";

// export interface UserInterface {
//   id: string;
//   username?: string;
//   firstName?: string;
//   email?: string;
// }

// export const DummyUser: UserInterface = {
//   id: "9cbe5057-59fe-4e6e-8399-b9cd85cc9c6c",
//   username: "Agentprod",
//   firstName: "Agent",
//   email: "agentprod@agentprod.com",
// };

// export interface AppState {
//   user: UserInterface | null;
//   setUser: (user: UserInterface | null) => void;
//   isLoading: boolean;
//   isError: boolean;
// }

// const UserContext = createContext<AppState>({
//   user: null,
//   setUser: () => {},
//   isLoading: true,
//   isError: false,
// });

// export const useUserContext = () => useContext(UserContext);

// const userKey = "user";

// function getUserFromCookies(): UserInterface | null {
//   const cookie = getCookie(userKey);
//   return cookie ? JSON.parse(cookie as string) : null;
// }

// function setUserInCookies(user: UserInterface | null) {
//   if (user) {
//     setCookie(userKey, JSON.stringify(user), { maxAge: 3600 * 24 * 7 }); // Expires in one week
//   }
// }

// export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<UserInterface | null>(getUserFromCookies());
//   const [isLoading, setIsLoading] = useState<boolean>(!user); // Assume loading if no user initially
//   const [isError, setIsError] = useState<boolean>(false);

//   useEffect(() => {
//     if (!user) {
//       setIsLoading(true);
//       // Optionally try fetching user data from an API or re-checking cookies
//       // This example assumes you might have an asynchronous operation here
//     }
//     setUserInCookies(user);
//     setIsLoading(false);
//   }, [user]);

//   const contextValue = useMemo(
//     () => ({
//       user,
//       setUser,
//       isLoading,
//       isError,
//     }),
//     [user, isLoading, isError]
//   );

//   return (
//     <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
//   );
// };
