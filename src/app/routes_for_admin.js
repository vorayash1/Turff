import { lazy } from "react";
import Loadable from "./components/Loadable";

const AdminPage = Loadable(lazy(() => import("app/views/dashboard/Analytics.jsx")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));



const routes = [
    { path: "/", element: <AdminPage /> },
    { path: "/session/signin", element: <JwtLogin /> },
    { path: "/dashboard/Analytics", element: <Analytics /> },


]

export default routes;