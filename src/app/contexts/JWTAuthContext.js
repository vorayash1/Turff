import { createContext, useEffect, useReducer, useContext } from "react";
import axios from "axios";
// CUSTOM COMPONENT
import { MatxLoading } from "app/components";
import { useNavigate } from "react-router-dom";

const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialized: true, user };
    }

    case "LOGIN": {
      return { ...state, isAuthenticated: true, user: action.payload.user };
    }

    case "LOGOUT": {
      return { ...state, isAuthenticated: false, user: null };
    }

    case "REGISTER": {
      const { user } = action.payload;

      return { ...state, isAuthenticated: true, user };
    }

    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT",
  login: () => { },
  logout: () => { },
  register: () => { }
});
function useGlobalContext() {
  return useContext(AuthContext);
}
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate(); // Initialize navigate for redirection

  const login = async (email, password) => {

    try {
      const response = await axios.post("https://myallapps.tech:3024/api/admin/auth/login", { email, password });
      const user = response.data;
      console.log(user.data.admin, "user--------")

      if (user.data && user.data.admin.status === "active") {
        // Store token and user data in local storage
        localStorage.setItem('token', user.data.admin.token);
        // localStorage.setItem('user', JSON.stringify(user.data.admin));
        localStorage.setItem('user', JSON.stringify(user.data.admin));
        // Store user info after login


        // Dispatch login action
        dispatch({ type: "LOGIN", payload: { user: user.data.admin } });

        // Redirect to dashboard
        // navigate("/dashboard/default");

        return user; // Return response data if login is successful
      } else {
        throw new Error("Login failed: User is not active.");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  const register = async (user_mail, user_name, user_password) => {
    const response = await axios.post("", { user_mail, user_name, user_password });
    const { user } = response.data;

    dispatch({ type: "REGISTER", payload: { user } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      const userData = JSON.parse(userStorage);
      console.log('userData = ', userData);
      dispatch({ type: "LOGIN", payload: { user: userData } });
    }
  }, [])

  useEffect(() => {
    // (async () => {
    // try {
    // const { data } = await axios.get("/api/auth/profile");
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      const userData = JSON.parse(userStorage);
      dispatch({ type: "INIT", payload: { isAuthenticated: true, user: userData } });
    } else {
      dispatch({ type: "INIT", payload: { isAuthenticated: false, user: null } });
    }
    // dispatch({ type: "INIT", payload: { isAuthenticated: true, user: data.user } });
    // } catch (err) {
    // console.error(err);

    // }
    // })();
  }, []);

  // SHOW LOADER
  if (!state.isInitialized) return <MatxLoading />;

  return (
    <AuthContext.Provider value={{ ...state, method: "JWT", login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// export default AuthContext;
export { useGlobalContext, AuthProvider };
