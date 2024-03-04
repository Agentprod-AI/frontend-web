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
  user: DummyUser,
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
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const contextValue = React.useMemo(
    () => ({ ...state, updateState }),
    [state],
  );

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  );
};
