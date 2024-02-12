import React, { useState } from "react";

export interface UserInterface {
  id?: number;
  username?: string;
  firstName?: string;
  email?: string;
}

export const DummyUser: UserInterface = {
  id: 1,
  username: "Agentprod",
  firstName: "Agent",
  email: "agentprod@agentprod.com",
};

export interface AppState {
  user?: UserInterface;
  updateState: (newState: Partial<AppState>) => void;
}

const defaultState: AppState = {
  user: {},
  updateState: (newState?: Partial<AppState>) => {},
};

const UserContext = React.createContext<AppState>(defaultState);
export const useUserContext = () => React.useContext(UserContext);

interface Props {
  children: React.ReactNode;
}

export const UserContextProvider: React.FunctionComponent<Props> = (
  props: Props,
): JSX.Element => {
  const [state, setState] = useState<AppState>({
    user: DummyUser,
    updateState: () => {},
  });

  const updateState = (newState: Partial<AppState>) => {
    setState({ ...state, ...newState });
  };

  return (
    <UserContext.Provider value={{ ...state, updateState }}>
      {props.children}
    </UserContext.Provider>
  );
};
