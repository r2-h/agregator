import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { eventsLayoutRoute } from "../events-layout-route";

export const eventsRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./events-page"), "EventsPage"),
});
