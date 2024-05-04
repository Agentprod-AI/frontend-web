import React, { useState } from "react";

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
  setUser: (newState: UserInterface) => void;
  // updateState: (newState: UserInterface) => void;
}

const defaultState: AppState = {
  user: DummyUser,
  // updateState: () => {},
  setUser: () => {},
};

const UserContext = React.createContext<AppState>(defaultState);
export const useUserContext = () => React.useContext(UserContext);

interface Props {
  children: React.ReactNode;
}

export const UserContextProvider: React.FunctionComponent<Props> = (
  props: Props
): JSX.Element => {
  // const [state, setState] = useState<AppState>({
  //   user: DummyUser,
  //   updateState: () => {},
  // });

  // const updateState = (newState: any) => {
  //   // setState((prevState) => ({ ...prevState, ...newState }));
  //   setState(newState);
  // };

  // const contextValue = React.useMemo(
  //   () => ({ ...state, updateState }),
  //   [state]
  // );
  const [user, setUser] = useState<UserInterface>(defaultState.user);

  const contextValue = React.useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  );

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  );
};
