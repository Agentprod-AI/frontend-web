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

function getUserFromLocalStorage(): UserInterface {
  const storedUser = localStorage.getItem(userKey);
  return storedUser ? JSON.parse(storedUser) : DummyUser;
}

function setUserInLocalStorage(user: UserInterface) {
  localStorage.setItem(userKey, JSON.stringify(user));
}

interface Props {
  children: React.ReactNode;
}

export const UserContextProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInterface>(getUserFromLocalStorage());

  useEffect(() => {
    // Update local storage when user changes
    setUserInLocalStorage(user);
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
