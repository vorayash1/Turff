import { lazy } from "react";
import Loadable from "./components/Loadable";

// const StuffPage = Loadable(lazy(() => import("app/auction/turff")));
const StuffPage = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
// const JwtRegister = Loadable(lazy(() => import("app/views/sessions/JwtRegister")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const PlayerList = Loadable(lazy(() => import("./auction/booking/list")));
// const MyAuction = Loadable(lazy(() => import("app/auction/myturff")));
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));
const CreateTeam = Loadable(lazy(() => import("./auction/slot/addslot")));
const Myturff = Loadable(lazy(() => import("app/auction/turff")));
const TeamList = Loadable(lazy(() => import("./auction/slot/list")));

const routes = [
    { path: "/", element: <StuffPage /> },
    // { path: "/", element: <StuffPage /> },
    // { path: "/session/signup", element: <JwtRegister /> },
    { path: "/session/signin", element: <JwtLogin /> },
    { path: "/booking/list", element: <PlayerList /> },
    // { path: "/myturff", element: <MyAuction /> },
    { path: "/turff", element: <Myturff /> },
    { path: "/slot/list", element: <TeamList /> },
    { path: "/dashboard/Analytics", element: <Analytics /> },
    { path: "/slot/addslot", element: <CreateTeam /> },



]

export default routes;

