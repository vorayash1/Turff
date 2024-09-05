import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";

import materialRoutes from "app/views/material-kit/MaterialRoutes";
import Profile from "./auction/profile";
// import SimpleForm from "./auction/addauction";

// SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const JwtRegister = Loadable(lazy(() => import("app/views/sessions/JwtRegister")));
const ForgotPassword = Loadable(lazy(() => import("app/views/sessions/ForgotPassword")));
// E-CHART PAGE
const AppEchart = Loadable(lazy(() => import("app/views/charts/echarts/AppEchart")));
// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));
//My Auctiion
const MyAuction = Loadable(lazy(() => import("app/auction/myturff")));
// const JwtLogin1 = Loadable(lazy(() => import("app/auction/signIn")));
// const JwtRegister1 = Loadable(lazy(() => import("app/auction/signUp")));
const SimpleForm = Loadable(lazy(() => import("app/auction/addauction")));
const EditSimpleForm = Loadable(lazy(() => import("./auction/editauction")));
const PlayerList = Loadable(lazy(() => import("./auction/booking/list")));
const AddPlayerPage = Loadable(lazy(() => import("./auction/booking/addplayer")));
const TeamList = Loadable(lazy(() => import("./auction/slot/list")));
const CreateTeam = Loadable(lazy(() => import("./auction/slot/addteam")));
const EditPlayerPage = Loadable(lazy(() => import("./auction/booking/edit")));
// const UpdateSponsor = Loadable(lazy(() => import("./auction/sponsor/edit")));
// const UpdateRule = Loadable(lazy(() => import("./auction/incrementrules/edit")));
const UpdateTeam = Loadable(lazy(() => import("./auction/slot/edit")));

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      // dashboard route
      { path: "/dashboard/default", element: <Analytics />, auth: authRoles.admin },
      // e-chart route
      { path: "/charts/echarts", element: <AppEchart />, auth: authRoles.editor }
    ]
  },

  //my auction page
  { path: "/auction/editauction", element: <EditSimpleForm /> },
  { path: "/auction/slot/edit", element: <UpdateTeam /> },
  { path: "/auction/booking/addplayer", element: <AddPlayerPage /> },
  { path: "/auction/booking/edit", element: <EditPlayerPage /> },
  { path: "/auction/slot/list", element: <TeamList /> },
  { path: "/auction/slot/addteam", element: <CreateTeam /> },
  { path: "/auction/booking/list", element: <PlayerList /> },
  { path: "/auction/myturff", element: <MyAuction /> },
  { path: "/auction/profile", element: <Profile /> },
  { path: "/auction/addauction", element: <SimpleForm /> },
  // { path: "/auction/booking/addplayer/:uniqueCode", element: <AddPlayerPage /> },

  // session pages route
  { path: "/session/404", element: <NotFound /> },
  { path: "/session/signin", element: <JwtLogin /> },
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },

  { path: "/", element: <Navigate to="session/signin" /> },
  { path: "*", element: <NotFound /> }
];

export default routes;
