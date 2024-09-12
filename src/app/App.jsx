import React from "react";
import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import { MatxTheme } from "./components";
// ALL CONTEXTS
import { AuthProvider } from "./contexts/JWTAuthContext";
import SettingsProvider from "./contexts/SettingsContext";
// import JwtLogin from "./auction/signIn";
// ROUTES
import routes from "./routes";
import adminRoutes from "../routes_for_admin.js";
import stuffRoutes from "../routes_for_stuff";
import { useEffect } from "react";

export default function App() {
  const content = useRoutes(routes);
  const adminContent = useRoutes(adminRoutes);
  const stuffContent = useRoutes(stuffRoutes);



  const [role, setRole] = React.useState("");
  useEffect(() => {
    const user = localStorage.getItem('user');
    setRole(user.type);
  }, []);
  console.log(role)
  // can be admin, stuff, ...
  //how to set role now?
  // you havee to set Role according to condition.

  return (

    <SettingsProvider>
      <AuthProvider>
        <MatxTheme>
          <CssBaseline />
          {/* {content} */}
          {role === "admin" ? adminContent : role === "stuff" ? stuffContent : content}
        </MatxTheme>
      </AuthProvider>
    </SettingsProvider>
  );
}
