import type { RouteObject } from "react-router-dom";
import Home from "./pages/home";
import Layout from "./layouts";

const rootRoutes: RouteObject = {
  path: "/",
  element: <Layout />,
  children: [
    {
      path: "",
      element: <Home />
    }
  ]
};

const routes: RouteObject[] = [
  rootRoutes
];

export default routes;
