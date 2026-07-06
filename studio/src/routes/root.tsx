import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";

import { AppHome } from "./index";
import { SetupWizard } from "./setup";

function RootLayout(): React.JSX.Element {
  return <Outlet />;
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  component: AppHome,
  getParentRoute: () => rootRoute,
  path: "/",
});

const setupRoute = createRoute({
  component: SetupWizard,
  getParentRoute: () => rootRoute,
  path: "/setup",
});

export const routeTree = rootRoute.addChildren([indexRoute, setupRoute]);
