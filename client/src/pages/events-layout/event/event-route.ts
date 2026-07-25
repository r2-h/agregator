import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { eventsLayoutRoute } from "../events-layout-route";

export const eventRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: "$id",
  component: lazyRouteComponent(() => import("./event-page"), "EventPage"),
});

