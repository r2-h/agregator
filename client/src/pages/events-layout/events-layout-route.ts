import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { protectedRoute } from "@/app/router";

export const eventsLayoutRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/events",
  component: lazyRouteComponent(() => import("./events-layout-page"), "EventsLayoutPage"),
});
