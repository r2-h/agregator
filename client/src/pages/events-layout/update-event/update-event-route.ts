import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { eventsLayoutRoute } from "../events-layout-route";

export const updateEventRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: "/$id/edit",
  component: lazyRouteComponent(() => import("./update-event-page"), "UpdateEventPage"),
});
