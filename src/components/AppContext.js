import { createContext, useReducer, useContext } from "react";

export const AppContext = createContext();

const initialState = {
  teams: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TEAMS":
      return { ...state, teams: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
