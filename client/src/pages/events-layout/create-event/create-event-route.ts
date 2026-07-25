import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { eventsLayoutRoute } from "../events-layout-route";

export const createNewRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: "/create-new",
  component: lazyRouteComponent(() => import("./create-event-page"), "CreateEventPage"),
});
