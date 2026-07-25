import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { eventsLayoutRoute } from "../events-layout-route";

export const joinedRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: "/joined",
  component: lazyRouteComponent(() => import("./joined-page"), "JoinedPage"),
});
