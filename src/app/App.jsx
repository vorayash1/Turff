import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import { MatxTheme } from "./components";
// ALL CONTEXTS
import { AuthProvider } from "app/contexts/JWTAuthContext";

import SettingsProvider from "app/contexts/SettingsContext";
// import MultiTheme from "./contexts/"
// import JwtLogin from "./auction/signIn";
// ROUTES
// import routes from "./routes";
// import adminRoutes from "../routes_for_admin";
// import stuffRoutes from "../routes_for_stuff";
import MainPage from "routes_for_mainPage";
import Footer from "../app/components/Footer";

export default function App() {
  // const content = useRoutes(routes);
  // const adminContent = useRoutes(adminRoutes);
  // const stuffContent = useRoutes(stuffRoutes);



  // can be admin, stuff, ...
  //how to set role now?
  // you havee to set Role according to condition.

  return (

    <SettingsProvider>
      <AuthProvider>
        <MatxTheme>

          <MainPage />
          {/* <Footer /> */}
          {/* {content} */}
        </MatxTheme>

      </AuthProvider>
    </SettingsProvider>
  );
}
