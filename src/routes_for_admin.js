import { lazy } from "react";
import Loadable from "./app/components/Loadable";

const AdminPage = Loadable(lazy(() => import("app/views/dashboard/Analytics.jsx")));

const routes = [
    { path: "/", element: <AdminPage /> }
]

export default routes;
//there is no page like adminpage //i havent created any admin