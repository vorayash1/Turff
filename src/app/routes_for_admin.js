import { lazy } from "react";
import Loadable from "./components/Loadable";

const AdminPage = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));
const MyAuction = Loadable(lazy(() => import("app/auction/myturff")));
const SimpleForm = Loadable(lazy(() => import("app/auction/addturf")));
const EditSimpleForm = Loadable(lazy(() => import("./auction/editturf")));
const PlayerList = Loadable(lazy(() => import("./auction/booking/list")));


const routes = [
    { path: "/", element: <AdminPage /> },
    { path: "/session/signin", element: <JwtLogin /> },
    { path: "/dashboard/Analytics", element: <Analytics /> },
    { path: "/auction/myturff", element: <MyAuction /> },
    { path: "/auction/addturf", element: <SimpleForm /> },
    { path: "/auction/editturf/:id", element: <EditSimpleForm /> },
    { path: "/auction/editturf", element: <EditSimpleForm /> },
    { path: "/auction/booking/list", element: <PlayerList /> },


]

export default routes;