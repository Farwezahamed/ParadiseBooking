import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  user: null,
  loading: false,
  error: null,
};

try {
  const storedUser = localStorage.getItem("user");
  INITIAL_STATE.user = storedUser ? JSON.parse(storedUser) : null;
} catch (e) {
  console.error("Error parsing stored user data:", e);
  localStorage.removeItem("user"); // Optionally clear invalid data
}

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.user) {
      try {
        localStorage.setItem("user", JSON.stringify(state.user));
      } catch (e) {
        console.error("Error saving user data:", e);
      }
    } else {
      localStorage.removeItem("user"); // Clean up if user is null
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
