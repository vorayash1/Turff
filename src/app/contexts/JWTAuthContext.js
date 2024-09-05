import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
// CUSTOM COMPONENT
import { MatxLoading } from "app/components";

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

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (user_mail, user_password) => {
    try {
      const response = await axios.post("https://myallapps.tech:3024/api/admin/auth/login", { email, password });
      const user = response.data;
      if (user.status === "success") {
        localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
        dispatch({ type: "LOGIN", payload: { user: user } }); // Dispatch action to update user state
        return user; // Return response data if login is successful
      } else {
        throw new Error(user.message); // Throw an error if login fails
      }
    } catch (error) {
      console.error("Login failed:", error); // Log error to console
      throw error; // Re-throw the error to be handled in the component
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
    (async () => {
      try {
        const { data } = await axios.get("/api/auth/profile");
        dispatch({ type: "INIT", payload: { isAuthenticated: true, user: data.user } });
      } catch (err) {
        console.error(err);
        dispatch({ type: "INIT", payload: { isAuthenticated: false, user: null } });
      }
    })();
  }, []);

  // SHOW LOADER
  if (!state.isInitialized) return <MatxLoading />;

  return (
    <AuthContext.Provider value={{ ...state, method: "JWT", login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;




//-----------------------------------------------------------------------------------------------------
// after login token
/*
import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode"; // Import JWT decoding library
import { MatxLoading } from "app/components";

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
      const { token } = action.payload;
      // Decode JWT token to extract user information
      const user = jwt_decode(token);
      localStorage.setItem("token", token); // Store token in local storage
      return { ...state, isAuthenticated: true, user };
    }

    case "LOGOUT": {
      localStorage.removeItem("token"); // Remove token from local storage on logout
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
  login: () => {},
  logout: () => {},
  register: () => {}
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (user_mail, user_password) => {
    try {
      const response = await axios.post("https://54ab838584.nxcli.io/auction_portal/user_login.php", { user_mail, user_password });
      const { token } = response.data; // Extract JWT token from response
      dispatch({ type: "LOGIN", payload: { token } });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Modify Axios instance to include JWT token in Authorization header
  axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  const register = async (user_mail, user_name, user_password) => {
    const response = await axios.post("https://54ab838584.nxcli.io/auction_portal/user_registation.php", { user_mail, user_name, user_password });
    const { user } = response.data;
    dispatch({ type: "REGISTER", payload: { user } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    // Check if a token exists in local storage
    const token = localStorage.getItem("token");
    if (token) {
      // Decode JWT token to extract user information
      const user = jwt_decode(token);
      dispatch({ type: "INIT", payload: { isAuthenticated: true, user } });
    } else {
      // If no token exists, set isAuthenticated to false
      dispatch({ type: "INIT", payload: { isAuthenticated: false, user: null } });
    }
  }, []);

  if (!state.isInitialized) return <MatxLoading />;

  return (
    <AuthContext.Provider value={{ ...state, method: "JWT", login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
*/