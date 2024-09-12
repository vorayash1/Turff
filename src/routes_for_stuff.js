import { lazy } from "react";
import Loadable from "./app/components/Loadable";

const StuffPage = Loadable(lazy(() => import("app/auction/myturff")));

const routes = [
    { path: "/mytuff", element: <StuffPage /> }
]

export default routes;

