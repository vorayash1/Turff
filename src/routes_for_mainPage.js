import React from "react";
import { useRoutes } from "react-router-dom";
import { MatxTheme } from "app/components";
import CssBaseline from "@mui/material/CssBaseline";
import { useGlobalContext } from "app/contexts/JWTAuthContext";
import routes from "app/routes";

import adminRoutes from "app/routes_for_admin";
import stuffRoutes from "app/routes_for_stuff";

const Mainpage = () => {
    const state = useGlobalContext();
    console.log(state)
    const role = (state.user == null) ? "" : state.user.type;
    console.log(role)
    const content = useRoutes(routes);
    const adminContent = useRoutes(adminRoutes);
    const stuffContent = useRoutes(stuffRoutes);
    //
    //after login i was redirecting to /dashboard is it ok?
    return (
        <>
            <MatxTheme>
                <CssBaseline />
                {/* {content} */}
                {role === "admin" ? adminContent : role === "tuff_owner" ? stuffContent : content}
            </MatxTheme>
        </>
    )
};

export default Mainpage;