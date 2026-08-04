import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { eventsLayoutRoute } from "../events-layout-route";

export const chatRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: "/chat",
  component: lazyRouteComponent(() => import("./chat-page"), "ChatPage"),
});
